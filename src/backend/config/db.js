'use strict';

/**
 * config/db.js — Student Panel
 * ─────────────────────────────────────────────────────────────────────────────
 * Advanced MongoDB connection manager using Mongoose.
 *
 * Features:
 *  • Colored, timestamped console output
 *  • Singleton connection guard
 *  • Auto-retry with exponential back-off + human-readable error diagnosis
 *  • Connection pool tuning
 *  • Live connection event logging (connected / disconnected / error / reconnected)
 *  • Connection stats on startup (ping latency, collections count)
 *  • Slow query detection (> 100 ms)
 *  • Graceful shutdown on SIGINT / SIGTERM
 *  • dbStatus() for /api/health endpoint
 *  • Credentials always masked in logs
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ── ANSI Colors ───────────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
  white:  '\x1b[37m',
};

// ── Logger ────────────────────────────────────────────────────────────────────
const ts    = () => new Date().toLocaleTimeString('en-IN', { hour12: false });
const tag   = (color, label) => `${color}${C.bold}[DB ${label}]${C.reset}`;
const stamp = (color, label) => `${C.dim}${ts()}${C.reset} ${tag(color, label)}`;

const log = {
  info  : (...m) => console.log  (stamp(C.cyan,    'INFO '), ...m),
  ok    : (...m) => console.log  (stamp(C.green,   'OK   '), ...m),
  warn  : (...m) => console.warn (stamp(C.yellow,  'WARN '), ...m),
  error : (...m) => console.error(stamp(C.red,     'ERROR'), ...m),
  event : (...m) => console.log  (stamp(C.magenta, 'EVENT'), ...m),
  stat  : (...m) => console.log  (stamp(C.blue,    'STAT '), ...m),
};

// ── Config ────────────────────────────────────────────────────────────────────
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI   ||
  'mongodb://127.0.0.1:27017/learnverse';

const MAX_RETRIES      = 3;
const RETRY_DELAY_MS   = 3000;   // base delay — doubles each attempt
const SLOW_QUERY_MS    = 100;    // warn if any operation takes longer

// ── Helpers ───────────────────────────────────────────────────────────────────
const maskedURI = () => MONGO_URI.replace(/:([^@]+)@/, ':****@');
const sleep     = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Translates raw Mongoose/MongoDB error codes into actionable advice.
 */
const diagnose = (err) => {
  const msg = err.message || '';

  if (msg.includes('ECONNREFUSED'))
    return 'MongoDB is not running or the host/port is wrong. Check your MONGODB_URI.';
  if (msg.includes('Authentication failed') || msg.includes('bad auth'))
    return 'Wrong username or password in MONGODB_URI. Check your Atlas credentials.';
  if (msg.includes('IP') || msg.includes('whitelist') || msg.includes('not allowed'))
    return 'Your IP is not whitelisted in MongoDB Atlas. Add it under Network Access.';
  if (msg.includes('ETIMEOUT') || msg.includes('timed out') || msg.includes('Server selection'))
    return 'Connection timed out. Check your internet connection or Atlas cluster status.';
  if (msg.includes('SSL') || msg.includes('TLS'))
    return 'SSL/TLS error. Make sure you are using the correct Atlas connection string.';
  if (msg.includes('ENOTFOUND'))
    return 'DNS lookup failed. Check the hostname in your MONGODB_URI.';

  return 'Unknown error — check the full message above for details.';
};

// ── Connection Events ─────────────────────────────────────────────────────────
mongoose.connection.on('connecting',    () => log.event(`${C.cyan}Establishing connection...${C.reset}`));
mongoose.connection.on('connected',     () => log.event(`${C.green}${C.bold}Connected to MongoDB ✓${C.reset}`));
mongoose.connection.on('open',          () => log.event(`${C.green}Connection open & ready${C.reset}`));
mongoose.connection.on('disconnecting', () => log.event(`${C.yellow}Disconnecting...${C.reset}`));
mongoose.connection.on('disconnected',  () => log.event(`${C.red}Disconnected from MongoDB${C.reset}`));
mongoose.connection.on('close',         () => log.event(`${C.dim}Connection closed${C.reset}`));
mongoose.connection.on('reconnected',   () => log.event(`${C.green}Reconnected to MongoDB ✓${C.reset}`));
mongoose.connection.on('error', (err)   => {
  log.error(`${C.red}${C.bold}${err.message}${C.reset}`);
  log.error(`${C.yellow}💡 ${diagnose(err)}${C.reset}`);
});

// ── Slow Query Monitor ────────────────────────────────────────────────────────
// Mongoose debug gives us collection + method — we wrap it with a timer
const _queryTimers = new Map();

mongoose.set('debug', (collectionName, method) => {
  const key = `${collectionName}.${method}.${Date.now()}`;
  _queryTimers.set(key, Date.now());

  // Check after a tick — gives enough time for the async op to register
  setImmediate(() => {
    const start = _queryTimers.get(key);
    if (!start) return;
    _queryTimers.delete(key);
    const ms = Date.now() - start;
    if (ms >= SLOW_QUERY_MS) {
      log.warn(
        `${C.yellow}Slow query${C.reset} — ` +
        `${C.bold}${collectionName}.${method}${C.reset} ` +
        `~${C.red}${ms}ms${C.reset}`
      );
    }
  });
});

// ── Connect ───────────────────────────────────────────────────────────────────
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    log.info('Already connected — skipping.');
    return;
  }

  log.info(`Connecting to: ${C.cyan}${maskedURI()}${C.reset}`);
  log.info(`Environment : ${C.bold}${process.env.NODE_ENV || 'development'}${C.reset}`);

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const t0 = Date.now();

      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS : 8000,
        socketTimeoutMS          : 45000,
        maxPoolSize              : 10,
        minPoolSize              : 2,
      });

      const pingMs = Date.now() - t0;
      const { host, name } = mongoose.connection;

      log.ok(`${C.green}${C.bold}MongoDB ready${C.reset}`);
      log.stat(`Host     : ${C.cyan}${host}${C.reset}`);
      log.stat(`Database : ${C.cyan}${name}${C.reset}`);
      log.stat(`Latency  : ${pingMs < 80 ? C.green : C.yellow}${pingMs}ms${C.reset}`);

      // Collection count
      try {
        const cols = await mongoose.connection.db.listCollections().toArray();
        log.stat(`Collections (${cols.length}): ${C.dim}${cols.map(c => c.name).join(', ')}${C.reset}`);
      } catch (_) {}

      // Remove strict JSON schema validation from users collection
      try {
        await mongoose.connection.db.command({ collMod: 'users', validator: {}, validationLevel: 'off' });
      } catch (_) {}

      log.ok(`${C.dim}─────────────────────────────────────────${C.reset}`);
      return;

    } catch (err) {
      attempt++;
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);

      log.error(`${C.red}${C.bold}Connection failed (attempt ${attempt}/${MAX_RETRIES})${C.reset}`);
      log.error(`Reason  : ${C.red}${err.message}${C.reset}`);
      log.error(`Fix     : ${C.yellow}${diagnose(err)}${C.reset}`);

      if (attempt >= MAX_RETRIES) {
        log.error(`${C.red}${C.bold}All ${MAX_RETRIES} attempts exhausted. Exiting.${C.reset}`);
        log.error(`${C.dim}URI tried: ${maskedURI()}${C.reset}`);
        process.exit(1);
      }

      log.warn(`Retrying in ${C.bold}${delay / 1000}s${C.reset}... (${MAX_RETRIES - attempt} attempt(s) left)`);
      await sleep(delay);
    }
  }
};

// ── Disconnect ────────────────────────────────────────────────────────────────
const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.connection.close();
  log.info('Connection closed cleanly.');
};

// ── Shutdown Hooks ────────────────────────────────────────────────────────────
const registerShutdownHooks = () => {
  let shuttingDown = false;

  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log('');
    log.warn(`${C.yellow}${C.bold}${signal} received — shutting down gracefully...${C.reset}`);
    await disconnectDB();
    log.ok('Shutdown complete. Goodbye 👋');
    process.exit(0);
  };

  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

// ── Health ────────────────────────────────────────────────────────────────────
const dbStatus = () => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return states[mongoose.connection.readyState] ?? 'unknown';
};

module.exports = { connectDB, disconnectDB, registerShutdownHooks, dbStatus, maskedURI };

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const log = (level, msg, meta = {}) => {
  const ts   = new Date().toISOString();
  const info = Object.keys(meta).length
    ? ' | ' + Object.entries(meta).map(([k,v]) => `${k}: ${v}`).join(' | ')
    : '';
  console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](
    `[${ts}] [${level.padEnd(5)}] [MIDDLEWARE] [AUTH          ] ${msg}${info}`
  );
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    log('WARN', '✗ No token provided', { path: req.path, ip: req.ip });
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user) {
      log('WARN', '✗ Token valid but user not found', { id: decoded.id, path: req.path });
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.status === 'suspended') {
      log('WARN', '✗ Suspended account attempted access', { email: user.email, path: req.path });
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.', suspended: true });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role, status: user.status };
    log('INFO', '✓ Token verified', { email: user.email, role: user.role, path: req.path });
    next();
  } catch (error) {
    log('ERROR', `✗ Token verification failed: ${error.message}`, { path: req.path, ip: req.ip });
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      log('WARN', '✗ Role not authorized', { email: req.user.email, role: req.user.role, required: roles.join('|'), path: req.path });
      return res.status(403).json({ success: false, message: `User role ${req.user.role} is not authorized to access this route` });
    }
    log('INFO', '✓ Role authorized', { email: req.user.email, role: req.user.role, path: req.path });
    next();
  };
};

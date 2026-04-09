const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();

const { connectDB, registerShutdownHooks, dbStatus } = require('./config/db');

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];

// Add Vercel domains
const productionOrigins = [
  "https://student-penal-lms.vercel.app",
  "https://student-penal-lms-mrprincekumarsingh143-gmailcoms-projects.vercel.app",
  ...allowedOrigins
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (productionOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require('./routes/googleAuth'); // initialize passport strategy

// Routes
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/auth/google', require('./routes/googleAuth'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/courses',     require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/categories',  require('./routes/categories'));
app.use('/api/student/assignments', require('./routes/assignmentRoutes'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/settings',    require('./routes/settings'));
app.use('/api/payments',    require('./routes/payments'));
app.use('/api/posts',       require('./routes/posts'));
app.use('/api/messages',    require('./routes/messages'));
app.use('/api/upload',      require('./routes/upload'));
app.use('/api/community',   require('./routes/community'));
app.use('/api/ai',          require('./routes/ai'));

// Serve uploaded images
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/uploads/avatars', express.static(__dirname + '/uploads/avatars'));
app.use('/certificates', express.static(__dirname + '/certificates'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LearnVerse Student API is running',
    db: dbStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Connect DB then start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  registerShutdownHooks();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Student server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Stop the existing process or change PORT in .env`);
    } else {
      console.error('❌ Server error:', err.message);
    }
    process.exit(1);
  });
});

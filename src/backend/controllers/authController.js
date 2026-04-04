const User   = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');

const log = (level, action, msg, meta = {}) => {
  const ts   = new Date().toISOString();
  const base = `[${ts}] [${level.padEnd(5)}] [AUTH] [${action.padEnd(14)}]`;
  const info = Object.keys(meta).length
    ? ' | ' + Object.entries(meta).map(([k,v]) => `${k}: ${v}`).join(' | ')
    : '';
  console[level === 'ERROR' ? 'error' : level === 'WARN' ? 'warn' : 'log'](`${base} ${msg}${info}`);
};

// POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  log('INFO', 'REGISTER', 'Registration attempt', { email: email || 'N/A' });
  try {
    if (!name || !email || !password) {
      log('WARN', 'REGISTER', 'Missing required fields', { email: email || 'N/A' });
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      log('WARN', 'REGISTER', '✗ Email already registered', { email });
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password, phone: phone || undefined });
    log('INFO', 'REGISTER', '✓ Account created — awaiting OTP verification', { email, name, id: user._id });

    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email.',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      log('WARN', 'REGISTER', `✗ Validation error: ${messages.join(', ')}`, { email: email || 'N/A' });
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    log('ERROR', 'REGISTER', `✗ Registration failed: ${error.message}`, { email: email || 'N/A' });
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  log('INFO', 'LOGIN', 'Login attempt', { email: email || 'N/A', ip: req.ip });
  try {
    if (!email || !password) {
      log('WARN', 'LOGIN', 'Missing credentials');
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      log('WARN', 'LOGIN', '✗ Email not found', { email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      log('WARN', 'LOGIN', '✗ Password mismatch', { email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      log('WARN', 'LOGIN', '✗ Account suspended', { email });
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.', suspended: true });
    }

    log('INFO', 'LOGIN', '✓ Credentials verified — OTP step triggered', { email, name: user.name });
    res.status(200).json({
      success: true,
      message: 'Credentials verified. OTP will be sent.',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    log('ERROR', 'LOGIN', `✗ Login error: ${error.message}`, { email: email || 'N/A' });
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

// GET /api/auth/logout
exports.logout = async (_req, res) => {
  log('INFO', 'LOGOUT', '✓ User logged out');
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'title thumbnail')
      .populate('completedCourses', 'title thumbnail');
    log('INFO', 'GET-ME', '✓ Profile fetched', { id: req.user.id });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    log('ERROR', 'GET-ME', `✗ Error: ${error.message}`, { id: req.user?.id });
    res.status(500).json({ success: false, message: 'Error fetching user data', error: error.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  log('INFO', 'FORGOT-PWD', 'Forgot password request', { email: email || 'N/A' });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      log('WARN', 'FORGOT-PWD', '✗ Email not found', { email });
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordToken  = otp;
    user.resetPasswordExpire = expiry;
    await user.save({ validateBeforeSave: false });
    await sendOTPEmail(user.email, otp, { name: user.name, purpose: 'forgot-password' });
    log('INFO', 'FORGOT-PWD', '✓ Reset OTP sent', { email, expiresAt: expiry.toISOString() });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    log('ERROR', 'FORGOT-PWD', `✗ Error: ${error.message}`, { email: email || 'N/A' });
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  log('INFO', 'RESET-PWD', 'Password reset attempt');
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      log('WARN', 'RESET-PWD', 'Missing token or new password');
      return res.status(400).json({ success: false, message: 'Token and new password required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      log('WARN', 'RESET-PWD', '✗ Invalid or expired reset token');
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    if (decoded.purpose !== 'otp-verified') {
      log('WARN', 'RESET-PWD', '✗ Invalid token purpose', { purpose: decoded.purpose });
      return res.status(403).json({ success: false, message: 'Invalid token purpose' });
    }

    const user = await User.findOne({ email: decoded.email.toLowerCase() }).select('+password');
    if (!user) {
      log('WARN', 'RESET-PWD', '✗ User not found', { email: decoded.email });
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password            = newPassword;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    log('INFO', 'RESET-PWD', '✓ Password reset successfully', { email: decoded.email });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    log('ERROR', 'RESET-PWD', `✗ Error: ${error.message}`);
    res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
  }
};

// POST /api/auth/send-otp
exports.sendOTP = async (req, res) => {
  const { email, purpose } = req.body;
  log('INFO', 'SEND-OTP', 'OTP request received', { email: email || 'N/A', purpose: purpose || 'general' });
  try {
    if (!email) {
      log('WARN', 'SEND-OTP', 'Email missing in request');
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      log('WARN', 'SEND-OTP', '✗ Email not registered', { email });
      return res.status(404).json({ success: false, message: 'Email not registered' });
    }

    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordToken  = otp;
    user.resetPasswordExpire = expiry;
    await user.save({ validateBeforeSave: false });

    const emailPurpose = purpose || 'forgot-password';
    await sendOTPEmail(email, otp, { name: user.name, purpose: emailPurpose });
    log('INFO', 'SEND-OTP', '✓ OTP sent successfully', { email, purpose: emailPurpose, expiresAt: expiry.toISOString() });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    log('ERROR', 'SEND-OTP', `✗ Failed to send OTP: ${error.message}`, { email: email || 'N/A' });
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  const { email, otp, purpose } = req.body;
  log('INFO', 'VERIFY-OTP', 'OTP verification attempt', { email: email || 'N/A', purpose: purpose || 'general' });
  try {
    if (!email || !otp) {
      log('WARN', 'VERIFY-OTP', 'Missing email or OTP');
      return res.status(400).json({ success: false, message: 'Email and OTP required' });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken:  otp,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      log('WARN', 'VERIFY-OTP', '✗ Invalid or expired OTP', { email });
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;

    if (purpose === 'registration') {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
      log('INFO', 'VERIFY-OTP', '✓ Registration OTP verified — account activated', { email });
      return sendTokenResponse(user, 200, res, 'OTP verified');
    }

    if (purpose === 'login') {
      await user.save({ validateBeforeSave: false });
      log('INFO', 'VERIFY-OTP', '✓ Login OTP verified — session started', { email, name: user.name });
      return sendTokenResponse(user, 200, res, 'Login successful');
    }

    await user.save({ validateBeforeSave: false });
    const token = jwt.sign(
      { email: user.email, purpose: 'otp-verified' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    log('INFO', 'VERIFY-OTP', '✓ OTP verified — reset token issued', { email });
    res.status(200).json({ success: true, message: 'OTP verified', token });
  } catch (error) {
    log('ERROR', 'VERIFY-OTP', `✗ Verification error: ${error.message}`, { email: email || 'N/A' });
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    ...(process.env.NODE_ENV === 'production' ? { secure: true } : {})
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    ...(message ? { message } : {}),
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  });
};

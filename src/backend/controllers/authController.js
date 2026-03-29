const User   = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || undefined // Only include if provided
    });

    // Don't send auth token yet — user must verify email via OTP first
    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email.',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Credentials valid — return success so frontend can trigger OTP step
    res.status(200).json({
      success: true,
      message: 'Credentials verified. OTP will be sent.',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'title thumbnail')
      .populate('completedCourses', 'title thumbnail');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken  = otp;
    user.resetPasswordExpire = expiry;
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(user.email, otp, { name: user.name, purpose: 'forgot-password' });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP', error: error.message });
  }
};

// @desc    Reset password via OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password required' });
    }

    // Verify JWT issued by verify-otp
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    if (decoded.purpose !== 'otp-verified') {
      return res.status(403).json({ success: false, message: 'Invalid token purpose' });
    }

    const emailLower = decoded.email.toLowerCase();
    const user = await User.findOne({ email: emailLower }).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Set password directly on the document and save — triggers pre('save') hash hook
    user.password            = newPassword;
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not registered' });

    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordToken  = otp;
    user.resetPasswordExpire = expiry;
    await user.save({ validateBeforeSave: false });

    const emailPurpose = purpose || 'forgot-password';
    await sendOTPEmail(email, otp, { name: user.name, purpose: emailPurpose });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

    const user = await User.findOne({
      email,
      resetPasswordToken:  otp,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    // Clear OTP
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;

    // For registration — mark verified and return full auth token
    if (purpose === 'registration') {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
      return sendTokenResponse(user, 200, res, 'OTP verified');
    }

    // For login — return full auth token so user is logged in
    if (purpose === 'login') {
      await user.save({ validateBeforeSave: false });
      return sendTokenResponse(user, 200, res, 'Login successful');
    }

    await user.save({ validateBeforeSave: false });

    // For forgot-password flow, return short-lived otp-verified token
    const token = jwt.sign(
      { email: user.email, purpose: 'otp-verified' },  // use DB email (already lowercase)
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ success: true, message: 'OTP verified', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      ...(message ? { message } : {}),
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
};

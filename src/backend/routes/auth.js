const express = require('express');
const router  = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register',        register);
router.post('/login',           login);
router.get ('/logout',          logout);
router.get ('/me',              protect, getMe);
router.post('/forgot-password', forgotPassword);  // sends OTP
router.post('/reset-password',  resetPassword);   // JWT token + new password
router.post('/send-otp',        sendOTP);
router.post('/verify-otp',      verifyOTP);

module.exports = router;

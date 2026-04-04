const express  = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// ── Configure Google Strategy ────────────────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
  const email = profile.emails?.[0]?.value;
  const name  = profile.displayName || 'Unknown';
  const photo = profile.photos?.[0]?.value || '';
  const ts    = new Date().toISOString();

  console.log(`\n[${ts}] [AUTH] [GOOGLE] ──────────────────────────────`);
  console.log(`[${ts}] [AUTH] [GOOGLE] Provider  : Google OAuth 2.0`);
  console.log(`[${ts}] [AUTH] [GOOGLE] Profile   : ${name}`);
  console.log(`[${ts}] [AUTH] [GOOGLE] Email     : ${email || 'NOT PROVIDED'}`);

  try {
    if (!email) {
      console.warn(`[${ts}] [AUTH] [GOOGLE] ⚠  No email returned from Google profile`);
      return done(new Error('No email from Google'), null);
    }

    let user = await User.findOne({ email });

    if (!user) {
      console.log(`[${ts}] [AUTH] [GOOGLE] ℹ  New user — creating account via Google`);
      user = await User.create({
        name,
        email,
        password:   Math.random().toString(36).slice(-12) + 'Aa1!',
        avatar:     photo,
        isVerified: true,
        googleId:   profile.id,
      });
      console.log(`[${ts}] [AUTH] [GOOGLE] ✓  Account created — id: ${user._id}`);
    } else {
      if (!user.googleId) {
        user.googleId   = profile.id;
        user.isVerified = true;
        if (!user.avatar && photo) user.avatar = photo;
        await user.save({ validateBeforeSave: false });
        console.log(`[${ts}] [AUTH] [GOOGLE] ✓  Existing account linked to Google`);
      } else {
        console.log(`[${ts}] [AUTH] [GOOGLE] ✓  Returning user — id: ${user._id}`);
      }
    }

    console.log(`[${ts}] [AUTH] [GOOGLE] ✓  Login successful for: ${user.name}`);
    console.log(`[${ts}] [AUTH] [GOOGLE] ──────────────────────────────\n`);
    return done(null, user);
  } catch (err) {
    console.error(`[${ts}] [AUTH] [GOOGLE] ✗  Internal error: ${err.message}`);
    console.log(`[${ts}] [AUTH] [GOOGLE] ──────────────────────────────\n`);
    return done(err, null);
  }
}));

// ── Routes ───────────────────────────────────────────────────────────────────

// Step 1: Redirect to Google
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// Step 2: Google callback
router.get('/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/google-callback?token=${token}`);
  }
);

module.exports = router;

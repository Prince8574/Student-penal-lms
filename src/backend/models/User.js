const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Username cannot be more than 30 characters'],
    match: [/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers and underscores']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        // Allow empty/null or any non-empty string (flexible format)
        return !v || v.trim().length > 0;
      },
      message: 'Please provide a valid phone number'
    }
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  completedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  googleId: { type: String, sparse: true },
  dob: {
    type: Date
  },
  tagline: {
    type: String,
    maxlength: [120, 'Tagline cannot be more than 120 characters']
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  linkedin:    { type: String, maxlength: [200] },
  github:      { type: String, maxlength: [200] },
  twitter:     { type: String, maxlength: [100] },
  portfolio:   { type: String, maxlength: [200] },
  country:     { type: String, maxlength: [100] },
  pincode:     { type: String, maxlength: [20] },
  whatsapp:    { type: String, maxlength: [20] },
  altEmail:    { type: String, maxlength: [100] },
  gender:      { type: String, maxlength: [30] },
  language:    { type: String, maxlength: [10], default: 'en' },
  institution: { type: String, maxlength: [200] },
  degree:      { type: String, maxlength: [50] },
  field:       { type: String, maxlength: [100] },
  gradYear:    { type: String, maxlength: [20] },
  cgpa:        { type: String, maxlength: [20] },
  org:         { type: String, maxlength: [200] },
  jobRole:     { type: String, maxlength: [100] },
  exp:         { type: String, maxlength: [20] },
  skills: [{
    l: { type: String },
    c: { type: String, default: 'gold' }
  }],
  goals: [{
    title:  { type: String },
    target: { type: String },
    pct:    { type: Number, default: 0 }
  }],
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Settings fields
  settings: {
    // Account
    firstName: String,
    lastName: String,
    dob: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Prefer not to say', '']
    },
    language: {
      type: String,
      default: 'English'
    },
    timezone: {
      type: String,
      default: 'IST (UTC+5:30)'
    },
    accent: {
      type: String,
      default: '#f0a500'
    },
    
    // Appearance
    theme: {
      type: String,
      enum: ['dark', 'midnight', 'aurora', 'ocean'],
      default: 'dark'
    },
    font: {
      type: String,
      default: 'Satoshi'
    },
    fontSize: {
      type: Number,
      default: 15,
      min: 12,
      max: 20
    },
    density: {
      type: String,
      enum: ['Compact', 'Default', 'Comfortable'],
      default: 'Default'
    },
    radius: {
      type: String,
      enum: ['None', 'Small', 'Medium', 'Large', 'Full'],
      default: 'Large'
    },
    animEnabled: {
      type: Boolean,
      default: true
    },
    particles: {
      type: Boolean,
      default: true
    },
    gsapEffects: {
      type: Boolean,
      default: true
    },
    reducedMotion: {
      type: Boolean,
      default: false
    },
    cursorFx: {
      type: Boolean,
      default: true
    },
    
    // Notifications
    emailNotif: {
      type: Boolean,
      default: true
    },
    pushNotif: {
      type: Boolean,
      default: true
    },
    smsNotif: {
      type: Boolean,
      default: false
    },
    inAppNotif: {
      type: Boolean,
      default: true
    },
    assignNotif: {
      type: Boolean,
      default: true
    },
    gradeNotif: {
      type: Boolean,
      default: true
    },
    msgNotif: {
      type: Boolean,
      default: true
    },
    announceNotif: {
      type: Boolean,
      default: true
    },
    streakNotif: {
      type: Boolean,
      default: true
    },
    achieveNotif: {
      type: Boolean,
      default: true
    },
    eventNotif: {
      type: Boolean,
      default: false
    },
    weeklyDigest: {
      type: Boolean,
      default: true
    },
    quietHours: {
      type: Boolean,
      default: false
    },
    quietFrom: {
      type: String,
      default: '22:00'
    },
    quietTo: {
      type: String,
      default: '07:00'
    },
    
    // Privacy
    profilePublic: {
      type: Boolean,
      default: true
    },
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    },
    showActivity: {
      type: Boolean,
      default: true
    },
    showCourses: {
      type: Boolean,
      default: true
    },
    showBadges: {
      type: Boolean,
      default: true
    },
    allowMessages: {
      type: Boolean,
      default: true
    },
    showOnline: {
      type: Boolean,
      default: true
    },
    shareAnalytics: {
      type: Boolean,
      default: false
    },
    personalizedAds: {
      type: Boolean,
      default: true
    },
    cookieConsent: {
      type: Boolean,
      default: true
    },
    thirdParty: {
      type: Boolean,
      default: false
    },
    
    // Security
    twoFaApp: {
      type: Boolean,
      default: false
    },
    twoFaSms: {
      type: Boolean,
      default: false
    },
    twoFaEmail: {
      type: Boolean,
      default: false
    },
    
    // Learning
    studyTime: {
      type: String,
      default: 'Evening (4–8 PM)'
    },
    dailyGoal: {
      type: Number,
      default: 2,
      min: 0.5,
      max: 8
    },
    videoSpeed: {
      type: String,
      default: '1.0x'
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    subtitles: {
      type: Boolean,
      default: false
    },
    downloadMode: {
      type: String,
      default: '720p'
    },
    certReminder: {
      type: Boolean,
      default: true
    },
    pomodoroDefault: {
      type: String,
      default: '25 min'
    },
    
    // Accessibility
    highContrast: {
      type: Boolean,
      default: false
    },
    largeText: {
      type: Boolean,
      default: false
    },
    reduceMotion: {
      type: Boolean,
      default: false
    },
    focusIndicators: {
      type: Boolean,
      default: false
    },
    colorBlind: {
      type: Boolean,
      default: false
    },
    darkReader: {
      type: Boolean,
      default: false
    },
    keyboardNav: {
      type: Boolean,
      default: false
    },
    screenReader: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: Boolean,
      default: false
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = mongoose.model('User', userSchema);

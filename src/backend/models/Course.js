const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.Mixed, // ObjectId (Mongoose) or object {name,initials} (admin)
    required: false
  },
  category: {
    type: mongoose.Schema.Types.Mixed, // ObjectId (Mongoose) or string (admin)
    required: false
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    default: 'Beginner'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  thumbnail: {
    type: String,
    default: 'default-course.jpg'
  },
  duration: {
    type: String
  },
  language: {
    type: String,
    default: 'English'
  },
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  enrolledStudents: {
    type: Number,
    default: 0
  },
  curriculum: [{
    title: String,
    lessons: [{
      title: String,
      duration: String,
      videoUrl: String,
      resources: [String]
    }]
  }],
  requirements: [String],
  whatYouWillLearn: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', ''],
    default: 'draft'
  },
  badge: {
    type: String,
    default: ''
  },
  // Admin-panel extra fields
  emoji:       { type: String, default: '📘' },
  accent:      { type: String, default: '#4F6EF7' },
  accentGlow:  { type: String },
  bg:          { type: String },
  subtitle:    { type: String },
  promoVideoUrl: { type: String },
  outcomes:    [{ type: String }],
  support:     { type: String },
  mediaType:   { type: String },
  certificate: { type: Boolean, default: true },
  lifetime:    { type: Boolean, default: true },
  downloadable:{ type: Boolean, default: true },
  previewVideo:{ type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update average rating
courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
  }
  return this.save();
};

module.exports = mongoose.model('Course', courseSchema);

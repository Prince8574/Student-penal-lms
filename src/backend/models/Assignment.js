const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  courseIcon: {
    type: String,
    default: '📚'
  },
  courseColor: {
    type: String,
    default: '#3b82f6'
  },
  type: {
    type: String,
    enum: ['Coding', 'Report', 'Design', 'Quiz', 'Project'],
    default: 'Coding'
  },
  points: {
    type: Number,
    required: [true, 'Please add points'],
    min: 0
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  dueTime: {
    type: String,
    default: '11:59 PM'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  requirements: [{
    type: String
  }],
  maxFileSize: {
    type: String,
    default: '50MB'
  },
  allowedTypes: [{
    type: String
  }],
  estimatedTime: {
    type: String
  },
  rubric: [{
    l: String,
    p: Number
  }],
  attachments: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', AssignmentSchema);

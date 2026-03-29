const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
    // No ref — admin assignments are not in Mongoose Assignment model
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Denormalized for admin grading view (admin uses raw MongoDB, not Mongoose)
  assignmentTitle: { type: String, default: '' },
  courseName:      { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'submitted', 'graded', 'overdue'],
    default: 'pending'
  },
  submittedAt:    { type: Date },
  submissionText: { type: String },
  submissionUrl:  { type: String },
  files: [{
    filename:     String,
    originalName: String,
    path:         String,
    size:         Number,
    mimetype:     String
  }],
  score:          { type: Number, min: 0 },
  grade:          { type: Number, min: 0 },  // alias for score
  maxScore:       { type: Number },
  feedback:       { type: String },
  certificateId:  { type: String },
  certificatePath:{ type: String },
  gradedAt:       { type: Date },
  gradedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', SubmissionSchema);

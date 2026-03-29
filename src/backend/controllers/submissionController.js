const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const mongoose = require('mongoose');
const { generateCertificate, generateCertificateId } = require('../services/certificateService');

const rawAssignments = () => mongoose.connection.db.collection('assignments');

// @desc    Submit assignment
// @route   POST /api/submissions/:assignmentId
// @access  Private
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if already submitted
    let submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user.id
    });

    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    })) : [];

    if (submission) {
      // Update existing submission
      submission.status = 'submitted';
      submission.submittedAt = new Date();
      submission.files = files;
      submission.feedback = 'Under review — results expected in 2 days';
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        assignment: req.params.assignmentId,
        student: req.user.id,
        status: 'submitted',
        submittedAt: new Date(),
        files,
        feedback: 'Under review — results expected in 2 days'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get my submission for a specific assignment
// @route   GET /api/submissions/my/:assignmentId
// @access  Private
exports.getMySubmissionByAssignment = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user.id
    });

    res.status(200).json({ success: true, data: submission || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get my submissions (student) OR instructor's assignment submissions
// @route   GET /api/submissions/my-submissions
// @access  Private
exports.getMySubmissions = async (req, res) => {
  try {
    // Instructor: return all submissions for assignments they created
    if (req.user.role === 'instructor') {
      const myAssignments = await rawAssignments()
        .find({ createdBy: req.user.id.toString() }, { projection: { _id: 1 } })
        .toArray();
      const assignmentIds = myAssignments.map(a => a._id.toString());

      const submissions = await Submission.find({
        assignment: { $in: assignmentIds }
      })
        .populate('student', 'name email avatar')
        .populate('assignment', 'title courseName points dueDate maxScore')
        .sort({ submittedAt: -1 });

      return res.status(200).json({ success: true, count: submissions.length, data: submissions });
    }

    // Student: return their own submissions
    const submissions = await Submission.find({ student: req.user.id })
      .populate('assignment', 'title courseName points dueDate')
      .sort({ submittedAt: -1 });

    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Grade submission (Instructor/Admin only)
// @route   PUT /api/submissions/:id/grade
// @access  Private
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback, score, maxScore } = req.body;
    const { ObjectId } = require('mongodb');

    let submission = await Submission.findById(req.params.id).populate('student');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const student = submission.student;

    // Fetch assignment from shared raw collection
    let assignmentDoc = null;
    try {
      assignmentDoc = await rawAssignments().findOne({ _id: new ObjectId(submission.assignment.toString()) });
    } catch (_) {}

    const finalScore    = score   !== undefined ? Number(score)   : Number(grade);
    const finalMaxScore = maxScore !== undefined ? Number(maxScore) : (assignmentDoc?.maxScore || assignmentDoc?.points || 100);
    const assignTitle   = submission.assignmentTitle || assignmentDoc?.title || 'Assignment';
    const courseName    = submission.courseName      || assignmentDoc?.courseName || '';

    // Generate certificate
    const certificateId   = generateCertificateId();
    const certificatePath = await generateCertificate({
      studentName:     student.name,
      courseName,
      assignmentTitle: assignTitle,
      score:           finalScore,
      maxScore:        finalMaxScore,
      completionDate:  new Date(),
      certificateId,
    });

    submission.status          = 'graded';
    submission.grade           = finalScore;
    submission.score           = finalScore;
    submission.maxScore        = finalMaxScore;
    submission.feedback        = feedback || '';
    submission.gradedAt        = new Date();
    submission.gradedBy        = req.user.id;
    submission.certificateId   = certificateId;
    submission.certificatePath = certificatePath;

    await submission.save();

    // Push to student grades array
    await User.findByIdAndUpdate(student._id, {
      $push: {
        grades: {
          assignmentId:    submission.assignment,
          assignmentTitle: assignTitle,
          courseName,
          score:           finalScore,
          maxScore:        finalMaxScore,
          percentage:      ((finalScore / finalMaxScore) * 100).toFixed(2),
          certificateId,
          certificatePath,
          gradedAt:        new Date(),
        }
      }
    });

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// @desc    Get all submissions for an assignment (Instructor/Admin)
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name email avatar')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Get assignment submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

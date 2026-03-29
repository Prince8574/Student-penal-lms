const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const {
  submitAssignment,
  getMySubmissions,
  getMySubmissionByAssignment,
  gradeSubmission,
  getAssignmentSubmissions
} = require('../controllers/submissionController');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/assignments/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpeg|jpg|png|pdf|doc|docx|zip|rar|txt|js|py|cpp|java|html|css|json|md|ipynb|fig|mp4|mov|avi)$/i;
    if (allowed.test(file.originalname)) return cb(null, true);
    cb(new Error('Invalid file type'));
  }
});

// Static routes first (before /:id patterns)
router.get('/my-submissions', protect, getMySubmissions);
router.get('/my/:assignmentId', protect, getMySubmissionByAssignment);

// Dynamic routes
router.post('/:assignmentId', protect, upload.array('files', 5), submitAssignment);
router.put('/:id/grade', protect, authorize('instructor', 'admin'), gradeSubmission);
router.get('/assignment/:assignmentId', protect, authorize('instructor', 'admin'), getAssignmentSubmissions);

module.exports = router;

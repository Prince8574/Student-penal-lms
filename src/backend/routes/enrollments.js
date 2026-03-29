const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  enrollCourse,
  getMyEnrollments,
  getEnrollmentByCourse,
  updateProgress,
  updateLesson,
  completeCourse
} = require('../controllers/enrollmentController');

// GET /api/enrollments/my-courses  — must be before /:courseId
router.get('/my-courses', protect, getMyEnrollments);

// GET /api/enrollments/course/:courseId
router.get('/course/:courseId', protect, getEnrollmentByCourse);

// POST /api/enrollments/:courseId
router.post('/:courseId', protect, enrollCourse);

// PUT /api/enrollments/:enrollmentId/progress
router.put('/:enrollmentId/progress', protect, updateProgress);

// PUT /api/enrollments/:enrollmentId/lesson
router.put('/:enrollmentId/lesson', protect, updateLesson);

// PUT /api/enrollments/:enrollmentId/complete
router.put('/:enrollmentId/complete', protect, completeCourse);

module.exports = router;

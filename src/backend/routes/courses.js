const express = require('express');
const router = express.Router();
const {
  getMyCourses,
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addReview
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// GET /api/courses/my-courses — must be before /:id
router.get('/my-courses', protect, getMyCourses);

router.route('/')
  .get(getCourses)
  .post(protect, authorize('instructor', 'admin'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('instructor', 'admin'), updateCourse)
  .delete(protect, authorize('instructor', 'admin'), deleteCourse);

router.post('/:id/reviews', protect, addReview);

module.exports = router;

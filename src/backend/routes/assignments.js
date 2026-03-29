const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAssignments,
  getAssignment,
} = require('../controllers/assignmentController');

router.route('/').get(protect, getAssignments);
router.route('/:id').get(protect, getAssignment);

module.exports = router;

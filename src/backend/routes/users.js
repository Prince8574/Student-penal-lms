const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getInstructors,
  setInstructorStatus,
  deleteInstructor,
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:courseId', protect, addToWishlist);
router.delete('/wishlist/:courseId', protect, removeFromWishlist);

// Instructor management (admin calls these from admin panel via student backend)
router.get('/instructors',              getInstructors);
router.patch('/instructors/:id/status', setInstructorStatus);
router.delete('/instructors/:id',       deleteInstructor);

module.exports = router;

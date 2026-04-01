const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
const User = require('../models/User');

// Avatar upload setup
const avatarDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => cb(null, 'avatar-' + req.user.id + path.extname(file.originalname)),
});
const avatarUpload = multer({ storage: avatarStorage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/avatar', protect, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const url = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatar: url });
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

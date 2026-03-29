const User = require('../models/User');

// @desc  Get my profile
// @route GET /api/users/profile
// @access Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses', 'title thumbnail rating duration level')
      .populate('completedCourses', 'title thumbnail')
      .populate('wishlist', 'title thumbnail price originalPrice rating instructor');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

// @desc  Update my profile
// @route PUT /api/users/profile
// @access Private
exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      'name', 'username', 'bio', 'phone', 'avatar', 'dob', 'tagline',
      'address', 'linkedin', 'github', 'twitter', 'portfolio',
      'skills', 'goals', 'institution', 'degree', 'field', 'gradYear',
      'cgpa', 'org', 'jobTitle', 'exp', 'country', 'pincode', 'whatsapp',
      'altEmail', 'gender', 'language'
    ];
    const fieldsToUpdate = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) fieldsToUpdate[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

// @desc  Get my wishlist
// @route GET /api/users/wishlist
// @access Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title thumbnail price originalPrice rating instructor level duration badge');

    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching wishlist', error: error.message });
  }
};

// @desc  Add course to wishlist
// @route POST /api/users/wishlist/:courseId
// @access Private
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: req.params.courseId } },
      { new: true }
    ).populate('wishlist', 'title thumbnail price');

    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding to wishlist', error: error.message });
  }
};

// @desc  Remove course from wishlist
// @route DELETE /api/users/wishlist/:courseId
// @access Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: req.params.courseId } },
      { new: true }
    ).populate('wishlist', 'title thumbnail price');

    res.status(200).json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing from wishlist', error: error.message });
  }
};

// ─── Instructor Management (Admin use) ───────────────────────────────────────

// @desc  Get all instructors
// @route GET /api/users/instructors
// @access Private (admin)
exports.getInstructors = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const q = { role: 'instructor' };
    if (search) q.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    if (status && status !== 'all') q.status = status;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(q);
    const data  = await User.find(q)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Set instructor status (active/suspended)
// @route PATCH /api/users/instructors/:id/status
// @access Private (admin)
exports.setInstructorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await User.findByIdAndUpdate(req.params.id, { status });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Delete instructor
// @route DELETE /api/users/instructors/:id
// @access Private (admin)
exports.deleteInstructor = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

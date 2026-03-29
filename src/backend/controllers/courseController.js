const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get my enrolled courses with progress
// @route   GET /api/courses/my-courses
// @access  Private
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({
        path: 'course',
        populate: [
          { path: 'instructor', select: 'name avatar' },
          { path: 'category', select: 'name icon' }
        ]
      })
      .sort('-enrolledAt');

    const data = enrollments.map(e => ({
      enrollmentId: e._id,
      progress: e.progress,
      status: e.status,
      completedLessons: e.completedLessons,
      lastAccessedLesson: e.lastAccessedLesson,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      certificate: e.certificate,
      course: e.course
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching my courses', error: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, sort, limit } = req.query;
    const mongoose = require('mongoose');
    const rawCol = () => mongoose.connection.db.collection('courses');

    // Build filter — admin saves status as 'published'
    const q = { status: 'published' };
    if (category) q.category = category;
    if (level)    q.level    = level;
    if (search)   q.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    let cursor = rawCol().find(q);

    // Sort
    if (sort === 'rating')     cursor = cursor.sort({ rating: -1 });
    else if (sort === 'newest') cursor = cursor.sort({ createdAt: -1 });
    else                        cursor = cursor.sort({ enrolledStudents: -1, createdAt: -1 });

    if (limit) cursor = cursor.limit(Number(limit));

    const courses = await cursor.toArray();

    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching courses', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { ObjectId } = require('mongodb');
    const rawCol = () => mongoose.connection.db.collection('courses');

    let course = null;
    try {
      course = await rawCol().findOne({ _id: new ObjectId(req.params.id) });
    } catch (_) {}

    // Fallback to Mongoose model if not found in raw collection
    if (!course) {
      course = await Course.findById(req.params.id).populate('reviews.user', 'name avatar');
    }

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching course', error: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
exports.createCourse = async (req, res) => {
  try {
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Add review to course
// @route   POST /api/courses/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = course.reviews.find(
      r => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    course.reviews.push(review);
    await course.calculateAverageRating();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

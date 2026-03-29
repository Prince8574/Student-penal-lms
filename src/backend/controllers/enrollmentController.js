const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc  Enroll in a course
// @route POST /api/enrollments/:courseId
// @access Private
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check already enrolled
    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    const price = course.price || 0;

    // Paid course must include payment details
    if (price > 0 && !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment details required for paid courses' });
    }

    const paymentData = price === 0
      ? { required: false, status: 'free', amount: 0 }
      : {
          required: true,
          status: 'paid',
          amount: price,
          method: paymentMethod,
          transactionId: transactionId || `TXN-${Date.now()}-${req.user.id}`,
          paidAt: new Date()
        };

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
      payment: paymentData
    });

    // Update course enrolled count & user enrolled list
    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudents: 1 } }),
      User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: courseId } })
    ]);

    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error enrolling in course', error: error.message });
  }
};

// @desc  Get all my enrollments
// @route GET /api/enrollments/my-courses
// @access Private
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course', 'title thumbnail instructor duration level category rating enrolledStudents badge')
      .sort('-enrolledAt');

    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching enrollments', error: error.message });
  }
};

// @desc  Get enrollment for a specific course (student) OR all enrollments for a course (instructor/admin)
// @route GET /api/enrollments/course/:courseId
// @access Private
exports.getEnrollmentByCourse = async (req, res) => {
  try {
    // Instructor/admin: return all students enrolled in this course
    if (req.user.role === 'instructor' || req.user.role === 'admin') {
      const enrollments = await Enrollment.find({ course: req.params.courseId })
        .populate('user', 'name email avatar')
        .sort('-enrolledAt');

      return res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
    }

    // Student: return their own enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching enrollment', error: error.message });
  }
};

// @desc  Update lesson progress
// @route PUT /api/enrollments/:enrollmentId/lesson
// @access Private
exports.updateLesson = async (req, res) => {
  try {
    const { lessonId, lessonTitle } = req.body;

    const enrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, user: req.user.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Add lesson to completed if not already there
    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    if (lessonTitle) enrollment.lastAccessedLesson = lessonTitle;

    // Auto-calculate progress based on course curriculum
    const course = await Course.findById(enrollment.course);
    if (course && course.curriculum) {
      const totalLessons = course.curriculum.reduce((acc, sec) => acc + sec.lessons.length, 0);
      if (totalLessons > 0) {
        enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
      }
    }

    await enrollment.save();

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating lesson', error: error.message });
  }
};

// @desc  Update overall progress manually
// @route PUT /api/enrollments/:enrollmentId/progress
// @access Private
exports.updateProgress = async (req, res) => {
  try {
    const { progress, completedLessons, lastAccessedLesson } = req.body;

    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: req.params.enrollmentId, user: req.user.id },
      { 
        ...(progress !== undefined && { progress }),
        ...(completedLessons && { completedLessons }),
        ...(lastAccessedLesson && { lastAccessedLesson })
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating progress', error: error.message });
  }
};

// @desc  Mark course as complete & issue certificate
// @route PUT /api/enrollments/:enrollmentId/complete
// @access Private
exports.completeCourse = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.enrollmentId, user: req.user.id });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    enrollment.status = 'completed';
    enrollment.progress = 100;
    enrollment.completedAt = new Date();
    enrollment.certificate = {
      issued: true,
      certificateId: `CERT-${req.user.id}-${enrollment.course}-${Date.now()}`,
      issuedAt: new Date()
    };

    await enrollment.save();

    // Add to user's completed courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { completedCourses: enrollment.course }
    });

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error completing course', error: error.message });
  }
};

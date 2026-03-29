const Payment  = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const Course   = require('../models/Course');
const User     = require('../models/User');

// @desc  Create payment + enroll student
// @route POST /api/payments/checkout/:courseId
// @access Private
exports.checkout = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { paymentMethod, transactionId, amount, gst, promoCode } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Already enrolled?
    const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled in this course' });

    const price = course.price || 0;

    // Paid course needs payment method
    if (price > 0 && !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method required' });
    }

    // Normalize method name — accept any string, fallback to 'Free' for free courses
    const normalizedMethod = price === 0 ? 'Free' : (paymentMethod || 'UPI');

    // Create payment record
    const payment = await Payment.create({
      user:          req.user.id,
      course:        courseId,
      transactionId: transactionId || `TXN-${Date.now()}`,
      method:        normalizedMethod,
      status:        'success',
      amount:        amount || price,
      gst:           gst || 0,
      promoCode:     promoCode || null,
    });

    // Create enrollment
    const enrollment = await Enrollment.create({
      user:   req.user.id,
      course: courseId,
      payment: {
        required:      price > 0,
        status:        price === 0 ? 'free' : 'paid',
        amount:        price,
        method:        normalizedMethod,
        transactionId: payment.transactionId,
        paidAt:        new Date()
      }
    });

    // Link payment to enrollment
    payment.enrollment = enrollment._id;
    await payment.save();

    // Update course count + user enrolled list
    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudents: 1 } }),
      User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: courseId } })
    ]);

    res.status(201).json({
      success: true,
      data: {
        enrollment,
        payment: {
          orderId:       payment.orderId,
          transactionId: payment.transactionId,
          amount:        payment.amount,
          gst:           payment.gst,
          method:        payment.method,
          status:        payment.status,
          paidAt:        payment.paidAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Checkout failed', error: error.message });
  }
};

// @desc  Get my payment history
// @route GET /api/payments/my-history
// @access Private
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('course', 'title thumbnail price')
      .sort('-paidAt');

    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};

// @desc  Get single payment by orderId
// @route GET /api/payments/:orderId
// @access Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId, user: req.user.id })
      .populate('course', 'title thumbnail');

    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment', error: error.message });
  }
};

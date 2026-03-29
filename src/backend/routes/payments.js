const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { checkout, getMyPayments, getPayment } = require('../controllers/paymentController');

// POST /api/payments/checkout/:courseId  — pay + enroll
router.post('/checkout/:courseId', protect, checkout);

// GET /api/payments/my-history
router.get('/my-history', protect, getMyPayments);

// GET /api/payments/:orderId
router.get('/:orderId', protect, getPayment);

module.exports = router;

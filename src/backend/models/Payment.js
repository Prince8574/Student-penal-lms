const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment'
  },
  orderId: {
    type: String,
    unique: true,
    default: () => `LV-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`
  },
  transactionId: { type: String },
  method: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'success'
  },
  amount:    { type: Number, required: true },
  gst:       { type: Number, default: 0 },
  discount:  { type: Number, default: 0 },
  promoCode: { type: String },
  paidAt:    { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

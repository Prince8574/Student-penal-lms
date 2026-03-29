const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // sorted pair of user IDs to identify a conversation
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:      { type: String, required: true, maxlength: 3000 },
    readBy:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
  }],
  lastMessage: { type: String },
  lastAt:      { type: Date, default: Date.now },
}, { timestamps: true });

MessageSchema.index({ participants: 1 });
MessageSchema.index({ lastAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);

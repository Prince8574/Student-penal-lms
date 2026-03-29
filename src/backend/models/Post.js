const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, maxlength: 2000 },
  image:   { type: String },
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text:   { type: String, required: true, maxlength: 1000 },
    likes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true, maxlength: 5000 },
  image:     { type: String },
  tag:       { type: String, enum: ['Question','Resource','Study Group','Achievement','Feedback','Discussion'], default: 'Discussion' },
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reactions: { type: Map, of: Number, default: {} },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments:  [CommentSchema],
}, { timestamps: true });

PostSchema.index({ createdAt: -1 });
PostSchema.index({ tag: 1 });

module.exports = mongoose.model('Post', PostSchema);

const Post = require('../models/Post');

// helper — shape a post for the client
function fmt(post, userId) {
  const p = post.toObject ? post.toObject() : post;
  return {
    id:        p._id,
    author:    p.author,
    content:   p.content,
    image:     p.image || null,
    tag:       p.tag,
    likes:     p.likes.length,
    liked:     userId ? p.likes.some(id => id.toString() === userId.toString()) : false,
    reactions: Object.fromEntries(p.reactions || new Map()),
    bookmarked: userId ? p.bookmarks.some(id => id.toString() === userId.toString()) : false,
    comments:  p.comments.map(c => ({
      id:      c._id,
      author:  c.author,
      text:    c.text,
      image:   c.image || null,
      likes:   c.likes.length,
      liked:   userId ? c.likes.some(id => id.toString() === userId.toString()) : false,
      replies: (c.replies || []).map(r => ({
        id:     r._id,
        author: r.author,
        text:   r.text,
        likes:  r.likes.length,
        createdAt: r.createdAt,
      })),
      createdAt: c.createdAt,
    })),
    createdAt: p.createdAt,
  };
}

// GET /api/posts?tag=&page=&limit=
exports.getPosts = async (req, res) => {
  try {
    const { tag, page = 1, limit = 20 } = req.query;
    const filter = tag && tag !== 'All' ? { tag } : {};
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
      .populate('comments.replies.author', 'name avatar');
    const total = await Post.countDocuments(filter);
    res.json({ success: true, data: posts.map(p => fmt(p, req.user?.id)), total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { content, tag, image } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: 'Content required' });
    const post = await Post.create({ author: req.user.id, content: content.trim(), tag: tag || 'Discussion', image });
    await post.populate('author', 'name avatar');
    res.status(201).json({ success: true, data: fmt(post, req.user.id) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const idx = post.likes.indexOf(req.user.id);
    if (idx === -1) post.likes.push(req.user.id);
    else post.likes.splice(idx, 1);
    await post.save();
    res.json({ success: true, likes: post.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/react
exports.reactPost = async (req, res) => {
  try {
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ success: false, message: 'Emoji required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.reactions.set(emoji, (post.reactions.get(emoji) || 0) + 1);
    await post.save();
    res.json({ success: true, reactions: Object.fromEntries(post.reactions) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/bookmark
exports.bookmarkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const idx = post.bookmarks.indexOf(req.user.id);
    if (idx === -1) post.bookmarks.push(req.user.id);
    else post.bookmarks.splice(idx, 1);
    await post.save();
    res.json({ success: true, bookmarked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text?.trim() && !image) return res.status(400).json({ success: false, message: 'Text or image required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.comments.push({ author: req.user.id, text: text?.trim() || '', image });
    await post.save();
    await post.populate('comments.author', 'name avatar');
    const c = post.comments[post.comments.length - 1];
    res.status(201).json({ success: true, data: {
      id: c._id, author: c.author, text: c.text, image: c.image || null,
      likes: 0, liked: false, replies: [], createdAt: c.createdAt,
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/comments/:cid/like
exports.likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comment = post.comments.id(req.params.cid);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    const idx = comment.likes.indexOf(req.user.id);
    if (idx === -1) comment.likes.push(req.user.id);
    else comment.likes.splice(idx, 1);
    await post.save();
    res.json({ success: true, likes: comment.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/posts/:id/comments/:cid/replies
exports.addReply = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Text required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comment = post.comments.id(req.params.cid);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    comment.replies.push({ author: req.user.id, text: text.trim() });
    await post.save();
    await post.populate('comments.replies.author', 'name avatar');
    const reply = comment.replies[comment.replies.length - 1];
    res.status(201).json({ success: true, data: { id: reply._id, author: reply.author, text: reply.text, likes: 0, createdAt: reply.createdAt } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/posts/:id/comments/:cid
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comment = post.comments.id(req.params.cid);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user.id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    comment.deleteOne();
    await post.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/posts/:id/comments/:cid
exports.editComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Text required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comment = post.comments.id(req.params.cid);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    if (comment.author.toString() !== req.user.id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    comment.text = text.trim();
    await post.save();
    res.json({ success: true, text: comment.text });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPosts, createPost, likePost, reactPost, bookmarkPost,
  addComment, likeComment, addReply, deleteComment, editComment,
} = require('../controllers/postController');

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.post('/:id/like',     protect, likePost);
router.post('/:id/react',    protect, reactPost);
router.post('/:id/bookmark', protect, bookmarkPost);

router.post('/:id/comments',              protect, addComment);
router.post('/:id/comments/:cid/like',    protect, likeComment);
router.post('/:id/comments/:cid/replies', protect, addReply);
router.put('/:id/comments/:cid',          protect, editComment);
router.delete('/:id/comments/:cid',       protect, deleteComment);

module.exports = router;

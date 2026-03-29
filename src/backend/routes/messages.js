const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getConversations, getConversation, sendMessage, searchUsers,
} = require('../controllers/messageController');

router.get('/users/search', protect, searchUsers);
router.get('/',             protect, getConversations);
router.get('/:userId',      protect, getConversation);
router.post('/:userId',     protect, sendMessage);

module.exports = router;

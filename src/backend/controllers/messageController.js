const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/messages — all conversations for current user
exports.getConversations = async (req, res) => {
  try {
    const convos = await Message.find({ participants: req.user.id })
      .sort({ lastAt: -1 })
      .populate('participants', 'name avatar');
    const data = convos.map(c => {
      const other = c.participants.find(p => p._id.toString() !== req.user.id.toString());
      const unread = c.messages.filter(m =>
        m.sender.toString() !== req.user.id.toString() &&
        !m.readBy.includes(req.user.id)
      ).length;
      return {
        id:       c._id,
        user:     other,
        lastMsg:  c.lastMessage || '',
        lastAt:   c.lastAt,
        unread,
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/messages/:userId — get or create conversation with a user
exports.getConversation = async (req, res) => {
  try {
    const otherId = req.params.userId;
    let convo = await Message.findOne({
      participants: { $all: [req.user.id, otherId] },
    }).populate('participants', 'name avatar')
      .populate('messages.sender', 'name avatar');

    if (!convo) {
      convo = await Message.create({ participants: [req.user.id, otherId], messages: [] });
      await convo.populate('participants', 'name avatar');
    }

    // mark all incoming as read
    let changed = false;
    convo.messages.forEach(m => {
      if (m.sender.toString() !== req.user.id.toString() && !m.readBy.includes(req.user.id)) {
        m.readBy.push(req.user.id);
        changed = true;
      }
    });
    if (changed) await convo.save();

    res.json({ success: true, data: convo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/messages/:userId — send a message
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Text required' });
    const otherId = req.params.userId;

    let convo = await Message.findOne({ participants: { $all: [req.user.id, otherId] } });
    if (!convo) convo = await Message.create({ participants: [req.user.id, otherId], messages: [] });

    const msg = { sender: req.user.id, text: text.trim(), readBy: [req.user.id] };
    convo.messages.push(msg);
    convo.lastMessage = text.trim().slice(0, 80);
    convo.lastAt = new Date();
    await convo.save();

    await convo.populate('messages.sender', 'name avatar');
    const saved = convo.messages[convo.messages.length - 1];
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/messages/users/search?q= — search users to start a conversation
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q || '';
    const users = await User.find({
      _id: { $ne: req.user.id },
      name: { $regex: q, $options: 'i' },
    }).select('name avatar').limit(10);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

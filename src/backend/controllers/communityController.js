const Post = require('../models/Post');
const User = require('../models/User');

// GET /api/community/stats
exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalMembers, postsToday, totalPosts] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments({ createdAt: { $gte: startOfDay } }),
      Post.countDocuments(),
    ]);

    // Trending tags — count posts per tag in last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const tagCounts = await Post.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: '$tag', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        members: totalMembers,
        postsToday,
        totalPosts,
        trendingTags: tagCounts.map(function(t) { return { tag: t._id, count: t.count }; }),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

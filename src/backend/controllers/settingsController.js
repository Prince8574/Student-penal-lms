const User = require('../models/User');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name username email phone bio avatar settings');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Merge user basic info with settings
    const userSettings = {
      // Basic info
      firstName: user.settings?.firstName || user.name?.split(' ')[0] || '',
      lastName: user.settings?.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      
      // All settings - convert to plain object
      ...(user.settings?.toObject ? user.settings.toObject() : user.settings || {})
    };

    res.status(200).json({
      success: true,
      data: userSettings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Extract basic fields that go in root level
    const { firstName, lastName, username, email, phone, bio, ...settingsData } = req.body;

    // Update basic user fields
    if (firstName || lastName) {
      user.name = `${firstName || ''} ${lastName || ''}`.trim();
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    // Update settings object
    user.settings = {
      ...(user.settings?.toObject ? user.settings.toObject() : user.settings || {}),
      firstName,
      lastName,
      ...settingsData
    };

    await user.save();

    // Return updated settings
    const updatedSettings = {
      firstName: user.settings.firstName || user.name?.split(' ')[0] || '',
      lastName: user.settings.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      ...(user.settings?.toObject ? user.settings.toObject() : user.settings || {})
    };

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

// @desc    Update password
// @route   PUT /api/settings/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
};

// @desc    Reset all settings to default
// @route   POST /api/settings/reset
// @access  Private
exports.resetSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Reset settings to default (empty object will use schema defaults)
    user.settings = {};
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Settings reset to default successfully'
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting settings',
      error: error.message
    });
  }
};

// @desc    Export user data
// @route   GET /api/settings/export
// @access  Private
exports.exportData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -verificationToken -resetPasswordToken')
      .populate('enrolledCourses', 'title')
      .populate('completedCourses', 'title')
      .populate('wishlist', 'title');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};

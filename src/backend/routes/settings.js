const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updatePassword,
  resetSettings,
  exportData
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Settings routes
router.route('/')
  .get(getSettings)
  .put(updateSettings);

router.put('/password', updatePassword);
router.post('/reset', resetSettings);
router.get('/export', exportData);

module.exports = router;

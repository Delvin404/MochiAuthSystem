const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/dashboard
// @access  Private (any logged-in user)
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, ${req.user.name}!`,
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// @route   GET /api/users/admin
// @access  Private (admin only)
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin panel' });
});

module.exports = router;

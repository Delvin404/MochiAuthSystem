const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const {
  register,
  login,
  refresh,
  logout,
  getProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validators');

// Limit repeated login attempts to mitigate brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getProfile);

module.exports = router;

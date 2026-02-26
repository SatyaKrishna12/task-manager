const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, registerSchema, loginSchema } = require('../middleware/validateMiddleware');

/**
 * Public Routes
 */

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', validate(loginSchema), login);

/**
 * Protected Routes (Require Authentication)
 */

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
// @access  Private
router.post('/logout', protect, logout);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, getMe);

// @route   PUT /api/auth/me
// @desc    Update user profile
// @access  Private
router.put('/me', protect, updateProfile);

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', protect, changePassword);

// @route   DELETE /api/auth/me
// @desc    Delete/Deactivate user account
// @access  Private
router.delete('/me', protect, deleteAccount);

module.exports = router;

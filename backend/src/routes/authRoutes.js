const express = require('express');
const { login, register, logout, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;

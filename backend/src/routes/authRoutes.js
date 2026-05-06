const express = require('express');
const { login, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;

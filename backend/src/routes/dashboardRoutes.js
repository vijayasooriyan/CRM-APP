const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Protected route
router.get('/', verifyToken, getDashboardStats);

module.exports = router;

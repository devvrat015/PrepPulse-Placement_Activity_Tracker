const express = require('express');
const { getAnalyticsSummary } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authMiddleware, getAnalyticsSummary);

module.exports = router;

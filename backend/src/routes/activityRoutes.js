const express = require('express');
const {
  createActivity,
  getActivities,
  getWeeklyActivities,
  deleteActivity,
} = require('../controllers/activityController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createActivity);
router.get('/', authMiddleware, getActivities);
router.get('/weekly', authMiddleware, getWeeklyActivities);
router.delete('/:id', authMiddleware, deleteActivity);

module.exports = router;

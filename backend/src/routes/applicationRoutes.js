const express = require('express');
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, createApplication);
router.get('/', authMiddleware, getApplications);
router.patch('/:id', authMiddleware, updateApplication);
router.delete('/:id', authMiddleware, deleteApplication);

module.exports = router;

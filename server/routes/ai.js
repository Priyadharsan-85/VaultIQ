const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected Chat Route
router.post('/chat', authMiddleware, aiController.processChat);
router.get('/insight', authMiddleware, aiController.getInsight);

module.exports = router;

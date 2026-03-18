const express = require('express');
const router = express.Router();
const fraudController = require('../controllers/fraudController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/alerts', fraudController.getAlerts);
router.put('/alerts/:id/review', fraudController.reviewAlert);

module.exports = router;

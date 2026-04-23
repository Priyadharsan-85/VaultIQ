const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', subscriptionController.getSubscriptions);
router.post('/scan', subscriptionController.scanForSubscriptions);

module.exports = router;

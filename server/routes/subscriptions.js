const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', subscriptionController.getSubscriptions);
router.post('/scan', subscriptionController.scanForSubscriptions);
router.post('/cancel/:id', subscriptionController.cancelSubscription);

module.exports = router;

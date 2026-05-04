const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const setuController = require('../controllers/setuController');

router.get('/status', authMiddleware, setuController.checkStatus);
router.post('/create_consent', authMiddleware, setuController.createConsent);
router.post('/sync_data', authMiddleware, setuController.syncData);

module.exports = router;

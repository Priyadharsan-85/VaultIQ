const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/crypto', marketController.getCrypto);
router.get('/stocks', marketController.getStocks);

module.exports = router;

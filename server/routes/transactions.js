const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.post('/add', transactionController.addTransaction);
router.get('/:id', transactionController.getTransactionById);

module.exports = router;

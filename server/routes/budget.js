const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', budgetController.getBudget);
router.post('/set', budgetController.setBudget);
router.put('/update/:category', budgetController.updateSpent);

module.exports = router;

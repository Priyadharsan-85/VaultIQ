const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', goalController.getGoals);
router.post('/add', goalController.createGoal);
router.post('/allocate', goalController.allocateToGoal);

module.exports = router;

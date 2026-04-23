const { Goal } = require('../models/associations');

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({ where: { userId: req.user.id } });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, targetDate, color } = req.body;
    const goal = await Goal.create({
      userId: req.user.id,
      title,
      targetAmount,
      targetDate,
      color
    });
    res.status(201).json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.allocateToGoal = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    const goal = await Goal.findOne({ where: { id: goalId, userId: req.user.id } });
    
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.currentAmount += parseFloat(amount);
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

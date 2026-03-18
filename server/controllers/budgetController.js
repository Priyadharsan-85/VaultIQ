const Budget = require('../models/Budget');

exports.getBudget = async (req, res) => {
  try {
    const budgets = await Budget.findAll({ where: { userId: req.user.id } });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.setBudget = async (req, res) => {
  try {
    const { category, monthlyLimit, month, year } = req.body;
    let budget = await Budget.findOne({ where: { userId: req.user.id, category, month, year } });

    if (budget) {
      budget.monthlyLimit = monthlyLimit;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user.id,
        category,
        monthlyLimit,
        month,
        year
      });
    }
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateSpent = async (req, res) => {
  try {
    const { category, currentSpent, month, year } = req.body;
    let budget = await Budget.findOne({ where: { userId: req.user.id, category, month, year } });

    if (!budget) return res.status(404).json({ message: 'Budget not set for this category' });

    budget.currentSpent = currentSpent;
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Calculate Total Balance (Sum of all transactions)
    // Note: In a real app, you'd separate Income and Expense. 
    // Here we treat positive as income, negative as expense.
    const totalTransactions = await Transaction.findAll({ where: { userId } });
    const totalBalance = totalTransactions.reduce((acc, tx) => acc + tx.amount, 0);

    // 2. Calculate Monthly Spending (Sum of negative transactions this month)
    const monthlyTransactions = await Transaction.findAll({
      where: {
        userId,
        transactionTime: { [Op.gte]: firstDayOfMonth },
        amount: { [Op.lt]: 0 } // Only expenses
      }
    });
    const monthlySpending = Math.abs(monthlyTransactions.reduce((acc, tx) => acc + tx.amount, 0));

    // 3. Calculate Monthly Income (Sum of positive transactions this month)
    const monthlyIncome = await Transaction.findAll({
      where: {
        userId,
        transactionTime: { [Op.gte]: firstDayOfMonth },
        amount: { [Op.gt]: 0 }
      }
    });
    const incomeTotal = monthlyIncome.reduce((acc, tx) => acc + tx.amount, 0);

    // 4. Calculate Commitments (Total Budget limits for the month)
    const budgets = await Budget.findAll({ where: { userId } });
    const totalCommitments = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);

    // 5. Fraud Alerts Count
    const fraudAlertsCount = await Transaction.count({
      where: { userId, isFraud: true }
    });

    res.json({
      totalBalance: totalBalance || 0,
      monthlySpending: monthlySpending || 0,
      monthlyIncome: incomeTotal || 0,
      totalCommitments: totalCommitments || 0,
      fraudAlerts: fraudAlertsCount || 0,
      savingsRate: incomeTotal > 0 ? ((incomeTotal - monthlySpending) / incomeTotal) * 100 : 0
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ message: 'Error calculating dashboard stats' });
  }
};

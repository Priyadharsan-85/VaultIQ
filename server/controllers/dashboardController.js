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

exports.getRunway = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({ where: { userId } });

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    thirtyDaysAgo.setHours(0,0,0,0);

    let totalBalance = 0;
    let changeLast30 = 0;
    const dailyChanges = {};

    transactions.forEach(tx => {
      totalBalance += tx.amount;
      const txDate = new Date(tx.transactionTime);
      if (txDate >= thirtyDaysAgo) {
        changeLast30 += tx.amount;
        const dStr = txDate.toISOString().split('T')[0];
        dailyChanges[dStr] = (dailyChanges[dStr] || 0) + tx.amount;
      }
    });

    let balancePointer = totalBalance - changeLast30;
    const historyData = [];

    // Historical data (last 30 days)
    for (let i = 0; i <= 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      
      balancePointer += (dailyChanges[dStr] || 0);
      historyData.push({
        date: dStr,
        balance: Math.round(balancePointer * 100) / 100,
        isProjection: false
      });
    }

    // Average daily flow for projection
    const averageDailyFlow = changeLast30 / 30;
    let projBalance = totalBalance;

    // Projected data (next 90 days)
    for (let i = 1; i <= 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      
      projBalance += averageDailyFlow;
      historyData.push({
        date: dStr,
        balance: Math.round(projBalance * 100) / 100,
        isProjection: true
      });
    }

    res.json(historyData);
  } catch (err) {
    console.error('Runway Error:', err);
    res.status(500).json({ message: 'Error calculating runway' });
  }
};

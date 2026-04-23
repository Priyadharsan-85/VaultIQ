const { Subscription, Transaction } = require('../models/associations');
const { Op } = require('sequelize');

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({ where: { userId: req.user.id } });
    res.json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.scanForSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({ 
      where: { userId },
      order: [['transactionTime', 'DESC']]
    });

    // Group by merchant
    const merchantGroups = {};
    transactions.forEach(tx => {
      if (!merchantGroups[tx.merchantName]) merchantGroups[tx.merchantName] = [];
      merchantGroups[tx.merchantName].push(tx);
    });

    const identifiedSubscriptions = [];

    for (const merchant in merchantGroups) {
      const txs = merchantGroups[merchant];
      if (txs.length < 2) continue;

      // Simple heuristic: check if at least two transactions are ~30 days apart
      for (let i = 0; i < txs.length - 1; i++) {
        const date1 = new Date(txs[i].transactionTime);
        const date2 = new Date(txs[i+1].transactionTime);
        const diffDays = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);

        if (diffDays >= 25 && diffDays <= 35) {
          // Found a potential recurring charge
          const latestAmount = Math.abs(txs[i].amount);
          const previousAmount = Math.abs(txs[i+1].amount);
          
          // Check if already exists
          let sub = await Subscription.findOne({ where: { userId, merchantName: merchant } });
          
          const nextDate = new Date(date1);
          nextDate.setDate(nextDate.getDate() + 30);

          if (!sub) {
            sub = await Subscription.create({
              userId,
              merchantName: merchant,
              amount: latestAmount,
              previousAmount: previousAmount,
              nextBillingDate: nextDate,
              cycle: 'monthly',
              status: 'active'
            });
          } else {
            sub.previousAmount = sub.amount;
            sub.amount = latestAmount;
            sub.nextBillingDate = nextDate;
            await sub.save();
          }
          identifiedSubscriptions.push(sub);
          break; // Move to next merchant
        }
      }
    }

    res.json({ message: 'Scan complete', subscriptions: identifiedSubscriptions });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

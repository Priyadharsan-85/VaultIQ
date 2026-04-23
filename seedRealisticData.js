const { Transaction, User, Budget, FraudAlert } = require('./server/models/associations');
const sequelize = require('./server/models/index');

const seed = async () => {
  try {
    await sequelize.sync();
    console.log('Purging stale identity data...');
    await User.destroy({ where: { email: 'demo@vaultiq.com' } });
    
    console.log('Restoring Demo Commander account...');
    const user = await User.create({
      name: 'Commander Demo',
      email: 'demo@vaultiq.com',
      password: '$2b$10$muE1U29r5LoY7FWLWz.G1ehLVVVmbPWftU4NtUs5TJY5WRn2Z33W6' // demo123
    });

    const userId = user.id;

    // 1. Clear existing data to start fresh for "Realistic" look
    await FraudAlert.destroy({ where: {} });
    await Transaction.destroy({ where: { userId } });
    await Budget.destroy({ where: { userId } });
    
    console.log('Seeding realistic data for user:', user.email);

    // 2. Seed Budgets
    await Budget.bulkCreate([
      { userId, category: 'Food', monthlyLimit: 15000, month: 4, year: 2026 },
      { userId, category: 'Shopping', monthlyLimit: 10000, month: 4, year: 2026 },
      { userId, category: 'Bills', monthlyLimit: 30000, month: 4, year: 2026 },
      { userId, category: 'Entertainment', monthlyLimit: 5000, month: 4, year: 2026 },
      { userId, category: 'Travel', monthlyLimit: 5000, month: 4, year: 2026 },
    ]);

    // 3. Seed Transactions (Mix of Income & Expense)
    const transactions = [
      { userId, amount: 85000, merchantName: 'Corporate Salary', category: 'Income', location: 'Remote', transactionTime: new Date('2026-04-01T10:00:00Z') },
      { userId, amount: -22000, merchantName: 'Skyline Apartments', category: 'Bills', location: 'Delhi', transactionTime: new Date('2026-03-02T09:00:00Z') },
      { userId, amount: -22000, merchantName: 'Skyline Apartments', category: 'Bills', location: 'Delhi', transactionTime: new Date('2026-04-02T09:00:00Z') },
      { userId, amount: -1500, merchantName: 'Starbucks Coffee', category: 'Food', location: 'Mumbai', transactionTime: new Date('2026-04-05T15:30:00Z') },
      { userId, amount: -4500, merchantName: 'Amazon India', category: 'Shopping', location: 'Online', transactionTime: new Date('2026-04-07T12:00:00Z') },
      { userId, amount: -800, merchantName: 'Uber India', category: 'Travel', location: 'Delhi', transactionTime: new Date('2026-04-10T08:00:00Z') },
      { userId, amount: -2500, merchantName: 'PVR Cinemas', category: 'Entertainment', location: 'Mumbai', transactionTime: new Date('2026-04-12T20:00:00Z') },
      { userId, amount: -3200, merchantName: 'Whole Foods', category: 'Food', location: 'Mumbai', transactionTime: new Date('2026-04-15T11:00:00Z') },
      { userId, amount: -12000, merchantName: 'Unusual ATM Withdrawal', category: 'Cash', location: 'Beijing', transactionTime: new Date('2026-04-18T03:00:00Z'), isFraud: true, fraudConfidence: 0.88 },
      { userId, amount: -500, merchantName: 'Netflix Subscription', category: 'Bills', location: 'Online', transactionTime: new Date('2026-03-19T10:00:00Z') },
      { userId, amount: -600, merchantName: 'Netflix Subscription', category: 'Bills', location: 'Online', transactionTime: new Date('2026-04-19T10:00:00Z') },
      { userId, amount: -4200, merchantName: 'Myntra Fashion', category: 'Shopping', location: 'Online', transactionTime: new Date('2026-04-20T14:00:00Z') },
    ];

    const createdTxs = await Transaction.bulkCreate(transactions);

    // 4. Seed a Fraud Alert for the anomalous transaction
    const fraudTx = createdTxs.find(t => t.isFraud);
    if (fraudTx) {
      await FraudAlert.create({
        transactionId: fraudTx.id,
        userId: userId,
        confidenceScore: 0.92,
        reason: 'Unusual international location & high cash volume extraction',
        status: 'pending'
      });
    }

    console.log('✅ Realistic data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();

const Transaction = require('./Transaction');
const FraudAlert = require('./FraudAlert');
const User = require('./User');
const Budget = require('./Budget');

// Define Associations
FraudAlert.belongsTo(Transaction, { foreignKey: 'transactionId' });
Transaction.hasMany(FraudAlert, { foreignKey: 'transactionId' });

Transaction.belongsTo(User, { foreignKey: 'userId' });
Budget.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Transaction, FraudAlert, User, Budget };

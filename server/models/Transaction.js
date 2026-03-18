const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  merchantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isFraud: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fraudConfidence: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
}, {
  timestamps: true,
});

module.exports = Transaction;

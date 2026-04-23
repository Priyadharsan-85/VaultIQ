const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  merchantName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  previousAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  cycle: {
    type: DataTypes.ENUM('monthly', 'yearly'),
    defaultValue: 'monthly',
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled'),
    defaultValue: 'active',
  }
}, {
  timestamps: true,
});

module.exports = Subscription;

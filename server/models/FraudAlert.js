const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const FraudAlert = sequelize.define('FraudAlert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  confidenceScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = FraudAlert;

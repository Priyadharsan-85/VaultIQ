const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currentAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#C6A87C', // Gold default
  }
}, {
  timestamps: true,
});

module.exports = Goal;

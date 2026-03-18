const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monthlyLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currentSpent: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Budget;

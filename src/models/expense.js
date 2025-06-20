'use strict';
const sequelize = require("../config/connect");
const { DataTypes } = require("sequelize");

  const Expense = sequelize.define('Expense', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    incurred_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'expenses',
    timestamps: true,
    underscored: true,
    paranoid: true,
  });


module.exports = Expense;

'use strict';

const User = require('./user');
const Expense = require('./expense');
const ExpenseFile = require('./expense_file');

// Define associations between models
User.hasMany(Expense, { foreignKey: 'user_id', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Expense.hasMany(ExpenseFile, { foreignKey: 'expense_id', as: 'files' });
ExpenseFile.belongsTo(Expense, { foreignKey: 'expense_id', as: 'expense' });

// Export all models to be used in the application
module.exports = {
  User,
  Expense,
  ExpenseFile,
};

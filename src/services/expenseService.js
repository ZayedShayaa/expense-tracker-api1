const { Expense } = require("../models");
const { Op } = require("sequelize");

// Helper function to fetch a single expense
async function getExpenseById(expenseId, userId) {
  const expense = await Expense.findOne({
    where: { id: expenseId, user_id: userId, deleted_at: null },
  });
  if (!expense) throw new Error("Expense not found or unauthorized");
  return expense;
}

//create a new expense
exports.createExpense = async (expenseData) => {
  return await Expense.create(expenseData);
};

// Get expenses for a user with pagination and optional filters
exports.getExpenses = async (
  userId,
  { page = 1, limit = 10, category, from, to }
) => {
  const offset = (page - 1) * limit;
  const where = { user_id: userId, deleted_at: null };

  if (category) where.category = category;

  if (from || to) {
    where.incurred_at = {};
    if (from) where.incurred_at[Op.gte] = new Date(from);
    if (to) where.incurred_at[Op.lte] = new Date(to);
  }

  const { count, rows } = await Expense.findAndCountAll({
    where,
    limit,
    offset,
    order: [["incurred_at", "DESC"]],
  });

  return { total: count, page, pageSize: limit, expenses: rows };
};

// Update an existing expense using getExpenseById helper
exports.updateExpense = async (expenseId, userId, expenseData) => {
  const expense = await getExpenseById(expenseId, userId);
  return await expense.update(expenseData);
};

// Delete an expense by marking it as deleted
exports.deleteExpense = async (expenseId, userId) => {
  const expense = await getExpenseById(expenseId, userId);
  return await expense.update({ deleted_at: new Date() });
};

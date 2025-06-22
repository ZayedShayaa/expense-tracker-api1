const ExpenseService = require("../services/expenseService");

exports.createExpense = async (req, res, next) => {
  try {
    const expenseData = {
      ...req.body,
      user_id: req.user.id, // add user ID from authenticated user
    };

    const expense = await ExpenseService.createExpense(expenseData);
    res.status(201).json(expense);
  } catch (err) {
    next(err); // pass to error handler middleware
  }
};

// Controller for fetching expenses with optional filters
exports.getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, from, to } = req.query;

    const expenses = await ExpenseService.getExpenses(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      from,
      to,
    });

    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const updated = await ExpenseService.updateExpense(
      req.params.id,
      req.user.id,
      req.body
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const deleted = await ExpenseService.deleteExpense(
      req.params.id,
      req.user.id
    );

    res.status(200).json(deleted);
  } catch (err) {
  
    next(err);
  }
};

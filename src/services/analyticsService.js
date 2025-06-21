const { Expense } = require("../models");
const { Op, fn, col,Sequelize } = require("sequelize");

// This service provides analytics related to expenses, such as monthly totals and category breakdowns.
exports.getMonthlyExpenses = async (userId) => {
  const expenses = await Expense.findAll({
    attributes: [
      [
        Sequelize.fn("TO_CHAR", Sequelize.col("incurred_at"), "YYYY-MM"),
        "month",
      ],
      [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
    ],
    where: { user_id: userId },
    group: [Sequelize.fn("TO_CHAR", Sequelize.col("incurred_at"), "YYYY-MM")],
    order: [
      [Sequelize.fn("TO_CHAR", Sequelize.col("incurred_at"), "YYYY-MM"), "ASC"],
    ],
  });

  return expenses.map((e) => ({
    month: e.get("month"),
    total: parseFloat(e.get("total")),
  }));
};


// This function retrieves analytics for expenses by category within a specified date range.
exports.getCategoryAnalytics = async (userId, from, to) => {
  const where = {
    user_id: userId,
    deleted_at: null,
  };

  if (from && to) {
    where.incurred_at = {
      [Op.between]: [new Date(from), new Date(to)],
    };
  }

  const results = await Expense.findAll({
    where,
    attributes: ["category", [fn("SUM", col("amount")), "total"]],
    group: ["category"],
    order: [[fn("SUM", col("amount")), "DESC"]],
    raw: true,
  });

  return results;
};

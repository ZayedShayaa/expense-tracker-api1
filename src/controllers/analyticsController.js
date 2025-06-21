const AnalyticsService = require("../services/analyticsService");

// Controller for handling analytics-related requests
exports.getMonthlyExpenses = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getMonthlyExpenses(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};


// Controller for handling category analytics requests
exports.getCategoryAnalytics = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await AnalyticsService.getCategoryAnalytics(req.user.id, from, to);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
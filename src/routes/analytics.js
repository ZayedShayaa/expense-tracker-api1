const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const AnalyticsController = require("../controllers/analyticsController");

router.use(auth);

router.get("/monthly", AnalyticsController.getMonthlyExpenses);
router.get("/categories", AnalyticsController.getCategoryAnalytics);

module.exports = router;

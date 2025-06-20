const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expensesController");
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const {
  createExpenseSchema,
  updateExpenseSchema,
} = require("../validations/expenseValidate");

// Protect all routes
router.use(auth);

router.post("/", validate(createExpenseSchema), ExpenseController.createExpense);
router.get("/", ExpenseController.getExpenses);
router.patch("/:id", validate(updateExpenseSchema), ExpenseController.updateExpense);
router.delete("/:id", ExpenseController.deleteExpense);

module.exports = router;

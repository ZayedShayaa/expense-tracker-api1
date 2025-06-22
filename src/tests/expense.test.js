const { Expense } = require("../models");
const ExpenseService = require("../services/expenseService");
const { Op } = require("sequelize");

// 🧪 نعمل Mock للدوال داخل Expense Model
jest.mock("../../src/models", () => ({
  Expense: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe("ExpenseService", () => {
  const mockUserId = 1;
  const mockExpenseId = 10;
  const mockExpense = {
    id: mockExpenseId,
    user_id: mockUserId,
    amount: 100,
    category: "Food",
    incurred_at: new Date("2024-01-01"),
    update: jest.fn(), // لـ update و delete
  };

  // ✅ createExpense
  it("should create an expense", async () => {
    Expense.create.mockResolvedValue(mockExpense);

    const result = await ExpenseService.createExpense({
      amount: 100,
      category: "Food",
      user_id: mockUserId,
    });

    expect(Expense.create).toHaveBeenCalledWith({
      amount: 100,
      category: "Food",
      user_id: mockUserId,
    });
    expect(result).toEqual(mockExpense);
  });

  // ✅ getExpenses
  it("should return paginated expenses with filters", async () => {
    Expense.findAndCountAll.mockResolvedValue({
      count: 1,
      rows: [mockExpense],
    });

    const result = await ExpenseService.getExpenses(mockUserId, {
      page: 1,
      limit: 10,
      category: "Food",
      from: "2024-01-01",
      to: "2024-12-31",
    });

    expect(result.total).toBe(1);
    expect(result.expenses).toContainEqual(mockExpense);
    expect(Expense.findAndCountAll).toHaveBeenCalled();
  });

  // ✅ updateExpense
  it("should update an existing expense", async () => {
    Expense.findOne.mockResolvedValue(mockExpense);
    mockExpense.update.mockResolvedValue({
      ...mockExpense,
      amount: 200,
    });

    const result = await ExpenseService.updateExpense(
      mockExpenseId,
      mockUserId,
      { amount: 200 }
    );

    expect(Expense.findOne).toHaveBeenCalledWith({
      where: { id: mockExpenseId, user_id: mockUserId, deleted_at: null },
    });
    expect(result.amount).toBe(200);
  });

  // ✅ deleteExpense (soft delete)
  it("should soft-delete an expense", async () => {
    Expense.findOne.mockResolvedValue(mockExpense);
    mockExpense.update.mockResolvedValue({
      ...mockExpense,
      deleted_at: new Date(),
    });

    const result = await ExpenseService.deleteExpense(
      mockExpenseId,
      mockUserId
    );

    expect(mockExpense.update).toHaveBeenCalledWith({
      deleted_at: expect.any(Date),
    });
    expect(result.deleted_at).toBeInstanceOf(Date);
  });
});

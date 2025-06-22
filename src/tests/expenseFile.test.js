const { Expense, ExpenseFile } = require("../models");
const service = require("../services/expenseFileService");

jest.mock("../models", () => ({
  Expense: { findOne: jest.fn() },
  ExpenseFile: { findOne: jest.fn(), create: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("expenseFileService", () => {
  it("throws if expense not found", async () => {
    Expense.findOne.mockResolvedValue(null);
    await expect(service.getFileById(1, 1, 1)).rejects.toThrow(
      "Unauthorized access"
    );
  });

  it("throws if file not found", async () => {
    Expense.findOne.mockResolvedValue({ id: 1, user_id: 1 });
    ExpenseFile.findOne.mockResolvedValue(null);
    await expect(service.getFileById(1, 1, 1)).rejects.toThrow(
      "File not found"
    );
  });

  it("returns file if found", async () => {
    const file = { id: 1, expense_id: 1 };
    Expense.findOne.mockResolvedValue({ id: 1, user_id: 1 });
    ExpenseFile.findOne.mockResolvedValue(file);
    await expect(service.getFileById(1, 1, 1)).resolves.toEqual(file);
  });

  it("uploads file correctly", async () => {
    const mock = { file_url: "uploads/test.pdf" };
    ExpenseFile.create.mockResolvedValue(mock);
    const res = await service.uploadFile({
      expenseId: 1,
      filename: "test.pdf",
      filePath: "/a/b/test.pdf",
    });
    expect(res.file_url).toBe("uploads/test.pdf");
  });
});

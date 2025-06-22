const { Expense, ExpenseFile } = require("../models");
const service = require("../services/expenseFileService");

jest.mock("../models", () => ({
  Expense: { findOne: jest.fn() },
  ExpenseFile: { findOne: jest.fn(), create: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("expenseFileService", () => {
  it("denies access if expense not found", async () => {
    Expense.findOne.mockResolvedValue(null);
    await expect(service.getFileById(1, 2, 3)).rejects.toThrow("Unauthorized access");
  });

  it("throws if file missing", async () => {
    Expense.findOne.mockResolvedValue({ id: 1, user_id: 3 });
    ExpenseFile.findOne.mockResolvedValue(null);
    await expect(service.getFileById(1, 2, 3)).rejects.toThrow("File not found");
  });

  it("returns file if all valid", async () => {
    const file = { id: 2 };
    Expense.findOne.mockResolvedValue({ id: 1, user_id: 3 });
    ExpenseFile.findOne.mockResolvedValue(file);
    await expect(service.getFileById(1, 2, 3)).resolves.toEqual(file);
  });

  it("uploads and returns file path", async () => {
    const mock = { file_url: "uploads/x.pdf" };
    ExpenseFile.create.mockResolvedValue(mock);
    const result = await service.uploadFile({ expenseId: 1, filename: "x.pdf", filePath: "/tmp/x.pdf" });
    expect(result.file_url).toBe("uploads/x.pdf");
  });
});

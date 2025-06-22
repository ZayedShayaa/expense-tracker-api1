const { Expense, ExpenseFile } = require("../models");
const path = require("path");

exports.uploadFile = async ({ expenseId, filename, filePath }) => {
  // get the full file path using path.basename
  const fileName = path.basename(filePath);

  // create a relative path using a single forward slash
  const relativeFilePath = `uploads/${fileName}`;

  //create a new file record in the database
  return await ExpenseFile.create({
    expense_id: expenseId,
    filename,
    file_url: relativeFilePath, // its will be sotorage "uploads/1750360413743-C.V.pdf"
  });
};
exports.getFileById = async (expenseId, fileId, userId) => {
  // validate the expenseId and fileId
  const expense = await Expense.findOne({
    where: { id: expenseId, user_id: userId },
  });

  if (!expense) {
    throw new Error("Unauthorized access");
  }

  //seach for the file
  const file = await ExpenseFile.findOne({
    where: { id: fileId, expense_id: expenseId },
  });

  if (!file) {
    throw new Error("File not found");
  }

  return file;
};

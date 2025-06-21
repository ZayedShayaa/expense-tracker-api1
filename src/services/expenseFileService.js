const { Expense, ExpenseFile } = require("../models");
const path = require("path");

exports.uploadFile = async ({ expenseId, filename, filePath }) => {
  // نأخذ اسم الملف فقط من المسار الكامل
  const fileName = path.basename(filePath);

  // ننشئ مساراً نسبياً باستخدام الشرطة المائلة المفردة
  const relativeFilePath = `uploads/${fileName}`;

  // أو باستخدام path.join مع replace
  // const relativeFilePath = path.join("uploads", fileName).replace(/\\/g, '/');

  return await ExpenseFile.create({
    expense_id: expenseId,
    filename,
    file_url: relativeFilePath, // its will be sotorage "uploads/1750360413743-C.V.pdf"
  });
};

exports.getFileById = async (expenseId, fileId, userId) => {
  // validate that the expense belongs to the user
  const expense = await Expense.findOne({
    where: { id: expenseId, user_id: userId },
  });
  if (!expense) throw new Error("Unauthorized access");

  const file = await ExpenseFile.findOne({
    where: { id: fileId, expense_id: expenseId },
  });

  if (!file) throw new Error("File not found");

  return file;
};

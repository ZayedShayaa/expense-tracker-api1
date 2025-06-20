const { Expense } = require("../models");
const path = require("path");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { Op } = require("sequelize");

const EXPORT_DIR = path.join(__dirname, "../exports");
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR);

exports.generateCSV = async (userId, from, to) => {
  const expenses = await Expense.findAll({
    where: {
      user_id: userId,
      deleted_at: null,
      incurred_at: { [Op.between]: [new Date(from), new Date(to)] },
    },
    raw: true,
  });

  const fileName = `expenses-${Date.now()}.csv`;
  const filePath = path.join(EXPORT_DIR, fileName);
  const ws = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    fastcsv
      .write(expenses, { headers: true })
      .on("error", reject)
      .on("finish", () => resolve(filePath))
      .pipe(ws);
  });
};

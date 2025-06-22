const exportService = require("../services/exportService");
const { addEmailJob } = require("../jobs/emailQueue");
const path = require("path");

// This controller handles exporting expenses to a CSV file and optionally sending it via email
exports.exportExpenses = async (req, res, next) => {
  try {
    const { from, to, sendEmail } = req.query;
    const { id: userId, email } = req.user;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "Both 'from' and 'to' query params are required" });
    }

    const filePath = await exportService.generateCSV(userId, from, to);
    const fileName = path.basename(filePath);

    if (sendEmail === "true") {
      await addEmailJob({
        to: email,
        subject: "Your Expense CSV Report",
        text: "Please find your CSV expense report attached.",
        attachments: [{ filename: fileName, path: filePath }],
      });
      return res.status(202).json({
        message: "Email job enqueued successfully",
        fileName,
      });
    }

    const downloadUrl = `/api/exports/download/${fileName}`;
    return res.status(200).json({
      message: "CSV generated successfully",
      fileName,
      downloadUrl,
    });
  } catch (err) {
    next(err);
  }
};
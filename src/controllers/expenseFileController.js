const ExpenseFileService = require("../services/expenseFileService");
const path = require("path");
const filegQueue = require("../jobs/fileQueue");

// This function is used to upload a file associated with an expense
exports.uploadFile = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0)
      return res.status(400).json({ error: "No file uploaded" });

    const expenseId = req.params.id;
    const uploadedFiles = [];

    for (const file of files) {
      const uploaded = await ExpenseFileService.uploadFile({
        expenseId,
        filename: file.originalname,
        filePath: file.path,
      });
      // Adding the file to the queue for processing
      await filegQueue.add({
        fileId: uploaded.id,
        filePath: path.resolve("src", uploaded.file_url),
        filename: uploaded.filename,
      });
      uploadedFiles.push(uploaded);
    }
    res.status(201).json(uploadedFiles);
  } catch (err) {
    next(err);
  }
};

// This function is used to download a file associated with an expense
exports.downloadFile = async (req, res, next) => {
  try {
    const { id: expenseId, fileId } = req.params;

    const file = await ExpenseFileService.getFileById(
      expenseId,
      fileId,
      req.user.id
    );

    // Check if the file exists
    const fullFilePath = path.join(__dirname, "..", file.file_url); //  uploads/xxx.pdf

    return res.download(fullFilePath, file.filename);
  } catch (err) {
    next(err);
  }
};

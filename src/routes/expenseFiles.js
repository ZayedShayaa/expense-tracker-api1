const express = require("express");
const router = express.Router({ mergeParams: true });

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload_middleware");
const ExpenseFileController = require("../controllers/expenseFileController");

// حماية كل المسارات
router.use(auth);

// رفع ملف (PDF/Image, max 5MB)
router.post("/", upload.single("file"), ExpenseFileController.uploadFile);

// تحميل ملف مرفق
router.get("/:fileId", ExpenseFileController.downloadFile);

module.exports = router;

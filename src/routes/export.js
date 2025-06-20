const express = require("express");
const router = express.Router();
const exportController = require("../controllers/exportController");
const auth = require("../middlewares/authMiddleware");

// حماية التصدير بالتوثيق
router.get("/csv", auth, exportController.exportExpenses);

module.exports = router;

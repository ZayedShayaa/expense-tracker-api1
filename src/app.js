const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
const expenseFileRoutes = require("./routes/expenseFiles");
const exportRouter = require("./routes/export");
app.use("/api/export", exportRouter);
app.use(express.json());
const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);

app.use("/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/expenses/:id/files", expenseFileRoutes);
app.use("/api/exports", exportRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" + err.message });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

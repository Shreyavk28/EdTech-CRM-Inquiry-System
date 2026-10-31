
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");
const app = express();
const inquiryRoutes = require("./routes/inquiryRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EdTech CRM API is running",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "Supabase database connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

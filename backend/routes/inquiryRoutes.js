
const express = require("express");
const router = express.Router();

const authenticateAdmin = require("../middleware/authMiddleware");

const {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiryController");

router.post("/", createInquiry);

router.get("/", authenticateAdmin, getAllInquiries);

router.patch("/:id/status", authenticateAdmin, updateInquiryStatus);

module.exports = router;

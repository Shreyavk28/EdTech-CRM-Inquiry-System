
const express = require("express");
const router = express.Router();

const authenticateAdmin = require("../middleware/authMiddleware");

const {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
} = require("../controllers/inquiryController");

// Public inquiry submission
router.post("/", createInquiry);

// Protected admin routes
router.get("/", authenticateAdmin, getAllInquiries);

router.patch("/:id/status", authenticateAdmin, updateInquiryStatus);

module.exports = router;

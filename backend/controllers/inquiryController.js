
const pool = require("../config/db");

const createInquiry = async (req, res) => {
  try {
    const {
      user_type,
      category,
      name,
      email,
      phone,
      message,
    } = req.body;

    if (
      !user_type ||
      !category ||
      !name ||
      !email ||
      !phone ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const allowedUserTypes = [
      "Parent",
      "Student",
      "School",
    ];

    const allowedCategories = [
      "Scholarship",
      "Concert",
      "Admission",
      "General Query",
    ];

    if (!allowedUserTypes.includes(user_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    const query = `
      INSERT INTO public.inquiries
      (user_type, category, name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      user_type,
      category,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      message.trim(),
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiry: result.rows[0],
    });

  } catch (error) {
    console.error("Create inquiry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
};



const getAllInquiries = async (req, res) => {
  try {
    const { search, category, userType, status } = req.query;

    let query = `
      SELECT *
      FROM public.inquiries
      WHERE 1=1
    `;

    const values = [];

    if (search) {
      values.push(`%${search.trim()}%`);
      query += ` AND (
        name ILIKE $${values.length}
        OR email ILIKE $${values.length}
        OR phone ILIKE $${values.length}
      )`;
    }

    if (category) {
      values.push(category);
      query += ` AND category = $${values.length}`;
    }

    if (userType) {
      values.push(userType);
      query += ` AND user_type = $${values.length}`;
    }

    if (status) {
      values.push(status);
      query += ` AND status = $${values.length}`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      inquiries: result.rows,
    });

  } catch (error) {
    console.error("Fetch inquiries error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};


const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Contacted",
      "Resolved",
    ];

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const result = await pool.query(
      `UPDATE public.inquiries
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully",
      inquiry: result.rows[0],
    });

  } catch (error) {
    console.error("Update status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry status",
    });
  }
};


module.exports = {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
};

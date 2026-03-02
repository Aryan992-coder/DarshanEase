const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// @GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

// @PUT /api/users/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, profilePic },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
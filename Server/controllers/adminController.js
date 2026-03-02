const User = require("../models/User");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");
const Donation = require("../models/Donation");
const DarshanSlot = require("../models/DarshanSlot");

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalTemples, totalBookings, totalDonations, recentBookings] =
      await Promise.all([
        User.countDocuments({ role: "USER" }),
        Temple.countDocuments({ isActive: true }),
        Booking.countDocuments(),
        Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
        Booking.find()
          .sort("-createdAt")
          .limit(5)
          .populate("user", "name")
          .populate("temple", "name"),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTemples,
        totalBookings,
        totalDonationAmount: totalDonations[0]?.total || 0,
        recentBookings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? "activated" : "deactivated"}`, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const bookingsByTemple = await Booking.aggregate([
      { $group: { _id: "$temple", count: { $sum: 1 } } },
      { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "temple" } },
      { $unwind: "$temple" },
      { $project: { templeName: "$temple.name", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    const donationsByTemple = await Donation.aggregate([
      { $group: { _id: "$temple", total: { $sum: "$amount" } } },
      { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "temple" } },
      { $unwind: "$temple" },
      { $project: { templeName: "$temple.name", total: 1 } },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: { bookingsByTemple, donationsByTemple } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
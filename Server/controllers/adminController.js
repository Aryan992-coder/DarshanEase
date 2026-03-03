const User = require("../models/User");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");
const Donation = require("../models/Donation");
const DarshanSlot = require("../models/DarshanSlot");

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalOrganizers, totalTemples, totalBookings, totalDonations, recentBookings] =
      await Promise.all([
        User.countDocuments({ role: "USER" }),
        User.countDocuments({ role: "ORGANIZER" }),
        Temple.countDocuments({ isActive: true }),
        Booking.countDocuments(),
        Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
        Booking.find()
          .sort("-createdAt").limit(5)
          .populate("user", "name email")
          .populate("temple", "name"),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrganizers,
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

// @GET /api/admin/organizers
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: "ORGANIZER" }).select("-password").sort("-createdAt");
    res.json({ success: true, count: organizers.length, data: organizers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/admin/organizers — Create organizer directly
exports.createOrganizer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const organizer = await User.create({ name, email, password, phone, role: "ORGANIZER" });
    res.status(201).json({
      success: true,
      message: "Organizer created successfully",
      data: { id: organizer._id, name: organizer.name, email: organizer.email, role: organizer.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true, runValidators: true }
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

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [bookingsByTemple, donationsByTemple, bookingsByStatus, monthlyBookings] =
      await Promise.all([
        Booking.aggregate([
          { $group: { _id: "$temple", count: { $sum: 1 } } },
          { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "temple" } },
          { $unwind: "$temple" },
          { $project: { templeName: "$temple.name", count: 1 } },
          { $sort: { count: -1 } },
        ]),
        Donation.aggregate([
          { $group: { _id: "$temple", total: { $sum: "$amount" } } },
          { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "temple" } },
          { $unwind: "$temple" },
          { $project: { templeName: "$temple.name", total: 1 } },
          { $sort: { total: -1 } },
        ]),
        Booking.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Booking.aggregate([
          { $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            count: { $sum: 1 },
          }},
          { $sort: { "_id.year": -1, "_id.month": -1 } },
          { $limit: 6 },
        ]),
      ]);

    res.json({ success: true, data: { bookingsByTemple, donationsByTemple, bookingsByStatus, monthlyBookings } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/temples — All temples including inactive
exports.getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find().populate("organizer", "name email").sort("-createdAt");
    res.json({ success: true, count: temples.length, data: temples });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/bookings — All bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .populate("slot", "date startTime endTime poojaType")
      .sort("-createdAt");
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

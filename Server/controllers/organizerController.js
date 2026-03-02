const Temple = require("../models/Temple");
const DarshanSlot = require("../models/DarshanSlot");
const Booking = require("../models/Booking");

// @GET /api/organizer/temples — Get organizer's own temples
exports.getMyTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ organizer: req.user._id, isActive: true });
    res.json({ success: true, data: temples });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/organizer/slots — Slots for organizer's temples
exports.getMySlots = async (req, res) => {
  try {
    const temples = await Temple.find({ organizer: req.user._id }).select("_id");
    const templeIds = temples.map((t) => t._id);
    const slots = await DarshanSlot.find({ temple: { $in: templeIds } }).populate("temple", "name");
    res.json({ success: true, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/organizer/bookings — Bookings for organizer's temples
exports.getMyTempleBookings = async (req, res) => {
  try {
    const temples = await Temple.find({ organizer: req.user._id }).select("_id");
    const templeIds = temples.map((t) => t._id);
    const bookings = await Booking.find({ temple: { $in: templeIds } })
      .populate("user", "name email phone")
      .populate("temple", "name")
      .populate("slot", "date startTime endTime poojaType")
      .sort("-createdAt");
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/organizer/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const temples = await Temple.find({ organizer: req.user._id }).select("_id name");
    const templeIds = temples.map((t) => t._id);

    const [totalSlots, totalBookings, confirmedBookings] = await Promise.all([
      DarshanSlot.countDocuments({ temple: { $in: templeIds } }),
      Booking.countDocuments({ temple: { $in: templeIds } }),
      Booking.countDocuments({ temple: { $in: templeIds }, status: "CONFIRMED" }),
    ]);

    res.json({
      success: true,
      data: { temples, totalSlots, totalBookings, confirmedBookings },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");

// @POST /api/bookings — USER
exports.createBooking = async (req, res) => {
  try {
    const { temple, slot, devoteesCount, specialRequests } = req.body;

    const darshanSlot = await DarshanSlot.findById(slot);
    if (!darshanSlot || !darshanSlot.isActive)
      return res.status(404).json({ success: false, message: "Slot not found or inactive" });

    if (darshanSlot.availableSeats < devoteesCount)
      return res.status(400).json({ success: false, message: "Not enough seats available" });

    const totalAmount = darshanSlot.pricePerDevotee * devoteesCount;

    const booking = await Booking.create({
      user: req.user._id,
      temple,
      slot,
      devoteesCount,
      totalAmount,
      specialRequests,
    });

    // Increment bookedCount
    darshanSlot.bookedCount += devoteesCount;
    await darshanSlot.save();

    await booking.populate(["temple", "slot"]);

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/my — USER: view own bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("temple", "name location")
      .populate("slot", "date startTime endTime poojaType")
      .sort("-createdAt");
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/:id — USER / ADMIN
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("temple", "name location")
      .populate("slot")
      .populate("user", "name email");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/bookings/:id/cancel — USER
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (booking.status === "CANCELLED")
      return res.status(400).json({ success: false, message: "Already cancelled" });

    booking.status = "CANCELLED";
    await booking.save();

    // Free up slots
    await DarshanSlot.findByIdAndUpdate(booking.slot, {
      $inc: { bookedCount: -booking.devoteesCount },
    });

    res.json({ success: true, message: "Booking cancelled successfully", data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings — ADMIN: all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .populate("slot", "date startTime endTime")
      .sort("-createdAt");
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const Donation = require("../models/Donation");

// @POST /api/donations — USER
exports.createDonation = async (req, res) => {
  try {
    const { temple, amount, message } = req.body;
    const donation = await Donation.create({
      user: req.user._id,
      temple,
      amount,
      message,
      transactionId: "TXN" + Date.now(),
      status: "SUCCESS",
    });
    await donation.populate("temple", "name");
    res.status(201).json({ success: true, data: donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/donations/my — USER
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .populate("temple", "name location")
      .sort("-createdAt");
    res.json({ success: true, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/donations — ADMIN
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("user", "name email")
      .populate("temple", "name")
      .sort("-createdAt");
    res.json({ success: true, count: donations.length, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
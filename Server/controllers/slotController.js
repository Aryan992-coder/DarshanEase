const DarshanSlot = require("../models/DarshanSlot");

// @GET /api/slots — Public (optionally filter by temple)
exports.getAllSlots = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.temple) filter.temple = req.query.temple;
    if (req.query.date) filter.date = { $gte: new Date(req.query.date) };

    const slots = await DarshanSlot.find(filter).populate("temple", "name location");
    res.json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/slots/:id — Public
exports.getSlotById = async (req, res) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id).populate("temple", "name location");
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    res.json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/slots — ADMIN / ORGANIZER
exports.createSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.create(req.body);
    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/slots/:id — ADMIN / ORGANIZER
exports.updateSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    res.json({ success: true, data: slot });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/slots/:id — ADMIN / ORGANIZER
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!slot) return res.status(404).json({ success: false, message: "Slot not found" });
    res.json({ success: true, message: "Slot deactivated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
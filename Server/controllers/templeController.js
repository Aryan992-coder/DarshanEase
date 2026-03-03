const Temple = require("../models/Temple");

// @GET /api/temples — Public
exports.getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ isActive: true }).populate("organizer", "name email");
    res.json({ success: true, count: temples.length, data: temples });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/temples/:id — Public
exports.getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id).populate("organizer", "name email");
    if (!temple) return res.status(404).json({ success: false, message: "Temple not found" });
    res.json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/temples — ADMIN / ORGANIZER
exports.createTemple = async (req, res) => {
  try {
    const { name, location, description, deity, openingTime, closingTime, images } = req.body;
    const temple = await Temple.create({
      name, location, description, deity, openingTime, closingTime,
      images: images || [],
      organizer: req.user._id,
    });
    res.status(201).json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/temples/:id — ADMIN / ORGANIZER
exports.updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!temple) return res.status(404).json({ success: false, message: "Temple not found" });
    res.json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/temples/:id/images — Add image URL
exports.addTempleImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ success: false, message: "Image URL required" });
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      { $push: { images: imageUrl } },
      { new: true }
    );
    if (!temple) return res.status(404).json({ success: false, message: "Temple not found" });
    res.json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/temples/:id/images — Remove image URL
exports.removeTempleImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      { $pull: { images: imageUrl } },
      { new: true }
    );
    if (!temple) return res.status(404).json({ success: false, message: "Temple not found" });
    res.json({ success: true, data: temple });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/temples/:id — ADMIN
exports.deleteTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    if (!temple) return res.status(404).json({ success: false, message: "Temple not found" });
    res.json({ success: true, message: "Temple deactivated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    description: { type: String },
    images: [{ type: String }],
    deity: { type: String },
    openingTime: { type: String },
    closingTime: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temple", templeSchema);
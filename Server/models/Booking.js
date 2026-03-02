const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "DarshanSlot", required: true },
    devoteesCount: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, default: 0 },
    bookingId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "CONFIRMED",
    },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

// Auto-generate bookingId before save
bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = "DE" + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
const mongoose = require("mongoose");

const darshanSlotSchema = new mongoose.Schema(
  {
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    poojaType: { type: String, default: "General Darshan" },
    totalCapacity: { type: Number, required: true },
    bookedCount: { type: Number, default: 0 },
    pricePerDevotee: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual: available seats
darshanSlotSchema.virtual("availableSeats").get(function () {
  return this.totalCapacity - this.bookedCount;
});

darshanSlotSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("DarshanSlot", darshanSlotSchema);
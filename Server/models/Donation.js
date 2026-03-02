const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
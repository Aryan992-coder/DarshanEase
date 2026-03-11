const dns = require('dns').promises;   // or just require('dns') in older Node
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://darshanease.vercel.app'  // your frontend Vercel URL
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/users",     require("./routes/userRoutes"));
app.use("/api/temples",   require("./routes/templeRoutes"));
app.use("/api/slots",     require("./routes/slotRoutes"));
app.use("/api/bookings",  require("./routes/bookingRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/admin",     require("./routes/adminRoutes"));
app.use("/api/organizer", require("./routes/organizerRoutes"));

// ─── Health Check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "DarshanEase API is running 🙏" });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ─── Database + Server Start ──────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
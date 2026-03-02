const express = require("express");
const router = express.Router();
const {
  getMyTemples, getMySlots, getMyTempleBookings, getDashboard,
} = require("../controllers/organizerController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ORGANIZER", "ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/temples", getMyTemples);
router.get("/slots", getMySlots);
router.get("/bookings", getMyTempleBookings);

module.exports = router;
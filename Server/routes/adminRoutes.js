const express = require("express");
const router = express.Router();
const {
  getDashboard, getAllUsers, getAllOrganizers, createOrganizer,
  updateUserRole, toggleUserStatus, deleteUser,
  getAnalytics, getAllTemples, getAllBookings,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ADMIN"));

router.get("/dashboard",         getDashboard);
router.get("/users",             getAllUsers);
router.get("/organizers",        getAllOrganizers);
router.post("/organizers",       createOrganizer);
router.put("/users/:id/role",    updateUserRole);
router.put("/users/:id/toggle",  toggleUserStatus);
router.delete("/users/:id",      deleteUser);
router.get("/analytics",         getAnalytics);
router.get("/temples",           getAllTemples);
router.get("/bookings",          getAllBookings);

module.exports = router;

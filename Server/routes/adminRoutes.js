const express = require("express");
const router = express.Router();
const {
  getDashboard, getAllUsers, updateUserRole, toggleUserStatus, getAnalytics,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ADMIN"));

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/toggle", toggleUserStatus);
router.get("/analytics", getAnalytics);

module.exports = router;
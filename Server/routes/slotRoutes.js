const express = require("express");
const router = express.Router();
const {
  getAllSlots, getSlotById, createSlot, updateSlot, deleteSlot,
} = require("../controllers/slotController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllSlots);
router.get("/:id", getSlotById);
router.post("/", protect, authorize("ADMIN", "ORGANIZER"), createSlot);
router.put("/:id", protect, authorize("ADMIN", "ORGANIZER"), updateSlot);
router.delete("/:id", protect, authorize("ADMIN", "ORGANIZER"), deleteSlot);

module.exports = router;
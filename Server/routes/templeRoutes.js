const express = require("express");
const router = express.Router();
const {
  getAllTemples, getTempleById, createTemple, updateTemple, deleteTemple,
} = require("../controllers/templeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllTemples);
router.get("/:id", getTempleById);
router.post("/", protect, authorize("ADMIN", "ORGANIZER"), createTemple);
router.put("/:id", protect, authorize("ADMIN", "ORGANIZER"), updateTemple);
router.delete("/:id", protect, authorize("ADMIN"), deleteTemple);

module.exports = router;
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");


router.post("/", protect, requireAdmin, createSkill);

router.get("/", getSkills);

router.put("/:id", protect, requireAdmin, updateSkill);

router.delete("/:id", protect, requireAdmin, deleteSkill);


module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getPublicProfile,
  search,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
router.post("/", createUser);
router.get("/", getUsers);
router.get("/search", protect, search);
router.get("/:id/profile", protect, getPublicProfile);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
module.exports = router;

const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect, authController.getCurrentUser);
router.put("/profile", protect, authController.updateCurrentUser);
router.post("/profile/photo", protect, upload.single("photo"), authController.uploadProfilePhoto);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


module.exports = router;

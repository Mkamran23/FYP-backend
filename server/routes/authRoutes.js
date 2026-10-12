const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { passport } = require("../config/passport");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: true,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=Google%20sign-in%20failed`,
  }),
  authController.googleCallback,
);
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
    state: true,
  }),
);
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=GitHub%20sign-in%20failed`,
  }),
  authController.githubCallback,
);
router.get("/me", protect, authController.getCurrentUser);
router.put("/profile", protect, authController.updateCurrentUser);
router.post(
  "/profile/photo",
  protect,
  upload.single("photo"),
  authController.uploadProfilePhoto,
);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;

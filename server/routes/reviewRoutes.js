const express = require("express");
const protect = require("../middleware/authMiddleware");
const controller = require("../controllers/reviewController");
const router = express.Router();
router.use(protect);
router.get("/pending", controller.getPendingReviews);
router.get("/user/:userId", controller.getUserReviews);
router.post("/", controller.createReview);
module.exports = router;

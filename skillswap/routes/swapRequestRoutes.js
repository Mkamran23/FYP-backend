const express = require("express");
const protect = require("../middleware/authMiddleware");
const controller = require("../controllers/swapRequestController");

const router = express.Router();

router.use(protect);
router.get("/", controller.getMySwapRequests);
router.post("/", controller.createSwapRequest);
router.patch("/:id/status", controller.updateRequestStatus);
router.get("/:id/messages", controller.getMessages);

module.exports = router;

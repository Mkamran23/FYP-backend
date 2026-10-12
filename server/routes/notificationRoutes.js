const express = require("express");
const protect = require("../middleware/authMiddleware");
const controller = require("../controllers/notificationController");
const router = express.Router();
router.use(protect);
router.get("/", controller.list);
router.get("/unread-count", controller.getUnreadCount);
router.patch("/read-all", controller.markAllRead);
module.exports = router;

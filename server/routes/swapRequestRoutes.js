const express = require("express");
const protect = require("../middleware/authMiddleware");
const controller = require("../controllers/swapRequestController");
const { chatUpload } = require("../middleware/chatUploadMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", controller.getMySwapRequests);
router.get("/badge-counts", controller.getBadgeCounts);
router.post("/", controller.createSwapRequest);
router.patch("/:id/status", controller.updateRequestStatus);
router.get("/:id/messages", controller.getMessages);
router.post(
  "/:id/messages/attachment",
  chatUpload.single("file"),
  controller.uploadMessageAttachment,
);
router.get(
  "/:id/messages/:messageId/file",
  controller.downloadMessageAttachment,
);

module.exports = router;

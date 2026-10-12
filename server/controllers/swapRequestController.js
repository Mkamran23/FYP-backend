const swapRequestService = require("../services/swapRequestService");
const messageService = require("../services/messageService");
const notificationService = require("../services/notificationService");
const path = require("path");
const { uploadDirectory } = require("../middleware/chatUploadMiddleware");

const respond =
  (handler, status, body = (result) => result) =>
  async (req, res) => {
    try {
      return res.status(status).json(body(await handler(req)));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  };

const createSwapRequest = async (req, res) => {
  try {
    const request = await swapRequestService.createSwapRequest(
      req.user.id,
      req.body.recipientId,
      req.body.skillId,
    );
    const recipientRequest =
      await swapRequestService.getSerializedRequestForParticipant(
        request.id,
        req.body.recipientId,
      );
    await notificationService.create({
      recipient: req.body.recipientId,
      type: "swap_request",
      title: "New swap request",
      message: `${request.otherUser.name} sent you a request for ${request.skill?.name || "a skill"}.`,
      link: "/swap-requests",
    });
    req.app
      .get("io")
      ?.to(`user:${req.user.id}`)
      .emit("swap-request:sent", { request });
    req.app
      .get("io")
      ?.to(`user:${req.body.recipientId}`)
      .emit("swap-request:created", { request: recipientRequest });
    return res.status(201).json({ message: "Swap request sent", request });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};
const getMySwapRequests = respond(
  (req) => swapRequestService.getMySwapRequests(req.user.id),
  200,
  (requests) => ({ requests }),
);
const getBadgeCounts = respond(async (req) => {
  const [swapRequests, messages] = await Promise.all([
    swapRequestService.getPendingRequestCount(req.user.id),
    messageService.getUnreadMessageCount(req.user.id),
  ]);
  return { swapRequests, messages, notifications: swapRequests + messages };
});

const updateRequestStatus = async (req, res) => {
  try {
    const request = await swapRequestService.updateRequestStatus(
      req.params.id,
      req.user.id,
      req.body.status,
    );
    const requesterId = request.otherUser.id;
    const requesterRequest =
      await swapRequestService.getSerializedRequestForParticipant(
        req.params.id,
        requesterId,
      );
    await notificationService.create({
      recipient: requesterId,
      type: "swap_update",
      title: "Swap request updated",
      message: `${request.otherUser.name} ${request.status} your swap request.`,
      link: "/swap-requests",
    });
    req.app
      .get("io")
      ?.to(`user:${requesterId}`)
      .emit("swap-request:updated", { request: requesterRequest });
    return res.status(200).json({ message: "Swap request updated", request });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const withAttachmentUrl = (req, message) =>
  message.attachment
    ? {
        ...message,
        attachment: {
          ...message.attachment,
          url: `${req.protocol}://${req.get("host")}/api/swap-requests/${message.swapRequestId}/messages/${message.id}/file`,
        },
      }
    : message;
const getMessages = async (req, res) => {
  try {
    const messages = await messageService.getMessages(
      req.params.id,
      req.user.id,
    );
    return res
      .status(200)
      .json({
        messages: messages.map((message) => withAttachmentUrl(req, message)),
      });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Unable to load messages" });
  }
};

const uploadMessageAttachment = async (req, res) => {
  try {
    const message = withAttachmentUrl(
      req,
      await messageService.createAttachmentMessage(
        req.params.id,
        req.user.id,
        req.body.text,
        req.file,
      ),
    );
    const swapRequest =
      await swapRequestService.getAcceptedRequestForParticipant(
        req.params.id,
        req.user.id,
      );
    req.app
      .get("io")
      ?.to(`swap:${req.params.id}`)
      .emit("chat:message", message);
    const recipientId =
      swapRequest.requester.toString() === req.user.id
        ? swapRequest.recipient.toString()
        : swapRequest.requester.toString();
    await notificationService.create({
      recipient: recipientId,
      type: "message",
      title: `New message from ${message.senderName}`,
      message: message.text || "Sent an attachment",
      link: "/swap-requests",
    });
    req.app
      .get("io")
      ?.to(`user:${recipientId}`)
      .emit("chat:notification", { message });
    return res.status(201).json({ message });
  } catch (error) {
    if (req.file) require("fs").unlink(req.file.path, () => {});
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Unable to upload attachment" });
  }
};

const downloadMessageAttachment = async (req, res) => {
  try {
    const message = await messageService.getAttachment(
      req.params.messageId,
      req.user.id,
    );
    return res.download(
      path.join(uploadDirectory, message.attachment.filename),
      message.attachment.originalName,
    );
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Unable to download attachment" });
  }
};

module.exports = {
  createSwapRequest,
  getMySwapRequests,
  getBadgeCounts,
  updateRequestStatus,
  getMessages,
  uploadMessageAttachment,
  downloadMessageAttachment,
};

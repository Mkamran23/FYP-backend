const Message = require("../models/message");
const swapRequestService = require("./swapRequestService");

const createError = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const serializeMessage = (message) => ({
  id: message._id.toString(),
  swapRequestId: message.swapRequest.toString(),
  senderId: message.sender._id
    ? message.sender._id.toString()
    : message.sender.toString(),
  senderName: message.sender.name || "",
  text: message.text,
  attachment: message.attachment?.filename
    ? {
        originalName: message.attachment.originalName,
        mimeType: message.attachment.mimeType,
        size: message.attachment.size,
      }
    : null,
  createdAt: message.createdAt,
  deliveredAt: message.deliveredAt,
  readAt: message.readAt,
});

const getMessages = async (swapRequestId, userId) => {
  await swapRequestService.getAcceptedRequestForParticipant(
    swapRequestId,
    userId,
  );
  const messages = await Message.find({ swapRequest: swapRequestId })
    .populate("sender", "name")
    .sort({ createdAt: 1 });
  return messages.map(serializeMessage);
};

const createMessage = async (swapRequestId, userId, text) => {
  const content = String(text || "").trim();
  if (!content) throw createError("Message cannot be empty");
  if (content.length > 2000)
    throw createError("Message cannot exceed 2000 characters");
  await swapRequestService.getAcceptedRequestForParticipant(
    swapRequestId,
    userId,
  );
  const message = await Message.create({
    swapRequest: swapRequestId,
    sender: userId,
    text: content,
  });
  await message.populate("sender", "name");
  return serializeMessage(message);
};

const createAttachmentMessage = async (swapRequestId, userId, text, file) => {
  const content = String(text || "").trim();
  if (!file) throw createError("Please choose a file to upload");
  if (content.length > 2000)
    throw createError("Message cannot exceed 2000 characters");
  await swapRequestService.getAcceptedRequestForParticipant(
    swapRequestId,
    userId,
  );
  const message = await Message.create({
    swapRequest: swapRequestId,
    sender: userId,
    text: content,
    attachment: {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
  await message.populate("sender", "name");
  return serializeMessage(message);
};

const getAttachment = async (messageId, userId) => {
  const message = await Message.findById(messageId).populate("sender", "name");
  if (!message?.attachment?.filename)
    throw createError("Attachment not found", 404);
  await swapRequestService.getAcceptedRequestForParticipant(
    message.swapRequest.toString(),
    userId,
  );
  return message;
};

const markMessagesDelivered = async (swapRequestId, userId) => {
  await swapRequestService.getAcceptedRequestForParticipant(
    swapRequestId,
    userId,
  );
  const deliveredAt = new Date();
  const messages = await Message.find({
    swapRequest: swapRequestId,
    sender: { $ne: userId },
    deliveredAt: null,
  }).select("_id");
  if (!messages.length) return null;
  await Message.updateMany(
    { _id: { $in: messages.map((message) => message._id) } },
    { $set: { deliveredAt } },
  );
  return {
    swapRequestId,
    messageIds: messages.map((message) => message._id.toString()),
    deliveredAt,
    readAt: null,
  };
};

const markMessagesRead = async (swapRequestId, userId) => {
  await swapRequestService.getAcceptedRequestForParticipant(
    swapRequestId,
    userId,
  );
  const now = new Date();
  const messages = await Message.find({
    swapRequest: swapRequestId,
    sender: { $ne: userId },
    readAt: null,
  }).select("_id");
  if (!messages.length) return null;
  await Message.updateMany(
    { _id: { $in: messages.map((message) => message._id) } },
    { $set: { deliveredAt: now, readAt: now } },
  );
  return {
    swapRequestId,
    messageIds: messages.map((message) => message._id.toString()),
    deliveredAt: now,
    readAt: now,
  };
};

const getUnreadMessageCount = async (userId) => {
  const acceptedRequests =
    await swapRequestService.getAcceptedRequestIdsForParticipant(userId);
  if (!acceptedRequests.length) return 0;
  return Message.countDocuments({
    swapRequest: { $in: acceptedRequests },
    sender: { $ne: userId },
    readAt: null,
  });
};

module.exports = {
  getMessages,
  createMessage,
  createAttachmentMessage,
  getAttachment,
  markMessagesDelivered,
  markMessagesRead,
  getUnreadMessageCount,
};

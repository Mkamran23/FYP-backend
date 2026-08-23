const Message = require("../models/message");
const swapRequestService = require("./swapRequestService");

const createError = (message, status = 400) => Object.assign(new Error(message), { status });
const serializeMessage = (message) => ({ id: message._id.toString(), swapRequestId: message.swapRequest.toString(), senderId: message.sender._id ? message.sender._id.toString() : message.sender.toString(), senderName: message.sender.name || "", text: message.text, createdAt: message.createdAt, deliveredAt: message.deliveredAt, readAt: message.readAt });

const getMessages = async (swapRequestId, userId) => {
  await swapRequestService.getAcceptedRequestForParticipant(swapRequestId, userId);
  const messages = await Message.find({ swapRequest: swapRequestId }).populate("sender", "name").sort({ createdAt: 1 });
  return messages.map(serializeMessage);
};

const createMessage = async (swapRequestId, userId, text) => {
  const content = String(text || "").trim();
  if (!content) throw createError("Message cannot be empty");
  if (content.length > 2000) throw createError("Message cannot exceed 2000 characters");
  await swapRequestService.getAcceptedRequestForParticipant(swapRequestId, userId);
  const message = await Message.create({ swapRequest: swapRequestId, sender: userId, text: content });
  await message.populate("sender", "name");
  return serializeMessage(message);
};

const markMessagesDelivered = async (swapRequestId, userId) => {
  await swapRequestService.getAcceptedRequestForParticipant(swapRequestId, userId);
  const deliveredAt = new Date();
  const messages = await Message.find(
    { swapRequest: swapRequestId, sender: { $ne: userId }, deliveredAt: null },
  ).select("_id");
  if (!messages.length) return null;
  await Message.updateMany(
    { _id: { $in: messages.map((message) => message._id) } },
    { $set: { deliveredAt } },
  );
  return { swapRequestId, messageIds: messages.map((message) => message._id.toString()), deliveredAt, readAt: null };
};

const markMessagesRead = async (swapRequestId, userId) => {
  await swapRequestService.getAcceptedRequestForParticipant(swapRequestId, userId);
  const now = new Date();
  const messages = await Message.find(
    { swapRequest: swapRequestId, sender: { $ne: userId }, readAt: null },
  ).select("_id");
  if (!messages.length) return null;
  await Message.updateMany(
    { _id: { $in: messages.map((message) => message._id) } },
    { $set: { deliveredAt: now, readAt: now } },
  );
  return { swapRequestId, messageIds: messages.map((message) => message._id.toString()), deliveredAt: now, readAt: now };
};

module.exports = { getMessages, createMessage, markMessagesDelivered, markMessagesRead };

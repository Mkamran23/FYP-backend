const Notification = require("../models/notification");
const create = (payload) => Notification.create(payload);
const listForUser = async (userId) => {
  const notifications = await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(100);
  return notifications.map((item) => ({
    id: String(item._id),
    type: item.type,
    title: item.title,
    message: item.message,
    link: item.link || "",
    read: Boolean(item.readAt),
    createdAt: item.createdAt,
  }));
};
const unreadCount = (userId) =>
  Notification.countDocuments({ recipient: userId, readAt: null });
const markAllRead = (userId) =>
  Notification.updateMany(
    { recipient: userId, readAt: null },
    { readAt: new Date() },
  );
module.exports = { create, listForUser, unreadCount, markAllRead };

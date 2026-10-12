const service = require("../services/notificationService");
const respond =
  (handler, status, body = (value) => value) =>
  async (req, res) => {
    try {
      return res.status(status).json(body(await handler(req)));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  };
const list = respond(
  (req) => service.listForUser(req.user.id),
  200,
  (notifications) => ({ notifications }),
);
const getUnreadCount = respond(
  (req) => service.unreadCount(req.user.id),
  200,
  (count) => ({ count }),
);
const markAllRead = respond(
  async (req) => {
    await service.markAllRead(req.user.id);
  },
  200,
  () => ({ message: "Notifications marked as read" }),
);
module.exports = { list, getUnreadCount, markAllRead };

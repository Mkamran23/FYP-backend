const service = require("../services/reviewService");
const notificationService = require("../services/notificationService");
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
const createReview = async (req, res) => {
  try {
    const { review, recipientId } = await service.createReview(
      req.user.id,
      req.body,
    );
    await notificationService.create({
      recipient: recipientId,
      type: "review",
      title: "New rating and review",
      message: `${review.reviewer?.name || "A member"} gave you ${review.rating} out of 5 stars.`,
      link: "/ratings",
    });
    req.app
      .get("io")
      ?.to(`user:${recipientId}`)
      .emit("feedback:received", { review });
    return res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};
const getPendingReviews = respond(
  (req) => service.getPendingReviews(req.user.id),
  200,
  (exchanges) => ({ exchanges }),
);
const getUserReviews = respond(
  (req) => service.getUserReviews(req.params.userId),
  200,
);
module.exports = { createReview, getPendingReviews, getUserReviews };

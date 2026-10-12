const Review = require("../models/review");
const SwapRequest = require("../models/swapRequest");
const error = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const serialize = (review) => ({
  id: String(review._id),
  rating: review.rating,
  feedback: review.feedback || "",
  createdAt: review.createdAt,
  reviewer: review.reviewer
    ? {
        id: String(review.reviewer._id),
        name: review.reviewer.name,
        avatarUrl: review.reviewer.avatarUrl || "",
      }
    : undefined,
});

const createReview = async (userId, { exchangeId, rating, feedback = "" }) => {
  if (!/^[a-f\d]{24}$/i.test(String(exchangeId || "")))
    throw error("A valid completed exchange is required");
  const score = Number(rating);
  if (!Number.isInteger(score) || score < 1 || score > 5)
    throw error("Rating must be a whole number from 1 to 5");
  if (String(feedback).trim().length > 500)
    throw error("Feedback must be 500 characters or fewer");
  const exchange = await SwapRequest.findOne({
    _id: exchangeId,
    status: "completed",
    $or: [{ requester: userId }, { recipient: userId }],
  });
  if (!exchange)
    throw error(
      "You can review only a completed exchange you participated in",
      403,
    );
  const recipient =
    String(exchange.requester) === String(userId)
      ? exchange.recipient
      : exchange.requester;
  try {
    const created = await Review.create({
      exchange: exchangeId,
      reviewer: userId,
      recipient,
      rating: score,
      feedback: String(feedback).trim(),
    });
    await created.populate("reviewer", "name avatarUrl");
    return { review: serialize(created), recipientId: String(recipient) };
  } catch (reason) {
    if (reason.code === 11000)
      throw error("You have already reviewed this exchange", 409);
    throw reason;
  }
};

const getPendingReviews = async (userId) => {
  const exchanges = await SwapRequest.find({
    status: "completed",
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate("requester", "name avatarUrl")
    .populate("recipient", "name avatarUrl")
    .populate("skill", "name")
    .sort({ updatedAt: -1 });
  const existing = await Review.find({
    reviewer: userId,
    exchange: { $in: exchanges.map((item) => item._id) },
  }).select("exchange");
  const reviewed = new Set(existing.map((item) => String(item.exchange)));
  return exchanges
    .filter((item) => !reviewed.has(String(item._id)))
    .map((item) => {
      const other =
        String(item.requester._id) === String(userId)
          ? item.recipient
          : item.requester;
      return {
        exchangeId: String(item._id),
        otherUser: {
          id: String(other._id),
          name: other.name,
          avatarUrl: other.avatarUrl || "",
        },
        skill: item.skill
          ? { id: String(item.skill._id), name: item.skill.name }
          : null,
        completedAt: item.updatedAt,
      };
    });
};

const getUserReviews = async (userId) => {
  const reviews = await Review.find({ recipient: userId })
    .populate("reviewer", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(50);
  const count = reviews.length;
  const average = count
    ? Math.round(
        (reviews.reduce((sum, item) => sum + item.rating, 0) / count) * 10,
      ) / 10
    : 0;
  const trustScore = count ? Math.round((average / 5) * 100) : 0;
  return {
    summary: { average, count, trustScore },
    reviews: reviews.map(serialize),
  };
};
module.exports = { createReview, getPendingReviews, getUserReviews };

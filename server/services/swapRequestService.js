const SwapRequest = require("../models/swapRequest");
const User = require("../models/user");
const Skill = require("../models/skill");

const createError = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const userFields = "name location avatarUrl";

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  location: user.location || "",
  avatarUrl: user.avatarUrl || "",
});
const serializeRequest = (request, userId) => {
  const requester = request.requester;
  const recipient = request.recipient;
  const otherUser = requester._id.toString() === userId ? recipient : requester;
  return {
    id: request._id.toString(),
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    otherUser: serializeUser(otherUser),
    skill: request.skill
      ? { id: request.skill._id.toString(), name: request.skill.name }
      : null,
    isRequester: requester._id.toString() === userId,
  };
};

const createSwapRequest = async (userId, recipientId, skillId) => {
  if (!recipientId || recipientId === userId)
    throw createError("Choose another user for a swap request");
  if (!skillId) throw createError("Choose a skill for this swap request");
  if (!(await User.exists({ _id: recipientId })))
    throw createError("Recipient does not exist", 404);
  if (!(await Skill.exists({ _id: skillId })))
    throw createError("Selected skill does not exist", 404);
  const existing = await SwapRequest.findOne({
    skill: skillId,
    $or: [
      { requester: userId, recipient: recipientId },
      { requester: recipientId, recipient: userId },
    ],
  });
  if (existing)
    throw createError(
      "You have already sent a request to this user for this skill",
      409,
    );
  let request;
  try {
    request = await SwapRequest.create({
      requester: userId,
      recipient: recipientId,
      skill: skillId,
    });
  } catch (error) {
    if (error.code === 11000)
      throw createError(
        "You have already sent a request to this user for this skill",
        409,
      );
    throw error;
  }
  await request.populate([
    { path: "requester", select: userFields },
    { path: "recipient", select: userFields },
    { path: "skill", select: "name" },
  ]);
  return serializeRequest(request, userId);
};

const getMySwapRequests = async (userId) => {
  const requests = await SwapRequest.find({
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate("requester", userFields)
    .populate("recipient", userFields)
    .populate("skill", "name")
    .sort({ updatedAt: -1 });
  return requests.map((request) => serializeRequest(request, userId));
};

const getPendingRequestCount = (userId) =>
  SwapRequest.countDocuments({ recipient: userId, status: "pending" });

const getAcceptedRequestIdsForParticipant = async (userId) => {
  const requests = await SwapRequest.find({
    status: "accepted",
    $or: [{ requester: userId }, { recipient: userId }],
  }).select("_id");
  return requests.map((request) => request._id);
};

const getSerializedRequestForParticipant = async (requestId, userId) => {
  const request = await SwapRequest.findOne({
    _id: requestId,
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate("requester", userFields)
    .populate("recipient", userFields)
    .populate("skill", "name");
  if (!request) throw createError("Swap request not found", 404);
  return serializeRequest(request, userId);
};

const updateRequestStatus = async (requestId, userId, status) => {
  if (!["accepted", "completed", "rejected", "cancelled"].includes(status))
    throw createError("Invalid request status");
  const request = await SwapRequest.findById(requestId)
    .populate("requester", userFields)
    .populate("recipient", userFields)
    .populate("skill", "name");
  if (!request) throw createError("Swap request not found", 404);
  const isRecipient = request.recipient._id.toString() === userId;
  const isRequester = request.requester._id.toString() === userId;
  if ((status === "accepted" || status === "rejected") && !isRecipient)
    throw createError("Only the recipient can respond to this request", 403);
  if (status === "completed" && !isRecipient && !isRequester)
    throw createError("Only exchange participants can mark it completed", 403);
  if (status === "cancelled" && !isRequester)
    throw createError("Only the requester can cancel this request", 403);
  if (status === "completed" && request.status !== "accepted")
    throw createError("Only an accepted exchange can be marked completed", 409);
  if (status !== "completed" && request.status !== "pending")
    throw createError("This swap request has already been resolved", 409);
  request.status = status;
  console.log("request", request);
  await request.save();
  return serializeRequest(request, userId);
};

const getAcceptedRequestForParticipant = async (requestId, userId) => {
  const request = await SwapRequest.findOne({
    _id: requestId,
    status: "accepted",
    $or: [{ requester: userId }, { recipient: userId }],
  });
  if (!request)
    throw createError(
      "Chat is available only to participants in an accepted swap request",
      403,
    );
  return request;
};

module.exports = {
  createSwapRequest,
  getMySwapRequests,
  getPendingRequestCount,
  getAcceptedRequestIdsForParticipant,
  getSerializedRequestForParticipant,
  updateRequestStatus,
  getAcceptedRequestForParticipant,
};

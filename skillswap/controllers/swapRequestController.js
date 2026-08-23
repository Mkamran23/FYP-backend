const swapRequestService = require("../services/swapRequestService");
const messageService = require("../services/messageService");

const respond = (handler, status, body = (result) => result) => async (req, res) => {
  try { return res.status(status).json(body(await handler(req))); }
  catch (error) { return res.status(error.status || 500).json({ message: error.message || "Something went wrong" }); }
};

const createSwapRequest = async (req, res) => {
  try {
    const request = await swapRequestService.createSwapRequest(req.user.id, req.body.recipientId, req.body.skillId);
    const recipientRequest = await swapRequestService.getSerializedRequestForParticipant(request.id, req.body.recipientId);
    req.app.get("io")?.to(`user:${req.user.id}`).emit("swap-request:sent", { request });
    req.app.get("io")?.to(`user:${req.body.recipientId}`).emit("swap-request:created", { request: recipientRequest });
    return res.status(201).json({ message: "Swap request sent", request });
  } catch (error) { return res.status(error.status || 500).json({ message: error.message || "Something went wrong" }); }
};
const getMySwapRequests = respond((req) => swapRequestService.getMySwapRequests(req.user.id), 200, (requests) => ({ requests }));
const updateRequestStatus = async (req, res) => {
  try {
    const request = await swapRequestService.updateRequestStatus(req.params.id, req.user.id, req.body.status);
    const requesterId = request.otherUser.id;
    const requesterRequest = await swapRequestService.getSerializedRequestForParticipant(req.params.id, requesterId);
    req.app.get("io")?.to(`user:${requesterId}`).emit("swap-request:updated", { request: requesterRequest });
    return res.status(200).json({ message: "Swap request updated", request });
  } catch (error) { return res.status(error.status || 500).json({ message: error.message || "Something went wrong" }); }
};
const getMessages = respond((req) => messageService.getMessages(req.params.id, req.user.id), 200, (messages) => ({ messages }));

module.exports = { createSwapRequest, getMySwapRequests, updateRequestStatus, getMessages };

const jwt = require("jsonwebtoken");
const messageService = require("../services/messageService");
const swapRequestService = require("../services/swapRequestService");
const notificationService = require("../services/notificationService");

const roomName = (swapRequestId) => `swap:${swapRequestId}`;

const initializeChatSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Authentication token is required");
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);

    socket.on("chat:join", async ({ swapRequestId }, callback = () => {}) => {
      try {
        await swapRequestService.getAcceptedRequestForParticipant(
          swapRequestId,
          socket.user.id,
        );
        socket.join(roomName(swapRequestId));
        const deliveryStatus = await messageService.markMessagesDelivered(
          swapRequestId,
          socket.user.id,
        );
        if (deliveryStatus)
          io.to(roomName(swapRequestId)).emit(
            "chat:message-status",
            deliveryStatus,
          );
        const status = await messageService.markMessagesRead(
          swapRequestId,
          socket.user.id,
        );
        if (status)
          io.to(roomName(swapRequestId)).emit("chat:message-status", status);
        callback({ ok: true });
      } catch (error) {
        callback({ ok: false, message: error.message });
      }
    });

    socket.on(
      "chat:send",
      async ({ swapRequestId, text }, callback = () => {}) => {
        try {
          const swapRequest =
            await swapRequestService.getAcceptedRequestForParticipant(
              swapRequestId,
              socket.user.id,
            );
          const message = await messageService.createMessage(
            swapRequestId,
            socket.user.id,
            text,
          );
          io.to(roomName(swapRequestId)).emit("chat:message", message);
          const recipientId =
            swapRequest.requester.toString() === socket.user.id
              ? swapRequest.recipient.toString()
              : swapRequest.requester.toString();
          await notificationService.create({
            recipient: recipientId,
            type: "message",
            title: `New message from ${message.senderName}`,
            message: message.text || "Sent an attachment",
            link: "/swap-requests",
          });
          io.to(`user:${recipientId}`).emit("chat:notification", { message });
          const room = io.sockets.adapter.rooms.get(roomName(swapRequestId));
          const recipientSocket =
            room &&
            [...room]
              .map((socketId) => io.sockets.sockets.get(socketId))
              .find((member) => member?.user.id !== socket.user.id);
          if (recipientSocket) {
            const deliveryStatus = await messageService.markMessagesDelivered(
              swapRequestId,
              recipientSocket.user.id,
            );
            if (deliveryStatus)
              io.to(roomName(swapRequestId)).emit(
                "chat:message-status",
                deliveryStatus,
              );
          }
          callback({ ok: true, message });
        } catch (error) {
          callback({ ok: false, message: error.message });
        }
      },
    );

    socket.on("chat:read", async ({ swapRequestId }) => {
      try {
        const status = await messageService.markMessagesRead(
          swapRequestId,
          socket.user.id,
        );
        if (status)
          io.to(roomName(swapRequestId)).emit("chat:message-status", status);
      } catch {
        /* The client will refresh messages if its session has expired. */
      }
    });

    socket.on("chat:received", async ({ swapRequestId }) => {
      try {
        const status = await messageService.markMessagesDelivered(
          swapRequestId,
          socket.user.id,
        );
        if (status)
          io.to(roomName(swapRequestId)).emit("chat:message-status", status);
      } catch {
        /* A stale notification requires no client-side action. */
      }
    });
  });
};

module.exports = { initializeChatSocket };

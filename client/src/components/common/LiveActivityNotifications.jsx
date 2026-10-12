import { MessageCircle, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { connectChatSocket } from "../../services/chatSocket";
import Toast from "./Toast";

export default function LiveActivityNotifications() {
  const { token } = useAuth();
  const [activity, setActivity] = useState(null);
  const [success, setSuccess] = useState("null");
  useEffect(() => {
    if (!token) return undefined;
    const socket = connectChatSocket(token);
    let dismissTimer;
    const show = (title, message, type = "activity") => {
      window.clearTimeout(dismissTimer);
      setActivity({ title, message, type });
      dismissTimer = window.setTimeout(() => setActivity(null), 5000);
    };
    const showSuccess = (title, message, type = "success") => {
      window.clearTimeout(dismissTimer);
      setSuccess({ title, message, type });
      dismissTimer = window.setTimeout(() => setSuccess(null), 5000);
    };
    const onRequest = ({ request }) =>
      show(
        "New swap request",
        `${request.otherUser.name} sent you a request for ${request.skill?.name || "a skill"}.`,
      );
    const onRequestUpdate = ({ request }) =>
      show(
        "Swap request updated",
        `${request.otherUser.name} ${request.status} your swap request.`,
      );
    const onFeedback = ({ review }) =>
      show(
        "New feedback received",
        `${review.reviewer?.name || "A member"} gave you ${review.rating} out of 5 stars.`,
      );
    const onMessage = ({ message }) => {
      socket.emit("chat:received", { swapRequestId: message.swapRequestId });
      show(
        `New message from ${message.senderName}`,
        message.text || "Sent an attachment",
        "message",
      );
    };
    socket.on("swap-request:created", onRequest);
    socket.on("swap-request:updated", onRequestUpdate);
    socket.on("chat:notification", onMessage);
    socket.on("feedback:received", onFeedback);
    return () => {
      window.clearTimeout(dismissTimer);
      socket.off("swap-request:created", onRequest);
      socket.off("swap-request:updated", onRequestUpdate);
      socket.off("chat:notification", onMessage);
      socket.off("feedback:received", onFeedback);
      socket.disconnect();
    };
  }, [token]);
  return (
    <>
      <Toast
        title={activity?.title}
        message={activity?.message}
        icon={activity?.type === "message" ? MessageCircle : undefined}
        onDismiss={() => setActivity(null)}
      />
      <Toast
        title={success?.title}
        message={success?.message}
        icon={CheckCircle}
        onDismiss={() => setSuccess(null)}
      />
    </>
  );
}

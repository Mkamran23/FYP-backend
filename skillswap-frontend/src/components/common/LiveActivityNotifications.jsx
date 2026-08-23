import { Bell, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthContext";
import { connectChatSocket } from "../../services/chatSocket";

export default function LiveActivityNotifications() {
  const { token } = useAuth();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (!token) return undefined;
    const socket = connectChatSocket(token);
    let dismissTimer;
    const show = (title, message, type = "activity") => {
      window.clearTimeout(dismissTimer);
      setActivity({ title, message, type });
      dismissTimer = window.setTimeout(() => setActivity(null), 5000);
    };
    const onRequest = ({ request }) => show("New swap request", `${request.otherUser.name} sent you a request for ${request.skill?.name || "a skill"}.`);
    const onRequestSent = ({ request }) => show("Swap request sent", `Your request for ${request.skill?.name || "a skill"} was sent to ${request.otherUser.name}.`);
    const onRequestUpdate = ({ request }) => show("Swap request updated", `${request.otherUser.name} ${request.status} your swap request.`);
    const onMessage = ({ message }) => {
      socket.emit("chat:received", { swapRequestId: message.swapRequestId });
      show(`New message from ${message.senderName}`, message.text, "message");
    };

    socket.on("swap-request:created", onRequest);
    socket.on("swap-request:sent", onRequestSent);
    socket.on("swap-request:updated", onRequestUpdate);
    socket.on("chat:notification", onMessage);
    return () => {
      window.clearTimeout(dismissTimer);
      socket.off("swap-request:created", onRequest);
      socket.off("swap-request:sent", onRequestSent);
      socket.off("swap-request:updated", onRequestUpdate);
      socket.off("chat:notification", onMessage);
      socket.disconnect();
    };
  }, [token]);

  if (!activity) return null;
  const Icon = activity.type === "message" ? MessageCircle : Bell;
  return <div role="status" className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-blue-100 bg-white p-4 shadow-lg">
    <Icon size={18} className="mt-0.5 shrink-0 text-blue-600" />
    <div className="min-w-0"><p className="text-sm font-semibold text-slate-800">{activity.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">{activity.message}</p></div>
    <button type="button" onClick={() => setActivity(null)} className="ml-auto text-slate-400 hover:text-slate-600" aria-label="Dismiss notification"><X size={16} /></button>
  </div>;
}

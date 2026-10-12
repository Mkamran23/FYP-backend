import {
  Check,
  CheckCheck,
  Download,
  FileText,
  Image,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { connectChatSocket } from "../../services/chatSocket";
import { swapRequestService } from "../../services/swapRequestService";

const displayTime = (value) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function SwapChat({
  swapRequest,
  token,
  currentUserId,
  onClose,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!swapRequest || !token) return undefined;
    let active = true;
    // Loading reflects an external request started by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError("");
    swapRequestService
      .getMessages(swapRequest.id, token)
      .then((data) => {
        if (active) setMessages(data.messages);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    const socket = connectChatSocket(token);
    socketRef.current = socket;
    socket.on("connect", () =>
      socket.emit("chat:join", { swapRequestId: swapRequest.id }, (result) => {
        if (!result.ok && active) setError(result.message);
      }),
    );
    socket.on("chat:message", (message) => {
      if (message.swapRequestId === swapRequest.id && active) {
        setMessages((current) =>
          current.some((item) => item.id === message.id)
            ? current
            : [...current, message],
        );
        if (message.senderId !== currentUserId)
          socket.emit("chat:read", { swapRequestId: swapRequest.id });
      }
    });
    socket.on("chat:message-status", (status) => {
      if (status.swapRequestId === swapRequest.id && active)
        setMessages((current) =>
          current.map((message) =>
            message.senderId === currentUserId &&
            status.messageIds.includes(message.id)
              ? {
                  ...message,
                  deliveredAt: status.deliveredAt || message.deliveredAt,
                  readAt: status.readAt || message.readAt,
                }
              : message,
          ),
        );
    });
    socket.on("connect_error", () => {
      if (active)
        setError("Live chat could not connect. Please refresh and try again.");
    });
    return () => {
      active = false;
      socketRef.current = null;
      socket.disconnect();
    };
  }, [swapRequest, token, currentUserId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const content = text.trim();
    if ((!content && !file) || !swapRequest) return;
    if (file) {
      try {
        const data = await swapRequestService.uploadAttachment(
          swapRequest.id,
          file,
          content,
          token,
        );
        setMessages((current) =>
          current.some((item) => item.id === data.message.id)
            ? current
            : [...current, data.message],
        );
        setText("");
        setFile(null);
        setError("");
      } catch (uploadError) {
        setError(uploadError.message || "Unable to upload attachment.");
      }
      return;
    }
    if (!socketRef.current?.connected) {
      setError("Live chat is reconnecting. Please try again in a moment.");
      return;
    }
    socketRef.current.emit(
      "chat:send",
      { swapRequestId: swapRequest.id, text: content },
      (result) => {
        if (!result.ok) setError(result.message);
        else {
          setText("");
          setError("");
        }
      },
    );
  };

  const selectFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    const allowedTypes = [
      "image/jpeg",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selected.type)) {
      setError("Choose a JPG, JPEG, PDF, or DOCX file.");
      event.target.value = "";
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("File must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }
    setFile(selected);
    setError("");
  };

  const downloadAttachment = async (attachment) => {
    try {
      const response = await fetch(attachment.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to download attachment.");
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = attachment.originalName;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      setError(downloadError.message || "Unable to download attachment.");
    }
  };

  if (!swapRequest)
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        Select an accepted swap request to start chatting.
      </div>
    );

  return (
    <div className="flex min-h-[500px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm xl:h-full xl:min-h-0">
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-slate-100 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={onClose}
            className="mr-1 h-7 w-7 rounded-md text-slate-500 hover:bg-slate-100 xl:hidden"
            aria-label="Back to swap requests"
          >
            ←
          </button>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {swapRequest.otherUser.avatarUrl ? (
              <img
                src={swapRequest.otherUser.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              swapRequest.otherUser.name.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-bold text-slate-800">
              {swapRequest.otherUser.name}
            </p>
            <p className="text-[9px] text-emerald-500">Accepted swap chat</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
        {isLoading && (
          <p className="text-center text-[9px] text-slate-400">
            Loading conversation...
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded bg-red-50 p-2 text-[9px] text-red-600"
          >
            {error}
          </p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="pt-8 text-center text-[9px] text-slate-400">
            Start discussing schedules and lesson plans.
          </p>
        )}
        {messages.map((message) => {
          const mine = message.senderId === currentUserId;
          const statusIcon = message.readAt ? (
            <CheckCheck size={11} className="text-blue-100" aria-label="Read" />
          ) : message.deliveredAt ? (
            <CheckCheck
              size={11}
              className="text-blue-200"
              aria-label="Received"
            />
          ) : (
            <Check size={11} aria-label="Sent" />
          );
          const AttachmentIcon =
            message.attachment?.mimeType === "image/jpeg" ? Image : FileText;
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-xl px-3 py-2 ${mine ? "rounded-br-sm bg-blue-600 text-white" : "rounded-bl-sm bg-slate-100 text-slate-700"}`}
              >
                {message.text && (
                  <p className="text-[11px] leading-4">{message.text}</p>
                )}
                {message.attachment && (
                  <button
                    type="button"
                    onClick={() => downloadAttachment(message.attachment)}
                    className={`mt-1 flex w-full items-center gap-2 rounded-md p-1.5 text-left text-[9px] ${mine ? "bg-blue-500 hover:bg-blue-400" : "bg-white hover:bg-slate-50"}`}
                  >
                    <AttachmentIcon size={15} />
                    <span className="max-w-36 flex-1 truncate">
                      {message.attachment.originalName}
                    </span>
                    <Download size={13} />
                  </button>
                )}
                <div
                  className={`mt-1 flex items-center gap-1 text-[7px] ${mine ? "text-blue-100" : "text-slate-400"}`}
                >
                  <span>{displayTime(message.createdAt)}</span>
                  {mine && statusIcon}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="shrink-0 border-t border-slate-100 p-2 sm:p-3"
      >
        {file && (
          <div className="mb-2 flex items-center gap-2 rounded-md bg-blue-50 px-2 py-1.5 text-[9px] text-blue-700">
            <FileText size={13} />
            <span className="min-w-0 flex-1 truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                fileInputRef.current.value = "";
              }}
              aria-label="Remove attachment"
            >
              <X size={13} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.pdf,.docx,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={selectFile}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-500 hover:text-blue-600"
            aria-label="Attach a JPG, JPEG, PDF, or DOCX file"
          >
            <Paperclip size={14} />
          </button>
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={2000}
            placeholder="Type a message..."
            className="min-w-0 flex-1 border-none bg-transparent text-[9px] text-slate-600 outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim() && !file}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white disabled:opacity-50"
          >
            <Send size={12} />
          </button>
        </div>
        <p className="mt-1 text-[7px] text-slate-400">
          JPG, JPEG, PDF, or DOCX up to 10 MB.
        </p>
      </form>
    </div>
  );
}

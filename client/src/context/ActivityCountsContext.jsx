import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../auth/AuthContext";
import { connectChatSocket } from "../services/chatSocket";
import { swapRequestService } from "../services/swapRequestService";
import { notificationService } from "../services/notificationService";

const ActivityCountsContext = createContext(null);
const emptyCounts = { swapRequests: 0, messages: 0, notifications: 0 };

export function ActivityCountsProvider({ children }) {
  const { token } = useAuth();
  const [counts, setCounts] = useState(emptyCounts);

  const clearCount = useCallback((name) => {
    setCounts((current) => ({ ...current, [name]: 0 }));
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    swapRequestService
      .getBadgeCounts(token)
      .then((data) => {
        if (active) setCounts(data);
      })
      .catch(() => {
        if (active) setCounts(emptyCounts);
      });

    const socket = connectChatSocket(token);
    const increment = (updates) =>
      setCounts((current) =>
        Object.fromEntries(
          Object.entries(current).map(([key, value]) => [
            key,
            value + (updates[key] || 0),
          ]),
        ),
      );
    const onRequest = () => increment({ swapRequests: 1, notifications: 1 });
    const onRequestUpdate = () => increment({ notifications: 1 });
    const onFeedback = () => increment({ notifications: 1 });
    const onMessage = ({ message }) => {
      socket.emit("chat:received", { swapRequestId: message.swapRequestId });
      increment({ messages: 1, notifications: 1 });
    };
    socket.on("swap-request:created", onRequest);
    socket.on("swap-request:updated", onRequestUpdate);
    socket.on("chat:notification", onMessage);
    socket.on("feedback:received", onFeedback);
    return () => {
      active = false;
      socket.off("swap-request:created", onRequest);
      socket.off("swap-request:updated", onRequestUpdate);
      socket.off("chat:notification", onMessage);
      socket.off("feedback:received", onFeedback);
      socket.disconnect();
    };
  }, [token]);

  const value = useMemo(() => ({ counts, clearCount }), [counts, clearCount]);
  return (
    <ActivityCountsContext.Provider value={value}>
      {children}
    </ActivityCountsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useActivityCounts() {
  const context = useContext(ActivityCountsContext);
  if (!context)
    throw new Error(
      "useActivityCounts must be used within ActivityCountsProvider",
    );
  return context;
}

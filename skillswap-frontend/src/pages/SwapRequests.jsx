import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import SwapChat from "../components/swapRequests/SwapChat";
import SwapRequestList from "../components/swapRequests/SwapRequestList";
import SwapRequestTabs from "../components/swapRequests/SwapRequestTabs";
import { connectChatSocket } from "../services/chatSocket";
import { swapRequestService } from "../services/swapRequestService";

function ActivityToast({ activity, onDismiss }) {
  if (!activity) return null;
  return <div role="status" className="fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-blue-100 bg-white p-4 shadow-lg">
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-700">↔</span>
    <div><p className="text-sm font-semibold text-slate-800">{activity.title}</p><p className="mt-0.5 text-xs text-slate-500">{activity.message}</p></div>
    <button type="button" onClick={onDismiss} className="ml-auto text-slate-400 hover:text-slate-600" aria-label="Dismiss notification">×</button>
  </div>;
}

export default function SwapRequests() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("All Requests");
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activity, setActivity] = useState(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    try { const data = await swapRequestService.getMine(token); setRequests(data.requests); setError(""); }
    catch (requestError) { setError(requestError.message || "Unable to load swap requests."); }
    finally { setIsLoading(false); }
  }, [token]);

  // The request list is external server state, loaded when this page mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadRequests(); }, [loadRequests]);

  useEffect(() => {
    if (!token) return undefined;
    const socket = connectChatSocket(token);
    const addRequest = ({ request }) => {
      setRequests((current) => current.some((item) => item.id === request.id) ? current : [request, ...current]);
    };
    const updateRequest = ({ request }) => {
      setRequests((current) => current.some((item) => item.id === request.id) ? current.map((item) => item.id === request.id ? request : item) : [request, ...current]);
    };
    socket.on("swap-request:created", addRequest);
    socket.on("swap-request:updated", updateRequest);
    return () => {
      socket.off("swap-request:created", addRequest);
      socket.off("swap-request:updated", updateRequest);
      socket.disconnect();
    };
  }, [token]);

  const handleStatusChange = async (id, status) => {
    setIsUpdating(true);
    try {
      const data = await swapRequestService.updateStatus(id, status, token);
      setRequests((current) => current.map((request) => request.id === id ? data.request : request));
      if (selectedRequest?.id === id) setSelectedRequest(data.request);
      if (status === "accepted") setActiveTab("Accepted");
      setActivity({
        title: `Swap request ${status}`,
        message: `You ${status} ${data.request.otherUser.name}'s swap request.`,
      });
    } catch (requestError) { setError(requestError.message || "Unable to update the request."); }
    finally { setIsUpdating(false); }
  };

  const openChat = (request) => { setSelectedRequest(request); setChatOpen(true); };

  return <DashboardLayout>
    <div className="min-h-full p-3 sm:p-4">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-3">
          <h1 className="text-lg font-bold text-slate-800">Swap Requests</h1>
          <p className="mt-1 text-sm text-slate-500">Accept a request to unlock private real-time chat for schedules and lesson details.</p>
        </div>
        {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <ActivityToast activity={activity} onDismiss={() => setActivity(null)} />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className={chatOpen ? "hidden xl:block" : "block"}>
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <SwapRequestTabs activeTab={activeTab} onChange={setActiveTab} />
              {isLoading ? <p className="p-8 text-center text-sm text-slate-500">Loading requests...</p> :
                <SwapRequestList activeTab={activeTab} requests={requests} onChat={openChat} onStatusChange={handleStatusChange} isUpdating={isUpdating} />}
            </section>
          </div>
          <div className={chatOpen ? "block" : "hidden xl:block"}>
            <SwapChat swapRequest={selectedRequest} token={token} currentUserId={user?.id} onClose={() => setChatOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>;
}

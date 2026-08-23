import { Check, MessageSquare, X } from "lucide-react";

const statusClass = { pending: "bg-blue-50 text-blue-600", accepted: "bg-emerald-50 text-emerald-600", rejected: "bg-red-50 text-red-600", cancelled: "bg-slate-100 text-slate-600" };
const buttonBase = "inline-flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-45";

function RequestActions({ request, onChat, onStatusChange, isUpdating }) {
  const canRespond = request.status === "pending" && !request.isRequester;
  const chatAvailable = request.status === "accepted";
console.log(request)
  return <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
    {!request.isRequester && <>
      <button type="button" onClick={() => onStatusChange(request.id, "accepted")} disabled={!canRespond || isUpdating} className={`${buttonBase} border-emerald-300 text-emerald-700`} title={!canRespond ? "Only the recipient can accept a pending request" : "Accept request"}><Check size={14} />Accept</button>
      <button type="button" onClick={() => onStatusChange(request.id, "rejected")} disabled={!canRespond || isUpdating} className={`${buttonBase} border-red-300 text-red-600`} title={!canRespond ? "This request can no longer be rejected" : "Reject request"}><X size={14} />Reject</button>
    </>}
    <button type="button" onClick={() => onChat(request)} disabled={!chatAvailable} className={`${buttonBase} ${chatAvailable ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-400"}`} title={chatAvailable ? "Open accepted swap chat" : "Chat becomes available after acceptance"}><MessageSquare size={14} />View chat</button>
  </div>;
}

export default function SwapRequestList({ activeTab, requests, onChat, onStatusChange, isUpdating }) {
  const filteredRequests = activeTab === "All Requests" ? requests : requests.filter((request) => request.status === activeTab.toLowerCase());

  if (!filteredRequests.length) return <div className="p-8 text-center text-xs text-slate-400">No {activeTab.toLowerCase()} found.</div>;

  return <div className="space-y-2 p-2 sm:p-3">
    {filteredRequests.map((request) => <div key={request.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-700">{request.otherUser.avatarUrl ?
            <img src={request.otherUser.avatarUrl} alt="" className="h-full w-full object-cover" /> : request.otherUser.name.charAt(0)}</div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">{request.otherUser.name}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{request.otherUser.location || "Location not set"}</p>
            <p className="mt-1 text-xs text-slate-400">{request.isRequester ? "You sent this swap request" : "Sent you a swap request"}</p></div>
        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[request.status]}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
      </div>
      <RequestActions request={request} onChat={onChat} onStatusChange={onStatusChange} isUpdating={isUpdating} />
    </div>)}
  </div>;
}

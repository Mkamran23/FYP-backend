import { BarChart3, BookOpen, MessageCircle, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { swapRequestService } from "../../services/swapRequestService";
const dayKey = (date) => new Date(date).toISOString().slice(0, 10);
const relativeTime = (date) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
};
export default function LearningActivity() {
  const { token, user } = useAuth();
  const [period, setPeriod] = useState("30");
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await swapRequestService.getMine(token);
      setRequests(data.requests);
      setError("");
    } catch (reason) {
      setError(reason.message || "Unable to load activity.");
    }
  }, [token]);
  useEffect(() => {
    load();
  }, [load]);
  const activity = useMemo(() => {
    const cutoff = Date.now() - Number(period) * 86400000;
    return requests.filter(
      (request) => new Date(request.updatedAt).getTime() >= cutoff,
    );
  }, [requests, period]);
  const points = useMemo(() => {
    const days = Number(period) === 7 ? 7 : 10;
    const start = new Date();
    start.setDate(start.getDate() - days + 1);
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return activity.filter(
        (request) => dayKey(request.updatedAt) === dayKey(date),
      ).length;
    });
  }, [activity, period]);
  const max = Math.max(...points, 1);
  const recent = [...activity]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);
  const detail = (request) =>
    request.status === "completed"
      ? `Completed swap with ${request.otherUser.name}`
      : request.status === "accepted"
        ? `Connected with ${request.otherUser.name}`
        : request.isRequester
          ? `Sent a request to ${request.otherUser.name}`
          : `Received a request from ${request.otherUser.name}`;
  const Icon = (request) =>
    request.status === "completed"
      ? CheckCircle2
      : request.status === "accepted"
        ? MessageCircle
        : BookOpen;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
          <BarChart3 size={13} className="text-blue-600" />
          Learning Activity
        </h2>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="rounded border border-slate-100 bg-slate-50 px-1 py-0.5 text-[10px]"
        >
          <option value="30">This Month</option>
          <option value="7">This Week</option>
        </select>
      </div>
      <div className="mt-3 h-[95px] w-full rounded bg-slate-50 p-2">
        <svg
          viewBox={`0 0 ${points.length * 30} 90`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <polyline
            points={points
              .map(
                (point, index) =>
                  `${5 + index * 30},${80 - (point / max) * 65}`,
              )
              .join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={5 + index * 30}
              cy={80 - (point / max) * 65}
              r="2.5"
              className="fill-white stroke-blue-500"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      {error ? (
        <p className="mt-3 text-[10px] text-red-600">{error}</p>
      ) : recent.length ? (
        <div className="mt-3 space-y-3">
          {recent.map((request) => {
            const ActivityIcon = Icon(request);
            return (
              <div key={request.id} className="flex items-start gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ActivityIcon size={11} />
                </div>
                <div>
                  <p className="text-[10px] font-medium leading-3 text-slate-600">
                    {detail(request)}
                  </p>
                  <p className="text-[7px] text-slate-400">
                    {relativeTime(request.updatedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-center text-[10px] text-slate-400">
          No activity in this period.
        </p>
      )}
    </div>
  );
}

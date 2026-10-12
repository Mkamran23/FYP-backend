import {
  Bell,
  CheckCheck,
  MessageCircle,
  Star,
  ArrowLeftRight,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useActivityCounts } from "../context/ActivityCountsContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { notificationService } from "../services/notificationService";
const icons = {
  message: MessageCircle,
  review: Star,
  swap_request: ArrowLeftRight,
  swap_update: ArrowLeftRight,
};
const relativeTime = (value) => {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
export default function Notifications() {
  const { token } = useAuth();
  const { clearCount } = useActivityCounts();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const data = await notificationService.list(token);
      setNotifications(data.notifications);
      setError("");
    } catch (e) {
      setError(e.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    load();
  }, [load]);
  const markRead = async () => {
    try {
      await notificationService.markAllRead(token);
      clearCount("notifications");
      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      );
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Activity center
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-800">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Swap requests, messages, ratings, and reviews in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={markRead}
            disabled={!notifications.some((item) => !item.read)}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 disabled:opacity-50"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p className="mt-6 text-sm text-slate-500">
            Loading notifications...
          </p>
        ) : !notifications.length ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Bell className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              You have no notifications yet.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {notifications.map((item) => {
              const Icon = icons[item.type] || Bell;
              const content = (
                <>
                  <span
                    className={`mt-0.5 rounded-full p-2 ${item.read ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-700"}`}
                  >
                    <Icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold text-slate-800">
                        {item.title}
                      </h2>
                      <time className="shrink-0 text-xs text-slate-400">
                        {relativeTime(item.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.message}
                    </p>
                  </div>
                  {!item.read && (
                    <span
                      className="mt-2 h-2 w-2 rounded-full bg-blue-600"
                      aria-label="Unread"
                    />
                  )}
                </>
              );
              return item.link ? (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`flex gap-3 rounded-xl border p-4 shadow-sm transition hover:border-blue-200 ${item.read ? "border-slate-200 bg-white" : "border-blue-100 bg-blue-50/40"}`}
                >
                  {content}
                </Link>
              ) : (
                <article
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {content}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

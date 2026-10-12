import { ShieldCheck, Users, Flag, Tags } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../auth/AuthContext";
import { adminService } from "../services/adminService";
export default function AdminPanel() {
  const { token } = useAuth();
  const [tab, setTab] = useState("users");
  const [data, setData] = useState({ users: [], categories: [], reports: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [users, categories, reports] = await Promise.all([
        adminService.getUsers(token),
        adminService.getCategories(token),
        adminService.getReports(token),
      ]);
      setData({
        users: users.users,
        categories: categories.categories,
        reports: reports.reports,
      });
      setError("");
    } catch (e) {
      setError(e.message || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    load();
  }, [load]);
  const toggleUser = async (user) => {
    try {
      await adminService.setUserStatus(user.id, !user.isActive, token);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const renameCategory = async (category) => {
    const name = window.prompt(`Rename ${category} to:`);
    if (!name?.trim()) return;
    try {
      await adminService.renameCategory(category, name, token);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const updateReport = async (report, status) => {
    const resolution =
      status === "resolved"
        ? window.prompt("Resolution note (optional):") || ""
        : report.resolution;
    try {
      await adminService.updateReport(report.id, { status, resolution }, token);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "reports", label: "Reports", icon: Flag },
  ];
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-lg bg-blue-100 p-2 text-blue-700">
            <ShieldCheck />
          </span>
          <div>
            <p className="text-sm font-semibold text--600">Administration</p>
            <h1 className="text-2xl font-bold text-slate-800">Control panel</h1>
          </div>
        </div>
        <div className="mb-5 flex gap-2 border-b border-slate-200">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${tab === item.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-slate-500">Loading admin controls...</p>
        ) : tab === "users" ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-3">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                      >
                        {user.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        disabled={user.role === "admin"}
                        onClick={() => toggleUser(user)}
                        className="rounded border px-3 py-1.5 text-xs font-semibold text-blue-700 disabled:opacity-40"
                      >
                        {user.isActive ? "Deactivate" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tab === "categories" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
              >
                <span className="font-medium text-slate-700">{category}</span>
                <button
                  onClick={() => renameCategory(category)}
                  className="text-sm font-semibold text-blue-600"
                >
                  Rename
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {data.reports.length ? (
              data.reports.map((report) => (
                <article
                  key={report.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        Report against {report.reportedUser?.name || "member"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {report.reason}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Reported by {report.reporter?.name || "Unknown"} ·{" "}
                        {report.contentType}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold capitalize">
                      {report.status}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateReport(report, "reviewed")}
                      className="rounded border px-3 py-1.5 text-xs font-semibold"
                    >
                      Mark reviewed
                    </button>
                    <button
                      onClick={() => updateReport(report, "resolved")}
                      className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => updateReport(report, "dismissed")}
                      className="rounded border px-3 py-1.5 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No reports to review.
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

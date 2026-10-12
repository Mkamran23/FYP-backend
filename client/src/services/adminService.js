import { apiClient } from "./apiClient";
const headers = (token) => ({ Authorization: `Bearer ${token}` });
export const adminService = {
  getUsers: (token) => apiClient("/admin/users", { headers: headers(token) }),
  setUserStatus: (id, isActive, token) =>
    apiClient(`/admin/users/${id}/status`, {
      method: "PATCH",
      headers: headers(token),
      body: JSON.stringify({ isActive }),
    }),
  getCategories: (token) =>
    apiClient("/admin/categories", { headers: headers(token) }),
  renameCategory: (category, name, token) =>
    apiClient(`/admin/categories/${encodeURIComponent(category)}`, {
      method: "PATCH",
      headers: headers(token),
      body: JSON.stringify({ name }),
    }),
  getReports: (token) =>
    apiClient("/admin/reports", { headers: headers(token) }),
  updateReport: (id, payload, token) =>
    apiClient(`/admin/reports/${id}`, {
      method: "PATCH",
      headers: headers(token),
      body: JSON.stringify(payload),
    }),
  reportUser: (payload, token) =>
    apiClient("/admin/reports", {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(payload),
    }),
};

import { apiClient } from "./apiClient";
const headers = (token) => ({ Authorization: `Bearer ${token}` });
export const notificationService = {
  list: (token) => apiClient("/notifications", { headers: headers(token) }),
  markAllRead: (token) =>
    apiClient("/notifications/read-all", {
      method: "PATCH",
      headers: headers(token),
    }),
};

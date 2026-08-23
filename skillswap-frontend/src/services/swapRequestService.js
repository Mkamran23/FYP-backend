import { apiClient } from "./apiClient";

const headers = (token) => ({ Authorization: `Bearer ${token}` });

export const swapRequestService = {
  getMine: (token) => apiClient("/swap-requests", { headers: headers(token) }),
  updateStatus: (id, status, token) => apiClient(`/swap-requests/${id}/status`, { method: "PATCH", headers: headers(token), body: JSON.stringify({ status }) }),
  getMessages: (id, token) => apiClient(`/swap-requests/${id}/messages`, { headers: headers(token) }),
  create: (recipientId, skillId, token) => apiClient("/swap-requests", { method: "POST", headers: headers(token), body: JSON.stringify({ recipientId, skillId }) }),
};

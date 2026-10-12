import { apiClient } from "./apiClient";
const headers = (token) => ({ Authorization: `Bearer ${token}` });
export const reviewService = {
  getPending: (token) =>
    apiClient("/reviews/pending", { headers: headers(token) }),
  getForUser: (userId, token) =>
    apiClient(`/reviews/user/${userId}`, { headers: headers(token) }),
  create: (payload, token) =>
    apiClient("/reviews", {
      method: "POST",
      headers: headers(token),
      body: JSON.stringify(payload),
    }),
};

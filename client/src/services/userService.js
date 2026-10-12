import { apiClient } from "./apiClient";

export const userService = {
  getPublicProfile: (id, token) =>
    apiClient(`/users/${id}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

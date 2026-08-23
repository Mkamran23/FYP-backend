import { apiClient } from "./apiClient";

export const matchingService = {
  getMyMatches: (tokenType, accessToken, limit = 6) => apiClient(`/matches/me?limit=${limit}`, {
    headers: { Authorization: `${tokenType || "Bearer"} ${accessToken}` },
  }),
};

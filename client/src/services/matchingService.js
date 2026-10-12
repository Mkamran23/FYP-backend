import { apiClient } from "./apiClient";

export const matchingService = {
  getMyMatches: (tokenType, accessToken, { limit = 3, page = 1 } = {}) =>
    apiClient(`/matches/me?limit=${limit}&page=${page}`, {
      headers: { Authorization: `${tokenType || "Bearer"} ${accessToken}` },
    }),
};

import { apiClient } from "./apiClient";
export const partnerSearchService = {
  search: (filters, token) =>
    apiClient(`/users/search?${new URLSearchParams(filters)}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

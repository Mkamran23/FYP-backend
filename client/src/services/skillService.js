import { apiClient } from "./apiClient";

export const skillService = {
  getCatalog: () => apiClient("/skills"),
};

import { apiClient } from "./apiClient";

const authHeaders = (tokenType, accessToken) => ({
  Authorization: `${tokenType || "Bearer"} ${accessToken}`,
});

export const authService = {
  register: (payload) =>
    apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    apiClient("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  forgotPassword: (email) =>
    apiClient("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (payload) =>
    apiClient("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getCurrentUser: (tokenType, accessToken) =>
    apiClient("/auth/me", { headers: authHeaders(tokenType, accessToken) }),
  updateProfile: (profile, tokenType, accessToken) =>
    apiClient("/auth/profile", {
      method: "PUT",
      headers: authHeaders(tokenType, accessToken),
      body: JSON.stringify(profile),
    }),
  uploadProfilePhoto: (photo, tokenType, accessToken) => {
    const formData = new FormData();
    formData.append("photo", photo);
    return apiClient("/auth/profile/photo", {
      method: "POST",
      headers: authHeaders(tokenType, accessToken),
      body: formData,
    });
  },
};

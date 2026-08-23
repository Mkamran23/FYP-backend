const authService = require("../services/authService");

const respond = (handler, success) => async (req, res) => {
  try {
    const result = await handler(req);
    return res.status(success.status).json(success.body(result));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
  }
};

const register = respond(
  (req) => authService.register(req.body),
  { status: 201, body: (auth) => ({ message: "User registered successfully", ...auth }) }
);

const login = respond(
  (req) => authService.login(req.body),
  { status: 200, body: (auth) => ({ message: "Login successful", ...auth }) }
);

const forgotPassword = respond(
  async (req) => { await authService.requestPasswordReset(req.body); },
  { status: 200, body: () => ({ message: "If that email exists, a reset link has been sent." }) }
);

const resetPassword = respond(
  async (req) => { await authService.resetPassword(req.body); },
  { status: 200, body: () => ({ message: "Password reset successfully. You can now sign in with your new password." }) }
);

const getCurrentUser = respond(
  (req) => authService.getProfile(req.user.id),
  { status: 200, body: (user) => ({ user }) }
);

const updateCurrentUser = respond(
  (req) => authService.updateProfile(req.user.id, req.body),
  { status: 200, body: (user) => ({ message: "Profile updated successfully", user }) }
);

const uploadProfilePhoto = respond(
  (req) => authService.updateProfilePhoto(req.user.id, req.file, `${req.protocol}://${req.get("host")}`),
  { status: 200, body: (user) => ({ message: "Profile photo uploaded successfully", user }) }
);

module.exports = { register, login, forgotPassword, resetPassword, getCurrentUser, updateCurrentUser, uploadProfilePhoto };

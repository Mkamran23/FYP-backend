const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Skill = require("../models/skill");
const sendEmail = require("../email");

const createError = (message, status = 400) => Object.assign(new Error(message), { status });

const serializeSkill = (skill) => ({ id: (skill._id || skill).toString(), name: skill.name || "", category: skill.category || "" });
const serializeUser = (user) => ({
  id: user._id.toString(), name: user.name, email: user.email, role: user.role,
  bio: user.bio || "", location: user.location || "", avatarUrl: user.avatarUrl || "",
  skillsToTeach: (user.skillsToTeach || []).filter(Boolean).map(serializeSkill),
  skillsToLearn: (user.skillsToLearn || []).filter(Boolean).map(serializeSkill),
});

const createAuthResponse = (user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
  const { exp } = jwt.decode(token);
  return { token, tokenType: "Bearer", expiresAt: new Date(exp * 1000).toISOString(), user: serializeUser(user) };
};

const register = async ({ name, email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!name?.trim() || !normalizedEmail || !password) throw createError("Name, email and password are required");
  if (password.length < 6) throw createError("Password must be at least 6 characters");
  if (await User.findOne({ email: normalizedEmail })) throw createError("Email already exists", 409);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12) });
  return createAuthResponse(user);
};

const login = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !password) throw createError("Email and password are required");
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) throw createError("Invalid email or password", 401);
  return createAuthResponse(user);
};

const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) throw createError("Email is required");
  const user = await User.findOne({ email: normalizedEmail }).select("+passwordResetToken +passwordResetExpires");
  if (!user) return;
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${encodeURIComponent(resetToken)}`;
  await sendEmail(user.email, "Reset your SkillSwap password", `Reset your password: ${resetUrl}`, `<p>Reset your password <a href="${resetUrl}">here</a>. This link expires in 15 minutes.</p>`);
};

const resetPassword = async ({ password, token }) => {
  if (!token || !password) throw createError("Reset token and new password are required");
  if (password.length < 8) throw createError("Password must be at least 8 characters");
  const resetHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ passwordResetToken: resetHash, passwordResetExpires: { $gt: new Date() } }).select("+password +passwordResetToken +passwordResetExpires");
  if (!user) throw createError("This password reset link is invalid or has expired");
  user.password = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

const getProfile = async (userId) => {
  const user = await User.findById(userId)
    .select("name email role bio location skillsToTeach skillsToLearn avatarUrl")
    .populate("skillsToTeach", "name category")
    .populate("skillsToLearn", "name category");
  if (!user) throw createError("User no longer exists", 401);
  return serializeUser(user);
};

const validateSkillIds = async (skillIds, fieldName) => {
  if (!Array.isArray(skillIds) || skillIds.length > 20) throw createError(`${fieldName} must contain up to 20 skills`);
  const ids = [...new Set(skillIds.map(String))];
  if (ids.length !== skillIds.length || ids.some((id) => !/^[a-f\d]{24}$/i.test(id))) throw createError(`${fieldName} contains an invalid skill`);
  if (await Skill.countDocuments({ _id: { $in: ids } }) !== ids.length) throw createError(`${fieldName} contains a skill that is not in the catalog`);
  return ids;
};

const updateProfile = async (userId, { name, bio, location, skillsToTeach, skillsToLearn }) => {
  const updates = {};
  if (name !== undefined) { if (!name.trim()) throw createError("Name cannot be empty"); updates.name = name.trim(); }
  if (bio !== undefined) updates.bio = String(bio).trim();
  if (location !== undefined) updates.location = String(location).trim();
  if (skillsToTeach !== undefined) updates.skillsToTeach = await validateSkillIds(skillsToTeach, "Skills to teach");
  if (skillsToLearn !== undefined) updates.skillsToLearn = await validateSkillIds(skillsToLearn, "Skills to learn");
  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .select("name email role bio location skillsToTeach skillsToLearn avatarUrl")
    .populate("skillsToTeach", "name category")
    .populate("skillsToLearn", "name category");
  if (!user) throw createError("User no longer exists", 401);
  return serializeUser(user);
};

const updateProfilePhoto = async (userId, file, baseUrl) => {
  if (!file) throw createError("Please choose an image to upload");
  const user = await User.findByIdAndUpdate(userId, { avatarUrl: `${baseUrl}/uploads/avatars/${file.filename}` }, { new: true })
    .select("name email role bio location skillsToTeach skillsToLearn avatarUrl")
    .populate("skillsToTeach", "name category")
    .populate("skillsToLearn", "name category");
  if (!user) throw createError("User no longer exists", 401);
  return serializeUser(user);
};

module.exports = { register, login, requestPasswordReset, resetPassword, getProfile, updateProfile, updateProfilePhoto };

const User = require("../models/user");
const Skill = require("../models/skill");
const Report = require("../models/report");
const error = (message, status = 400) =>
  Object.assign(new Error(message), { status });
const serializeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive !== false,
  createdAt: user.createdAt,
});
const listUsers = () =>
  User.find()
    .select("name email role isActive createdAt")
    .sort({ createdAt: -1 })
    .limit(200)
    .then((users) => users.map(serializeUser));
const setUserStatus = async (adminId, userId, isActive) => {
  if (String(adminId) === String(userId))
    throw error("You cannot change your own account status");
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: Boolean(isActive) },
    { new: true },
  ).select("name email role isActive createdAt");
  if (!user) throw error("User not found", 404);
  return serializeUser(user);
};
const listCategories = () =>
  Skill.distinct("category").then((categories) =>
    categories.filter(Boolean).sort(),
  );
const renameCategory = async (category, name) => {
  if (!name?.trim()) throw error("A category name is required");
  const result = await Skill.updateMany(
    { category },
    { category: name.trim() },
  );
  if (!result.matchedCount) throw error("Category not found", 404);
  return {
    from: category,
    name: name.trim(),
    updatedSkills: result.modifiedCount,
  };
};
const listReports = async () =>
  (
    await Report.find()
      .populate("reporter", "name email")
      .populate("reportedUser", "name email")
      .populate("resolvedBy", "name")
      .sort({ createdAt: -1 })
      .limit(200)
  ).map((report) => ({
    id: String(report._id),
    contentType: report.contentType,
    reason: report.reason,
    status: report.status,
    resolution: report.resolution || "",
    createdAt: report.createdAt,
    reporter: report.reporter
      ? {
          id: String(report.reporter._id),
          name: report.reporter.name,
          email: report.reporter.email,
        }
      : null,
    reportedUser: report.reportedUser
      ? {
          id: String(report.reportedUser._id),
          name: report.reportedUser.name,
          email: report.reportedUser.email,
        }
      : null,
  }));
const updateReport = async (adminId, id, { status, resolution }) => {
  if (!["open", "reviewed", "dismissed", "resolved"].includes(status))
    throw error("Invalid report status");
  const report = await Report.findByIdAndUpdate(
    id,
    {
      status,
      resolution: String(resolution || "").trim(),
      resolvedBy: adminId,
    },
    { new: true },
  );
  if (!report) throw error("Report not found", 404);
  return {
    id: String(report._id),
    status: report.status,
    resolution: report.resolution,
  };
};
const createReport = async (
  reporterId,
  { reportedUserId, contentType = "user", reason },
) => {
  if (!reportedUserId || String(reportedUserId) === String(reporterId))
    throw error("Choose another user to report");
  if (!["user", "message", "review"].includes(contentType) || !reason?.trim())
    throw error("A report reason is required");
  if (!(await User.exists({ _id: reportedUserId })))
    throw error("Reported user not found", 404);
  return Report.create({
    reporter: reporterId,
    reportedUser: reportedUserId,
    contentType,
    reason: reason.trim(),
  });
};
module.exports = {
  listUsers,
  setUserStatus,
  listCategories,
  renameCategory,
  listReports,
  updateReport,
  createReport,
};

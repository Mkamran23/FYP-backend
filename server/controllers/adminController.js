const service = require("../services/adminService");
const respond =
  (handler, status, body = (value) => value) =>
  async (req, res) => {
    try {
      return res.status(status).json(body(await handler(req)));
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  };
const listUsers = respond(
  () => service.listUsers(),
  200,
  (users) => ({ users }),
);
const setUserStatus = respond(
  (req) => service.setUserStatus(req.user.id, req.params.id, req.body.isActive),
  200,
  (user) => ({ user }),
);
const listCategories = respond(
  () => service.listCategories(),
  200,
  (categories) => ({ categories }),
);
const renameCategory = respond(
  (req) => service.renameCategory(req.params.category, req.body.name),
  200,
);
const listReports = respond(
  () => service.listReports(),
  200,
  (reports) => ({ reports }),
);
const updateReport = respond(
  (req) => service.updateReport(req.user.id, req.params.id, req.body),
  200,
  (report) => ({ report }),
);
const createReport = respond(
  (req) => service.createReport(req.user.id, req.body),
  201,
  (report) => ({
    message: "Report submitted",
    report: { id: String(report._id) },
  }),
);
module.exports = {
  listUsers,
  setUserStatus,
  listCategories,
  renameCategory,
  listReports,
  updateReport,
  createReport,
};

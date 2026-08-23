const userService = require("../services/userService");

const respond = (handler, success) => async (req, res) => {
  try {
    const result = await handler(req);
    return res.status(success.status).json(success.body(result));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
  }
};

const createUser = respond((req) => userService.createUser(req.body), { status: 201, body: (user) => user });
const getUsers = respond(() => userService.getUsers(), { status: 200, body: (users) => users });
const updateUser = respond((req) => userService.updateUser(req.params.id, req.body), { status: 200, body: (user) => user });
const deleteUser = respond(async (req) => { await userService.deleteUser(req.params.id); }, { status: 200, body: () => ({ message: "User deleted successfully" }) });

module.exports = { createUser, getUsers, updateUser, deleteUser };

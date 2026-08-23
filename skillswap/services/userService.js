const User = require("../models/user");

const createUser = (payload) => User.create(payload);
const getUsers = () => User.find();
const updateUser = (id, payload) => User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
const deleteUser = (id) => User.findByIdAndDelete(id);

module.exports = { createUser, getUsers, updateUser, deleteUser };

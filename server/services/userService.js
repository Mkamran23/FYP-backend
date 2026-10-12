const User = require("../models/user");

const createUser = (payload) => User.create(payload);
const getUsers = () => User.find();
const updateUser = (id, payload) =>
  User.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
const deleteUser = (id) => User.findByIdAndDelete(id);
const getPublicProfile = async (id) => {
  const user = await User.findById(id)
    .select("name bio location avatarUrl skillsToTeach skillsToLearn")
    .populate("skillsToTeach", "name category")
    .populate("skillsToLearn", "name category");
  if (!user) {
    const error = new Error("Member not found");
    error.status = 404;
    throw error;
  }
  const serializeSkill = (skill) => ({
    id: skill._id.toString(),
    name: skill.name,
    category: skill.category || "",
  });
  return {
    id: user._id.toString(),
    name: user.name,
    bio: user.bio || "",
    location: user.location || "",
    avatarUrl: user.avatarUrl || "",
    skillsToTeach: user.skillsToTeach.filter(Boolean).map(serializeSkill),
    skillsToLearn: user.skillsToLearn.filter(Boolean).map(serializeSkill),
  };
};

module.exports = {
  createUser,
  getUsers,
  getPublicProfile,
  updateUser,
  deleteUser,
};

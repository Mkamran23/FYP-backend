const Skill = require("../models/skill");

const createError = (message, status = 400) =>
  Object.assign(new Error(message), { status });

const createSkill = async ({ name, description, category }, createdBy) => {
  if (!name) throw createError("Skill name is required");
  if (!category?.trim()) throw createError("Skill category is required");
  return Skill.create({
    name: name.trim(),
    description,
    category: category.trim(),
    createdBy,
  });
};

const getSkills = () => Skill.find().sort({ category: 1, name: 1 });

const updateSkill = async (id, changes) => {
  const skill = await Skill.findById(id);
  if (!skill) throw createError("Skill not found", 404);
  skill.name = changes.name ?? skill.name;
  skill.description = changes.description ?? skill.description;
  skill.category = changes.category ?? skill.category;
  return skill.save();
};

const deleteSkill = async (id) => {
  const skill = await Skill.findById(id);
  if (!skill) throw createError("Skill not found", 404);
  await skill.deleteOne();
};

module.exports = { createSkill, getSkills, updateSkill, deleteSkill };

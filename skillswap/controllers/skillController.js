const skillService = require("../services/skillService");

const respond = (handler, success) => async (req, res) => {
  try {
    const result = await handler(req);
    return res.status(success.status).json(success.body(result));
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Something went wrong" });
  }
};

const createSkill = respond(
  (req) => skillService.createSkill(req.body, req.user.id),
  { status: 201, body: (skill) => ({ message: "Skill created successfully", skill }) }
);
const getSkills = respond(
  () => skillService.getSkills(),
  { status: 200, body: (skills) => skills }
);
const updateSkill = respond(
  (req) => skillService.updateSkill(req.params.id, req.body),
  { status: 200, body: (skill) => ({ message: "Skill updated successfully", skill }) }
);
const deleteSkill = respond(
  (req) => skillService.deleteSkill(req.params.id),
  { status: 200, body: () => ({ message: "Skill deleted successfully" }) }
);

module.exports = { createSkill, getSkills, updateSkill, deleteSkill };

const matchingService = require("../services/matchingService");

const getMyMatches = async (req, res) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 12;
    const matches = await matchingService.getMatchesForUser(req.user.id, limit);
    return res.status(200).json({ matches });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Unable to find matches" });
  }
};

module.exports = { getMyMatches };

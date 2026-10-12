const matchingService = require("../services/matchingService");

const getMyMatches = async (req, res) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 50)
      : 12;
    const requestedPage = Number.parseInt(req.query.page, 10);
    const page = Number.isInteger(requestedPage)
      ? Math.max(requestedPage, 1)
      : 1;
    const { matches, total } = await matchingService.getMatchesForUser(
      req.user.id,
      { limit, page },
    );
    return res
      .status(200)
      .json({
        matches,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Unable to find matches" });
  }
};

module.exports = { getMyMatches };

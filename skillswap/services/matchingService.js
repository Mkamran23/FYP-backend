const User = require("../models/user");
const SwapRequest = require("../models/swapRequest");

const ids = (skills = []) => skills.filter(Boolean).map((skill) => skill._id.toString());
const overlap = (source, target) => source.filter((id) => target.includes(id));
const serializeSkill = (skill) => ({ id: skill._id.toString(), name: skill.name, category: skill.category });

const getMatchesForUser = async (userId, limit = 12) => {
  const currentUser = await User.findById(userId)
    .select("skillsToTeach skillsToLearn")
    .populate("skillsToTeach", "name category")
    .populate("skillsToLearn", "name category");

  if (!currentUser) {
    const error = new Error("User no longer exists");
    error.status = 401;
    throw error;
  }

  const teachIds = ids(currentUser.skillsToTeach);
  const learnIds = ids(currentUser.skillsToLearn);
  if (!teachIds.length && !learnIds.length) return [];

  const existingRequests = await SwapRequest.find({ $or: [{ requester: userId }, { recipient: userId }] }).select("requester recipient");
  const requestedUserIds = new Set(existingRequests.map((request) => request.requester.toString() === userId ? request.recipient.toString() : request.requester.toString()));

  const candidates = await User.find({
    _id: { $nin: [userId, ...requestedUserIds] },
    $or: [
      { skillsToTeach: { $in: learnIds } },
      { skillsToLearn: { $in: teachIds } },
    ],
  })
    .select("name bio location avatarUrl skillsToTeach skillsToLearn")
    .populate("skillsToTeach", "name category")
    .populate("skillsToLearn", "name category");

  return candidates
    .map((candidate) => {
      const candidateTeachIds = ids(candidate.skillsToTeach);
      const candidateLearnIds = ids(candidate.skillsToLearn);
      const theyCanTeach = overlap(candidateTeachIds, learnIds);
      const theyWantToLearn = overlap(candidateLearnIds, teachIds);
      const matchCount = theyCanTeach.length + theyWantToLearn.length;
      const possibleMatches = Math.max(teachIds.length + learnIds.length, 1);

      return {
        user: {
          id: candidate._id.toString(),
          name: candidate.name,
          bio: candidate.bio || "",
          location: candidate.location || "",
          avatarUrl: candidate.avatarUrl || "",
        },
        matchScore: Math.round((matchCount / possibleMatches) * 100),
        matchingSkills: {
          theyCanTeach: candidate.skillsToTeach.filter((skill) => skill && theyCanTeach.includes(skill._id.toString())).map(serializeSkill),
          theyWantToLearn: candidate.skillsToLearn.filter((skill) => skill && theyWantToLearn.includes(skill._id.toString())).map(serializeSkill),
        },
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore || (b.matchingSkills.theyCanTeach.length + b.matchingSkills.theyWantToLearn.length) - (a.matchingSkills.theyCanTeach.length + a.matchingSkills.theyWantToLearn.length))
    .slice(0, limit);
};

module.exports = { getMatchesForUser };

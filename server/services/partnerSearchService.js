const User = require("../models/user");

const levels = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
const error = (message) => Object.assign(new Error(message), { status: 400 });
const distance = (a, b) => {
  const radians = (value) => (value * Math.PI) / 180;
  const dLat = radians(b[1] - a[1]);
  const dLng = radians(b[0] - a[0]);
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(a[1])) * Math.cos(radians(b[1])) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(value)) * 10) / 10;
};

const searchPartners = async (
  currentUserId,
  {
    skillId,
    expertise = "Beginner",
    radiusKm = "25",
    latitude,
    longitude,
    location = "",
  },
) => {
  if (skillId && !/^[a-f\d]{24}$/i.test(skillId))
    throw error("Select a valid skill");
  if (!levels[expertise]) throw error("Select a valid expertise level");
  const radius = Number(radiusKm);
  if (!Number.isFinite(radius) || radius < 1 || radius > 500)
    throw error("Search radius must be between 1 and 500 km");
  const hasCoordinates = latitude !== undefined || longitude !== undefined;
  let origin;
  if (hasCoordinates) {
    const lng = Number(longitude);
    const lat = Number(latitude);
    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat) ||
      lng < -180 ||
      lng > 180 ||
      lat < -90 ||
      lat > 90
    )
      throw error("Search location is invalid");
    origin = [lng, lat];
  }
  const query = { _id: { $ne: currentUserId } };
  if (skillId) query.skillsToTeach = skillId;
  if (location.trim() && !origin)
    query.location = { $regex: location.trim(), $options: "i" };
  if (origin)
    query.locationCoordinates = {
      $near: {
        $geometry: { type: "Point", coordinates: origin },
        $maxDistance: radius * 1000,
      },
    };
  const candidates = await User.find(query)
    .select(
      "name bio location avatarUrl skillsToTeach teachingExpertise locationCoordinates",
    )
    .populate("skillsToTeach", "name category")
    .limit(50);
  const members = candidates
    .map((member) => {
      const levelsBySkill = new Map(
        (member.teachingExpertise || []).map((item) => [
          String(item.skill),
          item.level,
        ]),
      );
      const skills = member.skillsToTeach
        .filter(Boolean)
        .map((skill) => ({
          id: String(skill._id),
          name: skill.name,
          category: skill.category || "",
          level: levelsBySkill.get(String(skill._id)) || "Intermediate",
        }))
        .filter(
          (skill) =>
            !skillId ||
            (skill.id === skillId && levels[skill.level] >= levels[expertise]),
        );
      if (!skills.length) return null;
      const coordinates = member.locationCoordinates?.coordinates;
      return {
        id: String(member._id),
        name: member.name,
        bio: member.bio || "",
        location: member.location || "",
        avatarUrl: member.avatarUrl || "",
        skills,
        distanceKm:
          origin && coordinates?.length === 2
            ? distance(origin, coordinates)
            : null,
      };
    })
    .filter(Boolean);
  return {
    members,
    filters: {
      skillId: skillId || "",
      expertise,
      radiusKm: radius,
      locationMode: origin ? "radius" : location.trim() ? "text" : "all",
    },
  };
};

module.exports = { searchPartners };

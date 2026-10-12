require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Skill = require("../models/skill");
const User = require("../models/user");
const seedData = require("../../database/demo-users.json");

async function seedDemoUsers() {
  await connectDB();
  const skills = await Skill.find().select("_id name");
  const skillIds = new Map(skills.map((skill) => [skill.name, skill._id]));
  const requiredSkills = [
    ...new Set(
      seedData.users.flatMap((user) => [
        ...user.skillsToTeach,
        ...user.skillsToLearn,
      ]),
    ),
  ];
  const missingSkills = requiredSkills.filter((name) => !skillIds.has(name));
  if (missingSkills.length)
    throw new Error(
      `Missing catalog skills: ${missingSkills.join(", ")}. Run npm run seed:skills first.`,
    );

  const password = await bcrypt.hash(seedData.sharedPassword, 12);
  const operations = seedData.users.map(
    ({ name, email, location, skillsToTeach, skillsToLearn }) => ({
      updateOne: {
        filter: { email },
        update: {
          $set: {
            name,
            location,
            bio: `Demo SkillSwap member who can teach ${skillsToTeach.join(" and ")}.`,
            password,
            role: "user",
            skillsToTeach: skillsToTeach.map((skill) => skillIds.get(skill)),
            skillsToLearn: skillsToLearn.map((skill) => skillIds.get(skill)),
          },
        },
        upsert: true,
      },
    }),
  );
  const result = await User.bulkWrite(operations, { ordered: false });
  console.log(
    `Demo users seeded: ${result.upsertedCount} created, ${result.modifiedCount} updated.`,
  );
  console.log(`All demo accounts use password: ${seedData.sharedPassword}`);
}

seedDemoUsers()
  .catch((error) => {
    console.error(`Unable to seed demo users: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

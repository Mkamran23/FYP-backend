require("dotenv").config();

const connectDB = require("../config/db");
const Skill = require("../models/skill");
const User = require("../models/user");

const skills = [
  ["IT", "JavaScript"],
  ["IT", "React"],
  ["IT", "Node.js"],
  ["IT", "Python"],
  ["IT", "UI/UX Design"],
  ["Arts", "Graphic Design"],
  ["Arts", "Digital Illustration"],
  ["Arts", "Photography"],
  ["Arts", "Watercolor Painting"],
  ["Music", "Guitar"],
  ["Music", "Piano"],
  ["Music", "Singing"],
  ["Music", "Music Production"],
  ["Cooking", "Pakistani Cooking"],
  ["Cooking", "Baking"],
  ["Cooking", "Italian Cooking"],
  ["Cooking", "Meal Planning"],
  ["Languages", "English"],
  ["Languages", "Urdu"],
  ["Languages", "Spanish"],
  ["Languages", "Public Speaking"],
  ["Fitness", "Yoga"],
  ["Fitness", "Strength Training"],
  ["Fitness", "Cricket"],
];

async function seedSkills() {
  await connectDB();

  const admin = await User.findOne({ role: "admin" }).select("_id");
  if (!admin)
    throw new Error(
      "No administrator exists. Create or promote an admin user before seeding the skill catalog.",
    );

  const operations = skills.map(([category, name]) => ({
    updateOne: {
      filter: { name, category },
      update: { $setOnInsert: { name, category, createdBy: admin._id } },
      upsert: true,
    },
  }));
  const result = await Skill.bulkWrite(operations, { ordered: false });
  console.log(
    `Skill catalog seeded: ${result.upsertedCount} added, ${skills.length - result.upsertedCount} already present.`,
  );
}

seedSkills()
  .catch((error) => {
    console.error(`Unable to seed skills: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = require("mongoose");
    await mongoose.disconnect();
  });

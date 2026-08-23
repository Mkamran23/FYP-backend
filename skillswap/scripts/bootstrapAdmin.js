require("dotenv").config();

const readline = require("readline");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user");

const emailArgument = process.argv.find((argument) => argument.startsWith("--email="));
const email = emailArgument?.slice("--email=".length).trim().toLowerCase();

const askPassword = () => new Promise((resolve) => {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  prompt.question("Password for new account (leave empty to only promote an existing user): ", (password) => {
    prompt.close();
    resolve(password);
  });
});

async function bootstrapAdmin() {
  if (!email) throw new Error("Provide an email with --email=admin@example.com");
  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    existingUser.role = "admin";
    await existingUser.save();
    console.log(`Administrator access granted to ${email}.`);
    return;
  }

  const password = await askPassword();
  if (password.length < 8) throw new Error("A new administrator needs a password with at least 8 characters.");
  await User.create({ name: "Catalog Administrator", email, password: await bcrypt.hash(password, 12), role: "admin" });
  console.log(`Administrator account created for ${email}.`);
}

bootstrapAdmin()
  .catch((error) => { console.error(`Unable to bootstrap administrator: ${error.message}`); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });

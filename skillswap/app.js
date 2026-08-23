const express = require("express");
const cors = require("cors");

const skillRoutes = require("./routes/skillRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const swapRequestRoutes = require("./routes/swapRequestRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchingRoutes);
app.use("/api/swap-requests", swapRequestRoutes);

app.get("/", (_req, res) => res.send("SkillSwap API Running"));

app.use((error, _req, res, _next) => {
  if (error.code === "LIMIT_FILE_SIZE") return res.status(400).json({ message: "Profile photo must be 5 MB or smaller" });
  if (error.message === "Only JPG, PNG, and WebP images are allowed") return res.status(400).json({ message: error.message });
  return res.status(500).json({ message: "Unable to process the request" });
});

module.exports = app;

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { passport, configurePassport } = require("./config/passport");

const skillRoutes = require("./routes/skillRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const swapRequestRoutes = require("./routes/swapRequestRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }),
);
configurePassport();
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

app.use("/api/skills", skillRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchingRoutes);
app.use("/api/swap-requests", swapRequestRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (_req, res) => res.send("SkillSwap API Running"));

app.use((error, _req, res, _next) => {
  if (error.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ message: "File must be 10 MB or smaller" });
  if (error.message === "Only JPG, PNG, and WebP images are allowed")
    return res.status(400).json({ message: error.message });
  if (error.message === "Only JPG, JPEG, PDF, and DOCX files are allowed")
    return res.status(400).json({ message: error.message });
  return res.status(500).json({ message: "Unable to process the request" });
});

module.exports = app;

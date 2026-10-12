const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    githubId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    bio: { type: String, trim: true, maxlength: 500, default: "" },
    location: { type: String, trim: true, maxlength: 100, default: "" },
    locationCoordinates: {
      type: { type: String, enum: ["Point"], default: undefined },
      coordinates: { type: [Number], default: undefined },
    },
    skillsToTeach: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    skillsToLearn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    teachingExpertise: [
      {
        skill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          default: "Intermediate",
        },
      },
    ],
    avatarUrl: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });
userSchema.index({ locationCoordinates: "2dsphere" }, { sparse: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

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
    skillsToTeach: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    skillsToLearn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    avatarUrl: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ skillsToTeach: 1 });
userSchema.index({ skillsToLearn: 1 });

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);

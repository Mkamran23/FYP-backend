const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

skillSchema.index({ name: 1, category: 1 }, { unique: true });

module.exports =
  mongoose.models.Skill || mongoose.model("Skill", skillSchema);

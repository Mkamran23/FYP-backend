const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

swapRequestSchema.index(
  { requester: 1, recipient: 1, skill: 1 },
  { unique: true, partialFilterExpression: { skill: { $exists: true } } },
);

module.exports =
  mongoose.models.SwapRequest ||
  mongoose.model("SwapRequest", swapRequestSchema);

const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      enum: ["user", "message", "review"],
      default: "user",
    },
    reason: { type: String, trim: true, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["open", "reviewed", "dismissed", "resolved"],
      default: "open",
      index: true,
    },
    resolution: { type: String, trim: true, maxlength: 500, default: "" },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);
module.exports =
  mongoose.models.Report || mongoose.model("Report", reportSchema);

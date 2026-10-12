const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["swap_request", "swap_update", "message", "review"],
      required: true,
    },
    title: { type: String, required: true, maxlength: 120 },
    message: { type: String, required: true, maxlength: 500 },
    link: { type: String, trim: true, maxlength: 200, default: "" },
    readAt: { type: Date, default: null, index: true },
  },
  { timestamps: true },
);
notificationSchema.index({ recipient: 1, createdAt: -1 });
module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

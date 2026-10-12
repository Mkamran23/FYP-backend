const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    exchange: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
      index: true,
    },
    reviewer: {
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
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true },
);
reviewSchema.index({ exchange: 1, reviewer: 1 }, { unique: true });
module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

import mongoose from "mongoose";

/**
 * AttemptResult
 * Persists every completed assessment submission for a user.
 * This is the source of truth for all dashboard analytics
 * (progress charts, assessment count, mistakeMap, skillGap, etc.).
 */
const attemptResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    assessmentTitle: {
      type: String,
      required: true,
      trim: true,
    },
    assessmentCategory: {
      type: String,
      required: true,
      trim: true,
    },
    assessmentField: {
      type: String,
      trim: true,
      default: "",
    },
    scorePercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    correctCount: {
      type: Number,
      required: true,
      min: 0,
    },
    gradableCount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },
    elapsedSeconds: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: efficiently fetch all attempts for a user sorted by date
attemptResultSchema.index({ userId: 1, completedAt: -1 });

const AttemptResult = mongoose.model("AttemptResult", attemptResultSchema);

export default AttemptResult;

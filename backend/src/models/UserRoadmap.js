import mongoose from "mongoose";

/**
 * UserRoadmap Schema
 * Persists personalized learning roadmap data generated for each user
 * based on their actual assessment results, SkillGap, MistakeMap, and ConceptRoot analysis.
 */
const stageSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  phase: { type: String, required: true },
  status: {
    type: String,
    enum: ["completed", "current", "upcoming", "locked"],
    default: "upcoming",
  },
  duration: { type: String, default: "4 Weeks" },
  priority: {
    type: String,
    enum: ["High", "Medium", "Standard", "Low"],
    default: "Standard",
  },
  why: { type: String, default: "" },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  concepts: [{ type: String }],
  description: { type: String, default: "" },
  questions: { type: Number, default: 20 },
  isWeakConcept: { type: Boolean, default: false },
});

const userRoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    targetCareer: {
      type: String,
      default: "Full-Stack Software Engineer",
    },
    selectedField: {
      type: String,
      default: "Technology",
    },
    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    hasHistory: {
      type: Boolean,
      default: false,
    },
    completedStageIds: [{ type: Number }],
    stages: [stageSchema],
    lastEvaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserRoadmap = mongoose.model("UserRoadmap", userRoadmapSchema);

export default UserRoadmap;

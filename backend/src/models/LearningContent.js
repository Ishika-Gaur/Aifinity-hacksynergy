import mongoose from "mongoose";

const learningContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: "Platform Admin" },
    authorEmail: { type: String, default: "admin@aifinity.ai" },
    type: {
      type: String,
      enum: ["Roadmap", "Concept Map", "Mistake Map", "Skill Gap Report"],
      required: true,
      default: "Roadmap",
    },
    status: {
      type: String,
      enum: ["Published", "Draft", "Archived"],
      default: "Published",
    },
    views: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

const LearningContent = mongoose.model("LearningContent", learningContentSchema);
export default LearningContent;

import mongoose from "mongoose";
import dotenv from "dotenv";
import { generatePersonalizedRoadmap } from "../src/controllers/analyticsController.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aifinity";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const userId = "6a8a031f284a3e77eec7a5ae"; // ISHIKA GAUR
  console.log(`Generating roadmap for user ${userId}...`);

  const result = await generatePersonalizedRoadmap(userId);
  console.log("\n--- GENERATED ROADMAP RESULT ---");
  console.log(JSON.stringify(result, null, 2));

  const roadmaps = await mongoose.connection.db.collection("userroadmaps").find({}).toArray();
  console.log("\n--- SAVED USER ROADMAPS IN DB ---");
  console.log(roadmaps);

  await mongoose.disconnect();
}

run().catch(console.error);

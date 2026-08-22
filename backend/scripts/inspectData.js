import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aifinity";

async function inspect() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB at", MONGODB_URI);

  const users = await mongoose.connection.db.collection("users").find({}).toArray();
  console.log("\n--- USERS ---");
  console.log(users.map(u => ({ id: u._id, email: u.email, name: u.name, selectedField: u.selectedField })));

  const attempts = await mongoose.connection.db.collection("attemptresults").find({}).toArray();
  console.log("\n--- ATTEMPT RESULTS ---");
  console.log(attempts.map(a => ({
    id: a._id,
    userId: a.userId,
    title: a.assessmentTitle,
    category: a.assessmentCategory,
    scorePercent: a.scorePercent,
    completedAt: a.completedAt
  })));

  const roadmaps = await mongoose.connection.db.collection("userroadmaps").find({}).toArray();
  console.log("\n--- USER ROADMAPS ---");
  console.log(roadmaps.map(r => ({
    id: r._id,
    userId: r.userId,
    targetCareer: r.targetCareer,
    readinessScore: r.readinessScore,
    hasHistory: r.hasHistory,
    stagesCount: r.stages ? r.stages.length : 0,
    stages: r.stages ? r.stages.map(s => ({ id: s.id, title: s.title, priority: s.priority, concepts: s.concepts })) : []
  })));

  await mongoose.disconnect();
}

inspect().catch(console.error);

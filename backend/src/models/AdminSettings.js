import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    general: {
      appName: { type: String, default: "AIFinity" },
      supportEmail: { type: String, default: "support@aifinity.ai" },
      maintenanceMode: { type: Boolean, default: false },
      publicRegistration: { type: Boolean, default: true },
    },
    ai: {
      primaryModel: { type: String, default: "gemini-3.5-flash-latest" },
      maxTokensPerRequest: { type: Number, default: 4096 },
      temperature: { type: Number, default: 0.7 },
      dailyLimitPerUser: { type: Number, default: 100 },
    },
    security: {
      enforceMfa: { type: Boolean, default: true },
      sessionTimeoutMinutes: { type: Number, default: 60 },
      ipWhitelisting: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);
export default AdminSettings;

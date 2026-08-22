import { adminApi } from "./api";

export const adminService = {
  getAnalytics: async () => {
    const res = await adminApi.getAnalytics();
    if (res.success) return res.analytics;
    return null;
  },

  getContent: async () => {
    const res = await adminApi.getContent();
    if (res.success) return res.content;
    return [];
  },

  createContent: async (contentData) => {
    const res = await adminApi.createContent(contentData);
    if (res.success) return res.content;
    throw new Error(res.error || "Failed to create content asset");
  },

  deleteContent: async (contentId) => {
    const res = await adminApi.deleteContent(contentId);
    if (res.success) return res.content;
    throw new Error(res.error || "Failed to delete content asset");
  },

  getReports: async () => {
    const res = await adminApi.getReports();
    if (res.success) return res.reports;
    return [];
  },

  getSettings: async () => {
    const res = await adminApi.getSettings();
    if (res.success) return res.settings;
    return null;
  },

  updateSettings: async (newSettings) => {
    const res = await adminApi.updateSettings(newSettings);
    if (res.success) return res.settings;
    throw new Error(res.error || "Failed to update platform settings");
  },
};

import {
  INITIAL_ANALYTICS,
  INITIAL_CONTENT,
  INITIAL_REPORTS,
  INITIAL_SETTINGS,
} from "../data/mockAdminData";

const STORAGE_KEYS = {
  CONTENT: "aifinity_admin_content",
  SETTINGS: "aifinity_admin_settings",
};

// Helper for local storage persistent state
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to persist admin state:", err);
  }
};

export const adminService = {
  getAnalytics: () => {
    return INITIAL_ANALYTICS;
  },

  getContent: () => {
    return getStored(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
  },

  deleteContent: (contentId) => {
    const content = getStored(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
    const updated = content.filter((c) => c.id !== contentId);
    setStored(STORAGE_KEYS.CONTENT, updated);
    return updated;
  },

  getReports: () => {
    return INITIAL_REPORTS;
  },

  getSettings: () => {
    return getStored(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings: (newSettings) => {
    setStored(STORAGE_KEYS.SETTINGS, newSettings);
    return newSettings;
  },
};

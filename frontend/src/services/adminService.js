import {
  INITIAL_USERS,
  INITIAL_ANALYTICS,
  INITIAL_CONTENT,
  INITIAL_REPORTS,
  INITIAL_SETTINGS,
} from "../data/mockAdminData";

const STORAGE_KEYS = {
  USERS: "aifinity_admin_users",
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
  getUsers: () => {
    return getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  updateUserRole: (userId, newRole) => {
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setStored(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  updateUserStatus: (userId, newStatus) => {
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
    setStored(STORAGE_KEYS.USERS, updated);
    return updated;
  },

  deleteUser: (userId) => {
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.filter((u) => u.id !== userId);
    setStored(STORAGE_KEYS.USERS, updated);
    return updated;
  },

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

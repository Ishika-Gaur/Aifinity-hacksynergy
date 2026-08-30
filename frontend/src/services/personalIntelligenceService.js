import { authApi } from "./api";

// Re-using the same generic request logic or explicitly writing fetch
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const personalIntelligenceService = {
  chat: async (messages) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch(`${API_BASE_URL}/personal-intelligence/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The credentials "include" normally handles cookies, but just in case
        },
        credentials: "include",
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to communicate with AI");
      }
      return data.message;
    } catch (err) {
      throw err;
    }
  },
};

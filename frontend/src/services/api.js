const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // CRITICAL: Ensures HTTP-only cookies are sent/received
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        error: data.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      status: res.status,
      ...data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Network error. Failed to reach server.",
    };
  }
}

export const authApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    request(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  getMe: () =>
    request("/auth/me", {
      method: "GET",
    }),
};

export const adminApi = {
  getUsers: () => request("/admin/users"),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  getAnalytics: () => request("/admin/analytics"),
  getContent: () => request("/admin/content"),
  createContent: (content) =>
    request("/admin/content", {
      method: "POST",
      body: JSON.stringify(content),
    }),
  deleteContent: (id) =>
    request(`/admin/content/${id}`, {
      method: "DELETE",
    }),
  getReports: () => request("/admin/reports"),
  getSettings: () => request("/admin/settings"),
  updateSettings: (settings) =>
    request("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
};

export const assessmentApi = {
  getPublished: () => request("/assessments"),
  getById: (id) => request(`/assessments/${id}`),
  startAttempt: (id) => request(`/assessments/${id}/start`),
  submitAttempt: (id, payload) =>
    request(`/assessments/${id}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAllForAdmin: () => request("/assessments/admin/all"),
  create: (assessment) => request("/assessments/admin", { method: "POST", body: JSON.stringify(assessment) }),
  update: (id, assessment) => request(`/assessments/admin/${id}`, { method: "PUT", body: JSON.stringify(assessment) }),
  remove: (id) => request(`/assessments/admin/${id}`, { method: "DELETE" }),
};

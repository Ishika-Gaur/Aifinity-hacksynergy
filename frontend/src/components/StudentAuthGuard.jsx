import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "../services/api";

export default function StudentAuthGuard({
  children,
  requireOnboardingCompleted = false,
  allowOnlyIncomplete = false,
}) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      let localUser = null;
      try {
        localUser = JSON.parse(localStorage.getItem("user") || "null");
      } catch (_) {}

      // Do not trust cached identity when the backend explicitly rejects the session.
      const res = await authApi.getMe();
      const networkUnavailable = res?.error && (
        res.error.includes("Network") ||
        res.error.includes("Failed to fetch") ||
        res.error.includes("Failed to reach server")
      );
      const currentUser = res?.success && res.user ? res.user : networkUnavailable ? localUser : null;

      if (currentUser) {
        setUser(currentUser);
        try {
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (_) {}
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF8F0]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B332C] border-t-transparent"></div>
      </div>
    );
  }

  // 1. Unauthenticated users -> redirect to Login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Already completed onboarding -> redirect away from /onboardingpage to /dashboard
  if (allowOnlyIncomplete && user.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Incomplete onboarding -> redirect away from protected features to /onboardingpage
  if (requireOnboardingCompleted && !user.onboardingCompleted) {
    return <Navigate to="/onboardingpage" replace />;
  }

  return children;
}

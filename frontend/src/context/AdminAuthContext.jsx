import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginAdmin,
  signupAdmin,
  logoutAdmin,
  subscribeToAuth,
  checkAdminExists,
} from "../services/firebase";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  // Authoritative check against Firestore
  const verifyAdminExistence = useCallback(async () => {
    const exists = await checkAdminExists();
    setAdminExists(exists);
    return exists;
  }, []);

  useEffect(() => {
    // Initial check on mount
    verifyAdminExistence();

    const unsubscribe = subscribeToAuth(async (authUser) => {
      setUser(authUser || null);
      await verifyAdminExistence();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [verifyAdminExistence]);

  const login = async (email, password) => {
    setLoading(true);
    const res = await loginAdmin(email, password);
    if (res.user) {
      setUser(res.user);
      await verifyAdminExistence();
    }
    setLoading(false);
    return res;
  };

  const signup = async (email, password, displayName) => {
    setLoading(true);
    const res = await signupAdmin(email, password, displayName);
    if (res.user) {
      setUser(res.user);
      setAdminExists(true);
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await logoutAdmin();
      setUser(null);
      await verifyAdminExistence();
      setIsLoggingOut(false);
      return { success: true };
    } catch (err) {
      setIsLoggingOut(false);
      const errMsg = err.message || "Failed to sign out from Firebase.";
      setLogoutError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const value = {
    user,
    loading,
    isAdmin: !!user,
    adminExists,
    verifyAdminExistence,
    isLoggingOut,
    logoutError,
    setLogoutError,
    login,
    signup,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

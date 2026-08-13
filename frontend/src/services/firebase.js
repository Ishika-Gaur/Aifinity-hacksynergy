import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";

// Read Firebase Config strictly from Vite environment variables (ALL VITE_ VARS ARE PUBLIC)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Developer-friendly validation for missing/placeholder env vars
const _isPlaceholder = (v) => !v || String(v).startsWith('your_') || String(v).toLowerCase().includes('replace');
if (_isPlaceholder(firebaseConfig.apiKey)) {
  // eslint-disable-next-line no-console
  console.error('\nFirebase config is missing or invalid.\nPlease create a `frontend/.env` (or `.env.local`) with your Firebase credentials. Example in `frontend/.env.example`.\nThen restart the dev server.\n');
  throw new Error('Missing or invalid Firebase API key. See frontend/.env.example for required VITE_FIREBASE_* variables.');
}

// Initialize Firebase App, Auth & Firestore
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const BOOTSTRAP_DOC_REF = doc(db, "system_config", "admin_bootstrap");

/**
 * Authoritative Backend Check:
 * Checks Firestore document system_config/admin_bootstrap to determine
 * whether the initial administrator account has been established.
 */
export async function checkAdminExists() {
  try {
    const snap = await getDoc(BOOTSTRAP_DOC_REF);
    return snap.exists() && snap.data()?.initialized === true;
  } catch (err) {
    return false;
  }
}

/**
 * Authenticate Administrator:
 * Verifies credentials via Firebase Auth AND checks single source of truth in Firestore.
 */
export async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // SINGLE AUTHORITATIVE SOURCE OF TRUTH CHECK:
    // Matches authenticated user UID against system_config/admin_bootstrap.adminUid
    const bootstrapSnap = await getDoc(BOOTSTRAP_DOC_REF);
    const isBootstrapAdmin = bootstrapSnap.exists() && bootstrapSnap.data()?.adminUid === uid;

    if (!isBootstrapAdmin) {
      await signOut(auth);
      return {
        user: null,
        error: "Access denied. Account is not authorized as system administrator.",
      };
    }

    return { user: userCredential.user, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

/**
 * Initial Administrator Signup / Provisioning Notice:
 * Direct client-side bootstrap creation is permanently disabled in Firestore Security Rules.
 * Initial administrator provisioning MUST be performed via the trusted server script (backend/bootstrapAdmin.js).
 */
export async function signupAdmin() {
  return {
    user: null,
    error: "Direct client-side admin creation is disabled for security. Use the trusted server provisioning script (backend/bootstrapAdmin.js) to set up the initial administrator account.",
  };
}

export async function logoutAdmin() {
  await signOut(auth);
}

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

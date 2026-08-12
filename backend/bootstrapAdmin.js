/**
 * Trusted Backend Server Provisioning Script for AIFinity Initial Administrator.
 * 
 * RUN COMMAND (from server / trusted backend environment):
 * node backend/bootstrapAdmin.js <email> <password> [displayName]
 * 
 * PRODUCTION GUARANTEES & SCENARIOS HANDLED:
 * 1. Admin Already Exists: Aborts if system_config/admin_bootstrap is initialized.
 * 2. Unrelated Account Collision Protection: Aborts if an Auth account exists without customClaims.bootstrapPending.
 * 3. Genuine Interrupted Bootstrap Recovery: Reconciles pending account, updates password deterministically, and completes setup.
 * 4. Fresh Provisioning: Creates Auth user with pending marker, writes Firestore lock in transaction, and clears pending marker.
 * 5. Rollback Consistency: Deletes newly created Auth user if Firestore transaction fails.
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export async function provisionInitialAdmin(email, password, displayName = "System Admin") {
  const bootstrapRef = adminDb.doc("system_config/admin_bootstrap");

  // -------------------------------------------------------------
  // Scenario 5: Admin Already Exists Check
  // -------------------------------------------------------------
  const bootstrapSnap = await bootstrapRef.get();
  if (bootstrapSnap.exists && bootstrapSnap.data()?.initialized === true) {
    throw new Error("ADMIN_ALREADY_EXISTS: Initial administrator account has already been established in Firestore.");
  }

  // -------------------------------------------------------------
  // Auth Account Search & Collision Prevention
  // -------------------------------------------------------------
  let userRecord = null;
  try {
    userRecord = await adminAuth.getUserByEmail(email);
  } catch (err) {
    if (err.code !== "auth/user-not-found") {
      throw err;
    }
  }

  let createdNewAuthUser = false;

  if (userRecord) {
    // -------------------------------------------------------------
    // Scenario 3 vs Scenario 4: Distinguish Unrelated Account vs Pending Bootstrap
    // -------------------------------------------------------------
    const claims = userRecord.customClaims || {};
    if (!claims.bootstrapPending) {
      throw new Error(
        `ADMIN_BOOTSTRAP_EMAIL_ALREADY_EXISTS: An existing account with email "${email}" is present in Firebase Auth, but it was not created by an interrupted bootstrap operation. Refusing to promote arbitrary pre-existing user accounts.`
      );
    }

    // Scenario 4: Genuine Interrupted Bootstrap Recovery
    // Update password and display name deterministically so credentials match current execution
    userRecord = await adminAuth.updateUser(userRecord.uid, {
      password,
      displayName,
    });
  } else {
    // -------------------------------------------------------------
    // Scenario 1: Fresh Provisioning
    // -------------------------------------------------------------
    userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: true,
    });
    createdNewAuthUser = true;

    // Set server custom claim marker identifying pending bootstrap creation
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      bootstrapPending: true,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    // -------------------------------------------------------------
    // Atomic Server-Side Firestore Transaction
    // -------------------------------------------------------------
    await adminDb.runTransaction(async (transaction) => {
      const snap = await transaction.get(bootstrapRef);
      if (snap.exists && snap.data()?.initialized === true) {
        throw new Error("ADMIN_ALREADY_EXISTS: Initial administrator account has already been established in Firestore.");
      }

      // Write singleton admin_bootstrap document
      transaction.create(bootstrapRef, {
        initialized: true,
        adminUid: userRecord.uid,
        createdAt: new Date().toISOString(),
      });

      // Write admin user document in Firestore
      const userRef = adminDb.doc(`users/${userRecord.uid}`);
      transaction.set(userRef, {
        uid: userRecord.uid,
        email,
        displayName,
        role: "Admin",
        createdAt: new Date().toISOString(),
      });
    });

    // Remove pending claim marker after successful Firestore write
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      bootstrapPending: false,
      isRootAdmin: true,
    });

    return userRecord;
  } catch (err) {
    // -------------------------------------------------------------
    // Scenario 2: Rollback Handling
    // -------------------------------------------------------------
    if (createdNewAuthUser && userRecord && !err.message.includes("ADMIN_ALREADY_EXISTS")) {
      try {
        await adminAuth.deleteUser(userRecord.uid);
        console.log(`[Rollback] Deleted newly created Auth user (${userRecord.uid}) due to Firestore failure.`);
      } catch (rollbackErr) {
        console.error("[Rollback Error] Failed to delete orphaned Auth user:", rollbackErr);
      }
    }

    throw err;
  }
}

// CLI Execution Handler
if (process.argv[1] && process.argv[1].endsWith("bootstrapAdmin.js")) {
  const email = process.argv[2];
  const password = process.argv[3];
  const displayName = process.argv[4] || "System Admin";

  if (!email || !password) {
    console.error("Usage: node backend/bootstrapAdmin.js <email> <password> [displayName]");
    process.exit(1);
  }

  provisionInitialAdmin(email, password, displayName)
    .then((user) => {
      console.log(`Successfully provisioned initial administrator: ${user.email} (UID: ${user.uid})`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`Admin provisioning failed: ${err.message}`);
      process.exit(1);
    });
}

import readline from "readline";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

function prompt(rl, query, hidden = false) {
  return new Promise((resolve) => {
    if (hidden && process.stdin.isTTY) {
      process.stdout.write(query);
      let input = "";
      process.stdin.setRawMode(true);
      process.stdin.resume();

      const onData = (char) => {
        char = char.toString("utf8");
        if (char === "\n" || char === "\r" || char === "\u0004") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(input.trim());
        } else if (char === "\u0003") {
          process.exit(1);
        } else if (char === "\b" || char === "\x7f") {
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          input += char;
          process.stdout.write("*");
        }
      };

      process.stdin.on("data", onData);
    } else {
      rl.question(query, (answer) => {
        resolve(answer.trim());
      });
    }
  });
}

export async function createAdminInteractive() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aifinity";

  console.log("\n=======================================================");
  console.log(" AIFinity One-Time Administrator Provisioning ");
  console.log("=======================================================\n");

  try {
    await mongoose.connect(mongoUri);
    await User.syncIndexes();

    // Enforce SINGLE ADMIN constraint check
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(`[NOTICE] Admin provisioning aborted: An administrator account already exists (${existingAdmin.email}).`);
      console.log("AIFinity strictly enforces a MAXIMUM of ONE administrator account.");
      await mongoose.disconnect();
      process.exit(0);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const nameInput = await prompt(rl, "Enter Admin Full Name [System Admin]: ");
    const name = nameInput || "System Admin";

    const email = await prompt(rl, "Enter Admin Email: ");
    if (!email || !email.includes("@")) {
      console.error("\n[ERROR] A valid email address is required.");
      rl.close();
      await mongoose.disconnect();
      process.exit(1);
    }

    // Check if email taken by a student
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.error(`\n[ERROR] An account with email "${email}" already exists.`);
      rl.close();
      await mongoose.disconnect();
      process.exit(1);
    }

    const password = await prompt(rl, "Enter Admin Password: ", true);
    if (!password || password.length < 6) {
      console.error("\n[ERROR] Password must be at least 6 characters long.");
      rl.close();
      await mongoose.disconnect();
      process.exit(1);
    }

    const confirmPassword = await prompt(rl, "Confirm Admin Password: ", true);
    if (password !== confirmPassword) {
      console.error("\n[ERROR] Passwords do not match.");
      rl.close();
      await mongoose.disconnect();
      process.exit(1);
    }

    rl.close();

    console.log("\nHashing password securely...");
    const passwordHash = await User.hashPassword(password);

    console.log("Provisioning administrator account in MongoDB...");
    const newAdmin = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "admin",
    });

    console.log("\n=======================================================");
    console.log(` SUCCESS: Administrator created successfully!`);
    console.log(` ID:    ${newAdmin._id}`);
    console.log(` Email: ${newAdmin.email}`);
    console.log(` Role:  ${newAdmin.role}`);
    console.log("=======================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    if (err.code === 11000) {
      console.error("\n[ERROR] Duplicate key constraint violation: An admin account already exists in MongoDB.");
    } else {
      console.error("\n[ERROR] Admin provisioning failed:", err.message);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  createAdminInteractive();
}

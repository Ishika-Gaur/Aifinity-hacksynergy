import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
};

const generateToken = (userId, role) => {
  const jwtSecret = process.env.JWT_SECRET || "fallback_dev_secret_key_change_in_prod";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id: userId, role }, jwtSecret, { expiresIn });
};

const formatUserResponse = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/**
 * Public Student Registration:
 * POST /api/auth/register
 * Force-assigns role: "student". Ignores any client-supplied role.
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    const passwordHash = await User.hashPassword(password);

    // CRITICAL: Force role to 'student'. Never trust client-supplied role.
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "student",
    });

    const token = generateToken(newUser._id, newUser.role);
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      user: formatUserResponse(newUser),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
}

/**
 * Shared Login Endpoint:
 * POST /api/auth/login
 * Used by both students and administrators.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "This account has been suspended." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    res.cookie("token", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: formatUserResponse(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
}

/**
 * Logout Endpoint:
 * POST /api/auth/logout
 * Clears HTTP-only authentication cookie.
 */
export async function logout(req, res) {
  res.clearCookie("token", getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}

/**
 * Current User Endpoint:
 * GET /api/auth/me
 * Returns currently authenticated user details.
 */
export async function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  return res.status(200).json({
    success: true,
    user: formatUserResponse(req.user),
  });
}

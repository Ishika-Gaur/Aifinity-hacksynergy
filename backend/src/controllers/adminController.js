import User from "../models/User.js";

const presentUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLoginAt: user.lastLoginAt || null,
});

export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users: users.map(presentUser) });
}

export async function deleteUser(req, res) {
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, message: "User deleted." });
}

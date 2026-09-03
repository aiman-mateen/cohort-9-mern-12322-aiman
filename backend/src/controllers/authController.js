const { registerUser, loginUser } = require("../services/authService");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    const error = new Error(
      "Name, email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    const error = new Error(
      "Name, email and password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    const error = new Error("Please provide a valid email address");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error(
      "Password must be at least 8 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await registerUser(
    trimmedName,
    normalizedEmail,
    password
  );

  res.status(201).json({
    message: "User registered successfully",
    user,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const result = await loginUser(normalizedEmail, password);

  res.status(200).json({
    message: "Login successful",
    ...result,
  });
};

const getMe = async (req, res, next) => {
  const user = await User.findById(req.user).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    user,
  });
};

const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;

  if (typeof name !== "string" || typeof email !== "string") {
    const error = new Error("Name and email are required");
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail) {
    const error = new Error("Name and email are required");
    error.statusCode = 400;
    throw error;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    const error = new Error("Please provide a valid email address");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: req.user },
  });

  if (existingUser) {
    const error = new Error("Email is already in use");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(req.user);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.name = trimmedName;
  user.email = normalizedEmail;

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    !currentPassword ||
    !newPassword
  ) {
    const error = new Error(
      "Current password and new password are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 8) {
    const error = new Error(
      "New password must be at least 8 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(req.user);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
};

const uploadProfileImage = async (req, res, next) => {
  if (!req.file) {
    const error = new Error("Please select an image");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(req.user);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.profileImage = `/uploads/profile/${req.file.filename}`;

  await user.save();

  res.status(200).json({
    message: "Profile image updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  uploadProfileImage,
};
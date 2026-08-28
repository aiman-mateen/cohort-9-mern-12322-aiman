const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  uploadProfileImage,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

router.put("/password", protect, updatePassword);

router.put(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage
);

module.exports = router;
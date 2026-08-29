const express = require("express");
const multer = require("multer");

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
  (req, res, next) => {
    upload.single("profileImage")(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Image size must be less than 2MB.",
          });
        }

        return res.status(400).json({
          message: error.message,
        });
      }

      if (error) {
        return res.status(400).json({
          message: error.message,
        });
      }

      next();
    });
  },
  uploadProfileImage
);

module.exports = router;
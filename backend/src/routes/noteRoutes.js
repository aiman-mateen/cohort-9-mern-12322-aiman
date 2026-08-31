const express = require("express");
const path = require("path");
const fs = require("fs");

const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNotes,
} = require("../controllers/noteController");

const protect = require("../middleware/authMiddleware");
const uploadNoteImage = require("../middleware/uploadNoteImage");

const router = express.Router();

router.post("/", protect, uploadNoteImage.single("image"), createNote);
router.get("/:id/image", protect, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note || !note.image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const imagePath = path.join(
      __dirname,
      "../..",
      note.image
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});
router.get("/", protect, getNotes);
router.get("/shared", protect, getSharedNotes);
router.post("/:id/share", protect, shareNote);
router.get("/:id", protect, getNote);
router.put("/:id", protect, uploadNoteImage.single("image"), updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
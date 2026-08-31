const express = require("express");
const path = require("path");
const fs = require("fs");
const Note = require("../models/Note");
const asyncHandler = require("../middleware/asyncHandler");

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

router.post(
  "/",
  protect,
  uploadNoteImage.single("image"),
  asyncHandler(createNote)
);
router.get(
  "/:id/image",
  protect,
  asyncHandler(async (req, res) => {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note || !note.image) {
      const error = new Error("Image not found");
      error.statusCode = 404;
      throw error;
    }

    const imagePath = path.join(
      __dirname,
      "../..",
      note.image
    );

    if (!fs.existsSync(imagePath)) {
      const error = new Error("Image not found");
      error.statusCode = 404;
      throw error;
    }

    res.sendFile(imagePath);
  })
);


router.get("/", protect, asyncHandler(getNotes));
router.get("/shared", protect, asyncHandler(getSharedNotes));
router.post("/:id/share", protect, asyncHandler(shareNote));
router.get("/:id", protect, asyncHandler(getNote));
router.put(
  "/:id",
  protect,
  uploadNoteImage.single("image"),
  asyncHandler(updateNote)
);
router.delete("/:id", protect, asyncHandler(deleteNote));

module.exports = router;
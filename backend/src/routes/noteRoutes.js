const express = require("express");

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
router.get("/", protect, getNotes);
router.get("/shared", protect, getSharedNotes);
router.post("/:id/share", protect, shareNote);
router.get("/:id", protect, getNote);
router.put("/:id", protect, uploadNoteImage.single("image"), updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
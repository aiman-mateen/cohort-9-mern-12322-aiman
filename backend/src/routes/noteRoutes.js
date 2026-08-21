const express = require("express");
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createNote);
router.get("/", protect, getNotes);
router.get("/:id", protect, getNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
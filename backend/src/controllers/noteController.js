const Note = require("../models/Note");
const sanitizeHtml = require("sanitize-html");


const sanitizeNoteContent = (content) =>
  sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "blockquote",
      "ul",
      "ol",
      "li",
      "label",
      "input",
      "div",
      "span",
    ],
    allowedAttributes: {
      input: ["type", "checked", "disabled"],
      ul: ["data-type"],
      li: ["data-type", "data-checked"],
    },
  });

  const sanitizeTitle = (title) =>
    sanitizeHtml(title.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });
  
// Create a note
const createNote = async (req, res) => {
  try {
    const { title, content, category, isFavorite } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title: sanitizeTitle(title),
      content: sanitizeNoteContent(content),
      category,
      isFavorite,
      user: req.user,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all notes belonging to logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get one note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { title, content, category, isFavorite } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (title !== undefined) {
      note.title = sanitizeTitle(title);
    }

    if (content !== undefined) {
      note.content = sanitizeNoteContent(content);
    }

    if (category !== undefined) {
      note.category = category;
    }

    if (isFavorite !== undefined) {
      note.isFavorite = isFavorite;
    }

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
const Note = require("../models/Note");
const User = require("../models/User");
const sanitizeHtml = require("sanitize-html");
const fs = require("fs");
const path = require("path");

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
      image: req.file ? `/uploads/notes/${req.file.filename}` : "",
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

    if (req.body.removeImage === "true" && note.image) {
      const imagePath = path.join(
        __dirname,
        "../..",
        note.image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      note.image = "";
    }
    
    if (req.file) {
      note.image = `/uploads/notes/${req.file.filename}`;
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

const shareNote = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Please provide the email address.",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found.",
      });
    }

    const userToShareWith = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!userToShareWith) {
      return res.status(404).json({
        message: "No user found with that email address.",
      });
    }

    if (userToShareWith._id.equals(req.user)) {
      return res.status(400).json({
        message: "You cannot share a note with yourself.",
      });
    }

    const alreadyShared = note.sharedWith.some((userId) =>
      userId.equals(userToShareWith._id)
    );

    if (alreadyShared) {
      return res.status(400).json({
        message: "This note is already shared with this user.",
      });
    }

    note.sharedWith.push(userToShareWith._id);

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate("user", "name email")
      .populate("sharedWith", "name email");

    res.status(200).json({
      message: "Note shared successfully.",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Share note error:", error);

    res.status(500).json({
      message: "Failed to share note.",
    });
  }
};

const getSharedNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      sharedWith: req.user,
    })
      .populate("user", "name email")
      .populate("sharedWith", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("Get shared notes error:", error);

    res.status(500).json({
      message: "Failed to fetch shared notes.",
    });
  }
};


module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
  getSharedNotes,
};
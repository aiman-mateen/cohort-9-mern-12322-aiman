const Note = require("../models/Note");
const User = require("../models/User");
const sanitizeHtml = require("sanitize-html");
const fs = require("fs");
const path = require("path");



   const allowedCategories = [
      "Personal",
      "Work",
      "Study",
      "Ideas",
      "To-Do",
      "Reminders",
    ];

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
const createNote = async (req, res, next) => {
  const { title, content, category, isFavorite } = req.body;

  if (typeof title !== "string" || typeof content !== "string") {
    const error = new Error("Title and content are required");
    error.statusCode = 400;
    throw error;
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    const error = new Error("Title and content are required");
    error.statusCode = 400;
    throw error;
  }

  if (category !== undefined && !allowedCategories.includes(category)) {
    const error = new Error("Invalid category");
    error.statusCode = 400;
    throw error;
  }

  if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
    const error = new Error("isFavorite must be a boolean");
    error.statusCode = 400;
    throw error;
  }

    const note = await Note.create({
      title: sanitizeTitle(trimmedTitle),
      content: sanitizeNoteContent(trimmedContent),
      category,
      isFavorite,
      image: req.file ? `/uploads/notes/${req.file.filename}` : "",
      user: req.user,
    });

  res.status(201).json({
    message: "Note created successfully",
    note,
  });
};

// Get all notes belonging to logged-in user
const getNotes = async (req, res, next) => {
  const notes = await Note.find({ user: req.user }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    notes,
  });
};

// Get one note
const getNote = async (req, res, next) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    note,
  });
};

// Update a note
const updateNote = async (req, res, next) => {
  const { title, content, category, isFavorite } = req.body;

  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      const error = new Error("Title cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    note.title = sanitizeTitle(title);
  }

  if (content !== undefined) {
    if (typeof content !== "string" || !content.trim()) {
      const error = new Error("Content cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    note.content = sanitizeNoteContent(content);
  }

  if (category !== undefined) {
    if (!allowedCategories.includes(category)) {
      const error = new Error("Invalid category");
      error.statusCode = 400;
      throw error;
    }

    note.category = category;
  }

  if (isFavorite !== undefined) {
    if (typeof isFavorite !== "boolean") {
      const error = new Error("isFavorite must be a boolean");
      error.statusCode = 400;
      throw error;
    }

    note.isFavorite = isFavorite;
  }

  const oldImage = note.image;

  if (req.body.removeImage === "true" && note.image) {
    note.image = "";
  }

  if (req.file) {
    note.image = `/uploads/notes/${req.file.filename}`;
  }

  await note.save();

  if (oldImage && (req.file || req.body.removeImage === "true")) {
    const imagePath = path.join(__dirname, "../..", oldImage);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  res.status(200).json({
    message: "Note updated successfully",
    note,
  });
};

// Delete a note
const deleteNote = async (req, res, next) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  await note.deleteOne();

  res.status(200).json({
    message: "Note deleted successfully",
  });
};

const shareNote = async (req, res) => {
  const { email } = req.body;

  if (typeof email !== "string" || !email.trim()) {
    const error = new Error("Please provide the email address.");
    error.statusCode = 400;
    throw error;
  }

const normalizedEmail = email.trim().toLowerCase();

  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user,
  });

  if (!note) {
    const error = new Error("Note not found.");
    error.statusCode = 404;
    throw error;
  }

  const userToShareWith = await User.findOne({
    email: normalizedEmail,
  });

  if (!userToShareWith) {
    const error = new Error("No user found with that email address.");
    error.statusCode = 404;
    throw error;
  }

  if (userToShareWith._id.equals(req.user)) {
    const error = new Error("You cannot share a note with yourself.");
    error.statusCode = 400;
    throw error;
  }

  const alreadyShared = note.sharedWith.some((userId) =>
    userId.equals(userToShareWith._id)
  );

  if (alreadyShared) {
    const error = new Error(
      "This note is already shared with this user."
    );
    error.statusCode = 400;
    throw error;
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
};

const getSharedNotes = async (req, res) => {
  const notes = await Note.find({
    sharedWith: req.user,
  })
    .populate("user", "name email")
    .populate("sharedWith", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    notes,
  });
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
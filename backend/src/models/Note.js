const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

   category: {
      type: String,
      enum: ["Personal", "Work", "Study", "Ideas", "To-Do", "Reminders"],
      default: "Personal",
      trim: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
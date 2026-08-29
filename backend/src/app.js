const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");
const fs = require("fs");
const uploadsPath = path.join(__dirname, "../uploads");
const profileUploadsPath = path.join(uploadsPath, "profile");
const noteUploadsPath = path.join(uploadsPath, "notes");


fs.mkdirSync(profileUploadsPath, { recursive: true });
fs.mkdirSync(noteUploadsPath, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  "/uploads/profile",
  express.static(profileUploadsPath)
);

app.get("/", (req, res) => {
  res.json({ message: "Notes App API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);


module.exports = app;
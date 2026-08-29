const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");
const fs = require("fs");
const uploadsPath = path.join(__dirname, "../uploads");
const profileUploadsPath = path.join(uploadsPath, "profile");
const noteUploadsPath = path.join(uploadsPath, "notes");
const pinoHttp = require("pino-http");
const logger = require("./config/logger");
const errorHandler = require("./middleware/errorMiddleware");

fs.mkdirSync(profileUploadsPath, { recursive: true });
fs.mkdirSync(noteUploadsPath, { recursive: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

app.use(
  "/uploads/profile",
  express.static(profileUploadsPath)
);

app.get("/", (req, res) => {
  res.json({ message: "Notes App API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);



// Centralized error handler — must come after all routes
app.use(errorHandler);

module.exports = app;
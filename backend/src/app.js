const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Notes App API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

module.exports = app;
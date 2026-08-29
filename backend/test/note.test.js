require("dotenv").config();

const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");

const app = require("../src/app");
const User = require("../src/models/User");
const Note = require("../src/models/Note");

describe("Notes Integration Tests", function () {
  this.timeout(10000);

  let token;
  let userId;
  let noteId;

  const testEmail = "noteintegration@example.com";
  const testPassword = "TestPassword123";

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);

    // Remove old test data if it exists
    await User.deleteMany({
      email: testEmail,
    });

    // Register test user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Notes Integration User",
        email: testEmail,
        password: testPassword,
      });

    userId = registerResponse.body.user.id;

    // Login to obtain JWT
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    token = loginResponse.body.token;
  });

  after(async function () {
    // Delete test notes
    await Note.deleteMany({
      user: userId,
    });

    // Delete test user
    await User.deleteMany({
      email: testEmail,
    });

    await mongoose.connection.close();
  });

  describe("POST /api/notes", function () {
    it("should create a new note successfully", async function () {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Integration Test Note",
          content: "<p>This is a test note.</p>",
          category: "Study",
          isFavorite: false,
        });

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(
        "Note created successfully"
      );

      expect(response.body.note).to.have.property("_id");
      expect(response.body.note.title).to.equal(
        "Integration Test Note"
      );
      expect(response.body.note.category).to.equal("Study");
      expect(response.body.note.isFavorite).to.equal(false);

      noteId = response.body.note._id;
    });

    it("should reject creating a note without authentication", async function () {
      const response = await request(app)
        .post("/api/notes")
        .send({
          title: "Unauthorized Note",
          content: "<p>This should fail.</p>",
        });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal(
        "Not authorized, token missing"
      );
    });

    it("should reject a note with missing title", async function () {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          content: "<p>Content without title.</p>",
        });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal(
        "Title and content are required"
      );
    });

    it("should reject a note with an invalid category", async function () {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Invalid Category Note",
          content: "<p>Some content.</p>",
          category: "InvalidCategory",
        });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal(
        "Invalid category"
      );
    });
  });

  describe("GET /api/notes", function () {
    it("should return the authenticated user's notes", async function () {
      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("notes");
      expect(response.body.notes).to.be.an("array");

      const createdNote = response.body.notes.find(
        (note) => note._id === noteId
      );

      expect(createdNote).to.exist;
      expect(createdNote.title).to.equal(
        "Integration Test Note"
      );
    });

    it("should reject getting notes without authentication", async function () {
      const response = await request(app)
        .get("/api/notes");

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal(
        "Not authorized, token missing"
      );
    });
  });

  describe("GET /api/notes/:id", function () {
    it("should return a single note successfully", async function () {
      const response = await request(app)
        .get(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.note._id).to.equal(noteId);
      expect(response.body.note.title).to.equal(
        "Integration Test Note"
      );
    });

    it("should return 404 for a non-existent note", async function () {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal(
        "Note not found"
      );
    });
  });

  describe("PUT /api/notes/:id", function () {
    it("should update a note successfully", async function () {
      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Integration Test Note",
          content: "<p>Updated note content.</p>",
          category: "Work",
          isFavorite: true,
        });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        "Note updated successfully"
      );

      expect(response.body.note.title).to.equal(
        "Updated Integration Test Note"
      );
      expect(response.body.note.category).to.equal("Work");
      expect(response.body.note.isFavorite).to.equal(true);
    });

    it("should reject updating a non-existent note", async function () {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/notes/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Note",
        });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal(
        "Note not found"
      );
    });
  });

  describe("DELETE /api/notes/:id", function () {
    it("should delete a note successfully", async function () {
      const response = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal(
        "Note deleted successfully"
      );

      // Confirm that the note no longer exists
      const deletedNote = await Note.findById(noteId);

      expect(deletedNote).to.be.null;
    });

    it("should return 404 when deleting a non-existent note", async function () {
      const response = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal(
        "Note not found"
      );
    });
  });
});
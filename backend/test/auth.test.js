require("dotenv").config();

const request = require("supertest");
const { expect } = require("chai");
const mongoose = require("mongoose");

const app = require("../src/app");
const User = require("../src/models/User");

describe("Authentication Integration Tests", function () {
  this.timeout(10000);

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI);
  });

  after(async function () {
    await User.deleteMany({
      email: "integrationtest@example.com",
    });

    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", function () {
    it("should register a new user successfully", async function () {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Integration Test User",
          email: "integrationtest@example.com",
          password: "TestPassword123",
        });

      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal(
        "User registered successfully"
      );
      expect(response.body.user).to.have.property("id");
      expect(response.body.user.email).to.equal(
        "integrationtest@example.com"
      );
    });

    it("should reject registration with an invalid email", async function () {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "TestPassword123",
        });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal(
        "Please provide a valid email address"
      );
    });
  });

  describe("POST /api/auth/login", function () {
    it("should login successfully with valid credentials", async function () {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "integrationtest@example.com",
          password: "TestPassword123",
        });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Login successful");
      expect(response.body).to.have.property("token");
      expect(response.body.user.email).to.equal(
        "integrationtest@example.com"
      );
    });

    it("should reject invalid credentials", async function () {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "integrationtest@example.com",
          password: "WrongPassword123",
        });

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal(
        "Invalid email or password"
      );
    });
  });

  describe("GET /api/auth/me", function () {
    let token;

    before(async function () {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "integrationtest@example.com",
          password: "TestPassword123",
        });

      token = response.body.token;
    });

    it("should return the authenticated user's profile", async function () {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.user.email).to.equal(
        "integrationtest@example.com"
      );
      expect(response.body.user).to.not.have.property("password");
    });

    it("should reject a request without a token", async function () {
      const response = await request(app)
        .get("/api/auth/me");

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal(
        "Not authorized, token missing"
      );
    });
  });
});

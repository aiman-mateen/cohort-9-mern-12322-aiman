# Jot — API Documentation

## Overview

Jot provides a RESTful backend API built with Node.js, Express, and MongoDB.

The API handles:

* User authentication
* User profiles
* Password management
* Notes CRUD operations
* Note sharing
* Note and profile image support
* User-specific authorization

### Base URL

```text
http://localhost:5000/api
```

---

## Authentication

Authentication uses **JSON Web Tokens (JWT)**.

Protected endpoints require a valid JWT in the request header:

```text
Authorization: Bearer <token>
```

### Register

**POST** `/auth/register`

Creates a new user account.

### Login

**POST** `/auth/login`

Authenticates a user and returns an authentication token.

### Get Current User

**GET** `/auth/me`

Returns the currently authenticated user's information.

**Authentication:** Required.

### Update Profile

**PUT** `/auth/profile`

Updates the authenticated user's profile information.

**Authentication:** Required.

### Update Password

**PUT** `/auth/password`

Updates the authenticated user's password.

**Authentication:** Required.

### Upload Profile Image

**POST** `/auth/profile/image`

Uploads or updates the authenticated user's profile image.

**Authentication:** Required.

---

# Notes API

All note endpoints require authentication unless otherwise specified.

## Create Note

**POST** `/notes`

Creates a new note for the authenticated user.

**Authentication:** Required.

Example request:

```json
{
  "title": "My Note",
  "content": "This is my note.",
  "category": "Personal"
}
```

---

## Get User Notes

**GET** `/notes`

Returns notes belonging to the authenticated user.

**Authentication:** Required.

The endpoint supports searching and filtering notes.

---

## Get Single Note

**GET** `/notes/:id`

Returns a specific note belonging to the authenticated user.

**Authentication:** Required.

---

## Update Note

**PUT** `/notes/:id`

Updates an existing note.

**Authentication:** Required.

Example request:

```json
{
  "title": "Updated Note",
  "content": "Updated note content.",
  "category": "Work"
}
```

---

## Delete Note

**DELETE** `/notes/:id`

Deletes a note belonging to the authenticated user.

**Authentication:** Required.

---

## Share Note

**POST** `/notes/:id/share`

Shares a note with another registered user.

**Authentication:** Required.

---

## Get Shared Notes

**GET** `/notes/shared`

Returns notes that have been shared with the authenticated user.

**Authentication:** Required.

---

## Get Note Image

**GET** `/notes/:id/image`

Returns the image associated with a note.

**Authentication:** Required.

---

# Search and Filtering

The notes API supports searching and filtering from the dashboard.

Users can search notes using their:

* Title
* Content

Notes can also be filtered by category.

Search and filtering are applied to the authenticated user's notes.

---

# Authorization

Jot uses JWT-based authentication and authorization.

Protected requests must include a valid token.

Users can only access and modify resources they are authorized to access. This prevents users from accessing other users' private notes.

---

# Error Handling

The API returns appropriate HTTP status codes and JSON error messages.

Common status codes include:

| Status Code | Meaning                       |
| ----------- | ----------------------------- |
| `200`       | Request successful            |
| `201`       | Resource created successfully |
| `400`       | Bad request                   |
| `401`       | Unauthorized                  |
| `403`       | Forbidden                     |
| `404`       | Resource not found            |
| `500`       | Internal server error         |

Example error response:

```json
{
  "message": "Not authorized, invalid or expired token"
}
```

---

# Image Uploads

Jot supports image uploads for:

* Note images
* Profile images

Supported formats:

* JPG
* JPEG
* PNG
* WEBP

Maximum file size:

```text
2 MB
```

Invalid file types or files exceeding the size limit are rejected by the backend.

---

# Security

The API implements several security measures:

* JWT authentication
* Protected routes
* User-specific authorization
* Password hashing
* Environment variables for sensitive configuration
* Input validation
* HTML sanitization for note content
* Image type validation
* Image size restrictions
* Disabled Express `x-powered-by` header

---

# API Testing

The API can be tested using tools such as Postman.

For protected endpoints:

1. Register a user.
2. Log in to obtain a JWT token.
3. Add the token to the request.
4. Use the following authorization format:

```text
Bearer <your-jwt-token>
```

The backend automated tests are implemented using **Mocha and Chai**.

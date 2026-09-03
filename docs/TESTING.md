# Jot — Testing Documentation

## Overview

Jot uses automated testing to verify the functionality of both the backend API and the React frontend.

The project uses:

* **Mocha** for backend testing
* **Chai** for backend assertions
* **Jest** for frontend testing
* **React Testing Library** for testing React components and pages

---

## Backend Testing

Backend tests are located in:

```text
backend/test/
```

The backend tests cover important authentication and notes functionality.

### Backend Test Files

```text
backend/test/
├── auth.test.js
└── note.test.js
```

### Run Backend Tests

From the `backend` directory:

```bash
npx mocha
```

The tests verify backend behavior including authentication and note-related operations.

---

## Frontend Testing

Frontend tests use Jest together with React Testing Library.

Tests are located alongside the components and pages they test.

### Tested Components

The automated test suite includes tests for:

* Delete confirmation modal
* New note modal
* Note card
* Note card skeleton
* Share note modal
* Sidebar
* Toast notifications
* Topbar

### Tested Pages

Tests are also implemented for:

* Dashboard
* Login
* Profile
* Register
* Settings
* Shared Notes

### Tested Services

The test suite includes tests for:

* Authentication service
* Notes service

---

## Frontend Test Setup

Jest is configured to use a **jsdom** environment so that React components can be tested in a browser-like environment.

The shared Jest setup is located at:

```text
frontend/src/setupTests.js
```

---

## Run Frontend Tests

From the `frontend` directory:

```bash
npm test
```

---

## Testing Approach

The automated tests focus on verifying:

* Component rendering
* User interactions
* Form behavior
* Authentication-related functionality
* Note operations
* Modal behavior
* Navigation and UI interactions
* Service behavior
* API-related frontend logic

React Testing Library is used to test components from the user's perspective rather than testing implementation details.

---

## Manual Testing

In addition to automated tests, the application can be manually tested through the running frontend and backend.

Important manual test flows include:

1. Register a new user.
2. Log in with valid credentials.
3. Create a note.
4. Edit a note.
5. Mark a note as favorite.
6. Search and filter notes.
7. Share a note with another user.
8. View shared notes.
9. Upload a note image.
10. Update profile information.
11. Update the password.
12. Log out.
13. Verify protected routes reject unauthorized requests.

---

## Test Environment

Automated tests should use test-specific configuration and should not expose production credentials or secrets.

Sensitive environment files are excluded from version control.

---

## Test Result

The automated testing implementation was completed as part of the project's testing phase and integrated into the main development branch.

Backend tests use **Mocha and Chai**, while frontend tests use **Jest and React Testing Library**.

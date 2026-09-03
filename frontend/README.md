# Jot — MERN Notes Application

Jot is a full-stack notes management application built with the MERN stack. It allows authenticated users to create, organize, edit, search, filter, share, and manage their personal notes through a responsive React interface.

The project was developed as part of the **10Pearls Shine Internship Program — Cohort 9**.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes and authenticated API requests
* User-specific notes
* Logout functionality
* Password update
* Profile management

### Notes Management

* Create notes
* View notes
* Edit notes
* Delete notes
* Favorite notes
* Categorize notes
* Rich-text note content
* User-specific note access

### Search & Filtering

* Search notes by content/title
* Filter notes by category
* Filter and organize notes for easier navigation

### Note Sharing

* Share notes with other users
* View notes shared with the authenticated user

### Image Support

* Upload images for notes
* Profile image upload
* Supported image formats: JPG, JPEG, PNG, and WEBP
* Maximum upload size: 2 MB

### User Interface

* Responsive React interface
* Dashboard
* Sidebar navigation
* Profile page
* Settings page
* Shared Notes page
* Toast notifications
* Confirmation dialogs
* Loading states and skeleton components
* Mobile navigation

## Technology Stack

### Frontend

* React
* Vite
* React Router
* JavaScript
* CSS
* Lucide React
* Jest
* React Testing Library

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* Multer
* Pino
* pino-http
* sanitize-html
* Mocha
* Chai

### Code Quality & Development Tools

* Git
* GitHub
* SonarQube
* CodeRabbit
* ESLint

## Project Structure

```text
cohort-9-mern-12322-aiman/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   │
│   ├── test/
│   │   ├── auth.test.js
│   │   └── note.test.js
│   │
│   ├── uploads/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── setupTests.js
│   │
│   ├── jest.config.cjs
│   ├── babel.config.cjs
│   └── package.json
│
├── docs/
│   └── sonarqube/
│
└── README.md
```

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB or access to a MongoDB database
* Git

## Installation

Clone the repository:

```bash
git clone https://github.com/aiman-mateen/cohort-9-mern-12322-aiman.git
cd cohort-9-mern-12322-aiman
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Running the Application

1. Start MongoDB.
2. Start the backend server.
3. Start the React frontend.
4. Open the frontend URL in a browser.
5. Register a new account or log in.
6. Create and manage notes from the dashboard.

## Testing

The project includes automated tests for both the backend and frontend.

### Backend Tests

Backend tests use **Mocha and Chai**.

From the `backend` directory:

```bash
npx mocha
```

Backend tests cover authentication and note-related functionality.

### Frontend Tests

Frontend tests use **Jest and React Testing Library**.

From the `frontend` directory:

```bash
npm test
```

The frontend test suite covers components, pages, and service functionality.

## Logging

The backend uses **Pino** and **pino-http** for application logging.

Logging is used to provide information about server requests and application activity while keeping the logging system lightweight and suitable for a Node.js application.

## Security

The application implements several security-related practices:

* JWT authentication
* Protected API routes
* User-specific authorization
* Password hashing
* Environment variables for secrets
* Request validation
* HTML sanitization for note content
* File type validation for uploads
* File size restrictions
* Disabled Express `x-powered-by` header

## SonarQube

SonarQube was used to analyze the project for code quality, reliability, maintainability, and other static-analysis issues.

The project was configured with the key:

```text
notes-app-jot
```

SonarQube analysis was performed against:

```text
frontend/src
backend
```

Screenshots and analysis evidence are available in:

```text
docs/sonarqube/
```

## Optional Features Implemented

The assignment provides optional features. Jot implements:

* **Search and Filter**

Other optional features such as real-time Socket.IO updates and import/export functionality were not required for the core application.

## Git Workflow

The project was developed using Git feature branches and pull requests.

Major development areas were organized into separate pull requests, including:

* Core application functionality
* Enhanced Notes
* User Experience and Image Support
* Automated Testing
* SonarQube and Code Quality

Code reviews were performed during development using automated review tooling.

## API

The backend exposes RESTful API endpoints for:

* Authentication
* User/profile management
* Notes CRUD operations
* Note sharing
* Shared notes
* Note image handling
* Profile image handling

See the project documentation for detailed endpoint information.

## Author

**Aiman Mateen**

Software Engineering
Mehran University of Engineering and Technology (MUET)

## Internship

Developed as part of the:

**10Pearls Shine Internship Program — Cohort 9**

**Technology Track:** MERN Stack

# Jot — Setup Guide

## Prerequisites

Install the following before running the application:

* Node.js and npm
* MongoDB
* Git

## Clone the Repository

```bash
git clone https://github.com/aiman-mateen/cohort-9-mern-12322-aiman.git
cd cohort-9-mern-12322-aiman
```

## Backend Setup

Navigate to the backend:

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

The API will be available at:

```text
http://localhost:5000
```

## Frontend Setup

Open a second terminal and navigate to the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Running the Application

1. Make sure MongoDB is running.
2. Start the backend server.
3. Start the frontend development server.
4. Open `http://localhost:5173` in your browser.
5. Register or log in to an account.
6. Start creating and managing notes.

## Environment Variables

Never commit real secrets or credentials to Git.

The backend `.env` file should remain local and should be excluded from version control.

For testing, use the separate test environment configuration provided with the automated testing setup.

## Upload Configuration

The application supports image uploads for notes and profile images.

Supported image formats:

* JPG
* JPEG
* PNG
* WEBP

Maximum file size:

```text
2 MB
```

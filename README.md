# demo-rest-api
REST API from Udemy Course

This project is a **demo REST API** for managing users and events, built with Node.js, Express, and SQLite. It supports authentication, image uploads, and full CRUD functionality for events, and is designed to demonstrate modern backend development patterns in a clear way.

It was developed as part of the Udemy Course "AI For Developers with GitHub Copilot, Cursor AI, & ChatGPT", with a focus on using AI tools to accelerate and improve backend development workflows.

## Background: What does this API model?

The API models a simple event platform, where:
- Users can signup and log in
- Authenticated users can create, edit, and delete events
- Events can include uploaded images
- Users can register for events
- Protected routes require JWT-based authentication

From a backend perspective, the project demonstrates how to structure a real-world REST API with authentication, database relations, and middleware.

## What this project does

- Implements a RESTful API using **Express**
- Uses **JWT authentication** for protected routes
- Hashes passwords securely with **bcrypt**
- Stores data in a **SQLite database** with foreigh-key constraints
- Supports **CRUD operations** for events
- Handles **image uploads** using Multer
- Separates concerns using routes, controllers, models, and utilities
- Automatically initializes the database schema on server start

## Tech Stack

- **Node.js** (ES Modules)
- **Express 5**
- **SQLite** (`better-sqlite3`)
- **JSON Web Tokens (JWT)**
- **bcrypt** for password hashing
- **Multer** for file uploads
- **CORS** for cross-origin requests

## Requirements

- Node.js **18+**
- npm

## How to run

Clone the repository:
<pre>
  git clone https://github.com/stellafruijtier/demo-rest-api.git
  cd demo-rest-api/demo-rest-api-udemy
</pre>

Install dependencies:
<pre>
  npm install
</pre>

Start the server:
<pre>
  npm run dev
</pre>

The API will run at:
<pre>
  http://localhost:3000
</pre>

The SQLite database (`database.sqlite`) is created automatically on first run.

## Authentication Flow

- Users sign up and log in via `/api/users`
- On successful login, a **JWT token** is returned
- Protected routes require a header:
<pre>
  Authorization: Bearer: your_token
</pre>

The token contains the user's `id` and `email` and expires after a configurable duration.

## Main API Endpoints

### Users
- `POST /api/users/signup` - Create a new user
- `POST /api/users/login` - Log in and receive JWT

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (authenticated, image required)
- `PUT /api/events/:id` - Update an event (authenticated)
- `DELETE /api/events/:id` - Delete event (authenticated)
- `POST /api/events/:id/register` - Register for an event (authenticated)

## Image Uploads
- Images are uploaded using multipart/form-data
- Stored in `public/images/`
- Only image files are accepted
- Uploaded images are served statically by the API





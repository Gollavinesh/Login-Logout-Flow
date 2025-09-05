# React + Node.js + SQLite Auth (Sessions)

A minimal full-stack example implementing **Register**, **Login**, **Session-based auth via cookies**, and **Logout**.
Passwords are hashed with **bcrypt**. Sessions are stored in SQLite via **connect-sqlite3**.

## Tech
- Frontend: React + Vite + React Router
- Backend: Node.js (Express), express-session, connect-sqlite3, bcrypt
- Database: SQLite (for users + sessions)

## Prereqs
- Node.js 18+ and npm
- Git (to push to GitHub)

## Quick Start (Two Terminals)
### 1) Backend
```bash
cd backend
npm install
npm run dev
# Server on http://localhost:4000
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
# App on http://localhost:5173
```

### Environment
- Backend `.env` (already provided):
  ```env
  PORT=4000
  SESSION_SECRET=supersecret_change_me
  ORIGIN=http://localhost:5173
  NODE_ENV=development
  ```
- Frontend `.env` (already provided):
  ```env
  VITE_API_URL=http://localhost:4000
  ```

## Features
- **Register** (`POST /api/auth/register`): Creates a user and starts a session
- **Login** (`POST /api/auth/login`): Authenticates and starts a session
- **Me** (`GET /api/auth/me`): Returns current session user
- **Logout** (`POST /api/auth/logout`): Destroys the session and clears the cookie
- **Protected** example (`GET /api/protected`): Requires a valid session

## Project Structure
```
backend/
  src/
    index.js        # Express app, sessions, CORS
    db.js           # SQLite init
    routes/auth.js  # Auth routes
  data/             # SQLite files (created at runtime)
  .env
  package.json
  DATABASE.md
frontend/
  src/
    App.jsx, auth.jsx, pages/*
    main.jsx
  index.html
  .env
  package.json
  vite.config.js
```

## Notes
- Cookies are set with `httpOnly` and `sameSite=lax` in dev. For production across domains, set `NODE_ENV=production` and ensure HTTPS; cookie will use `sameSite=none; secure`.
- CORS is configured to allow credentials from `ORIGIN` (default `http://localhost:5173`). Update `.env` if your frontend runs elsewhere.

## Push to GitHub
```bash
# in project root
git init
git add .
git commit -m "Auth demo: register/login/logout with sessions"
gh repo create react-node-sqlite-auth --public --source=. --remote=origin
git push -u origin main
```
(If you don't use GitHub CLI, create a repo on GitHub manually, copy its URL, then:)
```bash
git remote add origin <your_repo_url>
git branch -M main
git push -u origin main
```

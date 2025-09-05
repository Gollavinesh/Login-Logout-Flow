import express from "express";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import { ensureDb } from "./db.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

ensureDb(); // create tables if needed

const SQLiteStore = SQLiteStoreFactory(session);

app.use(cors({
  origin: ORIGIN,
  credentials: true
}));

app.use(express.json());

app.use(session({
  store: new SQLiteStore({
    db: "sessions.sqlite",
    dir: path.join(__dirname, "..", "data"),
  }),
  name: "sid",
  secret: process.env.SESSION_SECRET || "devsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, userId: req.session.userId || null });
});

app.use("/api/auth", authRouter);

// Example protected route
app.get("/api/protected", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });
  res.json({ message: "Secret data for user " + req.session.userId });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

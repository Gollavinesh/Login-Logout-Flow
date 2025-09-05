import { getDb } from "../db.js";
import bcrypt from "bcrypt";
import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  const db = getDb();
  db.get("SELECT id FROM users WHERE email = ?", [email], async (err, row) => {
    if (err) { db.close(); return res.status(500).json({ error: "Database error" }); }
    if (row) { db.close(); return res.status(409).json({ error: "Email already in use" }); }
    try {
      const hash = await bcrypt.hash(password, 10);
      db.run("INSERT INTO users (email, password_hash) VALUES (?, ?)", [email, hash], function(insertErr) {
        db.close();
        if (insertErr) return res.status(500).json({ error: "Insert failed" });
        req.session.userId = this.lastID;
        res.status(201).json({ id: this.lastID, email });
      });
    } catch (e) {
      db.close();
      res.status(500).json({ error: "Hashing failed" });
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  const db = getDb();
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) { db.close(); return res.status(500).json({ error: "Database error" }); }
    if (!user) { db.close(); return res.status(401).json({ error: "Invalid credentials" }); }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) { db.close(); return res.status(401).json({ error: "Invalid credentials" }); }
    req.session.userId = user.id;
    db.close();
    res.json({ id: user.id, email: user.email });
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("sid");
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const db = getDb();
  db.get("SELECT id, email FROM users WHERE id = ?", [req.session.userId], (err, row) => {
    db.close();
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ user: row || null });
  });
});

export default router;

// src/routes/auth.routes.js
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * -> Vérifie l'utilisateur et renvoie un JWT
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "missing_fields" });

  const { rows } = await query(
    "SELECT id, email, password_hash, role FROM core.users WHERE email = $1",
    [email]
  );
  const u = rows[0];
  if (!u) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  const token = jwt.sign(
    { id: u.id, email: u.email, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  // réponse simple et utile pour le front
  res.json({
    token,
    user: { id: u.id, email: u.email, role: u.role },
    expiresIn,
  });
});

export default router;

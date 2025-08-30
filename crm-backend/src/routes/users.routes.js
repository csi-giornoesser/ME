import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import { authRequired, requireRole } from "../middlewares/auth.js";

const router = Router();

/**
 * POST /api/users
 * Body: { email, password, role? }
 * - Protégé: admin seulement
 * - Hash automatique du mot de passe
 */
router.post("/", authRequired, requireRole("admin"), async (req, res) => {
  const { email, password, role = "user" } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "missing_fields" });
  if (password.length < 8) return res.status(400).json({ error: "weak_password" });

  const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
  const hash = await bcrypt.hash(password, rounds);

  try {
    const { rows } = await query(
      `INSERT INTO core.users (email, password_hash, role)
       VALUES ($1, $2, $3)
       RETURNING id, email, role, created_at`,
      [email, hash, role]
    );
    return res.status(201).json(rows[0]);
  } catch (e) {
    // 23505 = violation contrainte unique (email déjà pris)
    if (e.code === "23505") return res.status(409).json({ error: "email_exists" });
    console.error("POST /users error", e);
    return res.status(500).json({ error: "server_error" });
  }
});

/**
 * PATCH /api/users/:id/password
 * Body (admin): { newPassword }
 * Body (utilisateur lui-même): { oldPassword, newPassword }
 * - Admin peut reset sans oldPassword
 * - Un user peut changer SON propre mot de passe avec oldPassword
 */
router.patch("/:id/password", authRequired, async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "bad_id" });
  }

  const isAdmin = req.user?.role === "admin";
  const isSelf = req.user?.id === userId;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ error: "forbidden" });
  }

  const { oldPassword, newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "weak_password" });
  }

  // Récupérer le hash actuel
  const { rows } = await query(
    `SELECT id, password_hash FROM core.users WHERE id = $1`,
    [userId]
  );
  const u = rows[0];
  if (!u) return res.status(404).json({ error: "not_found" });

  // Si ce n'est pas un admin, vérifier l'ancien mot de passe
  if (!isAdmin) {
    const ok = await bcrypt.compare(oldPassword || "", u.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_old_password" });
  }

  const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
  const newHash = await bcrypt.hash(newPassword, rounds);

  await query(
    `UPDATE core.users SET password_hash = $1 WHERE id = $2`,
    [newHash, userId]
  );

  return res.status(204).send(); // No Content
});

export default router;

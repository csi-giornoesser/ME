import { pool } from "../config/db.js";

// POST /api/notifications
export async function createNotification(req, res, next) {
  try {
    const { type, client_id, dossier_id, canal = "email", scheduled_for, message } = req.body || {};

    if (!type || !client_id || !dossier_id || !scheduled_for) {
      return res.status(400).json({ error: "type, client_id, dossier_id, scheduled_for requis" });
    }

    // Id compatible avec vos sélections (cf. UNION avec 'sent-...')
    const id = `notif-${Date.now()}`;

    const c = await pool.connect();
    try {
      await c.query(
        `INSERT INTO core.notifications_queue
           (id, type, client_id, dossier_id, canal, scheduled_for, message)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [id, type, client_id, dossier_id, canal, scheduled_for, message]
      );
      return res.status(201).json({ id });
    } finally {
      c.release();
    }
  } catch (e) {
    console.error("Erreur API notifications (POST):", e);
    next(e);
  }
}

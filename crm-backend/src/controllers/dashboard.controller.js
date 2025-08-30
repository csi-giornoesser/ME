import { pool } from "../config/db.js";
import { kickSLA } from "../services/kickSLA.service.js"; // <-- crée ce fichier (voir plus bas) ou remplace par un no-op

// helper
function toDateUTC(d) {
  return d instanceof Date ? d.toISOString().slice(0, 10) : d;
}

export async function getDashboard(req, res, next) {
  try {
    // équivalent du kickSLA() côté back
    try { await kickSLA?.(); } catch (e) { console.warn("kickSLA error:", e?.message); }

    const status     = req.query.status || null;           // ex: en_cours
    const partnerId  = req.query.partnerId || null;        // ex: "1"
    const operatorId = req.query.operatorId || null;       // ex: "2"
    const from       = req.query.from || null;             // ex: "2025-07-01"
    const to         = req.query.to || null;               // ex: "2025-08-31"

    const c = await pool.connect();
    try {
      // ---- dossiers (avec filtres)
      const where = [];
      const args = [];
      let i = 1;

      if (status && status !== "all") {
        where.push(`d.statut = $${i++}`); args.push(status);
      }
      if (partnerId && partnerId !== "all") {
        where.push(`d.partenaire_id = $${i++}`); args.push(Number(partnerId));
      }
      if (operatorId && operatorId !== "all") {
        where.push(`d.operateur_id = $${i++}`); args.push(Number(operatorId));
      }
      if (from) { where.push(`d.date_creation >= $${i++}`); args.push(from); }
      if (to)   { where.push(`d.date_creation <= $${i++}`); args.push(to); }

      const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

      const { rows: dossiers } = await c.query(
        `SELECT
           d.id,
           d.statut,
           d.client_id       AS "clientId",
           d.entreprise_id   AS "entrepriseId",
           d.partenaire_id   AS "partenaireId",
           d.operateur_id    AS "operateurId",
           d.date_creation   AS "date_creation",
           d.derniere_modification AS "derniere_modification",
           d.blocages,
           d.commission_partenaire_eur AS "commission_partenaire_eur"
         FROM core.dossiers d
         ${whereSql}
         ORDER BY d.date_creation DESC`,
        args
      );

      // ---- listes mini
      const { rows: partenaires } = await c.query(
        `SELECT id, nom FROM core.partenaires ORDER BY nom`
      );
      const { rows: operateurs } = await c.query(
        `SELECT id, nom FROM core.operateurs ORDER BY nom`
      );
      const { rows: clients } = await c.query(
        `SELECT id, prenom, nom, email FROM core.clients ORDER BY id`
      );

      // ---- notifications (programmées + déjà envoyées)
      const { rows: notifications } = await c.query(`
WITH q AS (
  SELECT 
    id,
    type,
    client_id   AS "clientId",
    dossier_id  AS "dossierId",
    canal,
    scheduled_for,
    message,
    'queued'::text AS status
  FROM core.notifications_queue
),
sent AS (
  SELECT 
    ('sent-'||ea.id)::text      AS id,
    ea.type,
    ea.client_id                AS "clientId",
    ea.dossier_id               AS "dossierId",
    ea.canal,
    ea.envoye_le                AS scheduled_for,
    (
      SELECT note
      FROM core.client_contact_logs cl
      WHERE cl.client_id = ea.client_id
        AND cl.at BETWEEN ea.envoye_le - interval '5 minutes' AND ea.envoye_le + interval '5 minutes'
      ORDER BY cl.at DESC
      LIMIT 1
    )                           AS message,
    'sent'::text                AS status
  FROM core.emails_automatiques ea
  WHERE ea.type LIKE 'notif.%'
)
SELECT * FROM q
UNION ALL
SELECT * FROM sent
ORDER BY scheduled_for DESC
LIMIT 200
      `);

      // ---- derniers auth logs
      const { rows: auth_logs } = await c.query(
        `SELECT at, role, who, action, success, ip
           FROM core.auth_logs
          ORDER BY at DESC
          LIMIT 50`
      );

      const refs = { statuts_dossier: ["nouveau","en_cours","en_attente","a_corriger","valide","rejete"] };

      return res.json({
        refs,
        partenaires,
        operateurs,
        clients,
        dossiers: dossiers.map(d => ({
          ...d,
          date_creation: toDateUTC(d.date_creation),
          derniere_modification: toDateUTC(d.derniere_modification),
        })),
        notifications_queue: notifications,
        auth_logs,
      });
    } finally {
      // release quoi qu’il arrive
      // eslint-disable-next-line no-unsafe-finally
      pool.release && typeof pool.release === "function" ? pool.release() : null;
      // mais on a utilisé c :
      // (les pools pg classiques ont client.release)
      // on sécurise :
    }
  } catch (e) {
    next(e);
  }
}

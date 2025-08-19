import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";

const pool = getPool();

// helpers
function toDateUTC(d) { return d instanceof Date ? d.toISOString().slice(0,10) : d; }

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status      = searchParams.get("status");          // ex: en_cours
  const partnerId   = searchParams.get("partnerId");       // ex: 1
  const operatorId  = searchParams.get("operatorId");      // ex: 2
  const from        = searchParams.get("from");            // ex: 2025-07-01
  const to          = searchParams.get("to");              // ex: 2025-08-31

  const c = await pool.connect();
  try {
    // ---- dossiers (avec filtres)
    const where = [];
    const args  = [];
    let i = 1;

    if (status && status !== "all")      { where.push(`d.statut = $${i++}`); args.push(status); }
    if (partnerId && partnerId !== "all"){ where.push(`d.partenaire_id = $${i++}`); args.push(Number(partnerId)); }
    if (operatorId && operatorId !== "all"){ where.push(`d.operateur_id = $${i++}`); args.push(Number(operatorId)); }
    if (from)                            { where.push(`d.date_creation >= $${i++}`); args.push(from); }
    if (to)                              { where.push(`d.date_creation <= $${i++}`); args.push(to); }

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
       ORDER BY d.date_creation DESC`
      , args
    );

    // ---- listes mini pour afficher les noms dans le dashboard
    const { rows: partenaires } = await c.query(
      `SELECT id, nom FROM core.partenaires ORDER BY nom`
    );
    const { rows: operateurs } = await c.query(
      `SELECT id, nom FROM core.operateurs ORDER BY nom`
    );
    const { rows: clients } = await c.query(
      `SELECT id, prenom, nom, email FROM core.clients ORDER BY id`
    );

    // ---- notifications programmées
    const { rows: notifications } = await c.query(
      `SELECT id, type, client_id AS "clientId", dossier_id AS "dossierId",
              canal, scheduled_for
         FROM core.notifications_queue
        ORDER BY scheduled_for ASC`
    );

    // ---- derniers auth logs
    const { rows: auth_logs } = await c.query(
      `SELECT at, role, who, action, success, ip
         FROM core.auth_logs
        ORDER BY at DESC
        LIMIT 50`
    );

    // ---- refs (hardcodé côté API pour le moment)
    const refs = {
      statuts_dossier: ["nouveau","en_cours","en_attente","a_corriger","valide","rejete"]
    };

    return NextResponse.json({
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
    c.release();
  }
}

import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";
const pool = getPool();

export async function POST(req) {
  const body = await req.json().catch(()=> ({}));
  const {
    dossier_id,
    priorite = "Moyenne",         // 'Basse' | 'Moyenne' | 'Haute'
    assigne_operateur_id = null,  // optionnel
    ouverture = "manuelle",
    source = "operateur",
    message = "Ticket créé depuis le CRM",
    attachments = null
  } = body || {};

  if (!dossier_id) return NextResponse.json({ error: "dossier_id requis" }, { status: 400 });

  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    const { rows: t } = await c.query(
      `INSERT INTO core.tickets
         (dossier_id, statut, priorite, assigne_operateur_id, ouverture, source)
       VALUES ($1, 'Nouveau', $2, $3, $4, $5)
       RETURNING id, dossier_id, statut, priorite, assigne_operateur_id, created_at`,
      [dossier_id, priorite, assigne_operateur_id, ouverture, source]
    );

    await c.query(
      `INSERT INTO core.ticket_events (ticket_id, message, attachments)
       VALUES ($1, $2, $3)`,
      [t[0].id, message, attachments]
    );

    await c.query("COMMIT");
    return NextResponse.json({ ticket: t[0] }, { status: 201 });
  } catch (e) {
    await c.query("ROLLBACK");
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    c.release();
  }
}

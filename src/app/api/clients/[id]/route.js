import { NextResponse } from "next/server";
import { getPool } from "../../_lib/db";   // ⟵ was { pool }

const pool = getPool();                    // ⟵ add this

export async function GET(_req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const client = await pool.connect();
  try {
    // client
    const { rows: clientRows } = await client.query(
      `SELECT c.*
       FROM core.clients c
       WHERE c.id = $1`, [id]
    );
    if (clientRows.length === 0) return NextResponse.json({ error: "not found" }, { status: 404 });
    const c = clientRows[0];

    // dossiers du client
    const { rows: dossierRows } = await client.query(
      `SELECT *
         FROM core.dossiers
        WHERE client_id = $1
        ORDER BY date_creation DESC`, [id]
    );
    const dossierIds = dossierRows.map(d => d.id);

    // pièces (par client)
    const { rows: piecesRows } = await client.query(
      `SELECT type, fichier, statut, motif_refus, uploaded_at
         FROM core.pieces_justificatives
        WHERE client_id = $1
        ORDER BY uploaded_at NULLS LAST`, [id]
    );

    // téléchargements dispo
    const { rows: downloadsRows } = await client.query(
      `SELECT type, fichier
         FROM core.client_downloads
        WHERE client_id = $1`, [id]
    );

    // messages (zone d’échange) — tous dossiers du client
    let messagesRows = [];
    if (dossierIds.length) {
      const { rows } = await client.query(
        `SELECT dossier_id, sender_type AS "from", body AS message, at
           FROM core.messages
          WHERE dossier_id = ANY($1::int[])
          ORDER BY at ASC`, [dossierIds]
      );
      messagesRows = rows;
    }

    // historique notifications (très simple : logs contact + emails)
    const { rows: histoContact } = await client.query(
      `SELECT at, type, note
         FROM core.client_contact_logs
        WHERE client_id = $1
        ORDER BY at ASC`, [id]
    );
    const { rows: histoEmails } = await client.query(
      `SELECT envoye_le AS at, type, canal
         FROM core.emails_automatiques
        WHERE client_id = $1
        ORDER BY envoye_le ASC`, [id]
    );

    return NextResponse.json({
      client: c,
      dossiers: dossierRows,
      pieces_justificatives: piecesRows,
      telechargements_disponibles: downloadsRows,
      zone_echange: messagesRows.map(m => ({ ...m, date: m.at?.toISOString()?.slice(0,10) })),
      historique_echanges: [
        ...histoContact.map(h => ({ date: h.at?.toISOString()?.slice(0,10), type: h.type || "note", note: h.note || "" })),
        ...histoEmails.map(h => ({ date: h.at?.toISOString()?.slice(0,10), type: "email", note: h.type + (h.canal ? ` (${h.canal})` : "") }))
      ]
    });
  } finally {
    client.release();
  }
}

import { NextResponse } from "next/server";
import { getPool } from "../../_lib/db";
const pool = getPool();

export async function PATCH(req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const body = await req.json().catch(()=> ({}));
  const { statut, assign_to } = body || {};
  const ALLOWED = ['nouveau','en_cours','en_attente','a_corriger','valide','rejete'];
  if (statut && !ALLOWED.includes(statut)) {
    return NextResponse.json({ error: "invalid statut" }, { status: 400 });
  }

  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    // Update dossier
    const { rows } = await c.query(
      `UPDATE core.dossiers
          SET statut = COALESCE($2, statut),
              operateur_id = COALESCE($3, operateur_id),
              derniere_modification = CURRENT_DATE
        WHERE id = $1
        RETURNING *`,
      [id, statut ?? null, assign_to ?? null]
    );
    if (!rows.length) {
      await c.query("ROLLBACK");
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    const d = rows[0];

    // Log timeline
    await c.query(
      `INSERT INTO core.dossier_events (dossier_id, action, meta)
       VALUES ($1, $2, $3)`,
      [id, "UPDATE", { statut, assign_to }]
    );

    await c.query("COMMIT");
    return NextResponse.json({ dossier: d });
  } catch (e) {
    await c.query("ROLLBACK");
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    c.release();
  }
}

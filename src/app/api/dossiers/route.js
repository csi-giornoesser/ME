import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";
import { getActor } from "../_lib/actor";

const pool = getPool();

export async function GET(req) {
  const { role, partnerId, clientId } = getActor(req);

  let where = "TRUE";
  const params = [];

  if (role === "partner_user") {
    if (!partnerId) return NextResponse.json({ dossiers: [] });
    where = "partenaire_id = $1";
    params.push(partnerId);
  } else if (role === "client_user") {
    if (!clientId) return NextResponse.json({ dossiers: [] });
    where = "client_id = $1";
    params.push(clientId);
  }

  const c = await pool.connect();
  try {
    const { rows } = await c.query(
      `SELECT id, client_id, entreprise_id, partenaire_id, operateur_id, statut,
              date_creation, derniere_modification, blocages, commission_partenaire_eur
         FROM core.dossiers
        WHERE ${where}
        ORDER BY date_creation DESC`,
      params
    );
    return NextResponse.json({ dossiers: rows });
  } finally {
    c.release();
  }
}

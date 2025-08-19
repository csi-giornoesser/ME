import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";
const pool = getPool();

export async function POST(req) {
  const body = await req.json().catch(()=> ({}));
  const { type, client_id, dossier_id, canal = "email", scheduled_for } = body || {};
  if (!type || !client_id || !dossier_id || !scheduled_for) {
    return NextResponse.json({ error: "type, client_id, dossier_id, scheduled_for requis" }, { status: 400 });
  }

  const id = `notif-${Date.now()}`;
  const c = await pool.connect();
  try {
    await c.query(
      `INSERT INTO core.notifications_queue
       (id, type, client_id, dossier_id, canal, scheduled_for)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [id, type, client_id, dossier_id, canal, scheduled_for]
    );
    return NextResponse.json({ id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  } finally {
    c.release();
  }
}

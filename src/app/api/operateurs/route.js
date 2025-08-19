import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";
const pool = getPool();

export async function GET() {
  const { rows } = await pool.query(
    `SELECT id, nom, email, role, two_fa_enabled FROM core.operateurs ORDER BY nom`
  );
  return NextResponse.json({ items: rows });
}

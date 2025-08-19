import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";
const pool = getPool();

export async function GET() {
  const { rows } = await pool.query(
    `SELECT who, role, action, success, ip, at
     FROM core.auth_logs
     ORDER BY at DESC
     LIMIT 200`
  );
  return NextResponse.json({ items: rows });
}

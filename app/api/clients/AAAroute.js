import { NextResponse } from "next/server";
import { getPool } from "../_lib/db.mjs";
const pool = getPool();

export async function GET(req) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") || "20")));
  const q = url.searchParams.get("q"); // search
  const partnerId  = url.searchParams.get("partnerId");   // origine_partenaire_id
  const operatorId = url.searchParams.get("operatorId");  // operateur_assigne_id

  const where = [];
  const params = [];
  const add = (sql, v) => { params.push(v); where.push(sql.replace(/\$(\?)/g, `$${params.length}`)); };

  if (q) add(`(c.prenom ILIKE $? OR c.nom ILIKE $? OR c.email ILIKE $?)`, `%${q}%`);
  if (q) params.push(`%${q}%`, `%${q}%`); // on a ajouté 3 placeholders (le premier déjà poussé)
  if (partnerId && partnerId !== "all") add(`c.origine_partenaire_id = $?`, Number(partnerId));
  if (operatorId && operatorId !== "all") add(`c.operateur_assigne_id = $?`, Number(operatorId));

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT c.*, COUNT(*) OVER() AS total_rows
    FROM core.clients c
    ${whereSql}
    ORDER BY c.created_at DESC NULLS LAST, c.id DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(sql, [...params, pageSize, offset]);
    const total = rows[0]?.total_rows ? Number(rows[0].total_rows) : 0;
    return NextResponse.json({
      items: rows.map(({ total_rows, ...r }) => r),
      page, pageSize, total
    });
  } finally {
    client.release();
  }
}

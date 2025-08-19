import { NextResponse } from "next/server";
import { getPool } from "../_lib/db";
const pool = getPool();

export async function GET(req) {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") || "50")));
  const q = url.searchParams.get("q");

  const where = [];
  const params = [];
  const add = (sql, v) => { params.push(v); where.push(sql.replace(/\$(\?)/g, `$${params.length}`)); };

  if (q) add(`(p.nom ILIKE $? OR p.adresse ILIKE $?)`, `%${q}%`), params.push(`%${q}%`);

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT
      p.id, p.nom, p.adresse, p.integration, p.type_facturation,
      p.taux_commission, p.segment, p.ca_total, p.commissions_total,
      COUNT(*) OVER() AS total_rows
    FROM core.partenaires p
    ${whereSql}
    ORDER BY p.nom ASC
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

// src/app/api/_lib/db.mjs
import { Pool } from "pg";

let _pool = globalThis.__PG_POOL;
if (!_pool) {
  _pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Neon
  });
  globalThis.__PG_POOL = _pool;
}

export function getPool() {
  return _pool;
}

/**
 * withClient(async (c) => { ... })  // c = client PG
 * Gère connect/release et laisse ton code au propre.
 */
export async function withClient(fn) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}


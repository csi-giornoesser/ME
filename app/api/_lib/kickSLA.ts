// app/api/_lib/kickSLA.ts
import { getPool } from "./db.mjs";

// Throttle: 1 exécution max toutes les 2 minutes par instance
let lastRun = 0;
const MIN_MS_BETWEEN_RUNS = 2 * 60 * 1000;

export async function kickSLA(limit: number = 200) {
  const now = Date.now();
  if (now - lastRun < MIN_MS_BETWEEN_RUNS) return;
  lastRun = now;

  try {
    const pool = getPool();
    await pool.query("SELECT * FROM core.create_due_tickets($1);", [limit]);
    await pool.query("SELECT core.produce_notifications();");      // enqueuer selon l'état
    await pool.query("SELECT core.dispatch_due_notifications();"); // envoyer celles arrivées à échéance
  } catch (e: any) {
    console.warn("[kickSLA] skipped:", e.message);
  }
}

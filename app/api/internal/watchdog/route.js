// app/api/internal/watchdog/route.js
import { NextResponse } from 'next/server';
import { withClient } from '@/app/api/_lib/db.mjs';

const SECRET = process.env.WATCHDOG_SECRET;

export async function POST(req) {
  if (SECRET) {
    const hdr = req.headers.get('x-watchdog-secret');
    if (hdr !== SECRET) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return withClient(async (client) => {
    // 1) candidats selon la vue
    const { rows: candidates } = await client.query(`
      SELECT dossier_id, reason, age
      FROM core.watchdog_candidates_v1
    `);

    let created = 0, skipped = 0, escalated = 0;

    for (const c of candidates) {
      const fingerprint = `${c.dossier_id}|${c.reason}`;

      // 2) existe déjà un ticket ouvert pour ce fingerprint ?
      const { rows: open } = await client.query(`
        SELECT id, priorite, statut
        FROM core.tickets
        WHERE dossier_id = $1
          AND statut IN ('Nouveau','En cours')
          AND source = $2
        LIMIT 1
      `, [c.dossier_id, fingerprint]);

      // Priorité selon reason
      const priorite =
        c.reason === 'processing_slow' ? 'Moyenne' :
        'Haute';

      if (open.length) {
        // escalade si besoin (ex: passer de Moyenne à Haute)
        const tk = open[0];
        if (tk.priorite !== priorite) {
          await client.query(`UPDATE core.tickets SET priorite=$1 WHERE id=$2`, [priorite, tk.id]);
          await client.query(`
            INSERT INTO core.ticket_events (ticket_id, message)
            VALUES ($1, $2)
          `, [tk.id, `Escalade auto: priorité ${tk.priorite} -> ${priorite} (${c.reason})`]);
          escalated++;
        } else {
          skipped++;
        }
        continue;
      }

      // 3) créer le ticket
      const subject = `Dossier #${c.dossier_id} bloqué: ${c.reason} (âge ~ ${Math.floor(c.age / (1000*60*60))}h)`;
      const { rows: createdTk } = await client.query(`
        INSERT INTO core.tickets (dossier_id, statut, priorite, ouverture, source, subject)
        VALUES ($1, 'Nouveau', $2, 'auto', $3, $4)
        RETURNING id
      `, [c.dossier_id, priorite, fingerprint, subject]);

      await client.query(`
        INSERT INTO core.ticket_events (ticket_id, message)
        VALUES ($1, $2)
      `, [createdTk[0].id, `Créé automatiquement (reason=${c.reason}).`]);

      created++;
    }

    return NextResponse.json({ created, skipped, escalated, total: candidates.length });
  });
}

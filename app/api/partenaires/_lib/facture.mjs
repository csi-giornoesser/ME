// /workspaces/ME/app/api/partenaires/_lib/facture.mjs
import { getPool } from "../../_lib/db.mjs"; // <- remonte à api/_lib

function periodBounds(periode /* "YYYY-MM" */) {
  const [y, m] = periode.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end   = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1));
  return { startISO: start.toISOString().slice(0,10), endISO: end.toISOString().slice(0,10) };
}

function genInvoiceId(partnerId, periode) {
  const rnd = Math.floor(100000 + Math.random() * 900000);
  return `F${periode.replace("-","")}-${partnerId}-${rnd}`;
}

export async function previewOrCreateInvoice({ partnerId, periode, rate, dryRun = true }) {
  const pool = getPool();
  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    let effRate = rate;
    if (effRate == null) {
      const { rows } = await c.query(
        `SELECT taux_commission FROM core.partenaires WHERE id=$1`,
        [partnerId]
      );
      effRate = rows[0]?.taux_commission != null ? Number(rows[0].taux_commission)/100 : 0.15;
    }

    const { startISO, endISO } = periodBounds(periode);

    // Montant basé sur les paiements marqués "Payé" dans la période
    const { rows: dossiers } = await c.query(
      `
      SELECT
        d.id AS dossier_id,
        d.client_id,
        d.entreprise_id,
        COALESCE((e.service_paiement->>'montant')::numeric, 0) AS fee_eur
      FROM core.dossiers d
      JOIN core.entreprises e ON e.id = d.entreprise_id
      WHERE d.partenaire_id = $1
        AND (e.service_paiement->>'statut') = 'Payé'
        AND COALESCE(d.date_creation_effective, d.date_creation) >= $2::date
        AND COALESCE(d.date_creation_effective, d.date_creation) <  $3::date
      ORDER BY d.id
      `,
      [partnerId, startISO, endISO]
    );

    const ca = dossiers.reduce((s, d) => s + Number(d.fee_eur || 0), 0);
    const dossiersCount = dossiers.length;
    const commission = Math.round(ca * effRate * 100) / 100;

    if (dryRun) {
      await c.query("ROLLBACK");
      return {
        preview: true,
        periode,
        rate: effRate,
        dossiers_count: dossiersCount,
        ca_total_eur: ca,
        commission_eur: commission,
        dossiers
      };
    }

    // Alimente le récap par période (sans colonne commissions pour rester compatible)
    await c.query(
      `
      INSERT INTO core.partner_period_ca (partenaire_id, periode, ca, dossiers)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (partenaire_id, periode)
      DO UPDATE SET ca = EXCLUDED.ca, dossiers = EXCLUDED.dossiers
      `,
      [partnerId, periode, ca, dossiersCount]
    );

    // Génère / réutilise un id de facture stable pour cette période
    const existing = await c.query(
      `SELECT id FROM core.partner_invoices WHERE partenaire_id=$1 AND periode=$2`,
      [partnerId, periode]
    );
    let invoiceId = existing.rows[0]?.id ?? genInvoiceId(partnerId, periode);

    // Statut/date/échéance selon période (mois passé = payée)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const isPastPeriod = periode < currentMonth;

    const endOfPeriod = new Date(Date.UTC(Number(periode.slice(0,4)), Number(periode.slice(5,7)), 0));
    const invoiceDateISO = isPastPeriod
      ? endOfPeriod.toISOString().slice(0,10)
      : new Date().toISOString().slice(0,10);

    const dueDate = isPastPeriod
      ? invoiceDateISO
      : new Date(Date.now() + 30*24*3600*1000).toISOString().slice(0,10);

    const targetStatus = isPastPeriod ? 'payee' : 'En attente';

    // UPSERT facture avec les bonnes valeurs
    await c.query(
      `
      INSERT INTO core.partner_invoices (id, partenaire_id, montant, date, statut, periode, echeance, pdf)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NULL)
      ON CONFLICT (partenaire_id, periode)
      DO UPDATE SET
        montant = EXCLUDED.montant,
        date    = EXCLUDED.date,
        statut  = EXCLUDED.statut,
        echeance= EXCLUDED.echeance
      `,
      [invoiceId, partnerId, commission, invoiceDateISO, targetStatus, periode, dueDate]
    );

    await c.query("COMMIT");
    return {
      preview: false,
      periode,
      rate: effRate,
      dossiers_count: dossiersCount,
      ca_total_eur: ca,
      commission_eur: commission,
      invoice: {
        id: invoiceId,
        montant: commission,
        statut: targetStatus,
        periode,
        date: invoiceDateISO,
        echeance: dueDate,
        pdf: null,
      }
    };
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}

import { NextResponse } from "next/server";
import { getPool } from "../../_lib/db";

const pool = getPool();

export async function GET(_req, { params }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });

  const c = await pool.connect();
  try {
    // Partenaire (infos principales)
    const { rows: p } = await c.query(
      `SELECT id, nom, adresse, integration, type_facturation, taux_commission, segment,
              referent, contrat, paiement, coordonnees_facturation, docs,
              ca_total, commissions_total
         FROM core.partenaires
        WHERE id = $1`,
      [id]
    );
    if (!p.length) return NextResponse.json({ error: "not found" }, { status: 404 });
    const partenaire = p[0];

    // CA par période
    const { rows: ca_par_periode } = await c.query(
      `SELECT periode, ca, dossiers
         FROM core.partner_period_ca
        WHERE partenaire_id = $1
        ORDER BY periode ASC`,
      [id]
    );

    // Factures
    const { rows: factures } = await c.query(
      `SELECT id, montant, date, statut, periode, echeance, pdf
         FROM core.partner_invoices
        WHERE partenaire_id = $1
        ORDER BY date DESC`,
      [id]
    );

    // Users côté partenaire
    const { rows: partner_users } = await c.query(
      `SELECT id, email, nom, role, two_fa_enabled, last_login_at
         FROM core.partner_users
        WHERE partner_id = $1
        ORDER BY email`,
      [id]
    );

    // Dossiers de ce partenaire
    const { rows: dossiers } = await c.query(
      `SELECT id, statut, client_id, entreprise_id, blocages, date_creation, derniere_modification
         FROM core.dossiers
        WHERE partenaire_id = $1
        ORDER BY date_creation DESC`,
      [id]
    );

    // Historique exports partenaire
    const { rows: partner_exports_history } = await c.query(
      `SELECT id, format, filtres, generated_at, file
         FROM core.partner_exports_history
        WHERE partner_id = $1
        ORDER BY generated_at DESC`,
      [id]
    );

    return NextResponse.json({
      partenaire,
      ca_par_periode,
      factures,
      partner_users,
      dossiers,
      partner_exports_history,
    });
  } finally {
    c.release();
  }
}

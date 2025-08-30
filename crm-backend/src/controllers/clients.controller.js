import { pool } from "../config/db.js";

export async function getClientDetails(req, res, next) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "bad id" });
  }

  const client = await pool.connect();
  try {
    // ----- CLIENT -----
    const { rows: clientRows } = await client.query(
      `SELECT c.* FROM core.clients c WHERE c.id = $1`,
      [id]
    );
    if (clientRows.length === 0) {
      return res.status(404).json({ error: "not found" });
    }
    const c = clientRows[0];

    // ----- DOSSIERS -----
    const { rows: dossierRows } = await client.query(
      `SELECT *
         FROM core.dossiers
        WHERE client_id = $1
        ORDER BY date_creation DESC`,
      [id]
    );
    const dossierIds = dossierRows.map(d => d.id);

    // ----- PIECES -----
    const { rows: piecesRows } = await client.query(
      `SELECT type, fichier, statut, motif_refus, uploaded_at
         FROM core.pieces_justificatives
        WHERE client_id = $1
        ORDER BY uploaded_at NULLS LAST`,
      [id]
    );

    // ----- TELECHARGEMENTS -----
    const { rows: downloadsRows } = await client.query(
      `SELECT type, fichier
         FROM core.client_downloads
        WHERE client_id = $1`,
      [id]
    );

    // ----- MESSAGES -----
    let messagesRows = [];
    if (dossierIds.length) {
      const { rows } = await client.query(
        `SELECT dossier_id, sender_type AS "from", body AS message, at
           FROM core.messages
          WHERE dossier_id = ANY($1::int[])
          ORDER BY at ASC`,
        [dossierIds]
      );
      messagesRows = rows;
    }

    // ----- HISTORIQUE LEGACY -----
    const { rows: histoContact } = await client.query(
      `SELECT at, type, note
         FROM core.client_contact_logs
        WHERE client_id = $1
        ORDER BY at ASC`,
      [id]
    );
    const { rows: histoEmails } = await client.query(
      `SELECT envoye_le AS at, type, canal
         FROM core.emails_automatiques
        WHERE client_id = $1
        ORDER BY envoye_le ASC`,
      [id]
    );

    // ----- NOTIFICATIONS -----
    const { rows: notifications } = await client.query(
      `SELECT 
          id,
          type,
          client_id,
          dossier_id,
          canal,
          scheduled_for,
          message
       FROM core.notifications_queue
       WHERE client_id = $1
       ORDER BY scheduled_for DESC`,
      [id]
    );

    const relances = notifications.filter(n => n.type.startsWith("relance"));
    const alert_relance =
      relances.find(n => typeof n.message === "string" && n.message.trim() !== "") || null;

    // ----- ENTREPRISE -----
    let entreprise = null;
    if (c.entreprise_id) {
      const { rows: eRows } = await client.query(
        `SELECT * FROM core.entreprises WHERE id = $1`,
        [c.entreprise_id]
      );
      if (eRows.length) {
        const e = eRows[0];
        entreprise = {
          id: e.id,
          denomination: e.denomination,
          forme: e.forme,
          statut_dossier: e.statut_dossier,
          activite: e.activite,
          lieu_exercice: e.lieu_exercice,
          dates: e.dates,
          options_sociales: e.options_sociales,
          options_fiscales: e.options_fiscales,
          service_paiement: e.service_paiement,
          checklist_conformite: e.checklist_conformite,
          donnees_gouvernement: {
            guichet_unique_INPI: e.gov_inpi,
            INSEE_SIRENE: e.gov_insee,
            URSSAF: e.gov_urssaf,
            RNE: e.gov_rne,
          },
        };
      }
    }

    // ----- FAQ -----
    let faq = [];
    try {
      const { rows } = await client.query(
        `WITH cte AS (
           SELECT origine_partenaire_id AS partner_id
             FROM core.clients
            WHERE id = $1
         )
         SELECT f.id, f.category, f.question, f.answer, f.position
           FROM core.faq_entries f
           LEFT JOIN cte ON TRUE
          WHERE f.is_active = TRUE
            AND f.audience = 'client'
            AND f.lang = 'fr'
            AND (f.partner_id IS NULL OR f.partner_id = cte.partner_id)
          ORDER BY COALESCE(f.category,''), f.position NULLS LAST, f.id`,
        [id]
      );
      faq = rows;
    } catch {}

    // ----- REPONSE JSON -----
    return res.json({
      client: c,
      entreprise,
      dossiers: dossierRows,
      pieces_justificatives: piecesRows,
      telechargements_disponibles: downloadsRows,
      zone_echange: messagesRows.map(m => ({
        ...m,
        date: m.at?.toISOString?.()?.slice(0, 10),
      })),
      historique_echanges: [
        ...histoContact.map(h => ({
          date: h.at?.toISOString?.()?.slice(0, 10),
          type: h.type || "note",
          note: h.note || "",
        })),
        ...histoEmails.map(h => ({
          date: h.at?.toISOString?.()?.slice(0, 10),
          type: "email",
          note: h.type + (h.canal ? ` (${h.canal})` : ""),
        })),
      ],
      relances,
      notifications,
      alert_relance,
      faq,
    });
  } catch (e) {
    next(e);
  } finally {
    client.release();
  }
}

import { pool } from "../config/db.js";
import { kickSLA } from "../services/kickSLA.service.js"; // no-op possible au début

export async function getEntrepriseById(req, res, next) {
  try {
    try { await kickSLA?.(); } catch (e) { console.warn("kickSLA error:", e?.message); }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "bad id" });

    const client = await pool.connect();
    try {
      // --- Entreprise
      const { rows: eRows } = await client.query(
        `SELECT * FROM core.entreprises WHERE id = $1`,
        [id]
      );
      if (eRows.length === 0) return res.status(404).json({ error: "not found" });
      const e = eRows[0];

      // --- Titulaire (mini)
      const { rows: titulaireRows } = await client.query(
        `SELECT id, prenom, nom FROM core.clients WHERE id = $1`,
        [e.titulaire_client_id]
      );
      const titulaire = titulaireRows[0] ?? null;

      // --- Docs générés
      const { rows: docs } = await client.query(
        `SELECT type, source, fichier, date
           FROM core.documents_generes
          WHERE entreprise_id = $1
          ORDER BY date NULLS LAST, id`,
        [id]
      );

      // --- Dossiers liés
      const { rows: dossiers } = await client.query(
        `SELECT id, client_id, partenaire_id, statut,
                date_creation, derniere_modification, commission_partenaire_eur
           FROM core.dossiers
          WHERE entreprise_id = $1
          ORDER BY date_creation DESC`,
        [id]
      );

      // --- Jobs scraping
      const { rows: jobs } = await client.query(
        `SELECT id, portail, etat, last_event, updated_at
           FROM core.scraping_jobs
          WHERE entreprise_id = $1
          ORDER BY updated_at DESC NULLS LAST`,
        [id]
      );

      // --- Réponse (même shape que ta route Next actuelle)
      return res.json({
        entreprise: {
          id: e.id,
          denomination: e.denomination,
          forme: e.forme,
          statut_dossier: e.statut_dossier,
          titulaire_client: titulaire, // {id, prenom, nom}
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
        },
        documents_generes: docs,
        dossiers,
        scraping_jobs: jobs,
      });
    } finally {
      client.release();
    }
  } catch (e) {
    next(e);
  }
}

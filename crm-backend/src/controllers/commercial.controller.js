import { pool } from "../config/db.js";

/** GET /api/commercial/rappels */
export async function getRappels(req, res, next) {
  const c = await pool.connect();
  try {
    // Récupérer tous les rappels en attente
    const { rows: rappels } = await c.query(`
      SELECT 
        pi.id,
        pi.partner_id,
        pi.date_interaction,
        pi.type_interaction,
        pi.sujet,
        pi.notes,
        pi.prochaine_action,
        pi.rappel_date,
        pi.created_by,
        p.nom as partner_nom
      FROM core.partner_interactions pi
      LEFT JOIN core.partenaires p ON pi.partner_id = p.id
      WHERE pi.prochaine_action IS NOT NULL 
        AND pi.statut != 'termine'
      ORDER BY 
        CASE 
          WHEN pi.rappel_date IS NULL THEN 1
          WHEN pi.rappel_date < CURRENT_DATE THEN 0
          ELSE 2
        END,
        pi.rappel_date ASC,
        pi.date_interaction DESC
    `);

    // Stats côté serveur (identiques à ta route Next)
    const today = new Date();
    const stats = {
      total: rappels.length,
      en_retard: 0,
      aujourd_hui: 0,
      cette_semaine: 0,
      plus_tard: 0
    };

    rappels.forEach(rappel => {
      if (!rappel.rappel_date) {
        stats.plus_tard++;
        return;
      }
      const rappelDate = new Date(rappel.rappel_date);
      const diffDays = Math.ceil((rappelDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) stats.en_retard++;
      else if (diffDays === 0) stats.aujourd_hui++;
      else if (diffDays <= 7) stats.cette_semaine++;
      else stats.plus_tard++;
    });

    // Métriques globales
    const { rows: globalStats } = await c.query(`
      SELECT 
        COUNT(DISTINCT pi.partner_id) as partenaires_actifs,
        COUNT(*) as total_interactions_mois,
        COUNT(CASE WHEN pi.type_interaction = 'reunion' THEN 1 END) as reunions_mois
      FROM core.partner_interactions pi
      WHERE pi.date_interaction >= DATE_TRUNC('month', CURRENT_DATE)
    `);

    return res.json({
      rappels,
      stats,
      global_stats: globalStats[0] || {},
      generated_at: new Date().toISOString()
    });
  } catch (e) {
    console.error("Erreur GET /api/commercial/rappels:", e);
    next(e);
  } finally {
    c.release();
  }
}

/** POST /api/commercial/rappels  { interaction_id, action='termine' } */
export async function terminerRappel(req, res, next) {
  const { interaction_id, action = "termine" } = req.body || {};
  if (!interaction_id) {
    return res.status(400).json({ error: "interaction_id requis" });
  }

  const id = Number(interaction_id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "interaction_id invalide" });
  }

  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    const { rows: updated } = await c.query(
      `
      UPDATE core.partner_interactions 
      SET statut = $1
      WHERE id = $2
      RETURNING id, partner_id, sujet, prochaine_action
      `,
      [action, id]
    );

    if (!updated.length) {
      await c.query("ROLLBACK");
      return res.status(404).json({ error: "Interaction introuvable" });
    }

    await c.query("COMMIT");

    return res.json({
      interaction: updated[0],
      message: "Action marquée comme terminée"
    });
  } catch (e) {
    await c.query("ROLLBACK").catch(() => {});
    console.error("Erreur POST /api/commercial/rappels:", e);
    next(e);
  } finally {
    c.release();
  }
}

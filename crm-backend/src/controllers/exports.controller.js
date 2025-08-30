// crm-backend/src/controllers/exports.controller.js
import { pool } from "../config/db.js";

// ---------- Helpers dates ----------
function startOfCurrentMonthISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- Helper CSV ----------
function generateCSV(data) {
  if (!data || data.length === 0) return "\uFEFFAucune donnée à exporter";
  const headers = Object.keys(data[0] || {});
  const csvHeaders = headers.join(",");
  const csvRows = (data || []).map(row =>
    headers.map(h => {
      const v = row[h];
      if (v === null || v === undefined) return "";
      const s = String(v);
      return (s.includes(",") || s.includes('"') || s.includes("\n"))
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    }).join(",")
  );
  return "\uFEFF" + csvHeaders + "\n" + csvRows.join("\n");
}

/** GET /api/exports/commissions?partnerId=&periode=&from=&to=&format=csv|json&groupBy=dossier|partner|month */
export async function getExportCommissions(req, res, next) {
  const partnerId = req.query.partnerId || null;
  const periode   = req.query.periode || null; // (non utilisé ici, ok)
  const dateFrom  = req.query.from || null;
  const dateTo    = req.query.to || null;
  const format    = (req.query.format || "csv").toLowerCase();
  const groupBy   = (req.query.groupBy || "dossier").toLowerCase();

  const conn = await pool.connect();
  try {
    let query = "";
    let params = [];
    let i = 1;

    if (groupBy === "partner") {
      query = `
        SELECT 
          p.id as "ID Partenaire",
          p.nom as "Partenaire",
          p.taux_commission as "Taux (%)",
          COUNT(d.id) as "Nombre dossiers",
          COUNT(CASE WHEN d.statut = 'valide' THEN 1 END) as "Dossiers validés",
          COALESCE(SUM(d.commission_partenaire_eur), 0) as "Commission totale (€)",
          COALESCE(SUM(CASE WHEN d.statut = 'valide' THEN d.commission_partenaire_eur ELSE 0 END), 0) as "Commission due (€)",
          TO_CHAR(MIN(d.date_creation), 'DD/MM/YYYY') as "Premier dossier",
          TO_CHAR(MAX(d.date_creation), 'DD/MM/YYYY') as "Dernier dossier",
          p.type_facturation as "Type facturation",
          CASE WHEN p.paiement->>'iban' IS NOT NULL THEN 'Oui' ELSE 'Non' END as "IBAN renseigné"
        FROM core.partenaires p
        LEFT JOIN core.dossiers d ON p.id = d.partenaire_id
      `;
      const where = [];
      if (dateFrom) { where.push(`d.date_creation >= $${i++}`); params.push(dateFrom); }
      if (dateTo)   { where.push(`d.date_creation <= $${i++}::date + INTERVAL '1 day'`); params.push(dateTo); }
      if (partnerId && partnerId !== "all") { where.push(`p.id = $${i++}`); params.push(Number(partnerId)); }
      if (where.length) query += ` WHERE ${where.join(" AND ")}`;
      query += `
        GROUP BY p.id, p.nom, p.taux_commission, p.type_facturation, p.paiement
        ORDER BY "Commission due (€)" DESC
      `;
    } else if (groupBy === "month") {
      query = `
        SELECT 
          TO_CHAR(d.date_creation, 'YYYY-MM') as "Mois",
          p.nom as "Partenaire",
          COUNT(d.id) as "Dossiers créés",
          COUNT(CASE WHEN d.statut = 'valide' THEN 1 END) as "Dossiers validés",
          COALESCE(SUM(d.commission_partenaire_eur), 0) as "Commission totale (€)",
          COALESCE(AVG(d.commission_partenaire_eur), 0) as "Commission moyenne (€)",
          ROUND(
            COUNT(CASE WHEN d.statut = 'valide' THEN 1 END) * 100.0 / NULLIF(COUNT(d.id), 0),
            2
          ) as "Taux validation (%)"
        FROM core.dossiers d
        LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
      `;
      const where = [];
      if (dateFrom) { where.push(`d.date_creation >= $${i++}`); params.push(dateFrom); }
      if (dateTo)   { where.push(`d.date_creation <= $${i++}::date + INTERVAL '1 day'`); params.push(dateTo); }
      if (partnerId && partnerId !== "all") { where.push(`d.partenaire_id = $${i++}`); params.push(Number(partnerId)); }
      if (where.length) query += ` WHERE ${where.join(" AND ")}`;
      query += `
        GROUP BY TO_CHAR(d.date_creation, 'YYYY-MM'), p.nom
        ORDER BY "Mois" DESC, "Commission totale (€)" DESC
      `;
    } else {
      // groupBy = dossier (détaillé)
      query = `
        SELECT 
          d.id as "ID Dossier",
          TO_CHAR(d.date_creation, 'DD/MM/YYYY') as "Date création",
          d.statut as "Statut",
          CONCAT(c.prenom, ' ', c.nom) as "Client",
          e.denomination as "Entreprise",
          p.nom as "Partenaire",
          p.taux_commission as "Taux commission (%)",
          COALESCE(d.commission_partenaire_eur, 0) as "Commission (€)",
          CASE WHEN d.statut = 'valide' THEN 'Oui' ELSE 'Non' END as "Commission due",
          TO_CHAR(d.derniere_modification, 'DD/MM/YYYY') as "Dernière modification",
          p.type_facturation as "Type facturation",
          CASE WHEN d.exportable_csv THEN 'Oui' ELSE 'Non' END as "Exportable"
        FROM core.dossiers d
        LEFT JOIN core.clients c ON d.client_id = c.id
        LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
        LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
      `;
      const where = [`COALESCE(d.commission_partenaire_eur, 0) > 0`];
      if (dateFrom) { where.push(`d.date_creation >= $${i++}`); params.push(dateFrom); }
      if (dateTo)   { where.push(`d.date_creation <= $${i++}::date + INTERVAL '1 day'`); params.push(dateTo); }
      if (partnerId && partnerId !== "all") { where.push(`d.partenaire_id = $${i++}`); params.push(Number(partnerId)); }
      query += ` WHERE ${where.join(" AND ")}`;
      query += ` ORDER BY d.date_creation DESC`;
    }

    const { rows: data } = await conn.query(query, params);

    if (format === "csv") {
      const csv = generateCSV(data);
      const fileName = `commissions_${groupBy}_${new Date().toISOString().slice(0,10)}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).send(csv);
    }

    // Stats JSON
    const stats = { total_rows: data.length, total_commission: 0, commission_due: 0 };
    if (groupBy === "dossier") {
      for (const row of data) {
        const commission = parseFloat(row["Commission (€)"]) || 0;
        stats.total_commission += commission;
        if (row["Commission due"] === "Oui") stats.commission_due += commission;
      }
    }

    return res.json({
      data,
      stats,
      filters: { partnerId, periode, dateFrom, dateTo, groupBy },
      generated_at: new Date().toISOString(),
    });

  } catch (e) {
    console.error("Erreur export commissions:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/** GET /api/exports/activite?from=YYYY-MM-DD&to=YYYY-MM-DD&type=summary|detailed|performance&format=csv|json */
export async function getExportActivite(req, res, next) {
  const dateFrom = req.query.from || startOfCurrentMonthISO();
  const dateTo   = req.query.to   || todayISO();
  const format   = (req.query.format || "csv").toLowerCase();
  const type     = (req.query.type   || "summary").toLowerCase();

  const conn = await pool.connect();
  try {
    let data = [];

    if (type === "summary") {
      const { rows } = await conn.query(`
        WITH period_stats AS (
          SELECT 
            TO_CHAR(d.date_creation, 'YYYY-MM') as mois,
            COUNT(*) as dossiers_crees,
            COUNT(CASE WHEN d.statut = 'valide' THEN 1 END) as dossiers_valides,
            COUNT(CASE WHEN d.statut = 'rejete' THEN 1 END) as dossiers_rejetes,
            COUNT(CASE WHEN array_length(d.blocages, 1) > 0 THEN 1 END) as dossiers_bloques,
            COALESCE(SUM(d.commission_partenaire_eur), 0) as ca_commissions,
            COALESCE(AVG(d.commission_partenaire_eur), 0) as commission_moyenne,
            COUNT(DISTINCT d.client_id) as clients_uniques,
            COUNT(DISTINCT d.partenaire_id) as partenaires_actifs
          FROM core.dossiers d
          WHERE d.date_creation >= $1 AND d.date_creation <= $2::date + INTERVAL '1 day'
          GROUP BY TO_CHAR(d.date_creation, 'YYYY-MM')
        ),
        ticket_stats AS (
          SELECT 
            TO_CHAR(t.created_at, 'YYYY-MM') as mois,
            COUNT(*) as tickets_crees,
            COUNT(CASE WHEN t.statut = 'Résolu' THEN 1 END) as tickets_resolus,
            COALESCE(AVG(EXTRACT(HOURS FROM 
              CASE WHEN t.statut = 'Résolu' 
              THEN NOW() - t.created_at 
              ELSE NULL END
            )), 0) as temps_resolution_moyen_heures
          FROM core.tickets t
          WHERE t.created_at >= $1 AND t.created_at <= $2::date + INTERVAL '1 day'
          GROUP BY TO_CHAR(t.created_at, 'YYYY-MM')
        )
        SELECT 
          ps.mois as "Mois",
          ps.dossiers_crees as "Dossiers créés",
          ps.dossiers_valides as "Dossiers validés", 
          ps.dossiers_rejetes as "Dossiers rejetés",
          ps.dossiers_bloques as "Dossiers bloqués",
          ROUND(ps.dossiers_valides * 100.0 / NULLIF(ps.dossiers_crees, 0), 2) as "Taux validation (%)",
          ROUND(ps.ca_commissions, 2) as "CA Commissions (€)",
          ROUND(ps.commission_moyenne, 2) as "Commission moyenne (€)",
          ps.clients_uniques as "Clients uniques",
          ps.partenaires_actifs as "Partenaires actifs",
          COALESCE(ts.tickets_crees, 0) as "Tickets créés",
          COALESCE(ts.tickets_resolus, 0) as "Tickets résolus",
          ROUND(COALESCE(ts.temps_resolution_moyen_heures, 0), 1) as "Temps résolution moyen (h)"
        FROM period_stats ps
        LEFT JOIN ticket_stats ts ON ps.mois = ts.mois
        ORDER BY ps.mois DESC
      `, [dateFrom, dateTo]);
      data = rows;

    } else if (type === "performance") {
      const { rows } = await conn.query(`
        SELECT 
          p.nom as "Partenaire",
          p.segment as "Segment",
          COUNT(d.id) as "Dossiers total",
          COUNT(CASE WHEN d.statut = 'valide' THEN 1 END) as "Validés",
          COUNT(CASE WHEN d.statut = 'rejete' THEN 1 END) as "Rejetés", 
          ROUND(
            COUNT(CASE WHEN d.statut = 'valide' THEN 1 END) * 100.0 / NULLIF(COUNT(d.id), 0),
            2
          ) as "Taux validation (%)",
          COALESCE(SUM(d.commission_partenaire_eur), 0) as "CA Total (€)",
          COALESCE(AVG(d.commission_partenaire_eur), 0) as "Commission moyenne (€)",
          COUNT(DISTINCT d.client_id) as "Clients uniques",
          ROUND(
            COALESCE(AVG(EXTRACT(DAYS FROM 
              CASE WHEN d.statut = 'valide' 
              THEN COALESCE(d.derniere_modification::date, d.date_creation::date) - d.date_creation::date
              ELSE NULL END
            )), 0),
            1
          ) as "Délai validation moyen (j)",
          p.type_facturation as "Type facturation",
          TO_CHAR(MIN(d.date_creation), 'DD/MM/YYYY') as "Premier dossier",
          TO_CHAR(MAX(d.date_creation), 'DD/MM/YYYY') as "Dernier dossier"
        FROM core.partenaires p
        LEFT JOIN core.dossiers d ON p.id = d.partenaire_id 
          AND d.date_creation >= $1 
          AND d.date_creation <= $2::date + INTERVAL '1 day'
        GROUP BY p.id, p.nom, p.segment, p.type_facturation
        HAVING COUNT(d.id) > 0
        ORDER BY "CA Total (€)" DESC
      `, [dateFrom, dateTo]);
      data = rows;

    } else {
      const { rows } = await conn.query(`
        SELECT 
          TO_CHAR(d.date_creation, 'DD/MM/YYYY') as "Date",
          d.statut as "Statut",
          CONCAT(c.prenom, ' ', c.nom) as "Client",
          e.denomination as "Entreprise",
          p.nom as "Partenaire",
          o.nom as "Opérateur",
          COALESCE(d.commission_partenaire_eur, 0) as "Commission (€)",
          CASE 
            WHEN array_length(d.blocages, 1) > 0 
            THEN array_to_string(d.blocages, '; ') 
            ELSE 'Aucun' 
          END as "Blocages",
          COALESCE(
            EXTRACT(DAYS FROM 
              COALESCE(d.derniere_modification::date, CURRENT_DATE) - d.date_creation::date
            ), 0
          ) as "Jours depuis création",
          (SELECT COUNT(*) FROM core.tickets t WHERE t.dossier_id = d.id) as "Nb tickets",
          (SELECT COUNT(*) FROM core.messages m WHERE m.dossier_id = d.id) as "Nb messages"
        FROM core.dossiers d
        LEFT JOIN core.clients c ON d.client_id = c.id
        LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
        LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
        LEFT JOIN core.operateurs o ON d.operateur_id = o.id
        WHERE d.date_creation >= $1 AND d.date_creation <= $2::date + INTERVAL '1 day'
        ORDER BY d.date_creation DESC
      `, [dateFrom, dateTo]);
      data = rows;
    }

    if (format === "csv") {
      const csv = generateCSV(data);
      const fileName = `rapport_activite_${type}_${dateFrom}_${dateTo}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).send(csv);
    }

    const { rows: gs } = await conn.query(`
      SELECT 
        COUNT(*) as total_dossiers,
        COUNT(CASE WHEN statut = 'valide' THEN 1 END) as total_valides,
        COALESCE(SUM(commission_partenaire_eur), 0) as ca_total,
        COUNT(DISTINCT client_id) as clients_uniques,
        COUNT(DISTINCT partenaire_id) as partenaires_actifs
      FROM core.dossiers
      WHERE date_creation >= $1 AND date_creation <= $2::date + INTERVAL '1 day'
    `, [dateFrom, dateTo]);

    return res.json({
      data,
      global_stats: gs[0] || {},
      filters: { dateFrom, dateTo, type },
      generated_at: new Date().toISOString(),
    });

  } catch (e) {
    console.error("Erreur export activité:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/** GET /api/exports/dossiers?status=&partnerId=&operatorId=&from=&to=&format=csv|json */
export async function getExportDossiers(req, res, next) {
  const status     = req.query.status || null;
  const partnerId  = req.query.partnerId || null;
  const operatorId = req.query.operatorId || null;
  const dateFrom   = req.query.from || null;
  const dateTo     = req.query.to || null;
  const format     = (req.query.format || "csv").toLowerCase();

  const conn = await pool.connect();
  try {
    // Build WHERE
    const where = [];
    const params = [];
    let i = 1;

    if (status && status !== "all") {
      where.push(`d.statut = $${i++}`); params.push(status);
    }
    if (partnerId && partnerId !== "all") {
      where.push(`d.partenaire_id = $${i++}`); params.push(Number(partnerId));
    }
    if (operatorId && operatorId !== "all") {
      where.push(`d.operateur_id = $${i++}`); params.push(Number(operatorId));
    }
    if (dateFrom) { where.push(`d.date_creation >= $${i++}`); params.push(dateFrom); }
    if (dateTo)   { where.push(`d.date_creation <= $${i++}::date + INTERVAL '1 day'`); params.push(dateTo); }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const query = `
      SELECT 
        d.id as "ID",
        TO_CHAR(d.date_creation, 'DD/MM/YYYY') as "Date création",
        d.statut as "Statut",
        CONCAT(c.prenom, ' ', c.nom) as "Client",
        c.email as "Email client",
        c.telephone as "Téléphone",
        e.denomination as "Entreprise",
        e.forme as "Forme juridique",
        p.nom as "Partenaire",
        o.nom as "Opérateur",
        COALESCE(d.commission_partenaire_eur, 0) as "Commission (€)",
        CASE 
          WHEN array_length(d.blocages, 1) > 0 
          THEN array_to_string(d.blocages, '; ') 
          ELSE '' 
        END as "Blocages",
        TO_CHAR(COALESCE(d.derniere_modification, d.date_creation), 'DD/MM/YYYY HH24:MI') as "Dernière modification",
        CASE WHEN d.exportable_csv THEN 'Oui' ELSE 'Non' END as "Exportable"
      FROM core.dossiers d
      LEFT JOIN core.clients c     ON d.client_id     = c.id
      LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
      LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
      LEFT JOIN core.operateurs o  ON d.operateur_id  = o.id
      ${whereSql}
      ORDER BY d.date_creation DESC
    `;

    const { rows: dossiers } = await conn.query(query, params);

    if (format === "csv") {
      const csv = generateCSV(dossiers);
      const fileName = `dossiers_${new Date().toISOString().slice(0,10)}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.setHeader("Cache-Control", "no-cache");
      return res.status(200).send(csv);
    }

    return res.json({
      dossiers,
      total: dossiers.length,
      filters: { status, partnerId, operatorId, dateFrom, dateTo },
      generated_at: new Date().toISOString(),
    });

  } catch (e) {
    console.error("Erreur export dossiers:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/** POST /api/exports/dossiers  (placeholder pour futurs exports custom) */
export async function postExportDossiers(req, res, next) {
  try {
    const { filters = {}, columns = null, format = "csv" } = req.body || {};
    return res.json({
      message: "Export personnalisé - à implémenter si besoin",
      filters, columns, format
    });
  } catch (e) {
    console.error("Erreur POST export dossiers:", e);
    next(e);
  }
}
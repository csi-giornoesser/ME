import { previewOrCreateInvoice } from "../services/facture.service.js";
import { pool } from "../config/db.js";
import puppeteer from "puppeteer";

const PERIODE_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

// POST /api/partenaires/:id/factures/preview   { periode: "YYYY-MM", rate?: 0.15 }
export async function previewInvoice(req, res, next) {
  try {
    const partnerId = Number(req.params.id);
    const { periode, rate = null } = req.body || {};

    if (!Number.isFinite(partnerId)) {
      return res.status(400).json({ error: "partnerId invalide" });
    }
    if (!PERIODE_RE.test(periode || "")) {
      return res.status(400).json({ error: "periode doit être au format YYYY-MM" });
    }

    const result = await previewOrCreateInvoice({ partnerId, periode, rate, dryRun: true });
    return res.json(result);
  } catch (e) {
    next(e);
  }
}

// POST /api/partenaires/:id/factures          { periode: "YYYY-MM", rate?: 0.15 }
export async function createInvoice(req, res, next) {
  try {
    const partnerId = Number(req.params.id);
    const { periode, rate = null } = req.body || {};

    if (!Number.isFinite(partnerId)) {
      return res.status(400).json({ error: "partnerId invalide" });
    }
    if (!PERIODE_RE.test(periode || "")) {
      return res.status(400).json({ error: "periode doit être au format YYYY-MM" });
    }

    const result = await previewOrCreateInvoice({ partnerId, periode, rate, dryRun: false });
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}


// GET /api/partenaires/:id/clients
export async function listPartnerClients(req, res, next) {
  const partnerId = Number(req.params.id);
  if (!Number.isFinite(partnerId)) {
    return res.status(400).json({ error: "bad id" });
  }

  // Filtres (mêmes noms que ClientsTableCard)
  const search      = String(req.query.search || "").trim();
  const statut      = req.query.statut || "tous";
  const dateDebut   = req.query.dateDebut || null;
  const dateFin     = req.query.dateFin || null;
  const showBlocked = String(req.query.showBlocked || "") === "true";
  const commission  = req.query.commission;
  const limit       = Math.min(Number(req.query.limit || 1000), 5000);

  const conn = await pool.connect();
  try {
    const conds = ["d.partenaire_id = $1"];
    const vals  = [partnerId];
    let i = 2;

    if (statut && statut !== "tous") {
      conds.push(`d.statut = $${i++}`);
      vals.push(statut);
    }
    if (dateDebut) {
      conds.push(`d.date_creation >= $${i++}::date`);
      vals.push(dateDebut);
    }
    if (dateFin) {
      conds.push(`d.date_creation <= $${i++}::date`);
      vals.push(dateFin);
    }
    if (showBlocked) {
      conds.push(`COALESCE(array_length(d.blocages,1),0) > 0`);
    }
    if (commission && !Number.isNaN(Number(commission))) {
      conds.push(`COALESCE(d.commission_partenaire_eur,0) >= $${i++}::numeric`);
      vals.push(commission);
    }
    if (search) {
      conds.push(`(
        unaccent(COALESCE(c.prenom,'') || ' ' || COALESCE(c.nom,'')) ILIKE unaccent($${i}) OR
        COALESCE(c.email,'') ILIKE $${i} OR
        unaccent(COALESCE(e.denomination,'')) ILIKE unaccent($${i}) OR
        CAST(d.id AS text) ILIKE $${i}
      )`);
      vals.push(`%${search}%`);
      i++;
    }

    const sql = `
      SELECT
        d.id                    AS dossier_id,
        d.client_id,
        d.entreprise_id,
        d.statut,
        d.date_creation,
        d.date_creation_effective,
        d.derniere_modification,
        d.blocages,
        d.commission_partenaire_eur,
        c.prenom, c.nom, c.email, c.telephone,
        e.denomination AS entreprise_nom,
        e.forme        AS entreprise_forme,
        CASE 
          WHEN (e.service_paiement->>'statut') = 'Payé' THEN
            COALESCE((e.service_paiement->>'montant')::numeric, 0) * p.taux_commission / 100.0
          ELSE 0
        END AS commission_calculee,
        p.taux_commission
      FROM core.dossiers d
      JOIN core.clients     c ON c.id = d.client_id
      JOIN core.entreprises e ON e.id = d.entreprise_id
      JOIN core.partenaires p ON p.id = d.partenaire_id
      WHERE ${conds.join(" AND ")}
      ORDER BY d.date_creation DESC
      LIMIT $${i}
    `;
    vals.push(limit);

    const { rows } = await conn.query(sql, vals);

    const clients = rows.map(r => ({
      id: r.client_id,
      dossier_id: r.dossier_id,
      entreprise_id: r.entreprise_id,
      nom: r.nom,
      prenom: r.prenom,
      email: r.email,
      telephone: r.telephone,
      statut: r.statut,
      date_creation: r.date_creation,
      date_creation_effective: r.date_creation_effective,
      derniere_modification: r.derniere_modification,
      blocages: r.blocages || [],
      commission: Number(r.commission_calculee) || Number(r.commission_partenaire_eur) || 0,
      taux_commission: Number(r.taux_commission) || 0,
      entreprise_nom: r.entreprise_nom,
      entreprise_forme: r.entreprise_forme,
      fullName: `${r.prenom ?? ""} ${r.nom ?? ""}`.trim(),
      hasBlocked: Array.isArray(r.blocages) && r.blocages.length > 0,
      isCompleted: r.statut === "valide",
      isRejected: r.statut === "rejete",
    }));

    return res.json({ clients });
  } catch (e) {
    console.error("GET /api/partenaires/:id/clients error:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

// GET /api/partenaires/:id/interactions
export async function listPartnerInteractions(req, res, next) {
  try {
    const partnerId = Number(req.params.id);
    if (!Number.isFinite(partnerId)) {
      return res.status(400).json({ error: "ID partenaire invalide" });
    }

    const limit = Number(req.query.limit || 50);
    const type  = req.query.type || null; // "appel" | "email" | "reunion" | "relance" | "note" | "all"

    const conn = await pool.connect();
    try {
      // Partenaire (inclut le référent si dispo)
      const { rows: partenaires } = await conn.query(
        `SELECT id, nom, referent
           FROM core.partenaires
          WHERE id = $1`,
        [partnerId]
      );
      if (!partenaires.length) {
        return res.status(404).json({ error: "Partenaire introuvable" });
      }

      // Interactions (+ filtre optionnel)
      let q = `
        SELECT 
          id,
          partner_id,
          date_interaction,
          type_interaction,
          direction,
          sujet,
          notes,
          participant,
          duree_minutes,
          statut,
          prochaine_action,
          rappel_date,
          created_by,
          created_at
        FROM core.partner_interactions
        WHERE partner_id = $1
      `;
      const params = [partnerId];
      let i = 2;
      if (type && type !== "all") {
        q += ` AND type_interaction = $${i++}`;
        params.push(type);
      }
      q += ` ORDER BY date_interaction DESC LIMIT $${i}`;
      params.push(limit);

      const { rows: interactions } = await conn.query(q, params);

      // Prochaines actions (en attente)
      const { rows: prochaines } = await conn.query(
        `
        SELECT 
          id,
          sujet,
          prochaine_action,
          rappel_date,
          type_interaction
        FROM core.partner_interactions
        WHERE partner_id = $1 
          AND prochaine_action IS NOT NULL 
          AND statut != 'termine'
          AND (rappel_date IS NULL OR rappel_date >= CURRENT_DATE)
        ORDER BY COALESCE(rappel_date, date_interaction) ASC
        LIMIT 10
        `,
        [partnerId]
      );

      // Stats rapides
      const { rows: stats } = await conn.query(
        `
        SELECT 
          COUNT(*) as total_interactions,
          COUNT(CASE WHEN date_interaction >= NOW() - INTERVAL '30 days' THEN 1 END) as interactions_30j,
          COUNT(CASE WHEN type_interaction = 'appel' THEN 1 END) as nb_appels,
          COUNT(CASE WHEN type_interaction = 'reunion' THEN 1 END) as nb_reunions,
          COUNT(CASE WHEN prochaine_action IS NOT NULL AND statut != 'termine' THEN 1 END) as actions_en_attente,
          MAX(date_interaction) as derniere_interaction
        FROM core.partner_interactions
        WHERE partner_id = $1
        `,
        [partnerId]
      );

      // Utilisateurs du partenaire
      const { rows: partnerUsers } = await conn.query(
        `
        SELECT nom, email, role
        FROM core.partner_users
        WHERE partner_id = $1
        ORDER BY nom
        `,
        [partnerId]
      );

      // Participants historiques
      const { rows: historicParticipants } = await conn.query(
        `
        SELECT DISTINCT participant
        FROM core.partner_interactions
        WHERE partner_id = $1 
          AND participant IS NOT NULL 
          AND participant != ''
        ORDER BY participant
        `,
        [partnerId]
      );

      // Suggested contacts
      const suggestedContacts = [];
      const referent = partenaires[0]?.referent; // JSON ? {nom,email}? (on renvoie tel quel si présent)
      if (referent && referent.nom) {
        suggestedContacts.push({
          nom: referent.nom,
          email: referent.email || "",
          type: "Référent principal",
          display: `${referent.nom}${referent.email ? ` (${referent.email})` : ""} - Référent`,
        });
      }
      for (const user of partnerUsers) {
        if (user.nom) {
          suggestedContacts.push({
            nom: user.nom,
            email: user.email || "",
            type: `Utilisateur ${user.role}`,
            display: `${user.nom}${user.email ? ` (${user.email})` : ""} - ${user.role}`,
          });
        }
      }
      const existing = new Set(suggestedContacts.map(c => c.nom?.toLowerCase?.() || ""));
      for (const p of historicParticipants) {
        const name = (p.participant || "").toLowerCase();
        if (name && !existing.has(name)) {
          suggestedContacts.push({
            nom: p.participant,
            email: "",
            type: "Contact historique",
            display: `${p.participant} - Contact historique`,
          });
        }
      }

      return res.json({
        partenaire: partenaires[0],
        interactions,
        prochaines_actions: prochaines,
        stats: stats[0] || {},
        suggested_contacts: suggestedContacts,
        references: {
          types: [
            { value: "appel",   label: "Appel téléphonique" },
            { value: "email",   label: "Email" },
            { value: "reunion", label: "Réunion" },
            { value: "relance", label: "Relance commerciale" },
            { value: "note",    label: "Note interne" },
          ],
          directions: [
            { value: "entrant",        label: "Entrant" },
            { value: "sortant",        label: "Sortant" },
            { value: "bidirectionnel", label: "Bidirectionnel" },
          ],
        },
      });
    } finally {
      try { conn.release(); } catch {}
    }
  } catch (e) {
    console.error("Erreur GET interactions partenaire:", e);
    next(e);
  }
}

// POST /api/partenaires/:id/interactions
export async function createPartnerInteraction(req, res, next) {
  try {
    const partnerId = Number(req.params.id);
    if (!Number.isFinite(partnerId)) {
      return res.status(400).json({ error: "ID partenaire invalide" });
    }

    const {
      type_interaction,
      direction = "sortant",
      sujet,
      notes = "",
      participant = "",
      duree_minutes,
      prochaine_action = "",
      rappel_date,
      created_by = "Opérateur", // TODO: remplacer par l'utilisateur authentifié
    } = req.body || {};

    const validTypes = ["appel", "email", "reunion", "relance", "note"];
    const validDirections = ["entrant", "sortant", "bidirectionnel"];

    if (!type_interaction || !validTypes.includes(type_interaction)) {
      return res.status(400).json({ error: "Type d'interaction invalide" });
    }
    if (!sujet || !sujet.trim()) {
      return res.status(400).json({ error: "Sujet requis" });
    }
    if (direction && !validDirections.includes(direction)) {
      return res.status(400).json({ error: "Direction invalide" });
    }

    const conn = await pool.connect();
    try {
      // Vérifier existence du partenaire
      const { rows: partenaires } = await conn.query(
        `SELECT id FROM core.partenaires WHERE id = $1`,
        [partnerId]
      );
      if (!partenaires.length) {
        return res.status(404).json({ error: "Partenaire introuvable" });
      }

      // Insérer l'interaction
      const { rows } = await conn.query(
        `
        INSERT INTO core.partner_interactions 
          (partner_id, type_interaction, direction, sujet, notes, participant, duree_minutes, prochaine_action, rappel_date, created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING id, partner_id, date_interaction, type_interaction, direction, sujet, notes, participant, prochaine_action, rappel_date, created_by
        `,
        [
          partnerId,
          type_interaction,
          direction,
          sujet.trim(),
          notes.trim(),
          participant.trim(),
          duree_minutes ? parseInt(duree_minutes) : null,
          (prochaine_action || "").trim() || null,
          rappel_date || null,
          created_by,
        ]
      );

      return res.status(201).json({
        interaction: rows[0],
        message: "Interaction créée avec succès",
      });
    } finally {
      try { conn.release(); } catch {}
    }
  } catch (e) {
    console.error("Erreur POST interaction partenaire:", e);
    next(e);
  }
}


// GET /api/partenaires/:id/invoices/:invoiceId/pdf
export async function getInvoicePdf(req, res, next) {
  const partnerId = Number(req.params.id);
  const invoiceId = String(req.params.invoiceId || "");
  if (!Number.isFinite(partnerId) || !invoiceId) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  const conn = await pool.connect();
  try {
    // 1) Facture + infos partenaire
    const { rows: invoiceRows } = await conn.query(
      `
      SELECT 
        pi.*,
        p.nom AS partenaire_nom,
        p.coordonnees_facturation,
        p.paiement,
        p.taux_commission
      FROM core.partner_invoices pi
      JOIN core.partenaires p ON p.id = pi.partenaire_id
      WHERE pi.id = $1 AND pi.partenaire_id = $2
      `,
      [invoiceId, partnerId]
    );
    if (!invoiceRows.length) {
      return res.status(404).json({ error: "Facture introuvable" });
    }
    const invoice = invoiceRows[0];

    // 2) Données de la période
    const { rows: periodRows } = await conn.query(
      `SELECT ca, dossiers, periode
         FROM core.partner_period_ca 
        WHERE partenaire_id = $1 AND periode = $2`,
      [partnerId, invoice.periode]
    );
    const periodData = periodRows[0] || {};

    // 3) Paramètres société
    const { rows: companyRows } = await conn.query(
      `SELECT key, value FROM core.company_settings`
    );
    const companySettings = {};
    for (const r of companyRows) companySettings[r.key] = r.value;

    // 4) HTML
    const html = generateInvoiceHTML({
      invoice,
      partenaire: {
        nom: invoice.partenaire_nom,
        coordonnees: invoice.coordonnees_facturation || {},
        paiement: invoice.paiement || {},
      },
      periodData,
      companySettings,
    });

    // 5) PDF (Puppeteer)
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });
    await browser.close();

    // 6) Optionnel: marquer comme généré (comportement identique à ta route Next)
    await conn.query(
      `UPDATE core.partner_invoices SET pdf = $1 WHERE id = $2`,
      [`generated_${Date.now()}`, invoiceId]
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="facture_${invoiceId}.pdf"`
    );
    return res.status(200).send(pdfBuffer);
  } catch (e) {
    console.error("Erreur génération PDF facture:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/* ---------- Helper HTML ---------- */
function generateInvoiceHTML({ invoice, partenaire, periodData, companySettings }) {
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("fr-FR") : "");
  const formatAmount = (a) =>
    Number(a || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Facture ${invoice.id}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Helvetica', Arial, sans-serif; line-height:1.6; color:#333; font-size:14px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; border-bottom:2px solid #007bff; padding-bottom:20px; }
  .company-info h1 { font-size:24px; color:#007bff; margin-bottom:10px; }
  .invoice-info { text-align:right; }
  .invoice-info h2 { font-size:20px; margin-bottom:10px; color:#333; }
  .invoice-details { display:flex; justify-content:space-between; margin-bottom:40px; }
  .bill-to, .invoice-meta { width:48%; }
  .bill-to h3, .invoice-meta h3 { margin-bottom:10px; color:#007bff; border-bottom:1px solid #eee; padding-bottom:5px; }
  .items-table { width:100%; border-collapse:collapse; margin-bottom:30px; }
  .items-table th, .items-table td { padding:12px; text-align:left; border-bottom:1px solid #ddd; }
  .items-table th { background-color:#f8f9fa; font-weight:bold; }
  .total-section { display:flex; justify-content:flex-end; margin-bottom:40px; }
  .total-box { border:2px solid #007bff; padding:20px; background-color:#f8f9fa; min-width:300px; }
  .total-row { display:flex; justify-content:space-between; margin-bottom:10px; }
  .total-final { font-size:18px; font-weight:bold; border-top:2px solid #007bff; padding-top:10px; }
  .footer { margin-top:50px; padding-top:20px; border-top:1px solid #ddd; font-size:12px; color:#666; }
  .payment-info { background-color:#f8f9fa; padding:15px; border-radius:5px; margin-top:20px; }
  .text-right { text-align:right; } .text-center { text-align:center; }
</style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${partenaire.coordonnees.societe || partenaire.nom}</h1>
      <div>${partenaire.coordonnees.adresse || ""}</div>
      <div>${partenaire.coordonnees.email_facturation || ""}</div>
      <div>${partenaire.coordonnees.telephone || ""}</div>
      ${partenaire.coordonnees.siret ? `<div>SIRET: ${partenaire.coordonnees.siret}</div>` : ""}
    </div>
    <div class="invoice-info">
      <h2>FACTURE</h2>
      <div><strong>N°:</strong> ${invoice.id}</div>
      <div><strong>Date:</strong> ${formatDate(invoice.date)}</div>
      <div><strong>Échéance:</strong> ${formatDate(invoice.echeance)}</div>
    </div>
  </div>

  <div class="invoice-details">
    <div class="bill-to">
      <h3>Facturé à :</h3>
      <div><strong>${companySettings.company_name || "[À_CONFIGURER] Nom entreprise"}</strong></div>
      <div>${(companySettings.company_address || "[À_CONFIGURER] Adresse").replace(/\n/g,"<br>")}</div>
      <div>${companySettings.company_email || "[À_CONFIGURER] Email"}</div>
      ${companySettings.company_phone ? `<div>${companySettings.company_phone}</div>` : ""}
      ${companySettings.company_siret ? `<div>SIRET: ${companySettings.company_siret}</div>` : ""}
    </div>
    <div class="invoice-meta">
      <h3>Détails :</h3>
      <div><strong>Période:</strong> ${invoice.periode}</div>
      <div><strong>Statut:</strong> ${invoice.statut}</div>
      <div><strong>Dossiers traités:</strong> ${periodData.dossiers || 0}</div>
      <div><strong>CA total:</strong> ${formatAmount(periodData.ca)} €</div>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Période</th>
        <th class="text-right">CA de base</th>
        <th class="text-right">Taux</th>
        <th class="text-right">Montant</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Commission partenaire - ${periodData.dossiers || 0} dossier(s) traité(s)</td>
        <td>${invoice.periode}</td>
        <td class="text-right">${formatAmount(periodData.ca)} €</td>
        <td class="text-right">${invoice.taux_commission || 0}%</td>
        <td class="text-right">${formatAmount(invoice.montant)} €</td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-box">
      <div class="total-row"><span>Sous-total HT:</span><span>${formatAmount(invoice.montant)} €</span></div>
      <div class="total-row"><span>TVA (0%):</span><span>0,00 €</span></div>
      <div class="total-row total-final"><span>Total TTC:</span><span>${formatAmount(invoice.montant)} €</span></div>
    </div>
  </div>

  <div class="payment-info">
    <h3>Informations de paiement :</h3>
    <div><strong>Mode :</strong> ${companySettings.payment_terms || "Virement bancaire"}</div>
    ${companySettings.bank_iban ? `<div><strong>IBAN :</strong> ${companySettings.bank_iban}</div>` : ""}
    ${companySettings.bank_bic ? `<div><strong>BIC :</strong> ${companySettings.bank_bic}</div>` : ""}
    ${companySettings.bank_holder ? `<div><strong>Titulaire :</strong> ${companySettings.bank_holder}</div>` : ""}
    ${companySettings.late_penalty ? `<div style="margin-top:10px;color:#666;">Pénalités de retard : ${companySettings.late_penalty}</div>` : ""}
  </div>

  <div class="footer">
    <div style="text-align:left;margin-bottom:15px;">
      <div><strong>${companySettings.company_name || "[À_CONFIGURER] Nom entreprise"}</strong></div>
      ${companySettings.legal_form ? `<div>${companySettings.legal_form}</div>` : ""}
      ${companySettings.legal_capital ? `<div>Capital social : ${companySettings.legal_capital} €</div>` : ""}
      ${companySettings.legal_rcs ? `<div>${companySettings.legal_rcs}</div>` : ""}
      ${companySettings.company_vat ? `<div>TVA : ${companySettings.company_vat}</div>` : ""}
    </div>
    <div class="text-center">
      <p>Cette facture est générée automatiquement le ${formatDate(new Date())}</p>
      <p>En cas de question, contactez-nous à ${companySettings.company_email || "contact@entreprise.com"}</p>
    </div>
  </div>
</body>
</html>
`;
}


// POST /api/partenaires/:id/invoices
// Body: { action?: "preview"|"create", period?: "YYYY-MM", periode?: "YYYY-MM", rate?: number, dryRun?: boolean }
export async function postPartnerInvoices(req, res, next) {
  try {
    const partnerId = Number(req.params.id);
    if (!Number.isFinite(partnerId)) {
      return res.status(400).json({ error: "bad id" });
    }

    const body = req.body || {};
    const action = body.action; // "preview" | "create" | undefined
    const period = body.period || body.periode;
    const rate   = body.rate ?? null;

    if (!period || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) {
      return res.status(400).json({ error: "period must be 'YYYY-MM'" });
    }

    // Même logique que ta route Next : action === "preview" => dryRun true, "create" => false
    const dryRun = (body.dryRun !== undefined)
      ? Boolean(body.dryRun)
      : (action === "preview");

    const result = await previewOrCreateInvoice({
      partnerId,
      periode: period,
      rate,
      dryRun,
    });

    // preview => 200 ; create => 201 (mais on tolère dryRun explicite)
    const isCreate = dryRun === false || action === "create";
    return res.status(isCreate ? 201 : 200).json(result);
  } catch (e) {
    console.error("invoice POST error:", e);
    next(e);
  }
}


// GET /api/partenaires/:id
export async function getPartnerOverview(req, res, next) {
  const partnerId = Number(req.params?.id);
  if (!Number.isFinite(partnerId)) {
    return res.status(400).json({ error: "bad id" });
  }

  const conn = await pool.connect();
  try {
    // 1) Partenaire (JSONB protégés par COALESCE)
    const { rows: pRows } = await conn.query(
      `
      SELECT id, nom, adresse, integration, type_facturation, taux_commission, segment,
             referent, contrat,
             COALESCE(paiement, '{}'::jsonb)                AS paiement,
             COALESCE(coordonnees_facturation, '{}'::jsonb) AS coordonnees_facturation,
             COALESCE(docs, '{}'::jsonb)                    AS docs,
             COALESCE(ca_total, 0)                          AS ca_total,
             COALESCE(commissions_total, 0)                 AS commissions_total
      FROM core.partenaires
      WHERE id = $1
      `,
      [partnerId]
    );
    if (!pRows.length) return res.status(404).json({ error: "not found" });
    const partenaire = pRows[0];
    const taux = Number(partenaire.taux_commission || 0);

    // 2) La colonne commissions existe ?
    const { rows: colCheck } = await conn.query(
      `
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'core'
        AND table_name   = 'partner_period_ca'
        AND column_name  = 'commissions'
      LIMIT 1
      `
    );
    const hasCommissionsColumn = colCheck.length > 0;

    // 3) Agrégats en temps réel
    const aggSql = `
      SELECT
        COALESCE(SUM(ca), 0)::numeric AS ca_total_calc,
        COALESCE(SUM(
          ${hasCommissionsColumn ? "commissions" : "(ca * $2::numeric / 100.0)"}
        ), 0)::numeric AS commissions_total_calc
      FROM core.partner_period_ca
      WHERE partenaire_id = $1
    `;
    const aggParams = hasCommissionsColumn ? [partnerId] : [partnerId, taux];
    const { rows: agg } = await conn.query(aggSql, aggParams);
    const { ca_total_calc = 0, commissions_total_calc = 0 } = agg[0] || {};

    partenaire.ca_total = Number(ca_total_calc);
    partenaire.commissions_total = Number(commissions_total_calc);

    // 4) CA par période
    let ca_par_periode = [];
    if (hasCommissionsColumn) {
      const { rows } = await conn.query(
        `
        SELECT
          ppc.periode,
          COALESCE(ppc.ca, 0)::numeric          AS ca,
          COALESCE(ppc.dossiers, 0)::int        AS dossiers,
          COALESCE(ppc.commissions, 0)::numeric AS commissions
        FROM core.partner_period_ca ppc
        WHERE ppc.partenaire_id = $1
        ORDER BY ppc.periode ASC
        `,
        [partnerId]
      );
      ca_par_periode = rows;
    } else {
      const { rows } = await conn.query(
        `
        SELECT
          periode,
          COALESCE(ca, 0)::numeric AS ca,
          COALESCE(dossiers, 0)::int AS dossiers,
          NULL::numeric AS commissions
        FROM core.partner_period_ca
        WHERE partenaire_id = $1
        ORDER BY periode ASC
        `,
        [partnerId]
      );
      ca_par_periode = rows;
    }

    // 5) Factures
    const { rows: factures } = await conn.query(
      `
      SELECT id, montant, date, statut, periode, echeance, pdf
      FROM core.partner_invoices
      WHERE partenaire_id = $1
      ORDER BY periode DESC, date DESC
      `,
      [partnerId]
    );

    // 6) Users partenaire
    const { rows: partner_users } = await conn.query(
      `
      SELECT id, email, nom, role, two_fa_enabled, last_login_at
      FROM core.partner_users
      WHERE partner_id = $1
      ORDER BY email
      `,
      [partnerId]
    );

    // 7) Dossiers
    const { rows: dossiers } = await conn.query(
      `
      SELECT id, statut, client_id, entreprise_id, blocages, date_creation, derniere_modification
      FROM core.dossiers
      WHERE partenaire_id = $1
      ORDER BY date_creation DESC
      `,
      [partnerId]
    );

    // 8) Exports
    const { rows: partner_exports_history } = await conn.query(
      `
      SELECT id, format, filtres, generated_at, file
      FROM core.partner_exports_history
      WHERE partner_id = $1
      ORDER BY generated_at DESC
      `,
      [partnerId]
    );

    // Dérivés
    const sum = (xs, key) => xs.reduce((s, x) => s + Number(x?.[key] || 0), 0);
    const derived_totals = {
      ca_total: sum(ca_par_periode, "ca"),
      commissions_total: sum(ca_par_periode, "commissions"),
      dossiers_payes: sum(ca_par_periode, "dossiers"),
    };

    return res.json({
      partenaire,
      ca_par_periode,
      factures,
      partner_users,
      dossiers,
      partner_exports_history,
      derived_totals,
    });
  } catch (e) {
    console.error("GET /api/partenaires/:id failed:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}



// Helpers
function bounds(periode /* "YYYY-MM" */) {
  const [y, m] = (periode || "").split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const nextStart = new Date(Date.UTC(m === 12 ? y + 1 : y, m === 12 ? 0 : m, 1));
  return {
    startISO: start.toISOString().slice(0, 10),
    nextStartISO: nextStart.toISOString().slice(0, 10),
  };
}
function endOfPeriodISO(periode) {
  const y = Number(periode.slice(0, 4));
  const m = Number(periode.slice(5, 7));
  const d = new Date(Date.UTC(y, m, 0)); // dernier jour du mois
  return d.toISOString().slice(0, 10);
}
function genInvoiceId(partnerId, periode) {
  const rnd = Math.floor(100000 + Math.random() * 900000);
  return `F${periode.replace("-", "")}-${partnerId}-${rnd}`;
}

/** POST /api/partenaires/close-month
 *  Body: { partnerId: number, period?: "YYYY-MM" }
 *  - si period absent => mois précédent
 */
export async function postCloseMonth(req, res, next) {
  const client = await pool.connect();
  try {
    const body = req.body || {};
    let { period, partnerId } = body;

    // default = mois précédent (UTC)
    if (!period) {
      const now = new Date();
      const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
      period = `${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, "0")}`;
    }
    if (!partnerId || !Number.isFinite(Number(partnerId))) {
      return res.status(400).json({ error: "partnerId requis" });
    }
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) {
      return res.status(400).json({ error: "period doit être 'YYYY-MM'" });
    }
    partnerId = Number(partnerId);

    await client.query("BEGIN");

    // 1) taux
    const { rows: pRows } = await client.query(
      `SELECT taux_commission FROM core.partenaires WHERE id=$1`,
      [partnerId]
    );
    if (!pRows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "partenaire introuvable" });
    }
    const rate = Number(pRows[0].taux_commission || 0) / 100;

    // 2) calcul période (CA des dossiers "Payé" seulement)
    const { startISO, nextStartISO } = bounds(period);
    const { rows: dossiers } = await client.query(
      `
      SELECT COALESCE((e.service_paiement->>'montant')::numeric,0) AS fee_eur
      FROM core.dossiers d
      JOIN core.entreprises e ON e.id = d.entreprise_id
      WHERE d.partenaire_id = $1
        AND (e.service_paiement->>'statut') = 'Payé'
        AND COALESCE(d.date_creation_effective, d.date_creation) >= $2::date
        AND COALESCE(d.date_creation_effective, d.date_creation) <  $3::date
      `,
      [partnerId, startISO, nextStartISO]
    );
    const ca = dossiers.reduce((s, d) => s + Number(d.fee_eur || 0), 0);
    const dossiersCount = dossiers.length;
    const commission = Math.round(ca * rate * 100) / 100;

    // 3) upsert récap période
    await client.query(
      `
      INSERT INTO core.partner_period_ca (partenaire_id, periode, ca, dossiers)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (partenaire_id, periode)
      DO UPDATE SET ca = EXCLUDED.ca, dossiers = EXCLUDED.dossiers
      `,
      [partnerId, period, ca, dossiersCount]
    );

    // 4) upsert facture en 'payee' à la fin du mois
    const invoiceDateISO = endOfPeriodISO(period);
    const { rows: existing } = await client.query(
      `SELECT id FROM core.partner_invoices WHERE partenaire_id=$1 AND periode=$2`,
      [partnerId, period]
    );
    const invoiceId = existing[0]?.id ?? genInvoiceId(partnerId, period);

    await client.query(
      `
      INSERT INTO core.partner_invoices (id, partenaire_id, montant, date, statut, periode, echeance, pdf)
      VALUES ($1,$2,$3,$4,'payee',$5,$4,NULL)
      ON CONFLICT (partenaire_id, periode)
      DO UPDATE SET montant=EXCLUDED.montant, date=EXCLUDED.date, statut='payee', echeance=EXCLUDED.echeance
      `,
      [invoiceId, partnerId, commission, invoiceDateISO, period]
    );

    await client.query("COMMIT");
    return res.json({
      ok: true,
      period,
      partnerId,
      ca,
      dossiers: dossiersCount,
      commission,
      invoiceId,
      statut: "payee",
      date: invoiceDateISO,
    });
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("close-month error:", e);
    next(e);
  } finally {
    try { client.release(); } catch {}
  }
}

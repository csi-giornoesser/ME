import { pool } from "../config/db.js";

// POST /api/tickets/:id/events
// Body: { message: string, attachments?: any }
export async function addTicketEvent(req, res, next) {
  const ticketId = Number(req.params.id);
  if (!Number.isFinite(ticketId)) {
    return res.status(400).json({ error: "ID ticket invalide" });
  }

  const { message, attachments = null } = req.body || {};
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: "Message requis" });
  }

  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    // 1) vérifier que le ticket existe
    const { rows: tickets } = await conn.query(
      `SELECT id, statut FROM core.tickets WHERE id = $1`,
      [ticketId]
    );
    if (!tickets.length) {
      await conn.query("ROLLBACK");
      return res.status(404).json({ error: "Ticket introuvable" });
    }

    // 2) insérer l’event
    const { rows: events } = await conn.query(
      `
      INSERT INTO core.ticket_events (ticket_id, message, attachments)
      VALUES ($1, $2, $3)
      RETURNING id, ticket_id, at, message, attachments
      `,
      [
        ticketId,
        String(message).trim(),
        attachments != null ? JSON.stringify(attachments) : null,
      ]
    );

    // 3) si fermé → rouvrir + tracer
    if (tickets[0].statut === "Fermé") {
      await conn.query(
        `UPDATE core.tickets SET statut = 'En cours' WHERE id = $1`,
        [ticketId]
      );
      await conn.query(
        `INSERT INTO core.ticket_events (ticket_id, message) VALUES ($1, $2)`,
        [ticketId, "Ticket rouvert automatiquement suite à un nouveau message"]
      );
    }

    await conn.query("COMMIT");
    return res.status(201).json({
      event: events[0],
      message: "Message ajouté avec succès",
    });
  } catch (e) {
    await conn.query("ROLLBACK").catch(() => {});
    console.error("Erreur POST ticket event:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/** GET /api/tickets/:id */
export async function getTicket(req, res, next) {
  const ticketId = Number(req.params.id);
  if (!Number.isFinite(ticketId)) {
    return res.status(400).json({ error: "ID ticket invalide" });
  }

  const conn = await pool.connect();
  try {
    // ticket + infos liées
    const { rows: tickets } = await conn.query(
      `
      SELECT 
        t.id,
        t.dossier_id,
        t.subject,
        t.statut,
        t.priorite,
        t.assigne_operateur_id,
        t.ouverture,
        t.source,
        t.created_at,

        d.statut as dossier_statut,
        d.client_id,
        d.entreprise_id,
        d.partenaire_id,
        d.date_creation as dossier_date_creation,
        d.commission_partenaire_eur,

        c.prenom,
        c.nom,
        c.email,
        c.telephone,

        e.denomination,
        e.forme,

        p.nom as partenaire_nom,

        o.nom as operateur_nom,
        o.email as operateur_email
      FROM core.tickets t
      LEFT JOIN core.dossiers d   ON t.dossier_id = d.id
      LEFT JOIN core.clients c    ON d.client_id = c.id
      LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
      LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
      LEFT JOIN core.operateurs o   ON t.assigne_operateur_id = o.id
      WHERE t.id = $1
      `,
      [ticketId]
    );
    if (!tickets.length) {
      return res.status(404).json({ error: "Ticket introuvable" });
    }
    const ticket = tickets[0];

    // events
    const { rows: events } = await conn.query(
      `
      SELECT id, ticket_id, at, message, attachments
      FROM core.ticket_events
      WHERE ticket_id = $1
      ORDER BY at ASC
      `,
      [ticketId]
    );

    // opérateurs (pour assignation)
    const { rows: operateurs } = await conn.query(
      `SELECT id, nom, email, role FROM core.operateurs ORDER BY nom`
    );

    return res.json({
      ticket,
      events,
      operateurs,
      references: {
        statuts: ["Nouveau", "En cours", "Résolu", "Fermé"],
        priorites: ["Basse", "Moyenne", "Haute"],
      },
    });
  } catch (e) {
    console.error("Erreur GET ticket detail:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/** PATCH /api/tickets/:id */
export async function patchTicket(req, res, next) {
  const ticketId = Number(req.params.id);
  if (!Number.isFinite(ticketId)) {
    return res.status(400).json({ error: "ID ticket invalide" });
  }

  const {
    statut,
    priorite,
    assigne_operateur_id,
    subject,
    auto_event_message = true,
  } = req.body || {};

  const validStatuts = ["Nouveau", "En cours", "Résolu", "Fermé"];
  const validPriorites = ["Basse", "Moyenne", "Haute"];
  if (statut && !validStatuts.includes(statut)) {
    return res.status(400).json({ error: "Statut invalide" });
  }
  if (priorite && !validPriorites.includes(priorite)) {
    return res.status(400).json({ error: "Priorité invalide" });
  }

  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    const { rows: currentTicket } = await conn.query(
      `SELECT statut, priorite, assigne_operateur_id, subject FROM core.tickets WHERE id = $1`,
      [ticketId]
    );
    if (!currentTicket.length) {
      await conn.query("ROLLBACK");
      return res.status(404).json({ error: "Ticket introuvable" });
    }
    const current = currentTicket[0];

    let updateFields = [];
    let updateParams = [];
    let i = 1;
    const changes = [];

    if (statut && statut !== current.statut) {
      updateFields.push(`statut = $${i++}`);
      updateParams.push(statut);
      changes.push(`Statut: ${current.statut} → ${statut}`);
    }
    if (priorite && priorite !== current.priorite) {
      updateFields.push(`priorite = $${i++}`);
      updateParams.push(priorite);
      changes.push(`Priorité: ${current.priorite} → ${priorite}`);
    }
    if (assigne_operateur_id !== undefined && assigne_operateur_id !== current.assigne_operateur_id) {
      updateFields.push(`assigne_operateur_id = $${i++}`);
      updateParams.push(assigne_operateur_id);
      changes.push(assigne_operateur_id === null ? "Ticket désassigné" : `Assigné à l'opérateur #${assigne_operateur_id}`);
    }
    if (subject && subject.trim() !== current.subject) {
      updateFields.push(`subject = $${i++}`);
      updateParams.push(subject.trim());
      changes.push(`Sujet modifié: "${subject.trim()}"`);
    }

    if (updateFields.length === 0) {
      await conn.query("ROLLBACK");
      return res.json({ message: "Aucune modification détectée" });
    }

    updateParams.push(ticketId);
    const { rows: updated } = await conn.query(
      `
      UPDATE core.tickets
      SET ${updateFields.join(", ")}
      WHERE id = $${i}
      RETURNING id, subject, statut, priorite, assigne_operateur_id
      `,
      updateParams
    );

    if (auto_event_message && changes.length) {
      await conn.query(
        `INSERT INTO core.ticket_events (ticket_id, message) VALUES ($1, $2)`,
        [ticketId, `Modifications: ${changes.join(", ")}`]
      );
    }

    await conn.query("COMMIT");
    return res.json({
      ticket: updated[0],
      changes,
      message: "Ticket mis à jour avec succès",
    });
  } catch (e) {
    await conn.query("ROLLBACK").catch(() => {});
    console.error("Erreur PATCH ticket:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}


/** GET /api/tickets?statut=&priorite=&operatorId=&dossierId=&limit=&offset= */
export async function listTickets(req, res, next) {
  const statut     = req.query.statut || null;         // "Nouveau" | "En cours" | "Résolu" | "Fermé" | "all"
  const priorite   = req.query.priorite || null;       // "Basse" | "Moyenne" | "Haute" | "all"
  const operatorId = req.query.operatorId || null;     // number | "all"
  const dossierId  = req.query.dossierId || null;      // number
  const limit      = Math.max(1, Math.min( parseInt(req.query.limit ?? "50", 10), 200 ));
  const offset     = Math.max(0, parseInt(req.query.offset ?? "0", 10));

  try {
    const where = [];
    const params = [];
    let i = 1;

    if (statut && statut !== "all")     { where.push(`t.statut = $${i++}`); params.push(statut); }
    if (priorite && priorite !== "all") { where.push(`t.priorite = $${i++}`); params.push(priorite); }
    if (operatorId && operatorId !== "all") { where.push(`t.assigne_operateur_id = $${i++}`); params.push(Number(operatorId)); }
    if (dossierId) { where.push(`t.dossier_id = $${i++}`); params.push(Number(dossierId)); }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Liste paginée avec dernier event (LATERAL)
    const listSql = `
      SELECT 
        t.id,
        t.dossier_id,
        t.subject,
        t.statut,
        t.priorite,
        t.assigne_operateur_id,
        t.ouverture,
        t.source,
        t.created_at,
        d.statut AS dossier_statut,
        d.client_id,
        c.prenom,
        c.nom,
        c.email,
        o.nom  AS operateur_nom,
        o.email AS operateur_email,
        te.message AS dernier_message,
        te.at AS dernier_event_at
      FROM core.tickets t
      LEFT JOIN core.dossiers  d ON t.dossier_id = d.id
      LEFT JOIN core.clients   c ON d.client_id = c.id
      LEFT JOIN core.operateurs o ON t.assigne_operateur_id = o.id
      LEFT JOIN LATERAL (
        SELECT message, at
        FROM core.ticket_events
        WHERE ticket_id = t.id
        ORDER BY at DESC
        LIMIT 1
      ) te ON TRUE
      ${whereSql}
      ORDER BY t.created_at DESC
      LIMIT $${i++} OFFSET $${i++}
    `;
    const listParams = [...params, limit, offset];

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM core.tickets t
      LEFT JOIN core.dossiers d ON t.dossier_id = d.id
      ${whereSql}
    `;

    const conn = await pool.connect();
    try {
      const [{ rows: tickets }, { rows: [countRow] }, { rows: operateurs }] = await Promise.all([
        conn.query(listSql, listParams),
        conn.query(countSql, params),
        conn.query(`SELECT id, nom, email FROM core.operateurs ORDER BY nom`)
      ]);

      return res.json({
        tickets,
        total: countRow?.total ?? 0,
        limit,
        offset,
        filters: {
          statuts: ["Nouveau", "En cours", "Résolu", "Fermé"],
          priorites: ["Basse", "Moyenne", "Haute"],
          operateurs
        }
      });
    } finally {
      try { conn.release(); } catch {}
    }
  } catch (e) {
    console.error("Erreur GET /api/tickets:", e);
    next(e);
  }
}

/** POST /api/tickets
 * Body: {
 *  dossier_id: number,
 *  subject?: string,
 *  priorite?: "Basse"|"Moyenne"|"Haute",
 *  assigne_operateur_id?: number|null,
 *  ouverture?: "auto"|"manuelle",
 *  source?: string,
 *  message?: string,
 *  attachments?: any,
 *  sender_type?: string
 * }
 */
export async function createTicket(req, res, next) {
  const {
    dossier_id,
    subject = "Nouveau ticket",
    priorite = "Moyenne",
    assigne_operateur_id = null,
    ouverture = "manuelle",
    source,
    message = "Ticket créé depuis le CRM",
    attachments = null,
    sender_type
  } = req.body || {};

  if (!dossier_id) return res.status(400).json({ error: "dossier_id requis" });
  if (!subject || !String(subject).trim()) return res.status(400).json({ error: "subject requis" });

  const computedSource = source ?? `manual:${(sender_type || "operateur").toLowerCase()}:${Date.now()}`;

  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    const { rows: tickets } = await conn.query(
      `
      INSERT INTO core.tickets
        (dossier_id, subject, statut, priorite, assigne_operateur_id, ouverture, source)
      VALUES ($1, $2, 'Nouveau', $3, $4, $5, $6)
      RETURNING id, dossier_id, subject, statut, priorite, assigne_operateur_id, ouverture, source, created_at
      `,
      [dossier_id, String(subject).trim(), priorite, assigne_operateur_id, ouverture, computedSource]
    );

    await conn.query(
      `INSERT INTO core.ticket_events (ticket_id, message, attachments) VALUES ($1, $2, $3)`,
      [tickets[0].id, message, attachments != null ? JSON.stringify(attachments) : null]
    );

    await conn.query("COMMIT");
    return res.status(201).json({ ticket: tickets[0], message: "Ticket créé avec succès" });
  } catch (e) {
    await conn.query("ROLLBACK").catch(() => {});
    console.error("Erreur POST /api/tickets:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

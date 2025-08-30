import path from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { pool } from "../config/db.js";

import crypto from "crypto";
import { promises as fs } from "fs";

const DOCUMENT_TYPE_MAPPING = {
  attestation: ["Attestation URSSAF"],
  sirene: ["Avis de situation SIRENE"],
  siren: ["Avis de situation SIRENE"],
  p0: ["P0 Micro-Entrepreneur"],
  inpi: ["Preuve depot INPI"],
  rne: ["Extrait RNE"],
  recapitulatif: ["Recapitulatif Donnees"],
  recu: ["Recu Paiement"],
  mandat: ["Mandat signé"],
};

// Optionnel: chemin base des fichiers (env > fallback)
const DOCS_BASE_DIR = process.env.DOCS_BASE_DIR
  || path.join(process.cwd(), "uploads", "documents", "generated");

// ---- GET /api/dossiers/:id/documents/:type/download
export async function downloadDossierDocument(req, res, next) {
  const dossierId = Number(req.params.id);
  const documentType = String(req.params.type || "").toLowerCase();

  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({ error: "ID dossier invalide" });
  }
  if (!documentType) {
    return res.status(400).json({ error: "Type de document requis" });
  }

  const allowedTypes = DOCUMENT_TYPE_MAPPING[documentType];
  if (!allowedTypes) {
    return res.status(400).json({
      error: `Type de document non supporté. Types disponibles: ${Object.keys(DOCUMENT_TYPE_MAPPING).join(", ")}`,
    });
  }

  const conn = await pool.connect();
  try {
    // 1) dossier + entreprise
    const { rows: dossiers } = await conn.query(
      `
      SELECT d.id AS dossier_id, d.entreprise_id, d.statut,
             c.prenom, c.nom, c.email,
             e.denomination
      FROM core.dossiers d
      JOIN core.clients c     ON d.client_id = c.id
      JOIN core.entreprises e ON d.entreprise_id = e.id
      WHERE d.id = $1
      `,
      [dossierId]
    );
    if (!dossiers.length) return res.status(404).json({ error: "Dossier introuvable" });
    const dossier = dossiers[0];

    // 2) document généré le plus récent du type demandé
    const { rows: documents } = await conn.query(
      `
      SELECT id, type, source, fichier, date
      FROM core.documents_generes
      WHERE entreprise_id = $1
        AND type = ANY($2)
      ORDER BY date DESC
      LIMIT 1
      `,
      [dossier.entreprise_id, allowedTypes]
    );
    if (!documents.length) {
      return res.status(404).json({
        error: `Document "${documentType}" non disponible pour ce dossier`,
        details: `Aucun document de type ${allowedTypes.join(" ou ")} trouvé`,
      });
    }
    const doc = documents[0];

    // 3) lire le fichier (ou fallback PDF “substitut”)
    const filePath = path.join(DOCS_BASE_DIR, doc.fichier);
    let buffer;
    let fileName;
    let contentType = "application/octet-stream";

    if (existsSync(filePath)) {
      buffer = await readFile(filePath);
      const ext = path.extname(doc.fichier).toLowerCase();
      if (ext === ".pdf") contentType = "application/pdf";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      fileName = `${documentType}_${dossierId}${ext || ""}`;
    } else {
      // substitut simple PDF si fichier absent
      buffer = generateSubstitutePdf(doc, dossier);
      contentType = "application/pdf";
      fileName = `${documentType}_${dossierId}.pdf`;
      console.warn("Fichier manquant, substitution générée:", filePath);
    }

    // 4) log de téléchargement
    await conn.query(
      `INSERT INTO core.dossier_events (dossier_id, action, meta)
       VALUES ($1, $2, $3)`,
      [
        dossierId,
        "document_downloaded",
        JSON.stringify({
          document_type: doc.type,
          document_id: doc.id,
          filename: doc.fichier,
          client: `${dossier.prenom} ${dossier.nom}`,
        }),
      ]
    );

    // 5) réponse fichier
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Cache-Control", "no-cache");
    return res.status(200).send(buffer);
  } catch (e) {
    console.error("Erreur téléchargement document:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

// ---- POST /api/dossiers/:id/documents  (liste des documents disponibles)
export async function listDossierDocuments(req, res, next) {
  const dossierId = Number(req.params.id);
  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({ error: "ID dossier invalide" });
  }

  const conn = await pool.connect();
  try {
    const { rows: documents } = await conn.query(
      `
      SELECT dg.id, dg.type, dg.source, dg.fichier, dg.date, d.id AS dossier_id
      FROM core.documents_generes dg
      JOIN core.entreprises e ON dg.entreprise_id = e.id
      JOIN core.dossiers d    ON d.entreprise_id = e.id
      WHERE d.id = $1
      ORDER BY dg.date DESC
      `,
      [dossierId]
    );

    const available = documents.map((doc) => {
      const urlType =
        Object.keys(DOCUMENT_TYPE_MAPPING).find((k) =>
          DOCUMENT_TYPE_MAPPING[k].includes(doc.type)
        ) || "document";

      return {
        id: doc.id,
        type: doc.type,
        source: doc.source,
        date: doc.date,
        download_url: `/api/dossiers/${dossierId}/documents/${urlType}/download`,
        filename: doc.fichier,
      };
    });

    return res.json({
      dossier_id: dossierId,
      available_documents: available,
      total_count: documents.length,
      document_types: [...new Set(documents.map((d) => d.type))],
    });
  } catch (e) {
    console.error("Erreur liste documents:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

// ---- PDF substitut minimal
function generateSubstitutePdf(document, dossier) {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R
   /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 200 >>
stream
BT
/F1 12 Tf
72 720 Td
(${document.type}) Tj
0 -20 Td
(Dossier #${dossier.dossier_id}) Tj
0 -20 Td
(Client: ${dossier.prenom} ${dossier.nom}) Tj
0 -20 Td
(Entreprise: ${dossier.denomination || 'En cours de création'}) Tj
0 -20 Td
(Date: ${(document.date || new Date().toISOString().slice(0,10))}) Tj
0 -20 Td
(Source: ${document.source || 'Système'}) Tj
0 -40 Td
(Document de substitution) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
623
%%EOF`;
  return Buffer.from(content, "utf-8");
}

/** POST /api/dossiers/:id/etapes/formulaire/completer */
export async function completeFormStep(req, res, next) {
  const dossierId = Number(req.params.id);
  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({ error: "ID dossier invalide" });
  }

  const conn = await pool.connect();
  try {
    await conn.query(
      `
      INSERT INTO core.dossier_events (dossier_id, action, meta)
      VALUES ($1, 'step_completed', jsonb_build_object('step','formulaire'))
      `,
      [dossierId]
    );
    return res.json({ ok: true });
  } catch (e) {
    console.error("complete form error:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}


/** GET /api/dossiers/:id/messages */
export async function getDossierMessages(req, res, next) {
  const dossierId = Number(req.params.id);
  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({ error: "ID dossier invalide" });
  }

  const conn = await pool.connect();
  try {
    // Contexte dossier (client + entreprise)
    const { rows: dossiers } = await conn.query(
      `
      SELECT d.id, d.client_id, d.statut,
             c.prenom, c.nom, c.email,
             e.denomination
      FROM core.dossiers d
      LEFT JOIN core.clients c     ON d.client_id = c.id
      LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
      WHERE d.id = $1
      `,
      [dossierId]
    );
    if (!dossiers.length) return res.status(404).json({ error: "Dossier introuvable" });
    const dossier = dossiers[0];

    // Messages
    const { rows: messages } = await conn.query(
      `
      SELECT id, dossier_id, sender_type, body, at
      FROM core.messages
      WHERE dossier_id = $1
      ORDER BY at ASC
      `,
      [dossierId]
    );

    return res.json({
      dossier,
      messages,
      references: { sender_types: ["Client", "Opérateur", "Système"] },
    });
  } catch (e) {
    console.error("Erreur GET messages dossier:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}

/** POST /api/dossiers/:id/messages
 * Body: {
 *  sender_type?: "Client"|"Opérateur"|"Système",
 *  body: string,
 *  send_email?: boolean,
 *  email_template?: string
 * }
 */
export async function postDossierMessage(req, res, next) {
  const dossierId = Number(req.params.id);
  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({ error: "ID dossier invalide" });
  }

  const {
    sender_type = "Opérateur",
    body: messageBody,
    send_email = true,
    email_template = "message_operateur",
  } = req.body || {};

  if (!messageBody || !String(messageBody).trim()) {
    return res.status(400).json({ error: "Message requis" });
  }
  const validSender = ["Client", "Opérateur", "Système"];
  if (!validSender.includes(sender_type)) {
    return res.status(400).json({ error: "sender_type invalide" });
  }

  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");

    const { rows: dossiers } = await conn.query(
      `
      SELECT d.id, d.client_id, c.email AS client_email, c.prenom, c.nom
      FROM core.dossiers d
      LEFT JOIN core.clients c ON d.client_id = c.id
      WHERE d.id = $1
      `,
      [dossierId]
    );
    if (!dossiers.length) {
      await conn.query("ROLLBACK");
      return res.status(404).json({ error: "Dossier introuvable" });
    }
    const dossier = dossiers[0];

    const { rows: messages } = await conn.query(
      `
      INSERT INTO core.messages (dossier_id, sender_type, body)
      VALUES ($1, $2, $3)
      RETURNING id, dossier_id, sender_type, body, at
      `,
      [dossierId, sender_type, String(messageBody).trim()]
    );
    const message = messages[0];

    // Email auto + notif queue si opérateur et email client présent
    if (send_email && sender_type === "Opérateur" && dossier.client_email) {
      await conn.query(
        `
        INSERT INTO core.emails_automatiques (type, envoye_le, client_id, dossier_id, canal)
        VALUES ($1, NOW(), $2, $3, 'email')
        `,
        [email_template || "message_operateur", dossier.client_id, dossierId]
      );

      await conn.query(
        `
        INSERT INTO core.notifications_queue (id, type, client_id, dossier_id, canal, scheduled_for, message)
        VALUES ($1, $2, $3, $4, 'email', NOW() + INTERVAL '1 minute', $5)
        `,
        [
          `msg_${message.id}_${Date.now()}`,
          "nouveau_message_operateur",
          dossier.client_id,
          dossierId,
          String(messageBody).trim(),
        ]
      );
    }

    await conn.query("COMMIT");
    return res.status(201).json({
      message,
      email_sent: Boolean(send_email && sender_type === "Opérateur"),
      client_email: dossier.client_email,
      success_message: "Message ajouté avec succès",
    });
  } catch (e) {
    await conn.query("ROLLBACK").catch(() => {});
    console.error("Erreur POST message dossier:", e);
    next(e);
  } finally {
    try { conn.release(); } catch {}
  }
}


// ------- helpers -------
function extnameSafe(filename = "") {
  const ext = path.extname(filename || "").toLowerCase();
  return ext || "";
}
function makeSafeFilename(originalName = "", prefix = "") {
  const base = path.basename(originalName || "file");
  const id = crypto.randomUUID();
  return `${prefix}${id}__${base.replace(/\s+/g, "_")}`;
}

// Auto-completion des étapes (reprise de ta logique Next)
async function checkAndCompleteSteps(client, dossierId) {
  try {
    const piecesRes = await client.query(`
      SELECT 
        COUNT(*) as total_pieces,
        COUNT(CASE WHEN statut IN ('valide', 'en_attente') THEN 1 END) as uploaded_pieces
      FROM core.pieces_justificatives 
      WHERE dossier_id = $1 AND piece_key != 'MandatSigne'
    `, [dossierId]);

    const totalPieces = parseInt(piecesRes.rows[0]?.total_pieces || 0);
    const uploadedPieces = parseInt(piecesRes.rows[0]?.uploaded_pieces || 0);

    if (totalPieces > 0 && uploadedPieces >= totalPieces) {
      const existingStep = await client.query(`
        SELECT id FROM core.dossier_events 
        WHERE dossier_id = $1 AND action = 'step_completed' AND meta->>'step' = 'pieces' LIMIT 1
      `, [dossierId]);
      if (!existingStep.rows.length) {
        await client.query(`
          INSERT INTO core.dossier_events (dossier_id, action, meta)
          VALUES ($1, 'step_completed', jsonb_build_object('step','pieces','auto_completed',true,'completed_at',NOW()))
        `, [dossierId]);
      }
    }

    const mandatRes = await client.query(`
      SELECT statut FROM core.pieces_justificatives 
      WHERE dossier_id = $1 AND piece_key = 'MandatSigne' LIMIT 1
    `, [dossierId]);
    const mandatUploaded = ["valide","en_attente"].includes(mandatRes.rows[0]?.statut);

    if (mandatUploaded) {
      const existingMandat = await client.query(`
        SELECT id FROM core.dossier_events 
        WHERE dossier_id = $1 AND action = 'step_completed' AND meta->>'step' = 'mandat' LIMIT 1
      `, [dossierId]);
      if (!existingMandat.rows.length) {
        await client.query(`
          INSERT INTO core.dossier_events (dossier_id, action, meta)
          VALUES ($1, 'step_completed', jsonb_build_object('step','mandat','auto_completed',true,'completed_at',NOW()))
        `, [dossierId]);
      }
    }
  } catch (err) {
    console.warn("checkAndCompleteSteps warn:", err.message);
  }
}

/** POST /api/dossiers/:id/pieces/:piece_key/upload  (multipart; champ 'file') */
export async function uploadDossierPiece(req, res, next) {
  const dossierId = Number(req.params.id);
  const piece_key = String(req.params.piece_key || "");

  if (!Number.isFinite(dossierId) || !piece_key) {
    return res.status(400).json({ error: "Paramètres invalides", error_code: "INVALID_PARAMS" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier fourni (champ 'file')", error_code: "FILE_MISSING" });
  }

  const client = await pool.connect();
  try {
    // 1) pièce autorisée ?
    const chk = await client.query("SELECT core.check_piece_key_for_dossier($1,$2) AS ok;", [dossierId, piece_key]);
    if (!chk.rows?.[0]?.ok) {
      return res.status(400).json({ error: "Pièce non autorisée pour ce dossier", error_code: "INVALID_PIECE_KEY" });
    }

    // 2) règles (type_enum, extensions, size)
    const reqRes = await client.query(
      "SELECT * FROM core.get_expected_pieces_for_dossier($1) WHERE piece_key = $2 LIMIT 1;",
      [dossierId, piece_key]
    );
    if (reqRes.rowCount === 0) {
      return res.status(400).json({ error: "Règle introuvable pour cette pièce", error_code: "REQUIREMENT_NOT_FOUND" });
    }
    const rule = reqRes.rows[0];
    const typeEnum  = rule.type_enum;
    const acceptExt = Array.isArray(rule.accept_ext) ? rule.accept_ext.map(e => (e||"").toLowerCase()) : [];
    const maxMb     = Number(rule.max_file_size_mb || 10);

    // 3) valider taille & extension (on a buffer via multer memoryStorage)
    const buf = req.file.buffer;
    const sizeMb = buf.length / (1024*1024);
    if (sizeMb > maxMb) {
      return res.status(413).json({ error: `Fichier trop volumineux (> ${maxMb} Mo)`, error_code: "FILE_TOO_LARGE" });
    }
    const originalName = req.file.originalname || "piece";
    const ext = extnameSafe(originalName);
    if (acceptExt.length > 0 && !acceptExt.includes(ext)) {
      return res.status(400).json({
        error: `Extension non autorisée (${ext}). Acceptées: ${acceptExt.join(", ")}`,
        error_code: "FILE_TYPE_INVALID"
      });
    }

    // 4) enregistrer le fichier
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const safeName  = makeSafeFilename(originalName, `${dossierId}_${piece_key}_`);
    const fullPath  = path.join(uploadDir, safeName);
    await fs.writeFile(fullPath, buf);
    const fichierStored = fullPath;

    // 5) pièce existante ?
    const existingRes = await client.query(
      `SELECT id, fichier FROM core.pieces_justificatives 
       WHERE dossier_id = $1 AND piece_key = $2 
       ORDER BY uploaded_at DESC LIMIT 1`,
      [dossierId, piece_key]
    );
    const existing = existingRes.rows[0] || null;
    let oldFilePath = existing?.fichier ?? null;

    // 6) client_id du dossier
    const dossierInfo = await client.query("SELECT client_id FROM core.dossiers WHERE id = $1 LIMIT 1;", [dossierId]);
    const clientId = dossierInfo.rows?.[0]?.client_id ?? null;

    // 7) upsert pièce
    if (existing) {
      await client.query(
        `UPDATE core.pieces_justificatives 
         SET fichier=$1, statut='en_attente', uploaded_at=NOW()
         WHERE id=$2`,
        [fichierStored, existing.id]
      );
    } else {
      await client.query(
        `INSERT INTO core.pieces_justificatives
          (dossier_id, client_id, piece_key, type, fichier, statut, uploaded_at)
         VALUES ($1,$2,$3,$4,$5,'en_attente',NOW())`,
        [dossierId, clientId, piece_key, typeEnum, fichierStored]
      );
    }

    // 8) event d’upload
    await client.query(
      `INSERT INTO core.dossier_events (dossier_id, action, meta)
       VALUES ($1,'piece_uploaded', jsonb_build_object('piece_key',$2::text,'file',$3::text,'replaced',$4::boolean))`,
      [dossierId, piece_key, path.basename(fichierStored), Boolean(existing)]
    );

    // 9) auto-completion des étapes
    await checkAndCompleteSteps(client, dossierId);

    // 10) suppression ancien fichier en best-effort
    if (oldFilePath && oldFilePath !== fichierStored) {
      (async () => {
        try {
          await fs.access(oldFilePath);
          await fs.unlink(oldFilePath);
        } catch { /* ignore */ }
      })();
    }

    // 11) état consolidé de la pièce
    const stateOne = await client.query(
      "SELECT * FROM core.get_pieces_state_for_dossier($1) WHERE piece_key = $2 LIMIT 1;",
      [dossierId, piece_key]
    );

    return res.status(201).json({
      piece: stateOne.rows?.[0] ?? null,
      message: existing
        ? "Fichier remplacé avec succès, en attente de validation"
        : "Upload reçu, en attente de validation",
      replaced: Boolean(existing),
    });
  } catch (err) {
    console.error("UPLOAD piece error:", err);
    next(err);
  } finally {
    try { client.release(); } catch {}
  }
}


/** GET /api/dossiers/:id/pieces */
export async function getDossierPieces(req, res, next) {
  const dossierId = Number(req.params.id);
  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({
      error: "ID dossier invalide",
      error_code: "INVALID_DOSSIER_ID",
    });
  }

  const conn = await pool.connect();
  try {
    // Prépare les 4 requêtes en parallèle (comme dans ta route Next)
    const expectedQ = conn.query(
      "SELECT * FROM core.get_expected_pieces_for_dossier($1);",
      [dossierId]
    );
    const stateQ = conn.query(
      "SELECT * FROM core.get_pieces_state_for_dossier($1);",
      [dossierId]
    );
    const summaryQ = conn.query(
      "SELECT * FROM core.get_pieces_summary_for_dossier($1);",
      [dossierId]
    );
    const dossierQ = conn.query(
      "SELECT blocages FROM core.dossiers WHERE id = $1 LIMIT 1;",
      [dossierId]
    );

    const [expectedRes, stateRes, summaryRes, dossierRes] = await Promise.all([
      expectedQ,
      stateQ,
      summaryQ,
      dossierQ,
    ]);

    const pieces_expected = expectedRes.rows ?? [];
    const pieces_state = stateRes.rows ?? [];
    const summary =
      summaryRes.rows?.[0] ?? {
        total_required: 0,
        validated_count: 0,
        canValidate: false,
      };

    const blocages = dossierRes.rows?.[0]?.blocages ?? [];

    // Capabilities (identiques à ta logique)
    const capabilities = {
      canUpload: Array.isArray(blocages) ? blocages.length === 0 : true,
      canReplace: true,
    };

    return res.json({
      pieces_expected,
      pieces_state,
      summary,
      capabilities,
    });
  } catch (err) {
    console.error("GET /api/dossiers/:id/pieces error:", err);
    next(err);
  } finally {
    try { conn.release(); } catch {}
  }
}


/* ===== Helpers (copie/adapt de ta route Next) ===== */
const MACRO_STEP_IDS = new Set(["formulaire","pieces","mandat","transmission","processing","siren","attestation"]);
const REQUIRED_PIECES = ["CNI", "Passeport", "PhotoIdentite", "RIB"];
const MANDATE_KEY = "MandatSigne";

function groupByType(pieces) {
  const m = new Map();
  for (const p of pieces || []) {
    const key = p.type;
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(p);
  }
  return m;
}
function lastDate(list) {
  if (!list || !list.length) return null;
  const dates = list
    .map(x => x.uploaded_at)
    .filter(Boolean)
    .map(d => new Date(d).getTime());
  if (!dates.length) return null;
  return new Date(Math.max(...dates));
}
function firstUploadAmong(byType, types) {
  const dates = [];
  for (const t of types) {
    for (const p of byType.get(t) || []) {
      if (p.uploaded_at) dates.push(new Date(p.uploaded_at).getTime());
    }
  }
  if (!dates.length) return null;
  return new Date(Math.min(...dates));
}
function maxDate(...dates) {
  const ts = dates.filter(Boolean).map(d => new Date(d).getTime()).filter(Number.isFinite);
  return ts.length ? new Date(Math.max(...ts)) : null;
}
const toISOorNull = (d) => (d instanceof Date ? d.toISOString() : (d ? new Date(d).toISOString() : null));

/** GET /api/dossiers/:id/timeline */
export async function getDossierTimeline(req, res, next) {
  const dossierId = Number(req.params.id);
  if (!Number.isFinite(dossierId)) {
    return res.status(400).json({ error: "ID dossier invalide" });
  }

  const c = await pool.connect();
  try {
    // 1) Dossier + infos jointes
    const { rows: dossiers } = await c.query(
      `
      SELECT 
        d.*,
        c.prenom, c.nom, c.email,
        e.id  AS entreprise_id,
        e.denomination AS entreprise_denomination,
        p.nom AS partenaire_nom
      FROM core.dossiers d
      LEFT JOIN core.clients c     ON d.client_id = c.id
      LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
      LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
      WHERE d.id = $1
      `,
      [dossierId]
    );
    if (!dossiers.length) return res.status(404).json({ error: "Dossier introuvable" });
    const dossier = dossiers[0];

    // 2) Documents officiels
    const { rows: documentsOfficiels } = await c.query(
      `
      SELECT type, source, fichier, date
      FROM core.documents_generes
      WHERE entreprise_id = $1
      ORDER BY date ASC
      `,
      [dossier.entreprise_id]
    );

    // 3) Pièces justificatives
    const { rows: piecesClient } = await c.query(
      `
      SELECT type, statut, uploaded_at, motif_refus
      FROM core.pieces_justificatives
      WHERE dossier_id = $1
      ORDER BY uploaded_at ASC NULLS LAST
      `,
      [dossierId]
    );

    // 4) Events
    const { rows: eventsRaw } = await c.query(
      `
      SELECT action, meta, at
      FROM core.dossier_events
      WHERE dossier_id = $1
        AND action IN ('status_change','document_validated','admin_action','step_completed')
      ORDER BY at ASC
      `,
      [dossierId]
    );
    const events = eventsRaw.map(e => ({
      ...e,
      meta: typeof e.meta === "string" ? JSON.parse(e.meta) : e.meta,
    }));

    // 5) Tickets (3 derniers)
    const { rows: tickets } = await c.query(
      `
      SELECT id, subject, statut, priorite, created_at
      FROM core.tickets
      WHERE dossier_id = $1
      ORDER BY created_at DESC
      LIMIT 3
      `,
      [dossierId]
    );

    /* ---------- LOGIQUE D’ÉTAPES ---------- */

    // A) Formulaire
    const formEvent = events.find(
      e =>
        e.action === "step_completed" &&
        e.meta &&
        (e.meta.step === "formulaire" ||
         e.meta?.step === "Formulaire" ||
         e.meta?.step === "form_done")
    );
    const formulaireStatus = formEvent ? "completed" : "pending";
    const formulaireDate =
      formEvent?.at || dossier.date_creation || dossier.derniere_modification || null;

    // B) Pièces (hors mandat)
    const byType = groupByType(piecesClient);
    const hasAllRequiredUploaded =
      REQUIRED_PIECES.length > 0 &&
      REQUIRED_PIECES.every(t => (byType.get(t) || []).some(p => Boolean(p.uploaded_at)));
    const piecesStatus = hasAllRequiredUploaded ? "completed" : "pending";
    const firstUploadDate = firstUploadAmong(byType, REQUIRED_PIECES);
    const piecesDate = firstUploadDate || null;

    // C) Mandat
    const mandatList = byType.get(MANDATE_KEY) || [];
    const mandatUploaded = mandatList.some(p => Boolean(p.uploaded_at));
    const mandatStatus = mandatUploaded ? "completed" : "pending";
    const mandatDate = mandatUploaded ? lastDate(mandatList) || null : null;

    // D) Transmission / Traitement
    const prereqCompleted =
      formulaireStatus === "completed" &&
      piecesStatus === "completed" &&
      mandatStatus === "completed";

    const transmissionStatus = prereqCompleted ? "completed" : "pending";
    const transmissionDate = prereqCompleted ? maxDate(formulaireDate, piecesDate, mandatDate) : null;

    const traitementStatus = dossier.statut === "rejete" ? "error" : "pending";
    const traitementDate = null;

    // E) SIREN / Attestation
    const sirenDoc = documentsOfficiels.find(
      d =>
        d.type === "Avis de situation SIRENE" ||
        (d.type || "").toUpperCase().includes("SIRENE") ||
        (d.type || "").toUpperCase().includes("SIREN")
    );
    const sirenStatus = sirenDoc ? "completed" : "pending";
    const sirenDate = sirenDoc?.date || null;

    const attestationDoc = documentsOfficiels.find(
      d => d.type === "Attestation URSSAF" || (d.type || "").toUpperCase().includes("ATTESTATION")
    );
    const attestationStatus =
      attestationDoc && dossier.statut === "valide" ? "completed" : attestationDoc ? "pending" : "pending";
    const attestationDate = attestationDoc?.date || null;

    // Timeline (dates en ISO pour le front)
    const timelineSteps = [
      {
        id: "formulaire",
        title: "Formulaire rempli",
        description: formulaireStatus === "completed" ? "Vos informations ont été enregistrées" : "Informations à compléter",
        date: toISOorNull(formulaireDate),
        status: formulaireStatus,
      },
      {
        id: "pieces",
        title: "Pièces requises",
        description: piecesStatus === "completed" ? "Toutes les pièces obligatoires sont déposées" : "Aucune pièce requise complète",
        date: toISOorNull(piecesDate),
        status: piecesStatus,
      },
      {
        id: "mandat",
        title: "Mandat signé",
        description: mandatStatus === "completed" ? "Mandat déposé" : "Mandat à déposer",
        date: toISOorNull(mandatDate),
        status: mandatStatus,
      },
      {
        id: "transmission",
        title: "Dossier transmis",
        description: transmissionStatus === "completed" ? "Dépôt officiel enregistré" : "En attente de transmission",
        date: toISOorNull(transmissionDate),
        status: transmissionStatus,
      },
      {
        id: "processing",
        title: "Traitement administratif",
        description: traitementStatus === "completed" ? "Traitement terminé" : traitementStatus === "error" ? "Dossier rejeté" : "En attente du dépôt",
        date: traitementDate, // null
        status: traitementStatus,
      },
      {
        id: "siren",
        title: "SIREN attribué",
        description: "Numéro d'identification reçu",
        date: toISOorNull(sirenDate),
        status: sirenStatus,
      },
      {
        id: "attestation",
        title: "Attestation à télécharger",
        description: "Tous vos documents sont prêts",
        date: toISOorNull(attestationDate),
        status: attestationStatus,
      },
    ];

    // Métriques
    const macroSteps = timelineSteps.filter(s => MACRO_STEP_IDS.has(s.id));
    const completion_percent = macroSteps.length
      ? Math.round((macroSteps.filter(s => s.status === "completed").length / macroSteps.length) * 100)
      : 0;

    const documentsOfficielsCount = documentsOfficiels.length;
    let estimatedCompletion = null;
    if (dossier.statut === "en_cours" && documentsOfficielsCount === 0) {
      const baseDays = 7;
      const delayDays = tickets.filter(t => t.priorite === "Haute").length * 2;
      const d = new Date();
      d.setDate(d.getDate() + baseDays + delayDays);
      estimatedCompletion = d.toISOString();
    }

    // Activité récente
    const recentEvents = events.slice(-3).map(e => ({
      type: "event",
      description: e.action,
      date: e.at,
    }));
    const { rows: messagesImportants } = await c.query(
      `
      SELECT sender_type, body, at
      FROM core.messages
      WHERE dossier_id = $1
        AND (sender_type = 'Système' OR body ILIKE '%validé%' OR body ILIKE '%document%')
      ORDER BY at DESC
      LIMIT 2
      `,
      [dossierId]
    );
    const recentMsgs = messagesImportants.map(m => ({
      type: "message",
      description: `${m.sender_type}: ${m.body?.substring(0, 50) || ""}...`,
      date: m.at,
    }));
    const recent_activity = [...recentEvents, ...recentMsgs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Réponse
    return res.json({
      dossier: {
        id: dossier.id,
        statut: dossier.statut,
        date_creation: dossier.date_creation,
        derniere_modification: dossier.derniere_modification,
        blocages: dossier.blocages,
        client: `${dossier.prenom} ${dossier.nom}`,
        entreprise_denomination: dossier.entreprise_denomination,
        partenaire_nom: dossier.partenaire_nom,
      },
      timeline_steps: timelineSteps,
      documents_officiels: documentsOfficiels,
      pieces_client: {
        valides: piecesClient.filter(p => p.statut === "valide").length,
        total: piecesClient.length,
        details: piecesClient,
      },
      metrics: {
        completion_percent,
        estimated_completion: estimatedCompletion,
        documents_officiels_count: documentsOfficielsCount,
        tickets_count: tickets.length,
        has_urgent_tickets: tickets.some(t => t.priorite === "Haute" && t.statut !== "Résolu"),
      },
      recent_activity,
    });
  } catch (e) {
    console.error("timeline error:", e);
    next(e);
  } finally {
    try { c.release(); } catch {}
  }
}


const ALLOWED = ['nouveau','en_cours','en_attente','a_corriger','valide','rejete'];

/** PATCH /api/dossiers/:id  { statut?, assign_to? } */
export async function patchDossier(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: "bad id" });

  const body = req.body ?? {};
  const { statut, assign_to } = body;

  if (statut && !ALLOWED.includes(statut)) {
    return res.status(400).json({ error: "invalid statut" });
  }
  if (assign_to !== undefined && assign_to !== null && !Number.isFinite(Number(assign_to))) {
    return res.status(400).json({ error: "invalid assign_to" });
  }

  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    // build SET dynamiquement pour ne mettre à jour que ce qui est fourni
    const set = ['derniere_modification = NOW()'];
    const params = [id];
    let i = 2;

    if (statut) {
      set.push(`statut = $${i++}`);
      params.push(statut);
    }
    if (assign_to !== undefined) {
      set.push(`operateur_id = $${i++}`);
      params.push(assign_to === null ? null : Number(assign_to));
    }

    const sql =
      `UPDATE core.dossiers
          SET ${set.join(", ")}
        WHERE id = $1
        RETURNING *`;

    const { rows } = await c.query(sql, params);
    if (!rows.length) {
      await c.query("ROLLBACK");
      return res.status(404).json({ error: "not found" });
    }
    const dossier = rows[0];

    // log event (JSONB correct)
    const meta = {
      statut: statut ?? null,
      assign_to: assign_to ?? null,
      by: req.user?.id ?? null,          // si tu as de l’auth, sinon laisse null
      at: new Date().toISOString(),
    };
    await c.query(
      `INSERT INTO core.dossier_events (dossier_id, action, meta)
       VALUES ($1, 'UPDATE', $2::jsonb)`,
      [id, JSON.stringify(meta)]
    );

    await c.query("COMMIT");
    return res.json({ dossier });
  } catch (e) {
    await c.query("ROLLBACK");
    return next(e);
  } finally {
    c.release();
  }
}

import { kickSLA } from "../lib/kickSLA.js";
import { getActor } from "../lib/actor.js";

/** GET /api/dossiers */
export async function listDossiers(req, res, next) {
  await kickSLA(); // garde ton comportement SLA

  try {
    const { role, partnerId, clientId } = getActor(req);

    let where = "TRUE";
    const params = [];

    if (role === "partner_user") {
      if (!partnerId) return res.json({ dossiers: [] });
      where = "partenaire_id = $1";
      params.push(partnerId);
    } else if (role === "client_user") {
      if (!clientId) return res.json({ dossiers: [] });
      where = "client_id = $1";
      params.push(clientId);
    }

    const c = await pool.connect();
    try {
      const { rows } = await c.query(
        `
        SELECT 
          id,
          client_id,
          entreprise_id,
          partenaire_id,
          operateur_id,
          statut,
          date_creation,
          derniere_modification,
          blocages,
          commission_partenaire_eur
        FROM core.dossiers
        WHERE ${where}
        ORDER BY date_creation DESC
        `,
        params
      );

      return res.json({ dossiers: rows });
    } finally {
      c.release();
    }
  } catch (e) {
    console.error("Erreur GET dossiers:", e);
    return next(e);
  }
}

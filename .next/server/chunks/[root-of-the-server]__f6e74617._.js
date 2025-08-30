module.exports = {

"[project]/.next-internal/server/app/api/dossiers/[id]/timeline/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/pg [external] (pg, esm_import)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/app/api/_lib/db.mjs [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// src/app/api/_lib/db.mjs
__turbopack_context__.s({
    "getPool": ()=>getPool,
    "withClient": ()=>withClient
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
let _pool = globalThis.__PG_POOL;
if (!_pool) {
    _pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    globalThis.__PG_POOL = _pool;
}
function getPool() {
    return _pool;
}
async function withClient(fn) {
    const pool = getPool();
    const client = await pool.connect();
    try {
        return await fn(client);
    } finally{
        client.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/dossiers/[id]/timeline/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": ()=>GET
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/db.mjs [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPool"])();
// Étapes macro pour la progression
const MACRO_STEP_IDS = new Set([
    "formulaire",
    "pieces",
    "mandat",
    "transmission",
    "processing",
    "siren",
    "attestation"
]);
// Pièces obligatoires (hors mandat)
const REQUIRED_PIECES = [
    "CNI",
    "Passeport",
    "PhotoIdentite",
    "RIB"
];
const MANDATE_KEY = "MandatSigne";
async function GET(req, { params }) {
    try {
        const { id } = params;
        const dossierId = parseInt(id, 10);
        if (!dossierId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "ID dossier invalide"
            }, {
                status: 400
            });
        }
        const c = await pool.connect();
        try {
            // 1) Dossier + infos jointes
            const { rows: dossiers } = await c.query(`
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
        `, [
                dossierId
            ]);
            if (!dossiers.length) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Dossier introuvable"
                }, {
                    status: 404
                });
            }
            const dossier = dossiers[0];
            // 2) Documents officiels
            const { rows: documentsOfficiels } = await c.query(`
        SELECT type, source, fichier, date
        FROM core.documents_generes
        WHERE entreprise_id = $1
        ORDER BY date ASC
        `, [
                dossier.entreprise_id
            ]);
            // 3) Pièces justificatives client (toutes)
            const { rows: piecesClient } = await c.query(`
        SELECT type, statut, uploaded_at, motif_refus
        FROM core.pieces_justificatives
        WHERE dossier_id = $1
        ORDER BY uploaded_at ASC NULLS LAST
        `, [
                dossierId
            ]);
            // 4) Events
            const { rows: eventsRaw } = await c.query(`
        SELECT action, meta, at
        FROM core.dossier_events
        WHERE dossier_id = $1
          AND action IN ('status_change', 'document_validated', 'admin_action', 'step_completed')
        ORDER BY at ASC
        `, [
                dossierId
            ]);
            const events = eventsRaw.map((e)=>({
                    ...e,
                    meta: typeof e.meta === "string" ? JSON.parse(e.meta) : e.meta
                }));
            // 5) Tickets
            const { rows: tickets } = await c.query(`
        SELECT id, subject, statut, priorite, created_at
        FROM core.tickets
        WHERE dossier_id = $1
        ORDER BY created_at DESC
        LIMIT 3
        `, [
                dossierId
            ]);
            // ---------- LOGIQUE D’ÉTAPE ----------
            // A) FORMULAIRE
            const formEvent = events.find((e)=>e.action === "step_completed" && e.meta && (e.meta.step === "formulaire" || e.meta?.step === "Formulaire" || e.meta?.step === "form_done"));
            const formulaireStatus = formEvent ? "completed" : "pending";
            const formulaireDate = formEvent?.at || dossier.date_creation || dossier.derniere_modification || null;
            // B) PIÈCES (hors mandat) — binaire : déposé/non déposé
            const byType = groupByType(piecesClient);
            const hasAllRequiredUploaded = REQUIRED_PIECES.length > 0 && REQUIRED_PIECES.every((t)=>(byType.get(t) || []).some((p)=>Boolean(p.uploaded_at)));
            const piecesStatus = hasAllRequiredUploaded ? "completed" : "pending";
            const firstUploadDate = firstUploadAmong(byType, REQUIRED_PIECES);
            const piecesDate = hasAllRequiredUploaded ? firstUploadDate : firstUploadDate;
            // C) MANDAT — binaire : déposé/non déposé
            const mandatList = byType.get(MANDATE_KEY) || [];
            const mandatUploaded = mandatList.some((p)=>Boolean(p.uploaded_at));
            const mandatStatus = mandatUploaded ? "completed" : "pending";
            const mandatDate = mandatUploaded ? lastDate(mandatList) || null : null;
            // D) TRANSMISSION / TRAITEMENT
            // Transmission = completed seulement si formulaire + pièces + mandat sont completed
            const prereqCompleted = formulaireStatus === "completed" && piecesStatus === "completed" && mandatStatus === "completed";
            const transmissionStatus = prereqCompleted ? "completed" : "pending";
            const transmissionDate = prereqCompleted ? maxDate(formulaireDate, piecesDate, mandatDate) : null;
            // Traitement : PAS DE SIGNAL → ne pas auto-compléter
            const traitementStatus = dossier.statut === "rejete" ? "error" : "pending";
            const traitementDate = null; // (évite d’afficher une date quand c’est pending)
            // E) SIREN / ATTESTATION
            const sirenDoc = documentsOfficiels.find((d)=>d.type === "Avis de situation SIRENE" || (d.type || "").toUpperCase().includes("SIRENE") || (d.type || "").toUpperCase().includes("SIREN"));
            const sirenStatus = sirenDoc ? "completed" : "pending";
            const sirenDate = sirenDoc?.date || null;
            const attestationDoc = documentsOfficiels.find((d)=>d.type === "Attestation URSSAF" || (d.type || "").toUpperCase().includes("ATTESTATION"));
            const attestationStatus = attestationDoc && dossier.statut === "valide" ? "completed" : attestationDoc ? "pending" // plus d'état "active"
             : "pending";
            const attestationDate = attestationDoc?.date || null;
            // ---------- TIMELINE ----------
            const timelineSteps = [
                {
                    id: "formulaire",
                    title: "Formulaire rempli",
                    description: formulaireStatus === "completed" ? "Vos informations ont été enregistrées" : "Informations à compléter",
                    date: formulaireDate,
                    status: formulaireStatus
                },
                {
                    id: "pieces",
                    title: "Pièces requises",
                    description: piecesStatus === "completed" ? "Toutes les pièces obligatoires sont déposées" : "Aucune pièce requise complète",
                    date: piecesDate,
                    status: piecesStatus
                },
                {
                    id: "mandat",
                    title: "Mandat signé",
                    description: mandatStatus === "completed" ? "Mandat déposé" : "Mandat à déposer",
                    date: mandatDate,
                    status: mandatStatus
                },
                {
                    id: "transmission",
                    title: "Dossier transmis",
                    description: transmissionStatus === "completed" ? "Dépôt officiel enregistré" : "En attente de transmission",
                    date: transmissionDate,
                    status: transmissionStatus
                },
                {
                    id: "processing",
                    title: "Traitement administratif",
                    description: traitementStatus === "completed" ? "Traitement terminé" : traitementStatus === "error" ? "Dossier rejeté" : "En attente du dépôt",
                    date: traitementDate,
                    status: traitementStatus
                },
                {
                    id: "siren",
                    title: "SIREN attribué",
                    description: "Numéro d'identification reçu",
                    date: sirenDate,
                    status: sirenStatus
                },
                {
                    id: "attestation",
                    title: "Attestation à télécharger",
                    description: "Tous vos documents sont prêts",
                    date: attestationDate,
                    status: attestationStatus
                }
            ];
            function maxDate(...dates) {
                const ts = dates.filter(Boolean).map((d)=>new Date(d).getTime()).filter(Number.isFinite);
                return ts.length ? new Date(Math.max(...ts)) : null;
            }
            // ---------- MÉTRIQUES ----------
            const macroSteps = timelineSteps.filter((s)=>MACRO_STEP_IDS.has(s.id));
            const completion_percent = macroSteps.length ? Math.round(macroSteps.filter((s)=>s.status === "completed").length / macroSteps.length * 100) : 0;
            const documentOfficielsCount = documentsOfficiels.length;
            let estimatedCompletion = null;
            if (dossier.statut === "en_cours" && documentOfficielsCount === 0) {
                const baseDays = 7;
                const delayDays = tickets.filter((t)=>t.priorite === "Haute").length * 2;
                estimatedCompletion = new Date();
                estimatedCompletion.setDate(estimatedCompletion.getDate() + baseDays + delayDays);
            }
            // ---------- ACTIVITÉ RÉCENTE ----------
            const recentEvents = events.slice(-3).map((e)=>({
                    type: "event",
                    description: e.action,
                    date: e.at
                }));
            const { rows: messagesImportants } = await c.query(`
        SELECT sender_type, body, at
        FROM core.messages
        WHERE dossier_id = $1
          AND (sender_type = 'Système' OR body ILIKE '%validé%' OR body ILIKE '%document%')
        ORDER BY at DESC
        LIMIT 2
        `, [
                dossierId
            ]);
            const recentMsgs = messagesImportants.map((m)=>({
                    type: "message",
                    description: `${m.sender_type}: ${m.body?.substring(0, 50) || ""}...`,
                    date: m.at
                }));
            const recent_activity = [
                ...recentEvents,
                ...recentMsgs
            ].sort((a, b)=>new Date(b.date) - new Date(a.date)).slice(0, 5);
            // ---------- RÉPONSE ----------
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                dossier: {
                    id: dossier.id,
                    statut: dossier.statut,
                    date_creation: dossier.date_creation,
                    derniere_modification: dossier.derniere_modification,
                    blocages: dossier.blocages,
                    client: `${dossier.prenom} ${dossier.nom}`,
                    entreprise_denomination: dossier.entreprise_denomination,
                    partenaire_nom: dossier.partenaire_nom
                },
                timeline_steps: timelineSteps,
                documents_officiels: documentsOfficiels,
                pieces_client: {
                    // on laisse ces métriques si utiles, même si la validation ne compte plus pour l'étape
                    valides: piecesClient.filter((p)=>p.statut === "valide").length,
                    total: piecesClient.length,
                    details: piecesClient
                },
                metrics: {
                    completion_percent,
                    estimated_completion: estimatedCompletion,
                    documents_officiels_count: documentOfficielsCount,
                    tickets_count: tickets.length,
                    has_urgent_tickets: tickets.some((t)=>t.priorite === "Haute" && t.statut !== "Résolu")
                },
                recent_activity
            });
        } finally{
            c.release();
        }
    } catch (e) {
        console.error("Erreur timeline dossier:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de la récupération de la timeline"
        }, {
            status: 500
        });
    }
}
/* ------------------ helpers ------------------ */ function groupByType(pieces) {
    const m = new Map();
    for (const p of pieces || []){
        const key = p.type;
        if (!m.has(key)) m.set(key, []);
        m.get(key).push(p);
    }
    return m;
}
function lastDate(list) {
    if (!list || !list.length) return null;
    const dates = list.map((x)=>x.uploaded_at).filter(Boolean).map((d)=>new Date(d).getTime());
    if (!dates.length) return null;
    return new Date(Math.max(...dates));
}
function firstUploadAmong(byType, types) {
    const dates = [];
    for (const t of types){
        for (const p of byType.get(t) || []){
            if (p.uploaded_at) dates.push(new Date(p.uploaded_at).getTime());
        }
    }
    if (!dates.length) return null;
    return new Date(Math.min(...dates));
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__f6e74617._.js.map
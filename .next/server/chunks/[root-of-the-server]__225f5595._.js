module.exports = {

"[project]/.next-internal/server/app/api/clients/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/clients/[id]/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// src/app/api/clients/[id]/route.js
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
async function GET(_req, { params }) {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "bad id"
        }, {
            status: 400
        });
    }
    const client = await pool.connect();
    try {
        // ----- CLIENT
        const { rows: clientRows } = await client.query(`SELECT c.* FROM core.clients c WHERE c.id = $1`, [
            id
        ]);
        if (clientRows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "not found"
            }, {
                status: 404
            });
        }
        const c = clientRows[0];
        // ----- DOSSIERS
        const { rows: dossierRows } = await client.query(`SELECT *
         FROM core.dossiers
        WHERE client_id = $1
        ORDER BY date_creation DESC`, [
            id
        ]);
        const dossierIds = dossierRows.map((d)=>d.id);
        // ----- PIECES
        const { rows: piecesRows } = await client.query(`SELECT type, fichier, statut, motif_refus, uploaded_at
         FROM core.pieces_justificatives
        WHERE client_id = $1
        ORDER BY uploaded_at NULLS LAST`, [
            id
        ]);
        // ----- TELECHARGEMENTS
        const { rows: downloadsRows } = await client.query(`SELECT type, fichier
         FROM core.client_downloads
        WHERE client_id = $1`, [
            id
        ]);
        // ----- MESSAGES (zone d’échange legacy)
        let messagesRows = [];
        if (dossierIds.length) {
            const { rows } = await client.query(`SELECT dossier_id, sender_type AS "from", body AS message, at
           FROM core.messages
          WHERE dossier_id = ANY($1::int[])
          ORDER BY at ASC`, [
                dossierIds
            ]);
            messagesRows = rows;
        }
        // ----- Historique legacy (gardé pour compatibilité)
        const { rows: histoContact } = await client.query(`SELECT at, type, note
         FROM core.client_contact_logs
        WHERE client_id = $1
        ORDER BY at ASC`, [
            id
        ]);
        const { rows: histoEmails } = await client.query(`SELECT envoye_le AS at, type, canal
         FROM core.emails_automatiques
        WHERE client_id = $1
        ORDER BY envoye_le ASC`, [
            id
        ]);
        // ===== RELANCES & NOTIFICATIONS =====
        const { rows: notifications } = await client.query(`SELECT 
          id,
          type,
          client_id,
          dossier_id,
          canal,
          scheduled_for,
          message
       FROM core.notifications_queue
       WHERE client_id = $1
       ORDER BY scheduled_for DESC`, [
            id
        ]);
        // Séparation des relances
        const relances = notifications.filter((n)=>n.type.startsWith("relance"));
        // Dernière relance contenant un message
        const alert_relance = relances.find((n)=>typeof n.message === "string" && n.message.trim() !== "") || null;
        // ===== ENTREPRISE =====
        let entreprise = null;
        if (c.entreprise_id) {
            const { rows: eRows } = await client.query(`SELECT * FROM core.entreprises WHERE id = $1`, [
                c.entreprise_id
            ]);
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
                        RNE: e.gov_rne
                    }
                };
            }
        }
        // ===== FAQ =====
        let faq = [];
        try {
            const { rows } = await client.query(`WITH cte AS (
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
          ORDER BY COALESCE(f.category,''), f.position NULLS LAST, f.id`, [
                id
            ]);
            faq = rows;
        } catch  {}
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            client: c,
            entreprise,
            dossiers: dossierRows,
            pieces_justificatives: piecesRows,
            telechargements_disponibles: downloadsRows,
            zone_echange: messagesRows.map((m)=>({
                    ...m,
                    date: m.at?.toISOString?.()?.slice(0, 10)
                })),
            historique_echanges: [
                ...histoContact.map((h)=>({
                        date: h.at?.toISOString?.()?.slice(0, 10),
                        type: h.type || "note",
                        note: h.note || ""
                    })),
                ...histoEmails.map((h)=>({
                        date: h.at?.toISOString?.()?.slice(0, 10),
                        type: "email",
                        note: h.type + (h.canal ? ` (${h.canal})` : "")
                    }))
            ],
            // Pour le dashboard
            relances,
            notifications,
            alert_relance,
            faq
        });
    } finally{
        client.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__225f5595._.js.map
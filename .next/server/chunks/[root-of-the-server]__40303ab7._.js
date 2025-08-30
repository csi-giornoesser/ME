module.exports = {

"[project]/.next-internal/server/app/api/tickets/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/tickets/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": ()=>GET,
    "POST": ()=>POST,
    "runtime": ()=>runtime
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/db.mjs [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
const runtime = "nodejs";
;
;
const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPool"])();
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        // Filtres disponibles
        const statut = searchParams.get("statut");
        const priorite = searchParams.get("priorite");
        const operatorId = searchParams.get("operatorId");
        const dossierId = searchParams.get("dossierId");
        const limit = parseInt(searchParams.get("limit")) || 50;
        const offset = parseInt(searchParams.get("offset")) || 0;
        // Construction de la requête avec filtres
        let whereConditions = [];
        let params = [];
        let paramCount = 0;
        if (statut && statut !== "all") {
            paramCount++;
            whereConditions.push(`t.statut = $${paramCount}`);
            params.push(statut);
        }
        if (priorite && priorite !== "all") {
            paramCount++;
            whereConditions.push(`t.priorite = $${paramCount}`);
            params.push(priorite);
        }
        if (operatorId && operatorId !== "all") {
            paramCount++;
            whereConditions.push(`t.assigne_operateur_id = $${paramCount}`);
            params.push(parseInt(operatorId));
        }
        if (dossierId) {
            paramCount++;
            whereConditions.push(`t.dossier_id = $${paramCount}`);
            params.push(parseInt(dossierId));
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
        // Ajouter limit et offset
        params.push(limit, offset);
        const limitClause = `LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        const query = `
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
        
        -- Info dossier
        d.statut as dossier_statut,
        d.client_id,
        
        -- Info client
        c.prenom,
        c.nom,
        c.email,
        
        -- Opérateur assigné
        o.nom as operateur_nom,
        o.email as operateur_email,
        
        -- Dernier event (aperçu)
        te.message as dernier_message,
        te.at as dernier_event_at
        
      FROM core.tickets t
      LEFT JOIN core.dossiers d ON t.dossier_id = d.id
      LEFT JOIN core.clients c ON d.client_id = c.id
      LEFT JOIN core.operateurs o ON t.assigne_operateur_id = o.id
      LEFT JOIN LATERAL (
        SELECT message, at
        FROM core.ticket_events
        WHERE ticket_id = t.id
        ORDER BY at DESC
        LIMIT 1
      ) te ON true
      
      ${whereClause}
      ORDER BY t.created_at DESC
      ${limitClause}
    `;
        const { rows: tickets } = await pool.query(query, params);
        // Compter le total pour la pagination
        const countQuery = `
      SELECT COUNT(*) as total
      FROM core.tickets t
      LEFT JOIN core.dossiers d ON t.dossier_id = d.id
      ${whereClause}
    `;
        const countParams = params.slice(0, -2); // Enlever limit/offset
        const { rows: [{ total }] } = await pool.query(countQuery, countParams);
        // Récupérer les référentiels pour les filtres
        const { rows: operateurs } = await pool.query(`SELECT id, nom, email FROM core.operateurs ORDER BY nom`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            tickets,
            total: parseInt(total),
            limit,
            offset,
            filters: {
                statuts: [
                    "Nouveau",
                    "En cours",
                    "Résolu",
                    "Fermé"
                ],
                priorites: [
                    "Basse",
                    "Moyenne",
                    "Haute"
                ],
                operateurs
            }
        });
    } catch (e) {
        console.error("Erreur GET tickets:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de la récupération des tickets"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    const body = await req.json().catch(()=>({}));
    const { dossier_id, subject = "Nouveau ticket", priorite = "Moyenne", assigne_operateur_id = null, ouverture = "manuelle", source, message = "Ticket créé depuis le CRM", attachments = null, sender_type } = body || {};
    const computedSource = source ?? `manual:${(sender_type || 'operateur').toLowerCase()}:${Date.now()}`;
    if (!dossier_id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "dossier_id requis"
    }, {
        status: 400
    });
    if (!subject?.trim()) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "subject requis"
    }, {
        status: 400
    });
    const c = await pool.connect();
    try {
        await c.query("BEGIN");
        const { rows: tickets } = await c.query(`INSERT INTO core.tickets 
         (dossier_id, subject, statut, priorite, assigne_operateur_id, ouverture, source)
       VALUES ($1, $2, 'Nouveau', $3, $4, $5, $6)
       RETURNING id, dossier_id, subject, statut, priorite, assigne_operateur_id, ouverture, source, created_at`, [
            dossier_id,
            subject.trim(),
            priorite,
            assigne_operateur_id,
            ouverture,
            computedSource
        ]);
        await c.query(`INSERT INTO core.ticket_events (ticket_id, message, attachments)
       VALUES ($1, $2, $3)`, [
            tickets[0].id,
            message,
            attachments ? JSON.stringify(attachments) : null
        ]);
        await c.query("COMMIT");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ticket: tickets[0],
            message: "Ticket créé avec succès"
        }, {
            status: 201
        });
    } catch (e) {
        await c.query("ROLLBACK");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message || "Erreur lors de la création du ticket"
        }, {
            status: 500
        });
    } finally{
        c.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__40303ab7._.js.map
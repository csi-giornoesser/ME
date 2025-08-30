module.exports = {

"[project]/.next-internal/server/app/api/dashboard/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/_lib/kickSLA.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// app/api/_lib/kickSLA.ts
__turbopack_context__.s({
    "kickSLA": ()=>kickSLA
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/db.mjs [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Throttle: 1 exécution max toutes les 2 minutes par instance
let lastRun = 0;
const MIN_MS_BETWEEN_RUNS = 2 * 60 * 1000;
async function kickSLA(limit = 200) {
    const now = Date.now();
    if (now - lastRun < MIN_MS_BETWEEN_RUNS) return;
    lastRun = now;
    try {
        const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPool"])();
        await pool.query("SELECT * FROM core.create_due_tickets($1);", [
            limit
        ]);
        await pool.query("SELECT core.produce_notifications();"); // enqueuer selon l'état
        await pool.query("SELECT core.dispatch_due_notifications();"); // envoyer celles arrivées à échéance
    } catch (e) {
        console.warn("[kickSLA] skipped:", e.message);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/dashboard/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// app/api/dashboard/route.ts
__turbopack_context__.s({
    "GET": ()=>GET,
    "runtime": ()=>runtime
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/db.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$kickSLA$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/kickSLA.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$kickSLA$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$kickSLA$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
const runtime = "nodejs";
;
;
;
const pool = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPool"])();
// helpers
function toDateUTC(d) {
    return d instanceof Date ? d.toISOString().slice(0, 10) : d;
}
async function GET(req) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$kickSLA$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kickSLA"])();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // ex: en_cours
    const partnerId = searchParams.get("partnerId"); // ex: 1
    const operatorId = searchParams.get("operatorId"); // ex: 2
    const from = searchParams.get("from"); // ex: 2025-07-01
    const to = searchParams.get("to"); // ex: 2025-08-31
    const c = await pool.connect();
    try {
        // ---- dossiers (avec filtres)
        const where = [];
        const args = [];
        let i = 1;
        if (status && status !== "all") {
            where.push(`d.statut = $${i++}`);
            args.push(status);
        }
        if (partnerId && partnerId !== "all") {
            where.push(`d.partenaire_id = $${i++}`);
            args.push(Number(partnerId));
        }
        if (operatorId && operatorId !== "all") {
            where.push(`d.operateur_id = $${i++}`);
            args.push(Number(operatorId));
        }
        if (from) {
            where.push(`d.date_creation >= $${i++}`);
            args.push(from);
        }
        if (to) {
            where.push(`d.date_creation <= $${i++}`);
            args.push(to);
        }
        const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
        const { rows: dossiers } = await c.query(`SELECT
         d.id,
         d.statut,
         d.client_id       AS "clientId",
         d.entreprise_id   AS "entrepriseId",
         d.partenaire_id   AS "partenaireId",
         d.operateur_id    AS "operateurId",
         d.date_creation   AS "date_creation",
         d.derniere_modification AS "derniere_modification",
         d.blocages,
         d.commission_partenaire_eur AS "commission_partenaire_eur"
       FROM core.dossiers d
       ${whereSql}
       ORDER BY d.date_creation DESC`, args);
        // ---- listes mini pour afficher les noms dans le dashboard
        const { rows: partenaires } = await c.query(`SELECT id, nom FROM core.partenaires ORDER BY nom`);
        const { rows: operateurs } = await c.query(`SELECT id, nom FROM core.operateurs ORDER BY nom`);
        const { rows: clients } = await c.query(`SELECT id, prenom, nom, email FROM core.clients ORDER BY id`);
        // ---- notifications programmées
        // ---- notifications programmées
        // ---- notifications (programmées + déjà envoyées)
        const { rows: notifications } = await c.query(`
WITH q AS (
  SELECT 
    id,
    type,
    client_id   AS "clientId",
    dossier_id  AS "dossierId",
    canal,
    scheduled_for,
    message,
    'queued'::text AS status
  FROM core.notifications_queue
),
sent AS (
  SELECT 
    ('sent-'||ea.id)::text      AS id,
    ea.type,
    ea.client_id                AS "clientId",
    ea.dossier_id               AS "dossierId",
    ea.canal,
    ea.envoye_le                AS scheduled_for,  -- on garde le même nom pour le front
    (
      SELECT note
      FROM core.client_contact_logs cl
      WHERE cl.client_id = ea.client_id
        AND cl.at BETWEEN ea.envoye_le - interval '5 minutes' AND ea.envoye_le + interval '5 minutes'
      ORDER BY cl.at DESC
      LIMIT 1
    )                           AS message,
    'sent'::text                AS status
  FROM core.emails_automatiques ea
  WHERE ea.type LIKE 'notif.%'
)
SELECT * FROM q
UNION ALL
SELECT * FROM sent
ORDER BY scheduled_for DESC
LIMIT 200
`);
        // ---- derniers auth logs
        const { rows: auth_logs } = await c.query(`SELECT at, role, who, action, success, ip
         FROM core.auth_logs
        ORDER BY at DESC
        LIMIT 50`);
        // ---- refs (hardcodé côté API pour le moment)
        const refs = {
            statuts_dossier: [
                "nouveau",
                "en_cours",
                "en_attente",
                "a_corriger",
                "valide",
                "rejete"
            ]
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            refs,
            partenaires,
            operateurs,
            clients,
            dossiers: dossiers.map((d)=>({
                    ...d,
                    date_creation: toDateUTC(d.date_creation),
                    derniere_modification: toDateUTC(d.derniere_modification)
                })),
            notifications_queue: notifications,
            auth_logs
        });
    } finally{
        c.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e970d1fa._.js.map
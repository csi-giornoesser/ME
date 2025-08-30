module.exports = {

"[project]/.next-internal/server/app/api/exports/dossiers/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/exports/dossiers/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": ()=>GET,
    "POST": ()=>POST
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
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        // Récupérer les mêmes filtres que le dashboard
        const status = searchParams.get("status");
        const partnerId = searchParams.get("partnerId");
        const operatorId = searchParams.get("operatorId");
        const dateFrom = searchParams.get("from");
        const dateTo = searchParams.get("to");
        const format = searchParams.get("format") || "csv";
        // Construction de la requête avec filtres
        let whereConditions = [];
        let params = [];
        let paramCount = 0;
        if (status && status !== "all") {
            paramCount++;
            whereConditions.push(`d.statut = $${paramCount}`);
            params.push(status);
        }
        if (partnerId && partnerId !== "all") {
            paramCount++;
            whereConditions.push(`d.partenaire_id = $${paramCount}`);
            params.push(parseInt(partnerId));
        }
        if (operatorId && operatorId !== "all") {
            paramCount++;
            whereConditions.push(`d.operateur_id = $${paramCount}`);
            params.push(parseInt(operatorId));
        }
        if (dateFrom) {
            paramCount++;
            whereConditions.push(`d.date_creation >= $${paramCount}`);
            params.push(dateFrom);
        }
        if (dateTo) {
            paramCount++;
            whereConditions.push(`d.date_creation <= $${paramCount}::date + INTERVAL '1 day'`);
            params.push(dateTo);
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
        // Requête optimisée pour l'export
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
        CASE 
          WHEN d.exportable_csv THEN 'Oui' 
          ELSE 'Non' 
        END as "Exportable"
        
      FROM core.dossiers d
      LEFT JOIN core.clients c ON d.client_id = c.id
      LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
      LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
      LEFT JOIN core.operateurs o ON d.operateur_id = o.id
      
      ${whereClause}
      ORDER BY d.date_creation DESC
    `;
        const { rows: dossiers } = await pool.query(query, params);
        // Générer le CSV
        if (format === "csv") {
            const csvData = generateCSV(dossiers);
            const fileName = `dossiers_${new Date().toISOString().slice(0, 10)}.csv`;
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](csvData, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                    'Cache-Control': 'no-cache'
                }
            });
        }
        // Format JSON pour preview ou debug
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            dossiers,
            total: dossiers.length,
            filters: {
                status,
                partnerId,
                operatorId,
                dateFrom,
                dateTo
            },
            generated_at: new Date().toISOString()
        });
    } catch (e) {
        console.error("Erreur export dossiers:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de l'export des dossiers"
        }, {
            status: 500
        });
    }
}
// Fonction utilitaire pour générer le CSV
function generateCSV(data) {
    if (!data || data.length === 0) {
        return "Aucune donnée à exporter";
    }
    // Headers (clés du premier objet)
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    // Données
    const csvRows = data.map((row)=>{
        return headers.map((header)=>{
            const value = row[header];
            // Échapper les guillemets et entourer de guillemets si nécessaire
            if (value === null || value === undefined) {
                return '';
            }
            const stringValue = String(value);
            // Si la valeur contient une virgule, des guillemets ou un retour ligne, l'entourer de guillemets
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        }).join(',');
    });
    // Ajouter BOM UTF-8 pour Excel
    const BOM = '\uFEFF';
    return BOM + csvHeaders + '\n' + csvRows.join('\n');
}
async function POST(req) {
    try {
        const body = await req.json();
        const { filters = {}, columns = null, format = "csv" } = body;
        // Logique similaire mais avec plus de flexibilité
        // Permettre de choisir les colonnes à exporter
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Export personnalisé - à implémenter si besoin",
            filters,
            columns,
            format
        });
    } catch (e) {
        console.error("Erreur POST export dossiers:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de l'export personnalisé"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__cc5ccafa._.js.map
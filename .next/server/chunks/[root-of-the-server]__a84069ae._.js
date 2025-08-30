module.exports = {

"[project]/.next-internal/server/app/api/alerts/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/alerts/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
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
async function GET(req) {
    try {
        const c = await pool.connect();
        try {
            const alerts = {
                critical: [],
                important: [],
                info: []
            };
            // 🔴 ALERTES CRITIQUES
            // 1. Dossiers bloqués > 7 jours
            const { rows: dossiersBloques } = await c.query(`
        SELECT 
          d.id,
          d.statut,
          d.date_creation,
          d.blocages,
          d.derniere_modification,
          c.prenom,
          c.nom,
          c.email,
          EXTRACT(DAYS FROM NOW() - COALESCE(d.derniere_modification::date, d.date_creation::date)) as jours_blocage
        FROM core.dossiers d
        LEFT JOIN core.clients c ON d.client_id = c.id
        WHERE array_length(d.blocages, 1) > 0
          AND EXTRACT(DAYS FROM NOW() - COALESCE(d.derniere_modification::date, d.date_creation::date)) > 7
        ORDER BY jours_blocage DESC
        LIMIT 10
      `);
            if (dossiersBloques.length > 0) {
                alerts.critical.push({
                    id: 'dossiers_bloques',
                    type: 'dossiers_blocked',
                    title: `${dossiersBloques.length} dossier(s) bloqué(s) > 7 jours`,
                    description: 'Dossiers avec blocages non résolus depuis plus d\'une semaine',
                    count: dossiersBloques.length,
                    items: dossiersBloques.map((d)=>({
                            id: d.id,
                            label: `Dossier #${d.id} - ${d.prenom} ${d.nom}`,
                            detail: `Bloqué ${Math.floor(d.jours_blocage)} jours - ${d.blocages.join(', ')}`,
                            link: `/crm/clients/${d.id}`,
                            days: Math.floor(d.jours_blocage)
                        })),
                    action: 'traiter',
                    priority: 'critical'
                });
            }
            // 2. Tickets priorité "Haute" non assignés
            const { rows: ticketsUrgents } = await c.query(`
        SELECT 
          t.id,
          t.subject,
          t.created_at,
          t.priorite,
          d.client_id,
          c.prenom,
          c.nom,
          EXTRACT(HOURS FROM NOW() - t.created_at) as heures_attente
        FROM core.tickets t
        LEFT JOIN core.dossiers d ON t.dossier_id = d.id
        LEFT JOIN core.clients c ON d.client_id = c.id
        WHERE t.priorite = 'Haute' 
          AND t.assigne_operateur_id IS NULL
          AND t.statut IN ('Nouveau', 'En cours')
        ORDER BY t.created_at ASC
      `);
            if (ticketsUrgents.length > 0) {
                alerts.critical.push({
                    id: 'tickets_urgents',
                    type: 'tickets_urgent',
                    title: `${ticketsUrgents.length} ticket(s) urgents non assignés`,
                    description: 'Tickets priorité HAUTE en attente d\'assignation',
                    count: ticketsUrgents.length,
                    items: ticketsUrgents.map((t)=>({
                            id: t.id,
                            label: `Ticket #${t.id} - ${t.subject}`,
                            detail: `${t.prenom} ${t.nom} - En attente ${Math.floor(t.heures_attente)}h`,
                            link: `/crm/tickets/${t.id}`,
                            hours: Math.floor(t.heures_attente)
                        })),
                    action: 'assigner',
                    priority: 'critical'
                });
            }
            // 3. Documents refusés > 48h sans action
            const { rows: docsRefuses } = await c.query(`
        SELECT 
          pj.id,
          pj.type,
          pj.motif_refus,
          pj.uploaded_at,
          d.id as dossier_id,
          c.prenom,
          c.nom,
          EXTRACT(HOURS FROM NOW() - pj.uploaded_at) as heures_refus
        FROM core.pieces_justificatives pj
        LEFT JOIN core.dossiers d ON pj.dossier_id = d.id
        LEFT JOIN core.clients c ON d.client_id = c.id
        WHERE pj.statut = 'refusee'
          AND EXTRACT(HOURS FROM NOW() - pj.uploaded_at) > 48
        ORDER BY pj.uploaded_at ASC
        LIMIT 10
      `);
            if (docsRefuses.length > 0) {
                alerts.critical.push({
                    id: 'docs_refuses',
                    type: 'documents_refused',
                    title: `${docsRefuses.length} document(s) refusés > 48h`,
                    description: 'Documents refusés sans nouvelle version depuis plus de 2 jours',
                    count: docsRefuses.length,
                    items: docsRefuses.map((d)=>({
                            id: d.dossier_id,
                            label: `${d.type} - ${d.prenom} ${d.nom}`,
                            detail: `Refusé ${Math.floor(d.heures_refus / 24)} jours - ${d.motif_refus}`,
                            link: `/crm/clients/${d.dossier_id}`,
                            days: Math.floor(d.heures_refus / 24)
                        })),
                    action: 'relancer',
                    priority: 'critical'
                });
            }
            // 🟡 ALERTES IMPORTANTES
            // 1. Dossiers "en_attente" > 3 jours
            const { rows: dossiersAttente } = await c.query(`
        SELECT 
          d.id,
          d.statut,
          d.date_creation,
          d.derniere_modification,
          c.prenom,
          c.nom,
          EXTRACT(DAYS FROM NOW() - COALESCE(d.derniere_modification::date, d.date_creation::date)) as jours_attente
        FROM core.dossiers d
        LEFT JOIN core.clients c ON d.client_id = c.id
        WHERE d.statut = 'en_attente'
          AND EXTRACT(DAYS FROM NOW() - COALESCE(d.derniere_modification::date, d.date_creation::date)) > 3
        ORDER BY jours_attente DESC
        LIMIT 15
      `);
            if (dossiersAttente.length > 0) {
                alerts.important.push({
                    id: 'dossiers_attente',
                    type: 'dossiers_waiting',
                    title: `${dossiersAttente.length} dossier(s) en attente > 3 jours`,
                    description: 'Dossiers en attente de traitement depuis plus de 3 jours',
                    count: dossiersAttente.length,
                    items: dossiersAttente.slice(0, 5).map((d)=>({
                            id: d.id,
                            label: `Dossier #${d.id} - ${d.prenom} ${d.nom}`,
                            detail: `En attente ${Math.floor(d.jours_attente)} jours`,
                            link: `/crm/clients/${d.id}`,
                            days: Math.floor(d.jours_attente)
                        })),
                    action: 'traiter',
                    priority: 'important'
                });
            }
            // 2. Tickets "Nouveau" > 24h
            const { rows: ticketsNouveaux } = await c.query(`
        SELECT 
          t.id,
          t.subject,
          t.created_at,
          t.priorite,
          d.client_id,
          c.prenom,
          c.nom,
          EXTRACT(HOURS FROM NOW() - t.created_at) as heures_attente
        FROM core.tickets t
        LEFT JOIN core.dossiers d ON t.dossier_id = d.id
        LEFT JOIN core.clients c ON d.client_id = c.id
        WHERE t.statut = 'Nouveau'
          AND EXTRACT(HOURS FROM NOW() - t.created_at) > 24
        ORDER BY t.created_at ASC
        LIMIT 10
      `);
            if (ticketsNouveaux.length > 0) {
                alerts.important.push({
                    id: 'tickets_nouveaux',
                    type: 'tickets_new',
                    title: `${ticketsNouveaux.length} nouveau(x) ticket(s) > 24h`,
                    description: 'Nouveaux tickets non traités depuis plus d\'un jour',
                    count: ticketsNouveaux.length,
                    items: ticketsNouveaux.slice(0, 5).map((t)=>({
                            id: t.id,
                            label: `Ticket #${t.id} - ${t.subject}`,
                            detail: `${t.prenom} ${t.nom} - Priorité ${t.priorite}`,
                            link: `/crm/tickets/${t.id}`,
                            hours: Math.floor(t.heures_attente)
                        })),
                    action: 'prendre_en_charge',
                    priority: 'important'
                });
            }
            // 🔵 ALERTES INFORMATIVES
            // 1. Nouveaux dossiers du jour
            const { rows: nouveauxDossiers } = await c.query(`
        SELECT 
          d.id,
          d.statut,
          d.date_creation,
          c.prenom,
          c.nom,
          p.nom as partenaire_nom
        FROM core.dossiers d
        LEFT JOIN core.clients c ON d.client_id = c.id
        LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
        WHERE d.date_creation::date = CURRENT_DATE
        ORDER BY d.date_creation DESC
      `);
            if (nouveauxDossiers.length > 0) {
                alerts.info.push({
                    id: 'nouveaux_dossiers',
                    type: 'new_dossiers',
                    title: `${nouveauxDossiers.length} nouveau(x) dossier(s) aujourd'hui`,
                    description: 'Dossiers créés dans les dernières 24h',
                    count: nouveauxDossiers.length,
                    items: nouveauxDossiers.slice(0, 5).map((d)=>({
                            id: d.id,
                            label: `Dossier #${d.id} - ${d.prenom} ${d.nom}`,
                            detail: `${d.partenaire_nom} - Statut: ${d.statut}`,
                            link: `/crm/clients/${d.id}`
                        })),
                    action: 'consulter',
                    priority: 'info'
                });
            }
            // 2. Tickets résolus dernières 24h
            const { rows: ticketsResolus } = await c.query(`
        SELECT 
          t.id,
          t.subject,
          t.created_at,
          d.client_id,
          c.prenom,
          c.nom
        FROM core.tickets t
        LEFT JOIN core.dossiers d ON t.dossier_id = d.id
        LEFT JOIN core.clients c ON d.client_id = c.id
        WHERE t.statut = 'Résolu'
          AND t.created_at >= CURRENT_DATE - INTERVAL '24 hours'
        ORDER BY t.created_at DESC
        LIMIT 10
      `);
            if (ticketsResolus.length > 0) {
                alerts.info.push({
                    id: 'tickets_resolus',
                    type: 'tickets_resolved',
                    title: `${ticketsResolus.length} ticket(s) résolu(s) aujourd'hui`,
                    description: 'Tickets fermés dans les dernières 24h',
                    count: ticketsResolus.length,
                    items: ticketsResolus.slice(0, 5).map((t)=>({
                            id: t.id,
                            label: `Ticket #${t.id} - ${t.subject}`,
                            detail: `${t.prenom} ${t.nom}`,
                            link: `/crm/tickets/${t.id}`
                        })),
                    action: 'consulter',
                    priority: 'info'
                });
            }
            // Compter totaux
            const totalCritical = alerts.critical.reduce((sum, alert)=>sum + alert.count, 0);
            const totalImportant = alerts.important.reduce((sum, alert)=>sum + alert.count, 0);
            const totalInfo = alerts.info.reduce((sum, alert)=>sum + alert.count, 0);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                alerts,
                summary: {
                    critical: totalCritical,
                    important: totalImportant,
                    info: totalInfo,
                    total: totalCritical + totalImportant + totalInfo
                },
                generated_at: new Date().toISOString()
            });
        } finally{
            c.release();
        }
    } catch (e) {
        console.error("Erreur GET alerts:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de la récupération des alertes"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__a84069ae._.js.map
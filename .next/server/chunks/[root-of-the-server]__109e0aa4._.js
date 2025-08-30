module.exports = {

"[project]/.next-internal/server/app/api/tickets/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/tickets/[id]/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "GET": ()=>GET,
    "PATCH": ()=>PATCH
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
async function GET(req, { params }) {
    try {
        const { id } = params;
        if (!id || isNaN(parseInt(id))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "ID ticket invalide"
            }, {
                status: 400
            });
        }
        const c = await pool.connect();
        try {
            // 1. Récupérer le ticket avec toutes les infos liées
            const { rows: tickets } = await c.query(`
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
          
          -- Info dossier complet
          d.statut as dossier_statut,
          d.client_id,
          d.entreprise_id,
          d.partenaire_id,
          d.date_creation as dossier_date_creation,
          d.commission_partenaire_eur,
          
          -- Info client
          c.prenom,
          c.nom,
          c.email,
          c.telephone,
          
          -- Entreprise
          e.denomination,
          e.forme,
          
          -- Partenaire
          p.nom as partenaire_nom,
          
          -- Opérateur assigné
          o.nom as operateur_nom,
          o.email as operateur_email
          
        FROM core.tickets t
        LEFT JOIN core.dossiers d ON t.dossier_id = d.id
        LEFT JOIN core.clients c ON d.client_id = c.id
        LEFT JOIN core.entreprises e ON d.entreprise_id = e.id
        LEFT JOIN core.partenaires p ON d.partenaire_id = p.id
        LEFT JOIN core.operateurs o ON t.assigne_operateur_id = o.id
        WHERE t.id = $1
      `, [
                parseInt(id)
            ]);
            if (!tickets.length) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Ticket introuvable"
                }, {
                    status: 404
                });
            }
            const ticket = tickets[0];
            // 2. Récupérer tous les events du ticket
            const { rows: events } = await c.query(`
        SELECT 
          id,
          ticket_id,
          at,
          message,
          attachments
        FROM core.ticket_events
        WHERE ticket_id = $1
        ORDER BY at ASC
      `, [
                parseInt(id)
            ]);
            // 3. Récupérer la liste des opérateurs pour assignation
            const { rows: operateurs } = await c.query(`
        SELECT id, nom, email, role
        FROM core.operateurs
        ORDER BY nom
      `);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ticket,
                events,
                operateurs,
                references: {
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
                    ]
                }
            });
        } finally{
            c.release();
        }
    } catch (e) {
        console.error("Erreur GET ticket detail:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de la récupération du ticket"
        }, {
            status: 500
        });
    }
}
async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json().catch(()=>({}));
        if (!id || isNaN(parseInt(id))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "ID ticket invalide"
            }, {
                status: 400
            });
        }
        const { statut, priorite, assigne_operateur_id, subject, auto_event_message = true // Créer un event automatique pour tracer les changements
         } = body;
        // Validation des valeurs
        const validStatuts = [
            "Nouveau",
            "En cours",
            "Résolu",
            "Fermé"
        ];
        const validPriorites = [
            "Basse",
            "Moyenne",
            "Haute"
        ];
        if (statut && !validStatuts.includes(statut)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Statut invalide"
            }, {
                status: 400
            });
        }
        if (priorite && !validPriorites.includes(priorite)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Priorité invalide"
            }, {
                status: 400
            });
        }
        const c = await pool.connect();
        try {
            await c.query("BEGIN");
            // 1. Récupérer l'état actuel pour comparaison
            const { rows: currentTicket } = await c.query(`
        SELECT statut, priorite, assigne_operateur_id, subject
        FROM core.tickets 
        WHERE id = $1
      `, [
                parseInt(id)
            ]);
            if (!currentTicket.length) {
                await c.query("ROLLBACK");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Ticket introuvable"
                }, {
                    status: 404
                });
            }
            const current = currentTicket[0];
            // 2. Construire la requête de mise à jour
            let updateFields = [];
            let updateParams = [];
            let paramCount = 0;
            let changes = [];
            if (statut && statut !== current.statut) {
                paramCount++;
                updateFields.push(`statut = $${paramCount}`);
                updateParams.push(statut);
                changes.push(`Statut: ${current.statut} → ${statut}`);
            }
            if (priorite && priorite !== current.priorite) {
                paramCount++;
                updateFields.push(`priorite = $${paramCount}`);
                updateParams.push(priorite);
                changes.push(`Priorité: ${current.priorite} → ${priorite}`);
            }
            if (assigne_operateur_id !== undefined && assigne_operateur_id !== current.assigne_operateur_id) {
                paramCount++;
                updateFields.push(`assigne_operateur_id = $${paramCount}`);
                updateParams.push(assigne_operateur_id);
                if (assigne_operateur_id === null) {
                    changes.push("Ticket désassigné");
                } else {
                    changes.push(`Assigné à l'opérateur #${assigne_operateur_id}`);
                }
            }
            if (subject && subject.trim() !== current.subject) {
                paramCount++;
                updateFields.push(`subject = $${paramCount}`);
                updateParams.push(subject.trim());
                changes.push(`Sujet modifié: "${subject.trim()}"`);
            }
            // 3. Effectuer la mise à jour si nécessaire
            if (updateFields.length > 0) {
                updateParams.push(parseInt(id));
                const updateQuery = `
          UPDATE core.tickets 
          SET ${updateFields.join(", ")}
          WHERE id = $${++paramCount}
          RETURNING id, subject, statut, priorite, assigne_operateur_id
        `;
                const { rows: updatedTicket } = await c.query(updateQuery, updateParams);
                // 4. Ajouter un event automatique si demandé
                if (auto_event_message && changes.length > 0) {
                    await c.query(`
            INSERT INTO core.ticket_events (ticket_id, message)
            VALUES ($1, $2)
          `, [
                        parseInt(id),
                        `Modifications: ${changes.join(", ")}`
                    ]);
                }
                await c.query("COMMIT");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ticket: updatedTicket[0],
                    changes,
                    message: "Ticket mis à jour avec succès"
                });
            } else {
                await c.query("ROLLBACK");
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "Aucune modification détectée"
                });
            }
        } finally{
            c.release();
        }
    } catch (e) {
        console.error("Erreur PATCH ticket:", e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Erreur lors de la mise à jour du ticket"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__109e0aa4._.js.map
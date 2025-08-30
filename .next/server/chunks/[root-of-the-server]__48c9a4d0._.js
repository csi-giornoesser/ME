module.exports = {

"[project]/.next-internal/server/app/api/commercial/rappels/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

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
"[project]/app/api/_lib/proxy.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// app/api/_lib/proxy.ts
/**
 * Proxy helper pour relayer une requête Next.js vers l'API Express.
 * - récupère la base URL depuis API_INTERNAL_URL ou NEXT_PUBLIC_API_URL
 * - fusionne les query params entrants
 * - propage headers/cookies (en nettoyant ceux interdits)
 * - retourne la réponse (stream) telle quelle
 */ __turbopack_context__.s({
    "proxyGET": ()=>proxyGET,
    "proxyPATCH": ()=>proxyPATCH,
    "proxyPOST": ()=>proxyPOST,
    "proxyRequest": ()=>proxyRequest
});
function getApiBase() {
    // On essaie d’abord API_INTERNAL_URL (backend privé), puis NEXT_PUBLIC_API_URL (public)
    const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "";
    if (!base) {
        throw new Error("API_INTERNAL_URL (ou NEXT_PUBLIC_API_URL) manquant dans l'environnement");
    }
    // Valide et normalise
    let u;
    try {
        // Supporte base avec ou sans trailing slash
        u = new URL(base.startsWith("http") ? base : `http://${base}`);
    } catch  {
        throw new Error(`API base URL invalide: "${base}"`);
    }
    return u.toString().replace(/\/+$/, ""); // retire trailing slash
}
function mergeQuery(to, from) {
    // on garde ce qui est déjà dans "to" et on ajoute/écrase avec ceux de "from"
    from.searchParams.forEach((v, k)=>{
        if (!to.searchParams.has(k)) to.searchParams.set(k, v);
    });
}
function passthroughRequestHeaders(req, extra) {
    const out = new Headers(extra || undefined);
    // Copie les headers utiles (cookies, auth, content-type…)
    for (const [k, v] of req.headers){
        const key = k.toLowerCase();
        // headers interdits à setter côté fetch
        if ([
            "host",
            "content-length",
            "connection"
        ].includes(key)) continue;
        if (!out.has(k)) out.set(k, v);
    }
    return out;
}
function passthroughResponseHeaders(h) {
    const out = new Headers();
    for (const [k, v] of h){
        const key = k.toLowerCase();
        // on peut filtrer certains hop-by-hop si besoin
        if ([
            "transfer-encoding",
            "connection"
        ].includes(key)) continue;
        out.set(k, v);
    }
    return out;
}
async function proxyRequest(req, path, init) {
    const base = getApiBase();
    // Construit l’URL cible
    // - path peut contenir un querystring propre
    const target = new URL(path.startsWith("/") ? `${base}${path}` : `${base}/${path}`);
    // Fusionne les query params de la requête entrante
    const incoming = new URL(req.url);
    mergeQuery(target, incoming);
    // Méthode & body
    const method = (init?.method || req.method || "GET").toUpperCase();
    // Body : uniquement si non GET/HEAD
    let body = init?.body;
    if (!body && method !== "GET" && method !== "HEAD") {
        // on lit le body une seule fois (arrayBuffer pour supporter tout type)
        const ab = await req.arrayBuffer().catch(()=>null);
        if (ab) body = ab;
    }
    // Headers (on propage + extra éventuels)
    const headers = passthroughRequestHeaders(req, init?.headers);
    // Appel API
    const resp = await fetch(target.toString(), {
        method,
        headers,
        body,
        // important pour laisser passer les redirects/API brutes
        redirect: "manual"
    });
    // On renvoie le stream tel quel, avec headers nettoyés
    return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: passthroughResponseHeaders(resp.headers)
    });
}
const proxyGET = (req, path)=>proxyRequest(req, path, {
        method: "GET"
    });
const proxyPOST = (req, path, body)=>proxyRequest(req, path, {
        method: "POST",
        body: body instanceof Uint8Array || typeof body === "string" ? body : body != null ? JSON.stringify(body) : undefined,
        headers: body != null ? {
            "content-type": "application/json"
        } : undefined
    });
const proxyPATCH = (req, path, body)=>proxyPOST(req, path, body && {
        ...body,
        __method: "PATCH"
    }); // ou direct PATCH si ton API l’accepte
}),
"[project]/app/api/commercial/rappels/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "GET": ()=>GET,
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$proxy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/_lib/proxy.ts [app-route] (ecmascript)");
;
const GET = (req)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$proxy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["proxyRequest"])(req, "/api/commercial/rappels");
const POST = (req)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$_lib$2f$proxy$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["proxyRequest"])(req, "/api/commercial/rappels");
}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__48c9a4d0._.js.map
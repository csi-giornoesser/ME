// app/api/_lib/proxy.ts
/**
 * Proxy helper pour relayer une requête Next.js vers l'API Express.
 * - récupère la base URL depuis API_INTERNAL_URL ou NEXT_PUBLIC_API_URL
 * - fusionne les query params entrants
 * - propage headers/cookies (en nettoyant ceux interdits)
 * - retourne la réponse (stream) telle quelle
 */

function getApiBase(): string {
  // On essaie d’abord API_INTERNAL_URL (backend privé), puis NEXT_PUBLIC_API_URL (public)
  const base =
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";

  if (!base) {
    throw new Error(
      "API_INTERNAL_URL (ou NEXT_PUBLIC_API_URL) manquant dans l'environnement"
    );
  }

  // Valide et normalise
  let u: URL;
  try {
    // Supporte base avec ou sans trailing slash
    u = new URL(base.startsWith("http") ? base : `http://${base}`);
  } catch {
    throw new Error(`API base URL invalide: "${base}"`);
  }
  return u.toString().replace(/\/+$/, ""); // retire trailing slash
}

function mergeQuery(to: URL, from: URL) {
  // on garde ce qui est déjà dans "to" et on ajoute/écrase avec ceux de "from"
  from.searchParams.forEach((v, k) => {
    if (!to.searchParams.has(k)) to.searchParams.set(k, v);
  });
}

function passthroughRequestHeaders(req: Request, extra?: HeadersInit): Headers {
  const out = new Headers(extra || undefined);

  // Copie les headers utiles (cookies, auth, content-type…)
  for (const [k, v] of req.headers) {
    const key = k.toLowerCase();
    // headers interdits à setter côté fetch
    if (["host", "content-length", "connection"].includes(key)) continue;
    if (!out.has(k)) out.set(k, v);
  }

  return out;
}

function passthroughResponseHeaders(h: Headers): Headers {
  const out = new Headers();
  for (const [k, v] of h) {
    const key = k.toLowerCase();
    // on peut filtrer certains hop-by-hop si besoin
    if (["transfer-encoding", "connection"].includes(key)) continue;
    out.set(k, v);
  }
  return out;
}

/**
 * Proxy principal
 * @param req  requête entrante (Next route handler)
 * @param path chemin à appeler côté API (ex: "/api/alerts" ou `/api/clients/${id}`)
 * @param init overrides (method/body/headers…) si besoin
 */
export async function proxyRequest(
  req: Request,
  path: string,
  init?: RequestInit
): Promise<Response> {
  const base = getApiBase();

  // Construit l’URL cible
  // - path peut contenir un querystring propre
  const target = new URL(
    path.startsWith("/") ? `${base}${path}` : `${base}/${path}`
  );

  // Fusionne les query params de la requête entrante
  const incoming = new URL(req.url);
  mergeQuery(target, incoming);

  // Méthode & body
  const method = (init?.method || req.method || "GET").toUpperCase();

  // Body : uniquement si non GET/HEAD
  let body: BodyInit | undefined = init?.body;
  if (!body && method !== "GET" && method !== "HEAD") {
    // on lit le body une seule fois (arrayBuffer pour supporter tout type)
    const ab = await req.arrayBuffer().catch(() => null);
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
    redirect: "manual",
    // credentials: "include" // inutile ici, on propage déjà Cookie
  });

  // On renvoie le stream tel quel, avec headers nettoyés
  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: passthroughResponseHeaders(resp.headers),
  });
}

/* ------- Helpers pratiques (optionnel) ------- */

export const proxyGET = (req: Request, path: string) =>
  proxyRequest(req, path, { method: "GET" });

export const proxyPOST = (req: Request, path: string, body?: any) =>
  proxyRequest(req, path, {
    method: "POST",
    body: body instanceof Uint8Array || typeof body === "string"
      ? (body as any)
      : body != null
      ? JSON.stringify(body)
      : undefined,
    headers: body != null ? { "content-type": "application/json" } : undefined,
  });

export const proxyPATCH = (req: Request, path: string, body?: any) =>
  proxyPOST(req, path, body && { ...body, __method: "PATCH" }); // ou direct PATCH si ton API l’accepte


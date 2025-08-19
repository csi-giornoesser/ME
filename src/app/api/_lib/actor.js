// Simule l'auth pour filtrer l'API par rôle.
// En prod, on branchera sur ta vraie auth (NextAuth/JWT) et/ou RLS Postgres.
export function getActor(req) {
  const role = req.headers.get("x-role") || "admin"; // admin par défaut (CRM)
  const partnerId = Number(req.headers.get("x-partner-id") || "") || null;
  const clientId  = Number(req.headers.get("x-client-id") || "")  || null;
  return { role, partnerId, clientId };
}

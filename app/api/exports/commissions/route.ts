import { proxyRequest } from "../../_lib/proxy";

// Conserve tous les query params (partnerId, from, to, format, groupBy…)
export const GET = (req: Request) => proxyRequest(req, "/api/exports/commissions");

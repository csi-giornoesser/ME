import { proxyRequest } from "../../_lib/proxy";

// Conserve les query params (status, partnerId, operatorId, from, to, format)
export const GET  = (req: Request) => proxyRequest(req, "/api/exports/dossiers");
export const POST = (req: Request) => proxyRequest(req, "/api/exports/dossiers");

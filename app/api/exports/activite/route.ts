import { proxyRequest } from "../../_lib/proxy";

// proxyRequest conserve les query params (from, to, type, format)
export const GET = (req: Request) => proxyRequest(req, "/api/exports/activite");

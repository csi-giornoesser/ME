import { proxyRequest } from "../../_lib/proxy";

export const GET  = (req: Request) => proxyRequest(req, "/api/commercial/rappels");
export const POST = (req: Request) => proxyRequest(req, "/api/commercial/rappels");

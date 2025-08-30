import { proxyRequest } from "../_lib/proxy";

export const GET  = (req: Request) => proxyRequest(req, "/api/tickets");
export const POST = (req: Request) => proxyRequest(req, "/api/tickets");

import { proxyRequest } from "../_lib/proxy";

export const GET = (req: Request) => proxyRequest(req, "/api/dossiers");

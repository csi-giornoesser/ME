import { proxyRequest } from "../_lib/proxy";

export const POST = (req: Request) => proxyRequest(req, "/api/notifications");

import { proxyRequest } from "../../_lib/proxy";

export const GET = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/tickets/${params.id}`);

export const PATCH = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/tickets/${params.id}`);

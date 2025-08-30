import { proxyRequest } from "../../../_lib/proxy";

export const GET  = (req: Request, { params }: { params: { id: string } }) =>
  // conserve ?limit=&type=
  proxyRequest(req, `/api/partenaires/${params.id}/interactions`);

export const POST = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/partenaires/${params.id}/interactions`);

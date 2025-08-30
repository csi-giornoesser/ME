import { proxyRequest } from "../../_lib/proxy";

export const GET = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/partenaires/${params.id}`);

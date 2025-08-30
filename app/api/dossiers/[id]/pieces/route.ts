import { proxyRequest } from "../../../_lib/proxy";

export const GET = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/dossiers/${params.id}/pieces`);

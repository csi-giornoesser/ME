import { proxyRequest } from "../../../../../_lib/proxy";

export const GET = (req: Request, { params }: { params: { id: string; type: string } }) =>
  proxyRequest(req, `/api/dossiers/${params.id}/documents/${params.type}/download`);

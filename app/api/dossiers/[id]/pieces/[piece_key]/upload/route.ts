import { proxyRequest } from "../../../../../_lib/proxy";

export const POST = (req: Request, { params }: { params: { id: string; piece_key: string } }) =>
  proxyRequest(req, `/api/dossiers/${params.id}/pieces/${params.piece_key}/upload`);

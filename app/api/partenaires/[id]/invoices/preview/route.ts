import { proxyRequest } from "../../../../_lib/proxy";

export const POST = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/partenaires/${params.id}/invoices/preview`);

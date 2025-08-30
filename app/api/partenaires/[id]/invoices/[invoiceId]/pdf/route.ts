import { proxyRequest } from "../../../../_lib/proxy";

export const GET = (_req: Request, { params }: { params: { id: string, invoiceId: string } }) =>
  proxyRequest(_req, `/api/partenaires/${params.id}/invoices/${params.invoiceId}/pdf`);

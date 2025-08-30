import { proxyRequest } from "../../../_lib/proxy";

export const GET = (req: Request, { params }: { params: { id: string } }) =>
  // proxyRequest conserve les query params (search, statut, dateDebut, dateFin, showBlocked, commission, limit)
  proxyRequest(req, `/api/partenaires/${params.id}/clients`);

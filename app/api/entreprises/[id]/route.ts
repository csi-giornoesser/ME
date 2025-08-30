export const runtime = "nodejs";
import { proxyRequest } from "../../_lib/proxy";

export const GET = (req: Request, { params }: { params: { id: string } }) =>
  proxyRequest(req, `/api/entreprises/${params.id}`);

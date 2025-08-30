// app/api/alerts/route.ts
export const runtime = "nodejs";
import { proxyGET } from "../_lib/proxy";

export async function GET(req: Request) {
  return proxyGET(req, "/api/alerts");
}

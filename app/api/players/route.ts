import { proxyStats } from "@/lib/mc-stats";

export const runtime = "nodejs";

export function GET() {
  return proxyStats("/api/players");
}

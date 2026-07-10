import { NextResponse } from "next/server";

/**
 * Thin server-side proxy to the Minecraft server stats API.
 *
 * The upstream (a Java plugin or its FastAPI proxy) requires a bearer key that
 * must never reach the browser, so the `/api/*` routes fetch through here and
 * relay JSON back. Configure via env:
 *
 *   MC_STATS_API_URL   base URL, e.g. http://127.0.0.1:8080 (default)
 *   MC_STATS_API_KEY   bearer token sent on every upstream request
 */
const BASE_URL = (process.env.MC_STATS_API_URL ?? "http://mc.gobitsnbytes.org").replace(/\/$/, "");
const API_KEY = process.env.MC_STATS_API_KEY;

// Cache each upstream response briefly so the 20s client poll can't stampede
// the game server when many visitors are on the page at once.
const REVALIDATE_SECONDS = 15;

export async function proxyStats(path: string): Promise<NextResponse> {
  if (!API_KEY) {
    return NextResponse.json({ error: "Stats API not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Upstream unavailable" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=45` },
    });
  } catch {
    return NextResponse.json({ error: "Upstream unreachable" }, { status: 502 });
  }
}

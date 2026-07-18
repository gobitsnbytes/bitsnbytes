import { NextRequest, NextResponse } from "next/server";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${MOTHERBOARD_BASE}/api/meetings/public/guest/verification/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        { error: (data as { detail?: string }).detail ?? "Verification failed" },
        { status: upstream.status }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/team/schedule/verification/verify] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

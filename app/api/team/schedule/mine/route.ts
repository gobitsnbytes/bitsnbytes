import { NextRequest, NextResponse } from "next/server";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email query param required" }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${MOTHERBOARD_BASE}/api/meetings/public/guest/mine?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      { next: { revalidate: 0 } }
    );
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json({ error: (data as { detail?: string }).detail ?? "Failed to fetch meetings" }, { status: upstream.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/team/schedule/mine]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

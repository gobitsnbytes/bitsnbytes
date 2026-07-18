import { NextResponse } from "next/server";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";

export async function GET() {
  try {
    const upstream = await fetch(`${MOTHERBOARD_BASE}/api/meetings/public/hosts`, {
      next: { revalidate: 60 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch hosts" },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/team/schedule/hosts] upstream error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

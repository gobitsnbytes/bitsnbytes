import { NextResponse } from "next/server";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";

export async function GET() {
  try {
    const upstream = await fetch(`${MOTHERBOARD_BASE}/api/meetings/public/hosts`, {
      // No auth — this is a public endpoint
      next: { revalidate: 60 }, // Cache for 60 s on the server
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch hosts from Motherboard" },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/booking/hosts] upstream error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

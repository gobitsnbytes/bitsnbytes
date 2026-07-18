import { NextRequest, NextResponse } from "next/server";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://motherboard.gobitsnbytes.org";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const bookingLink = searchParams.get("bookingLink");
  const date = searchParams.get("date");
  const duration = searchParams.get("duration") ?? "30";

  if (!bookingLink || !date) {
    return NextResponse.json(
      { error: "bookingLink and date query params are required" },
      { status: 400 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be in YYYY-MM-DD format" }, { status: 400 });
  }

  try {
    const url = `${MOTHERBOARD_BASE}/api/meetings/public/availability/${encodeURIComponent(bookingLink)}/slots?date=${date}&duration=${duration}`;
    const upstream = await fetch(url, { next: { revalidate: 0 } }); // Never cache — real-time availability

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch slots from Motherboard" },
        { status: upstream.status }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/booking/slots] upstream error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

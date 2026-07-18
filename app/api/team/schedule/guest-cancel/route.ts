import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";

const Schema = z.object({
  meeting_id: z.string().min(1),
  email: z.string().email(),
  reason: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { meeting_id, email, reason } = parsed.data;

  try {
    const upstream = await fetch(
      `${MOTHERBOARD_BASE}/api/meetings/public/guest/${encodeURIComponent(meeting_id)}/cancel`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      }
    );
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json({ error: (data as { detail?: string }).detail ?? "Cancellation failed" }, { status: upstream.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/team/schedule/guest-cancel]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

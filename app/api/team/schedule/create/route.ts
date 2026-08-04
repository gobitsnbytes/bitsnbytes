import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";
const MOTHERBOARD_API_KEY = process.env.MOTHERBOARD_API_KEY ?? process.env.INTERNAL_API_SECRET ?? "";

const RequestSchema = z.object({
  bookingLink: z.string().min(1),
  hostDiscordId: z.string().min(1),
  guestName: z.string().min(1).max(120),
  guestEmail: z.string().email(),
  message: z.string().max(500).optional(),
  slotISO: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
    message: "Invalid ISO date-time string",
  }),
  duration: z.number().int().min(15).max(120).default(30),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { hostDiscordId, guestName, guestEmail, message, slotISO, duration } = parsed.data;
  const scheduledTimeMs = new Date(slotISO).getTime();

  const payload = {
    title: `Meeting with ${guestName}`,
    description: message
      ? `External request via gobitsnbytes.org.\n\nMessage:\n${message}`
      : "External request via gobitsnbytes.org.",
    scheduled_time: scheduledTimeMs,
    duration_minutes: duration || 30,
    location_type: "discord_vc",
    location_details: "Discord VC (link sent via email)",
    creator_id: hostDiscordId,
    invitees: [{ id: hostDiscordId, type: "user" }],
    external_emails: [guestEmail],
    scope: "invite",
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (MOTHERBOARD_API_KEY) {
      headers["Authorization"] = `Bearer ${MOTHERBOARD_API_KEY}`;
    }

    let upstream = await fetch(`${MOTHERBOARD_BASE}/api/meetings/schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (upstream.status === 401 || upstream.status === 404) {
      // Fallback to public endpoint
      upstream = await fetch(`${MOTHERBOARD_BASE}/api/meetings/public/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { error: (data as { detail?: string }).detail ?? "Failed to create session" },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ success: true, meeting: data }, { status: 201 });
  } catch (err) {
    console.error("[/api/team/schedule/create] upstream error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

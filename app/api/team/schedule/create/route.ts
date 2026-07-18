import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://api.gobitsnbytes.org";
const MOTHERBOARD_API_KEY = process.env.MOTHERBOARD_API_KEY ?? "";

const RequestSchema = z.object({
  bookingLink: z.string().min(1),
  hostDiscordId: z.string().min(1),
  guestName: z.string().min(1).max(120),
  guestEmail: z.string().email(),
  message: z.string().max(500).optional(),
  slotISO: z.string().datetime(),
  duration: z.number().int().min(15).max(120).default(30),
});

export async function POST(req: NextRequest) {
  if (!MOTHERBOARD_API_KEY) {
    return NextResponse.json(
      { error: "Scheduling service not configured. Please contact the team directly." },
      { status: 503 }
    );
  }

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
  const endTimeMs = scheduledTimeMs + duration * 60 * 1000;

  const payload = {
    title: `Meeting with ${guestName}`,
    description: message
      ? `External request.\n\nMessage:\n${message}`
      : "External request via gobitsnbytes.org/about.",
    scheduled_time: scheduledTimeMs,
    end_time: endTimeMs,
    creator_id: hostDiscordId,
    location_details: "Discord VC (link sent via email)",
    external_emails: guestEmail,
    attendees: [{ discord_id: hostDiscordId, attendee_type: "user" }],
  };

  try {
    const upstream = await fetch(`${MOTHERBOARD_BASE}/api/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOTHERBOARD_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

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

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MOTHERBOARD_BASE = process.env.MOTHERBOARD_API_URL ?? "https://motherboard.gobitsnbytes.org";
const MOTHERBOARD_API_KEY = process.env.MOTHERBOARD_API_KEY ?? "";

const BookingRequestSchema = z.object({
  bookingLink: z.string().min(1),
  hostDiscordId: z.string().min(1),
  guestName: z.string().min(1).max(120),
  guestEmail: z.string().email(),
  message: z.string().max(500).optional(),
  slotISO: z.string().datetime(), // UTC ISO-8601
  duration: z.number().int().min(15).max(120).default(30),
});

export async function POST(req: NextRequest) {
  // Require an API key to be configured — fail loudly in development if missing
  if (!MOTHERBOARD_API_KEY) {
    console.error("[/api/booking/create] MOTHERBOARD_API_KEY is not set");
    return NextResponse.json(
      { error: "Booking service is not configured. Please contact the team directly." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { hostDiscordId, guestName, guestEmail, message, slotISO, duration } = parsed.data;

  const scheduledTimeMs = new Date(slotISO).getTime();
  const endTimeMs = scheduledTimeMs + duration * 60 * 1000;

  const meetingTitle = `Meeting with ${guestName}`;
  const meetingDescription = message
    ? `External booking request.\n\nMessage from guest:\n${message}`
    : "External booking request via gobitsnbytes.org/about.";

  const payload = {
    title: meetingTitle,
    description: meetingDescription,
    scheduled_time: scheduledTimeMs,
    end_time: endTimeMs,
    creator_id: hostDiscordId,
    location_details: "Discord VC (link will be sent via email)",
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

    const responseBody = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      console.error("[/api/booking/create] Motherboard error:", upstream.status, responseBody);
      return NextResponse.json(
        { error: (responseBody as { detail?: string }).detail ?? "Failed to create booking" },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ success: true, meeting: responseBody }, { status: 201 });
  } catch (err) {
    console.error("[/api/booking/create] upstream error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

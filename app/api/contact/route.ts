import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sendContactWebhook } from "@/lib/discord"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body?.name ?? "").toString().trim()
    const email = (body?.email ?? "").toString().trim()
    const subject = (body?.subject ?? "").toString().trim()
    const message = (body?.message ?? "").toString().trim()
    const source = (body?.source ?? "website").toString().trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      )
    }

    // 1. Archive in Supabase
    const { error: dbError } = await supabase.from("contacts").insert({
      name,
      email,
      subject: subject || null,
      message,
      source,
    })

    if (dbError) {
      console.error("Supabase contact insert error:", dbError)
    }

    // 2. Notify Discord via Webhook
    const discordSent = await sendContactWebhook({
      name,
      email,
      subject,
      message,
      source,
    })

    if (!discordSent) {
      console.error("Discord webhook delivery failed")
      // If both Supabase and Discord fail, return a 502 bad gateway
      if (dbError) {
        return NextResponse.json(
          { error: "Submission failed. Please try again." },
          { status: 502 },
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API exception:", error)
    return NextResponse.json(
      { error: "Something went wrong while submitting the contact form." },
      { status: 500 },
    )
  }
}

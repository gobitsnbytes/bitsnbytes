import { NextRequest, NextResponse } from "next/server"
import { getEvents, createEvent, getNotionConfigStatus, NotionConfigError, NotionDatabaseError } from "@/lib/notion"
import { POINTS, addPoints } from "@/lib/gamification"

export async function GET(req: NextRequest) {
  const configStatus = getNotionConfigStatus()
  if (!configStatus.configured) {
    return NextResponse.json(
      { error: "Notion integration not configured", missing: configStatus.missing },
      { status: 503 }
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const forkId = searchParams.get("forkId") || undefined
    const status = searchParams.get("status") as any
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    const events = await getEvents({ forkId, status, limit })

    return NextResponse.json({ events, total: events.length })
  } catch (error) {
    console.error("[API /events] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to fetch events. Please try again later." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const configStatus = getNotionConfigStatus()
  if (!configStatus.configured) {
    return NextResponse.json(
      { error: "Notion integration not configured", missing: configStatus.missing },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const { name, forkId, type, date, description } = body

    if (!name || !forkId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: name, forkId, type" },
        { status: 400 }
      )
    }

    const event = await createEvent({
      name,
      forkId,
      type,
      date: date ? new Date(date) : undefined,
      description,
    })

    // Award points for event creation
    await addPoints(forkId, POINTS.EVENT_CREATED, "Event Created")

    return NextResponse.json({ event, message: "Event created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[API /events POST] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to create event. Please try again later." },
      { status: 500 }
    )
  }
}
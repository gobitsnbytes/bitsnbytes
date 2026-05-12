import { NextRequest, NextResponse } from "next/server"
import { getReports, createReport, getNotionConfigStatus, NotionConfigError, NotionDatabaseError } from "@/lib/notion"
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
    const type = searchParams.get("type") as any
    const status = searchParams.get("status") as any
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    const reports = await getReports({ forkId, type, status, limit })

    return NextResponse.json({ reports, total: reports.length })
  } catch (error) {
    console.error("[API /reports] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to fetch reports. Please try again later." },
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
    const { title, forkId, type, content, isLate } = body

    if (!title || !forkId || !type || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, forkId, type, content" },
        { status: 400 }
      )
    }

    const report = await createReport({
      title,
      forkId,
      type,
      content,
      isLate: isLate ?? false,
    })

    // Award points for report submission
    let points = POINTS.REPORT_SUBMITTED
    if (!isLate) {
      points += POINTS.ON_TIME_REPORT_BONUS
    }
    await addPoints(forkId, points, `Report Submitted: ${title}`)

    return NextResponse.json({ report, message: "Report submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("[API /reports POST] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to submit report. Please try again later." },
      { status: 500 }
    )
  }
}
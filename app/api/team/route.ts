import { NextRequest, NextResponse } from "next/server"
import { getTeamMembers, getNotionConfigStatus, NotionConfigError, NotionDatabaseError } from "@/lib/notion"

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

    const members = await getTeamMembers({ forkId, status, limit })

    return NextResponse.json({ members, total: members.length })
  } catch (error) {
    console.error("[API /team] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to fetch team members. Please try again later." },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { getForks, getNotionConfigStatus, NotionConfigError, NotionDatabaseError } from "@/lib/notion"
import { calculateHealthScore } from "@/lib/healthScore"
import { getLeaderboard } from "@/lib/gamification"

export async function GET(req: NextRequest) {
  // Check Notion configuration
  const configStatus = getNotionConfigStatus()
  if (!configStatus.configured) {
    return NextResponse.json(
      {
        error: "Notion integration not configured",
        missing: configStatus.missing,
        message: `Missing environment variables: ${configStatus.missing.join(", ")}. Please configure these in your .env file.`,
      },
      { status: 503 }
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as "Active" | "Inactive" | "Pending" | null
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined

    const forks = await getForks({ status: status || undefined, limit })

    // Calculate health scores for each fork
    const forksWithHealth = forks.map((fork) => {
      const healthResult = calculateHealthScore(fork)
      return {
        ...fork,
        healthScore: healthResult.score,
        healthStatus: healthResult.status,
        healthBreakdown: healthResult.breakdown,
      }
    })

    // Generate leaderboard
    const leaderboard = await getLeaderboard(forks)

    return NextResponse.json({
      forks: forksWithHealth,
      leaderboard,
      total: forks.length,
    })
  } catch (error) {
    console.error("[API /forks] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to fetch forks. Please try again later." },
      { status: 500 }
    )
  }
}
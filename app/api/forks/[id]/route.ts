import { NextRequest, NextResponse } from "next/server"
import { getFork, getEvents, getTeamMembers, getReports, getNotionConfigStatus, NotionConfigError, NotionDatabaseError } from "@/lib/notion"
import { calculateHealthScore, getHealthRecommendations } from "@/lib/healthScore"
import { getLevelInfo, getPointsToNextLevel } from "@/lib/gamification"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const configStatus = getNotionConfigStatus()
  if (!configStatus.configured) {
    return NextResponse.json(
      { error: "Notion integration not configured", missing: configStatus.missing },
      { status: 503 }
    )
  }

  try {
    const { id } = await params
    const fork = await getFork(id)

    if (!fork) {
      return NextResponse.json({ error: "Fork not found" }, { status: 404 })
    }

    // Fetch related data
    const [events, members, reports] = await Promise.all([
      getEvents({ forkId: id }),
      getTeamMembers({ forkId: id }),
      getReports({ forkId: id, limit: 5 }),
    ])

    // Calculate health score
    const healthResult = calculateHealthScore(fork)
    const recommendations = getHealthRecommendations(healthResult.breakdown)

    // Get level info
    const levelInfo = getLevelInfo(fork.level)
    const nextLevel = getPointsToNextLevel(fork.points)

    return NextResponse.json({
      fork: {
        ...fork,
        healthScore: healthResult.score,
        healthStatus: healthResult.status,
        healthBreakdown: healthResult.breakdown,
      },
      level: {
        current: fork.level,
        ...levelInfo,
        pointsToNextLevel: nextLevel.pointsNeeded,
        nextLevel: nextLevel.next,
      },
      events,
      members,
      reports,
      recommendations,
    })
  } catch (error) {
    console.error("[API /forks/[id]] Error:", error)

    if (error instanceof NotionConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }

    if (error instanceof NotionDatabaseError) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: "Failed to fetch fork details. Please try again later." },
      { status: 500 }
    )
  }
}
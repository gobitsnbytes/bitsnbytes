import { getFork, updateForkPoints, type ForkLevel } from "./notion"

// ─────────────────────────────────────────────────────────────────────────────
// Points Constants
// ─────────────────────────────────────────────────────────────────────────────

export const POINTS = {
  // Events
  EVENT_CREATED: 10,
  EVENT_APPROVED: 20,
  EVENT_COMPLETED: 50,
  PER_SPONSOR_SECURED: 10,

  // Engagement
  REPORT_SUBMITTED: 15,
  WEEKLY_PULSE_UPDATE: 10,
  ON_TIME_REPORT_BONUS: 10,

  // Penalties
  MISSED_REPORT_DEADLINE: -15,
  INACTIVE_TWO_WEEKS: -25,

  // Onboarding
  ONBOARDING_STEP_COMPLETE: 5,
  ONBOARDING_COMPLETE_BONUS: 15,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Level Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const LEVELS: Record<ForkLevel, { min: number; max: number; badge: string; color: string }> = {
  "Seed Fork": { min: 0, max: 99, badge: "🌱", color: "#81ECEC" },
  "Active Fork": { min: 100, max: 299, badge: "🌿", color: "#00FF95" },
  "High Impact Fork": { min: 300, max: 699, badge: "🌳", color: "#00F2FF" },
  "Elite Fork": { min: 700, max: Infinity, badge: "🏆", color: "#FFD700" },
}

// ─────────────────────────────────────────────────────────────────────────────
// Level Functions
// ─────────────────────────────────────────────────────────────────────────────

export function getLevelFromPoints(points: number): ForkLevel {
  if (points >= 700) return "Elite Fork"
  if (points >= 300) return "High Impact Fork"
  if (points >= 100) return "Active Fork"
  return "Seed Fork"
}

export function getLevelInfo(level: ForkLevel) {
  return LEVELS[level] || LEVELS["Seed Fork"]
}

export function getPointsToNextLevel(points: number): { current: ForkLevel; next: ForkLevel | null; pointsNeeded: number } {
  const current = getLevelFromPoints(points)
  const levelOrder: ForkLevel[] = ["Seed Fork", "Active Fork", "High Impact Fork", "Elite Fork"]
  const currentIndex = levelOrder.indexOf(current)
  const next = currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null
  
  let pointsNeeded = 0
  if (next) {
    const nextLevelInfo = LEVELS[next]
    pointsNeeded = nextLevelInfo.min - points
  }
  
  return { current, next, pointsNeeded }
}

// ─────────────────────────────────────────────────────────────────────────────
// Points Management
// ─────────────────────────────────────────────────────────────────────────────

export async function addPoints(
  forkId: string,
  points: number,
  reason: string
): Promise<{ success: boolean; newTotal: number; newLevel: ForkLevel; message: string }> {
  try {
    const fork = await getFork(forkId)
    if (!fork) {
      return {
        success: false,
        newTotal: 0,
        newLevel: "Seed Fork",
        message: `Fork not found: ${forkId}`,
      }
    }

    const currentPoints = fork.points || 0
    const newTotal = Math.max(0, currentPoints + points) // Don't go below 0
    const newLevel = getLevelFromPoints(newTotal)
    
    await updateForkPoints(forkId, newTotal)

    const pointsText = points > 0 ? `+${points}` : `${points}`
    const message = `${pointsText} points for ${reason}. Total: ${newTotal} (${newLevel})`
    
    console.log(`[Gamification] Fork ${fork.name}: ${message}`)

    return {
      success: true,
      newTotal,
      newLevel,
      message,
    }
  } catch (error) {
    console.error("[Gamification] Failed to add points:", error)
    return {
      success: false,
      newTotal: 0,
      newLevel: "Seed Fork",
      message: `Failed to update points: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard
// ─────────────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number
  forkId: string
  forkName: string
  city: string
  points: number
  level: ForkLevel
  badge: string
}

export async function getLeaderboard(forks: { id: string; name: string; city: string; points: number; level: ForkLevel }[]): Promise<LeaderboardEntry[]> {
  return forks
    .sort((a, b) => b.points - a.points)
    .map((fork, index) => ({
      rank: index + 1,
      forkId: fork.id,
      forkName: fork.name,
      city: fork.city,
      points: fork.points,
      level: fork.level,
      badge: LEVELS[fork.level].badge,
    }))
}
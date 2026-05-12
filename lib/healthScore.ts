import type { Fork } from "./notion"

// ─────────────────────────────────────────────────────────────────────────────
// Health Score Types
// ─────────────────────────────────────────────────────────────────────────────

export interface HealthScoreBreakdown {
  pulseRecency: number
  eventsConducted: number
  teamCompleteness: number
  reportSubmission: number
  partnerships: number
}

export interface HealthScoreResult {
  score: number
  breakdown: HealthScoreBreakdown
  status: HealthStatus
}

export type HealthStatus = "Excellent" | "Good" | "Fair" | "At Risk"

// ─────────────────────────────────────────────────────────────────────────────
// Health Status Helper
// ─────────────────────────────────────────────────────────────────────────────

export function getHealthStatus(score: number): { status: HealthStatus; color: string; description: string } {
  if (score >= 80) {
    return {
      status: "Excellent",
      color: "#22c55e", // green
      description: "This fork is thriving with strong engagement and activity.",
    }
  }
  if (score >= 60) {
    return {
      status: "Good",
      color: "#eab308", // yellow
      description: "This fork is healthy but has room for improvement.",
    }
  }
  if (score >= 40) {
    return {
      status: "Fair",
      color: "#f97316", // orange
      description: "This fork needs attention in several areas.",
    }
  }
  return {
    status: "At Risk",
    color: "#ef4444", // red
    description: "This fork requires immediate intervention to remain active.",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual Score Calculators (each out of 20 points)
// ─────────────────────────────────────────────────────────────────────────────

function calculatePulseScore(fork: Fork): number {
  if (!fork.lastPulse) return 0

  const now = new Date()
  const lastPulse = new Date(fork.lastPulse)
  const daysSincePulse = Math.floor((now.getTime() - lastPulse.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSincePulse <= 7) return 20 // Within last week
  if (daysSincePulse <= 14) return 15 // Within 2 weeks
  if (daysSincePulse <= 21) return 10 // Within 3 weeks
  if (daysSincePulse <= 30) return 5 // Within a month
  return 0 // Over a month
}

function calculateEventsScore(fork: Fork): number {
  const eventsCount = fork.eventsCount || 0

  if (eventsCount >= 5) return 20 // 5+ events
  if (eventsCount >= 4) return 18
  if (eventsCount >= 3) return 15
  if (eventsCount >= 2) return 12
  if (eventsCount >= 1) return 8
  return 0 // No events
}

function calculateTeamScore(fork: Fork): number {
  const teamSize = fork.teamSize || 0

  if (teamSize >= 5) return 20 // Full team
  if (teamSize >= 4) return 16
  if (teamSize >= 3) return 12
  if (teamSize >= 2) return 8
  if (teamSize >= 1) return 4
  return 0 // Solo or no team
}

function calculateReportScore(_fork: Fork): number {
  // This would need report data from Notion
  // For now, we'll base it on a hypothetical reportsSubmitted field
  // In practice, you'd fetch recent reports and calculate based on submission rate
  return 10 // Default middle score
}

function calculatePartnershipScore(_fork: Fork): number {
  // This would need partnership/sponsor data
  // For now, return a base score
  // In practice, check for sponsors, partners, etc.
  return 10 // Default middle score
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Health Score Calculator
// ─────────────────────────────────────────────────────────────────────────────

export function calculateHealthScore(fork: Fork): HealthScoreResult {
  const breakdown: HealthScoreBreakdown = {
    pulseRecency: calculatePulseScore(fork),
    eventsConducted: calculateEventsScore(fork),
    teamCompleteness: calculateTeamScore(fork),
    reportSubmission: calculateReportScore(fork),
    partnerships: calculatePartnershipScore(fork),
  }

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0)
  const status = getHealthStatus(score).status

  return { score, breakdown, status }
}

// ─────────────────────────────────────────────────────────────────────────────
// Health Score Recommendations
// ─────────────────────────────────────────────────────────────────────────────

export function getHealthRecommendations(breakdown: HealthScoreBreakdown): string[] {
  const recommendations: string[] = []

  if (breakdown.pulseRecency < 15) {
    recommendations.push("Submit a weekly pulse update to improve engagement tracking.")
  }

  if (breakdown.eventsConducted < 15) {
    recommendations.push("Plan and conduct more events to increase fork visibility.")
  }

  if (breakdown.teamCompleteness < 15) {
    recommendations.push("Recruit more team members to strengthen your fork's capacity.")
  }

  if (breakdown.reportSubmission < 15) {
    recommendations.push("Submit regular reports to maintain transparency and earn points.")
  }

  if (breakdown.partnerships < 15) {
    recommendations.push("Seek partnerships with local organizations and sponsors.")
  }

  return recommendations
}

// ─────────────────────────────────────────────────────────────────────────────
// Network Health Overview
// ─────────────────────────────────────────────────────────────────────────────

export interface NetworkHealthOverview {
  totalForks: number
  activeForks: number
  averageScore: number
  excellentCount: number
  goodCount: number
  fairCount: number
  atRiskCount: number
}

export function calculateNetworkHealth(forks: Fork[]): NetworkHealthOverview {
  const scores = forks.map((f) => calculateHealthScore(f))
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length)
    : 0

  const statusCounts = {
    excellent: scores.filter((s) => s.score >= 80).length,
    good: scores.filter((s) => s.score >= 60 && s.score < 80).length,
    fair: scores.filter((s) => s.score >= 40 && s.score < 60).length,
    atRisk: scores.filter((s) => s.score < 40).length,
  }

  return {
    totalForks: forks.length,
    activeForks: forks.filter((f) => f.status === "Active").length,
    averageScore,
    excellentCount: statusCounts.excellent,
    goodCount: statusCounts.good,
    fairCount: statusCounts.fair,
    atRiskCount: statusCounts.atRisk,
  }
}
import { POINTS } from "./gamification"

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding Steps Configuration
// ─────────────────────────────────────────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { id: "discord", label: "Join Discord Server", points: POINTS.ONBOARDING_STEP_COMPLETE, description: "Join the Bits&Bytes Discord community" },
  { id: "intro", label: "Post Introduction", points: POINTS.ONBOARDING_STEP_COMPLETE, description: "Introduce yourself in the #introductions channel" },
  { id: "role", label: "Select Role", points: POINTS.ONBOARDING_STEP_COMPLETE, description: "Choose your role (Tech, Design, Outreach, etc.)" },
  { id: "handbook", label: "Read Fork Handbook", points: POINTS.ONBOARDING_STEP_COMPLETE * 2, description: "Review the fork operations handbook" },
  { id: "first_event", label: "Attend First Event", points: POINTS.ONBOARDING_STEP_COMPLETE * 3, description: "Participate in your first fork event" },
] as const

export type OnboardingStepId = typeof ONBOARDING_STEPS[number]["id"]

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding Progress Types
// ─────────────────────────────────────────────────────────────────────────────

export interface OnboardingProgress {
  memberId: string
  completedSteps: OnboardingStepId[]
  totalSteps: number
  completedCount: number
  percentage: number
  isComplete: boolean
  totalPointsEarned: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

export function calculateOnboardingProgress(
  memberId: string,
  completedSteps: OnboardingStepId[]
): OnboardingProgress {
  const totalSteps = ONBOARDING_STEPS.length
  const completedCount = completedSteps.length
  const percentage = Math.round((completedCount / totalSteps) * 100)
  const isComplete = completedCount === totalSteps

  const totalPointsEarned = ONBOARDING_STEPS
    .filter((step) => completedSteps.includes(step.id))
    .reduce((sum, step) => sum + step.points, 0)

  return {
    memberId,
    completedSteps,
    totalSteps,
    completedCount,
    percentage,
    isComplete,
    totalPointsEarned,
  }
}

export function getNextStep(completedSteps: OnboardingStepId[]): typeof ONBOARDING_STEPS[number] | null {
  const nextStep = ONBOARDING_STEPS.find((step) => !completedSteps.includes(step.id))
  return nextStep || null
}

export function getStepById(stepId: OnboardingStepId): typeof ONBOARDING_STEPS[number] | undefined {
  return ONBOARDING_STEPS.find((step) => step.id === stepId)
}

export function getPointsForStep(stepId: OnboardingStepId): number {
  const step = getStepById(stepId)
  return step?.points || POINTS.ONBOARDING_STEP_COMPLETE
}

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding Checklist Component Data
// ─────────────────────────────────────────────────────────────────────────────

export function getOnboardingChecklist(completedSteps: OnboardingStepId[]) {
  return ONBOARDING_STEPS.map((step) => ({
    ...step,
    isCompleted: completedSteps.includes(step.id),
  }))
}
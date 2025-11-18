'use client'

import { Suspense, lazy, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import LumaSpin from '@/components/ui/luma-spin'
import { LiquidGlassBackdrop } from '@/components/ui/liquid-glass-effect'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface InteractiveRobotSplineProps {
  scene: string
  className?: string
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={cn('flex h-full w-full items-center justify-center bg-background', className)}>
          <LumaSpin />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}

interface InteractiveRobotSectionProps {
  children?: ReactNode
  className?: string
}

export function InteractiveRobotSection({ children, className }: InteractiveRobotSectionProps) {
  const ROBOT_SCENE_URL = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode'

  return (
    <div className={cn('relative h-screen w-screen overflow-hidden', className)}>
      <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="absolute inset-0 z-0" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/70 via-transparent to-white/10 dark:from-black/60 dark:via-transparent dark:to-black/80" />
      {children && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 text-white">
          <div className="w-full max-w-3xl text-center drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
            <div className="relative isolate rounded-[40px] border border-white/30 bg-white/20 p-8 text-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
              <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />
              <div className="relative z-10 space-y-4">{children}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


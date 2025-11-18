'use client'

import { Suspense, lazy, type ReactNode } from 'react'

import { cn } from '@/lib/utils'
import LumaSpin from '@/components/ui/luma-spin'

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
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      {children && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 text-white">
          <div className="w-full max-w-2xl text-center drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]">{children}</div>
        </div>
      )}
    </div>
  )
}


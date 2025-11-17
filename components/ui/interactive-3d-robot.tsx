'use client';

import { Suspense, lazy } from 'react';
import LumaSpin from '@/components/ui/luma-spin';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({
  scene,
  className,
}: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`w-full h-full flex items-center justify-center bg-background ${className}`}
        >
          <LumaSpin />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

export function InteractiveRobotSection() {
  const ROBOT_SCENE_URL =
    'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0"
      />

      <div
        className="
        absolute inset-0 z-10
        pt-20 md:pt-32 lg:pt-40
        px-4 md:px-8
        pointer-events-none
      "
      >
        <div
          className="
          text-center
          text-white
          drop-shadow-lg
          w-full max-w-2xl
          mx-auto
        "
        >
          <h1
            className="
            text-2xl md:text-3xl lg:text-4xl xl:text-5xl
            font-bold
          "
          >
            This is interactive 3d robot Whobee
          </h1>
        </div>
      </div>
    </div>
  );
}



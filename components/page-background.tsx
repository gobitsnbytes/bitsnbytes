"use client";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

type PageBackgroundProps = {
  className?: string;
};

export function PageBackground({ className }: PageBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background transition-colors duration-300", className)}
    >
      {/* Animated Neobrutalist coordinate grid */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.05}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "stroke-foreground/10 fill-foreground/10"
        )}
      />

      {/* Subtle fallback coordinates grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.015] dark:opacity-[0.03]" />
      
      {/* Stipple noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-noise-texture" />
    </div>
  );
}

export default PageBackground;

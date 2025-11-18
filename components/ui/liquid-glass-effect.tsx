import { cn } from "@/lib/utils"

export function LiquidGlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="60"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="3" result="soft" />
          <feComposite in="soft" in2="soft" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

type LiquidGlassBackdropProps = {
  radiusClassName?: string
  className?: string
  blurClassName?: string
}

export function LiquidGlassBackdrop({
  radiusClassName = "rounded-full",
  className,
  blurClassName,
}: LiquidGlassBackdropProps) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 shadow-[0_0_20px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.6),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all dark:shadow-[0_0_18px_rgba(0,0,0,0.45),inset_1px_1px_2px_rgba(255,255,255,0.15),inset_-1px_-1px_2px_rgba(0,0,0,0.55)]",
          radiusClassName,
          className,
        )}
      />
      <div
        className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", radiusClassName, blurClassName)}
        style={{ backdropFilter: 'url("#liquid-glass-filter")' }}
      />
      <LiquidGlassFilter />
    </>
  )
}


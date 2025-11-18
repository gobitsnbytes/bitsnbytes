"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const liquidButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "bg-transparent text-primary hover:scale-[1.03]",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xl",
    },
  },
)

type LiquidButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof liquidButtonVariants> & {
    asChild?: boolean
  }

export function LiquidButton({ className, variant, size, asChild = false, children, ...props }: LiquidButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp data-slot="button" className={cn("relative", liquidButtonVariants({ variant, size, className }))} {...props}>
      <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.6),inset_-1px_-1px_2px_rgba(0,0,0,0.3)] transition-all dark:shadow-[0_0_18px_rgba(0,0,0,0.45),inset_1px_1px_2px_rgba(255,255,255,0.15),inset_-1px_-1px_2px_rgba(0,0,0,0.55)]" />
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-full" style={{ backdropFilter: 'url("#liquid-glass-filter")' }} />
      <span className="pointer-events-none z-10">{children}</span>
      <GlassFilter />
    </Comp>
  )
}

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="liquid-glass-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="60" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="soft" />
          <feComposite in="soft" in2="soft" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze"

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string
    inner: string
    button: string
    textColor: string
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[#fefefe] via-[#3E3E3E] to-[#f5f5f5]",
    button: "bg-gradient-to-b from-[#cbcbcb] to-[#8b8b8b]",
    textColor: "text-white",
  },
  primary: {
    outer: "bg-gradient-to-b from-[#000] to-[#A0A0A0]",
    inner: "bg-gradient-to-b from-[var(--brand-coral)] via-[var(--brand-purple)] to-[#120524]",
    button: "bg-gradient-to-b from-[var(--brand-pink)] to-[var(--brand-purple)]",
    textColor: "text-white",
  },
  success: {
    outer: "bg-gradient-to-b from-[#004b35] to-[#8ed0ae]",
    inner: "bg-gradient-to-b from-[#e1f5ec] via-[#043b32] to-[#cde8de]",
    button: "bg-gradient-to-b from-[#b6f0d5] to-[#3b7b63]",
    textColor: "text-[#fefdf7]",
  },
  error: {
    outer: "bg-gradient-to-b from-[#5a0000] to-[#ffaeb0]",
    inner: "bg-gradient-to-b from-[#ffe3e3] via-[#610002] to-[#ffdada]",
    button: "bg-gradient-to-b from-[#f59b9b] to-[#8f3c3d]",
    textColor: "text-white",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#7a5a00] to-[#f7df9c]",
    inner: "bg-gradient-to-b from-[#fff9d1] via-[#745508] to-[#ffe59c]",
    button: "bg-gradient-to-b from-[#ffe9a0] to-[#9b873f]",
    textColor: "text-[#fff9d6]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#7a3d0f] to-[#ebbb91]",
    inner: "bg-gradient-to-b from-[#edc5a1] via-[#5f2d01] to-[#ffdec1]",
    button: "bg-gradient-to-b from-[#ffd8b6] to-[#8f5c30]",
    textColor: "text-[#fff6ec]",
  },
}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(function MetalButton(
  { children, className, variant = "default", ...props },
  ref,
) {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const colors = colorVariants[variant]

  return (
    <div
      className={cn("relative inline-flex rounded-lg p-[1.5px] transition-transform", colors.outer)}
      style={{
        transform: isPressed ? "translateY(2px) scale(0.99)" : "translateY(0) scale(1)",
        boxShadow: isPressed
          ? "0 2px 6px rgba(0,0,0,0.2)"
          : isHovered && !isTouchDevice
            ? "0 10px 30px rgba(0,0,0,0.25)"
            : "0 6px 18px rgba(0,0,0,0.18)",
      }}
    >
      <div
        className={cn("absolute inset-[1px] rounded-md transition-[filter]", colors.inner)}
        style={{ filter: isHovered && !isPressed && !isTouchDevice ? "brightness(1.05)" : "none" }}
      />
      <button
        ref={ref}
        className={cn(
          "relative z-10 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold uppercase tracking-wide transition-transform",
          colors.button,
          colors.textColor,
          className,
        )}
        style={{ transform: isPressed ? "scale(0.97)" : "scale(1)" }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsPressed(false)
          setIsHovered(false)
        }}
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        {...props}
      >
        {children}
      </button>
    </div>
  )
})

export { liquidButtonVariants }


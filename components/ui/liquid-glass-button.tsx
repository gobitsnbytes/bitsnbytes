"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { LiquidGlassBackdrop, LiquidGlassFilter } from "@/components/ui/liquid-glass-effect"

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
    <Comp data-slot="button" className={cn("relative isolate", liquidButtonVariants({ variant, size, className }))} {...props}>
      <LiquidGlassBackdrop radiusClassName="rounded-full" />
      <span className="pointer-events-none z-10">{children}</span>
      <LiquidGlassFilter />
    </Comp>
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
    outer: "bg-[#505050]",
    inner: "bg-[#7E7E7E]",
    button: "bg-[#ABABAB]",
    textColor: "text-white",
  },
  primary: {
    outer: "bg-[#1a0b2c]",
    inner: "bg-[var(--brand-purple)]",
    button: "bg-[var(--brand-pink)]",
    textColor: "text-white",
  },
  success: {
    outer: "bg-[#1b4d3e]",
    inner: "bg-[#3b7b63]",
    button: "bg-[#4a9b7f]",
    textColor: "text-white",
  },
  error: {
    outer: "bg-[#5a0000]",
    inner: "bg-[#8f3c3d]",
    button: "bg-[#c45152]",
    textColor: "text-white",
  },
  gold: {
    outer: "bg-[#7a5a00]",
    inner: "bg-[#9b873f]",
    button: "bg-[#c8a850]",
    textColor: "text-[#fff9d6]",
  },
  bronze: {
    outer: "bg-[#7a3d0f]",
    inner: "bg-[#8f5c30]",
    button: "bg-[#b07543]",
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


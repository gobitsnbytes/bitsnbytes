import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageSectionProps = {
  children: ReactNode
  className?: string
  eyebrow?: string
  title?: string | ReactNode
  description?: string | ReactNode
  align?: "left" | "center"
  as?: "section" | "div"
  bleed?: boolean
}

export function PageSection({
  children,
  className,
  eyebrow,
  title,
  description,
  align = "left",
  as: Component = "section",
  bleed = false,
}: PageSectionProps) {
  const headingAlignment = align === "center" ? "items-center text-center" : "text-left"

  return (
    <Component className={cn("section-shell", bleed && "max-w-none px-0 sm:px-6", className)}>
      {(eyebrow || title || description) && (
        <div className={cn("mb-10 flex flex-col gap-3", headingAlignment)}>
          {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
          {title && (
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </Component>
  )
}

export default PageSection


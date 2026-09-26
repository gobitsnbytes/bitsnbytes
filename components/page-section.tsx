import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center";
  as?: "section" | "div";
  bleed?: boolean;
};

/**
 * Legacy section wrapper, restyled as an edition chapter head: mono "§ — EYEBROW" in the signal
 * colour, Anton title, serif description, 3px rule. Server-safe (no motion) and still registers
 * with the chapter index via data-cinematic-section.
 */
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
  const center = align === "center";

  return (
    <Component
      data-cinematic-section
      data-cinematic-title={typeof title === "string" ? title : eyebrow}
      className={cn(
        "section-shell overflow-x-clip px-4 py-10 sm:px-6 md:py-16 lg:px-8",
        bleed && "max-w-none px-0 sm:px-6",
        className,
      )}
    >
      {(eyebrow || title || description) && (
        <header
          className={cn(
            "mb-8 flex flex-col gap-3 border-b-3 border-line pb-4 md:mb-10",
            center ? "items-center text-center" : "text-left",
          )}
        >
          {eyebrow && (
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">§ — {eyebrow}</p>
          )}
          {title && (
            <h2 className="font-display text-[clamp(40px,7vw,112px)] uppercase leading-[0.86] tracking-[0.005em] text-fg">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-[60ch] font-serif text-base leading-relaxed text-fg/80 md:text-lg">{description}</p>
          )}
        </header>
      )}
      {children}
    </Component>
  );
}

export default PageSection;

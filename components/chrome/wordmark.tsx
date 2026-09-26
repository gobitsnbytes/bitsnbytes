import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Mega-display type role (DESIGN.md): Archivo 900 on the wdth axis. Archivo is named explicitly
 * because font-sans prefers a locally installed Helvetica, which has no width axis.
 */
export const WIDE = "font-[family-name:var(--font-archivo)] font-black [font-stretch:125%] tracking-[-0.04em]";

export type WordmarkProps = ComponentProps<"span"> & { scriptClassName?: string };

/** bits&bytes™: lowercase wide "bits" + script "&bytes" dropping onto the baseline + small ™. Size via font-size. */
export function Wordmark({ className, scriptClassName, ...props }: WordmarkProps) {
  return (
    <span className={cn(WIDE, "inline-flex items-baseline whitespace-nowrap leading-none", className)} {...props}>
      bits
      <span
        className={cn(
          "-ml-[0.03em] inline-block translate-y-[0.1em] font-script text-[0.92em] font-normal tracking-normal [font-stretch:100%]",
          scriptClassName,
        )}
      >
        &amp;bytes
      </span>
      <span className="ml-[0.04em] self-start text-[0.2em] font-bold tracking-normal">™</span>
    </span>
  );
}

/** The cube mark in currentColor (CSS mask of public/logo.svg). Decorative: label the parent link. */
export function CubeMark({ className }: { className?: string }) {
  return <span aria-hidden className={cn("bnb-cube", className)} />;
}

/** Brand four-point star (loader glyph). */
export const STAR_PATH = "M50 0C53 31 69 47 100 50C69 53 53 69 50 100C47 69 31 53 0 50C31 47 47 31 50 0Z";

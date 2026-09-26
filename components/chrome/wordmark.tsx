import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Mega-display type role (DESIGN.md): Archivo 900 on the wdth axis. Archivo is named explicitly
 * because font-sans prefers a locally installed Helvetica, which has no width axis.
 */
export const WIDE = "font-[family-name:var(--font-archivo)] font-black [font-stretch:125%] tracking-[-0.04em]";

export type WordmarkProps = ComponentProps<"span"> & {
  scriptClassName?: string;
  /** Split "bits" into per-letter [data-wm-char] inline-blocks for animation. Hide split copies from AT (aria-hidden). */
  split?: boolean;
};

/**
 * bits&bytes™ lockup (buttermax's "Butter" + script "max") and the one source of truth for its geometry,
 * used by the hero, nav, footer and intro: wide "bits", script "&bytes" at .86em tucked .12em into the "s"
 * and dropped .16em below the baseline, ™ at .13em on the cap line. Live DOM text, no SVG: paints without JS.
 * Size it with font-size (the lockup is ~4.1em wide).
 *
 * Where the script overlaps the "s" it is trapped with a knockout stroke in --wm-knockout: set that to the
 * surface colour behind the mark (unset = no knockout).
 * Hooks: [data-wm-layer], [data-wm-char] (split only), [data-wm-script], [data-wm-tm].
 */
export function Wordmark({ className, scriptClassName, split = false, ...props }: WordmarkProps) {
  return (
    <span data-wm-layer="" className={cn("block whitespace-nowrap leading-[0.8]", className)} {...props}>
      <span className={cn(WIDE, "inline-block")}>
        {split
          ? ["b", "i", "t", "s"].map((ch, i) => (
              <span key={i} data-wm-char="" className="inline-block">
                {ch}
              </span>
            ))
          : "bits"}
      </span>
      <span
        data-wm-script=""
        className={cn(
          "relative top-[0.16em] -ml-[0.12em] inline-block font-script text-[0.86em] font-normal leading-none tracking-normal [font-stretch:100%]",
          "[paint-order:stroke_fill] [-webkit-text-stroke:0.05em_var(--wm-knockout,transparent)]",
          scriptClassName,
        )}
      >
        &amp;bytes
      </span>
      {/* Floor keeps the ™ legible at nav size. */}
      <span
        data-wm-tm=""
        className="ml-[0.1em] inline-block align-top font-[family-name:var(--font-archivo)] text-[max(0.13em,5px)] font-black"
      >
        ™
      </span>
    </span>
  );
}

/** The cube mark in currentColor (CSS mask of public/logo.svg). Decorative: label the parent link. */
export function CubeMark({ className }: { className?: string }) {
  return <span aria-hidden className={cn("bnb-cube", className)} />;
}

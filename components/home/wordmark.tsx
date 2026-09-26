import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/*
 * Wordmark — buttermax.net's "Butter" + script "max" lockup, rebuilt as live DOM text in our type:
 * "bits" in Archivo 900 at font-stretch 125% (wdth axis) with -0.04em tracking, "&bytes" in the script face
 * dropping below the baseline and tucking into the "s", and a small ™. No SVG, no canvas, no opacity at SSR:
 * this is the homepage LCP and paints without JS.
 *
 * Size it with font-size on this element or a parent (the lockup is ~4.1em wide). Always aria-hidden: the caller
 * supplies the accessible name. `plate` renders a flat colour copy for riso misregistration layers (no knockout).
 * Where the script overlaps the sans it is trapped with a knockout stroke in --wm-knockout (default orange, the
 * hero surface); set that variable when placing the wordmark on another surface.
 *
 * Hooks for animation: [data-wm-layer] (each copy), [data-wm-char] (the four sans letters),
 * [data-wm-script], [data-wm-tm].
 */

const SANS = "[font-family:var(--font-archivo),Arial,sans-serif] font-black";

export type WordmarkProps = ComponentProps<"span"> & { plate?: boolean };

export function Wordmark({ plate = false, className, ...props }: WordmarkProps) {
  return (
    <span
      aria-hidden
      data-wm-layer=""
      className={cn("block whitespace-nowrap leading-[0.8]", className)}
      {...props}
    >
      <span className={cn(SANS, "inline-block tracking-[-0.04em] [font-stretch:125%]")}>
        {["b", "i", "t", "s"].map((ch, i) => (
          <span key={i} data-wm-char="" className="inline-block">
            {ch}
          </span>
        ))}
      </span>
      <span
        data-wm-script=""
        className={cn(
          "relative top-[0.16em] -ml-[0.12em] inline-block font-script text-[0.86em] leading-none",
          !plate && "[paint-order:stroke_fill] [-webkit-text-stroke:0.05em_var(--wm-knockout,var(--orange))]",
        )}
      >
        {"&bytes"}
      </span>
      <span data-wm-tm="" className={cn(SANS, "ml-[0.1em] inline-block align-top text-[0.13em]")}>
        ™
      </span>
    </span>
  );
}

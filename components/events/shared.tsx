import type { ReactNode } from "react";
import { WIDE } from "@/components/chrome/wordmark";
import { pad } from "@/components/edition/shared";
import { cn } from "@/lib/utils";

/** inkfish section header row: label left, [S.0N] right, 12px mono. */
export function SectionHead({ label, section, className }: { label: ReactNode; section: number; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 font-mono text-xs font-bold uppercase tracking-[0.08em]",
        className,
      )}
    >
      {label}
      <span className="text-signal">[S.{pad(section)}]</span>
    </div>
  );
}

/** Giant display word with an inkfish superscript bracket count (computed by the caller). */
export function GiantCount({ children, count, className }: { children: ReactNode; count: number; className?: string }) {
  return (
    <h2 className={cn(WIDE, "text-[clamp(44px,11.2vw,160px)] uppercase leading-[0.85]", className)}>
      {children}
      <sup className="ml-[0.12em] inline-block align-top font-mono text-[0.25em] font-bold leading-none tracking-normal">
        <span aria-hidden>[</span>
        {pad(count)}
        <span aria-hidden>]</span>
      </sup>
    </h2>
  );
}

/*
 * inkfish mixed-width grid: cards are 25 / 37.5 / 50% (2 / 3 / 4 of 8 columns) and every row closes
 * to 8. Rows are taken from inkfish's own sequence ([4,4] [3,2,3] [2,2,2,2]).
 */
const ROWS: Record<number, number[]> = {
  1: [8],
  2: [4, 4],
  3: [3, 2, 3],
  4: [2, 2, 2, 2],
  5: [3, 2, 3, 4, 4],
  6: [4, 4, 2, 2, 2, 2],
};
export const spansFor = (n: number, flip = false): number[] => {
  const spans = n <= 6 ? ROWS[n] : [...ROWS[6], ...spansFor(n - 6)];
  return flip ? [...spans].reverse() : spans;
};

// lg: the inkfish width; md: halves (25% is too narrow there); mobile: full width.
export const SPAN_CLASS: Record<number, string> = {
  2: "md:col-span-4 lg:col-span-2",
  3: "md:col-span-4 lg:col-span-3",
  4: "md:col-span-4",
  8: "md:col-span-8",
};

/** Row index of each card for an 8-column grid. */
export const rowsOf = (spans: number[]) => {
  let row = 0;
  let used = 0;
  return spans.map((span) => {
    if (used + span > 8) {
      row += 1;
      used = 0;
    }
    used += span;
    return row;
  });
};

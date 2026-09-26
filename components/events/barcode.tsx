"use client";

import type { FocusEvent, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * inkfish barcode stripe-wipe (tmp/research-full.json → inkfish "Barcode stripe-wipe row highlight").
 * Row = [label | 12 stripes | title]. The wipe state lives on the row element (data-wipe):
 * reset → in (fill enters from the left) → out (exits to the right). Text inverts through a
 * duplicated layer revealed by clip-path, so brand colours stay exact (no blend modes).
 * Keyboard focus mirrors hover. Reduced motion / motion toggle off: instant fill.
 */

// Stripe widths are 1/i of the column, so they shrink left → right.
export const STRIPES = [3, 4, 5, 6, 7, 8, 10, 14, 16, 18, 20, 30];

const ANIM =
  "transition-[scale,clip-path] ease-[cubic-bezier(.25,1,.5,1)] group-data-[wipe=reset]/row:transition-none motion-reduce:transition-none motion-off:transition-none";
export const WIPE_BAR = cn(
  "pointer-events-none absolute inset-0 origin-left scale-x-0 bg-fg",
  "group-data-[wipe=in]/row:scale-x-100 group-data-[wipe=out]/row:origin-right",
  ANIM,
);
const INVERT = cn(
  "pointer-events-none absolute inset-0 text-surface [clip-path:inset(0_100%_0_0)]",
  "group-data-[wipe=in]/row:[clip-path:inset(0)] group-data-[wipe=out]/row:[clip-path:inset(0_0_0_100%)]",
  ANIM,
);

const wipeIn = (row: HTMLElement) => {
  if (row.dataset.wipe === "in") return;
  row.dataset.wipe = "reset";
  void row.offsetWidth; // commit the reset before transitioning in
  row.dataset.wipe = "in";
};
const wipeOut = (row: HTMLElement) => {
  if (row.dataset.wipe === "in") row.dataset.wipe = "out";
};

/** Spread on the row element (it must also carry `group/row`). */
export const wipe = {
  onPointerEnter: (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") wipeIn(event.currentTarget);
  },
  onPointerLeave: (event: PointerEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(document.activeElement)) wipeOut(event.currentTarget);
  },
  onFocus: (event: FocusEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).matches(":focus-visible")) wipeIn(event.currentTarget);
  },
  onBlur: (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.matches(":hover")) wipeOut(event.currentTarget);
  },
};

/** A cell whose fill bar + inverted copy sweep in on row hover. `pad` goes on both copies; ms timings. */
export function WipeCell({
  children,
  className,
  pad,
  delay,
  duration,
}: {
  children: ReactNode;
  className?: string;
  pad: string;
  delay: number;
  duration: number;
}) {
  const timing = { transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` };
  return (
    <span className={cn("relative block", className)}>
      <span aria-hidden className={WIPE_BAR} style={timing} />
      <span className={cn("relative block", pad)}>{children}</span>
      <span aria-hidden className={cn(INVERT, pad)} style={timing}>
        {children}
      </span>
    </span>
  );
}

/**
 * The 12 stripes. `progress` adds an orange fill per stripe (data-stripe, driven with inline
 * scaleX by the caller) over a faint track, for the reel's now-playing row.
 */
export function Barcode({
  className,
  progress = false,
  step = 8,
  base = 100,
}: {
  className?: string;
  progress?: boolean;
  /** Stagger per stripe index (ms). */
  step?: number;
  base?: number;
}) {
  return (
    <span aria-hidden className={cn("flex items-stretch gap-[3px]", className)}>
      {STRIPES.map((i) => (
        <span key={i} className={cn("relative block", progress && "bg-fg/15")} style={{ width: `calc(100% / ${i})` }}>
          <span
            className={WIPE_BAR}
            style={{ transitionDelay: `${base + step * i}ms`, transitionDuration: "300ms" }}
          />
          {progress ? (
            <span
              data-stripe
              className="absolute inset-0 origin-left scale-x-0 bg-orange motion-reduce:scale-x-100 motion-off:scale-x-100"
            />
          ) : null}
        </span>
      ))}
    </span>
  );
}

/** "→" that grows in from the left after the row fill (inkfish arrow, scaleX instead of width). */
export function WipeArrow({ shown = false }: { shown?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block origin-left transition-transform delay-[400ms] duration-300 ease-[cubic-bezier(.25,1,.5,1)] motion-reduce:transition-none motion-off:transition-none",
        shown ? "scale-x-100" : "scale-x-0 group-data-[wipe=in]/row:scale-x-100",
      )}
    >
      →
    </span>
  );
}

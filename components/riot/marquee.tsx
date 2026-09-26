import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  ink: { band: "bg-ink text-paper", sep: "bg-orange" },
  burgundy: { band: "bg-burgundy text-paper", sep: "bg-orange" },
  orange: { band: "bg-orange text-ink", sep: "bg-ink" },
  acid: { band: "bg-acid text-ink", sep: "bg-burgundy" },
} as const;

const FONTS = {
  mono: "py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] md:text-sm",
  display: "py-4 font-display text-4xl uppercase leading-none md:text-6xl",
} as const;

export type MarqueeProps = {
  items: ReactNode[];
  tone?: keyof typeof TONES;
  /** Seconds per full loop (default 30). Lower is faster. */
  speed?: number;
  reverse?: boolean;
  font?: keyof typeof FONTS;
  className?: string;
};

/**
 * Ticker band. CSS transform-only loop over a duplicated track; pauses on hover, stops under
 * prefers-reduced-motion and the site motion toggle. Screen readers get the items once.
 */
export function Marquee({ items, tone = "ink", speed = 30, reverse = false, font = "mono", className }: MarqueeProps) {
  // ponytail: repeat to >= 12 entries per copy so short lists span wide screens; measure with ResizeObserver if gaps ever show.
  const run = Array.from({ length: Math.ceil(12 / Math.max(items.length, 1)) }, () => items).flat();
  const t = TONES[tone];

  return (
    <div
      className={cn("group overflow-hidden border-y-3 border-line", t.band, FONTS[font], className)}
      style={{ "--marquee-duration": `${speed}s` } as CSSProperties}
    >
      <ul className="sr-only">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div
        aria-hidden
        className={cn(
          "flex w-max animate-riot-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-off:animate-none",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((item, i) => (
              <span key={i} className="flex shrink-0 items-center gap-6 pr-6 whitespace-nowrap">
                {item}
                <span className={cn("size-2 shrink-0", t.sep)} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

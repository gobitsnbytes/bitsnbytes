import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StickyStackProps = {
  /** Pinned media (window collage, globe, poster…). */
  media: ReactNode;
  /** Copy blocks; each holds at the top while the next one slides over it. */
  items: ReactNode[];
  className?: string;
};

/**
 * Editions sticky copy stack beside a pinned media column (native position: sticky, no JS).
 * ≥1024px: cards stick at 110px (+14px per card so earlier edges peek) and the media column pins.
 * Below: media first, then the cards as a plain stack. Ancestors must not set transform or
 * overflow hidden/auto (use overflow-x: clip).
 */
export function StickyStack({ media, items, className }: StickyStackProps) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12", className)}>
      <div className="lg:order-last">
        <div className="lg:sticky lg:top-[110px] lg:h-[calc(100svh-150px)]">{media}</div>
      </div>
      <ol className="grid gap-6 lg:block">
        {items.map((item, index) => (
          <li
            key={index}
            className="lg:sticky lg:top-[calc(110px+var(--i)*14px)] lg:pb-[40svh] lg:last:pb-[20svh]"
            style={{ "--i": index } as CSSProperties}
          >
            <div className="border-3 border-line bg-surface p-6 shadow-[6px_6px_0_0_var(--shadow-color)] md:p-8">{item}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

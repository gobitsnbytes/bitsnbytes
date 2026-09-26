import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Clip paths lifted verbatim from design/neobrutalism-design-system.html.
const BURST =
  "polygon(50% 0,61% 12%,78% 6%,80% 24%,97% 27%,88% 43%,100% 55%,84% 63%,90% 82%,72% 80%,66% 98%,50% 87%,34% 98%,28% 80%,10% 82%,16% 63%,0 55%,12% 43%,3% 27%,20% 24%,22% 6%,39% 12%)";
const STAR = "polygon(50% 0,63% 38%,100% 38%,69% 59%,82% 100%,50% 75%,18% 100%,31% 59%,0 38%,37% 38%)";
const PLUS =
  "polygon(38% 0,62% 0,62% 38%,100% 38%,100% 62%,62% 62%,62% 100%,38% 100%,38% 62%,0 62%,0 38%,38% 38%)";
const FLOWER =
  "polygon(50% 0,60% 20%,80% 12%,74% 33%,96% 35%,80% 50%,96% 65%,74% 67%,80% 88%,60% 80%,50% 100%,40% 80%,20% 88%,26% 67%,4% 65%,20% 50%,4% 35%,26% 33%,20% 12%,40% 20%)";

const TAG_TONES = {
  cream: "bg-cream text-ink",
  burgundy: "bg-burgundy text-paper",
  orange: "bg-orange text-ink",
  cobalt: "bg-cobalt text-white",
  marker: "bg-marker text-ink",
  ink: "bg-ink text-paper",
} as const;

export type TagProps = ComponentProps<"span"> & { tone?: keyof typeof TAG_TONES };

/** Mono label chip with a 2px border and 3px hard shadow. */
export function Tag({ tone = "cream", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-line px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.14em] shadow-[3px_3px_0_0_var(--shadow-color)]",
        TAG_TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Inverted mono bar with a pulsing orange square (pulse stops under reduced motion / motion toggle). */
export function Eyebrow({ className, children, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 bg-fg py-1.5 pl-2.5 pr-3 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.34em] text-surface",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="size-2 shrink-0 animate-riot-pulse bg-orange motion-reduce:animate-none motion-off:animate-none" />
      {children}
    </span>
  );
}

const BURST_TONES = {
  marker: "bg-marker text-ink",
  burgundy: "bg-burgundy text-white",
  orange: "bg-orange text-ink",
  cobalt: "bg-cobalt text-white",
} as const;

export type BurstProps = ComponentProps<"span"> & { tone?: keyof typeof BURST_TONES };

/** Starburst sticker (one per view). Hidden from assistive tech unless it has text children. Size via className (default 96px). */
export function Burst({ tone = "marker", className, style, children, ...props }: BurstProps) {
  return (
    <span
      aria-hidden={children ? undefined : true}
      className={cn(
        "inline-grid size-24 shrink-0 place-items-center p-3 text-center font-display text-[15px] uppercase leading-[0.85]",
        BURST_TONES[tone],
        className,
      )}
      style={{ clipPath: BURST, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}

export type StickerProps = Omit<ComponentProps<"span">, "children">;

function sticker(clipPath: string, base: string, { className, style, ...props }: StickerProps) {
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0", base, className)}
      style={{ clipPath, ...style }}
      {...props}
    />
  );
}

/** Decorative five-point star (flips with the theme: ink on paper, paper on ink). */
export const Star = (props: StickerProps) => sticker(STAR, "size-10 bg-fg", props);
/** Decorative cobalt plus. */
export const Plus = (props: StickerProps) => sticker(PLUS, "size-[38px] bg-cobalt", props);
/** Decorative burgundy flower. */
export const Flower = (props: StickerProps) => sticker(FLOWER, "size-11 bg-burgundy", props);

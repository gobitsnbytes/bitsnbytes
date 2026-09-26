import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Chapter surface. paper follows the theme (paper / ink in dark); the others are fixed poster tones. */
export type Tone = "paper" | "ink" | "orange" | "cream";

const pad = (n: number | string) => (typeof n === "number" ? String(n).padStart(2, "0") : n);

export type ChapterProps = Omit<ComponentProps<"section">, "title" | "id"> & {
  id: string;
  /** Label for the sticky chapter index (data-cinematic-title). */
  title: string;
  /** Optional explicit chapter number, exposed as data-chapter-number="0N". */
  number?: number;
  tone?: Tone;
};

/**
 * Numbered edition chapter. Renders <section data-cinematic-section data-cinematic-title> so
 * ExperienceProvider picks it up for the chapter index, and data-surface={tone} so the nav and
 * index flip colour over it. The tone class re-scopes line/shadow/fg tokens, so riot primitives
 * inside an ink chapter flip automatically. Full-bleed: bring your own container.
 */
export function Chapter({ id, title, number, tone = "paper", className, children, ...props }: ChapterProps) {
  return (
    <section
      id={id}
      data-cinematic-section=""
      data-cinematic-title={title}
      data-chapter-number={number === undefined ? undefined : pad(number)}
      data-surface={tone}
      className={cn(`tone-${tone}`, "relative overflow-x-clip py-16 md:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}

export type ChapterHeadProps = Omit<ComponentProps<"header">, "title"> & {
  number: number | string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  /** split: title left, description right (kit default). center: stacked and centred. */
  align?: "split" | "center";
  as?: "h1" | "h2" | "h3";
};

/** Section head: "§0N — LABEL" in mono, Anton title, optional serif description, 3px rule below. */
export function ChapterHead({
  number,
  label,
  title,
  description,
  align = "split",
  as: Heading = "h2",
  className,
  ...props
}: ChapterHeadProps) {
  const center = align === "center";
  return (
    <header
      className={cn(
        "mb-9 flex flex-wrap gap-4 border-b-3 border-line pb-3.5",
        center ? "flex-col items-center text-center" : "items-end justify-between",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">
          §{pad(number)} — {label}
        </p>
        <Heading className="mt-1.5 font-display text-[clamp(40px,7vw,112px)] uppercase leading-[0.86] tracking-[0.005em]">
          {title}
        </Heading>
      </div>
      {description ? <p className="max-w-[42ch] font-serif text-base text-fg/80">{description}</p> : null}
    </header>
  );
}

// Deterministic jagged edge (generated once with a seeded LCG; no Math.random at render).
const TORN =
  "M0 0H1200V33L1172 33L1137 14L1109 22L1093 26L1076 36L1062 14L1039 12L1006 13L971 31L949 19L928 25L909 28L887 34L857 23L831 26L803 32L779 34L761 26L735 19L712 19L693 21L676 23L640 27L619 20L606 34L589 21L564 25L545 12L510 29L483 34L464 21L444 14L423 32L403 20L367 34L340 27L310 34L285 13L252 34L228 28L214 28L184 20L165 31L137 28L111 30L79 19L53 29L36 18L0 10Z";

const TONE_FILL: Record<Tone, string> = {
  paper: "var(--page)",
  ink: "var(--ink)",
  orange: "var(--orange)",
  cream: "var(--cream)",
};

export type TornEdgeProps = {
  /** Tone of the section above. */
  from: Tone;
  /** Tone of the section below. */
  to: Tone;
  /** false: the upper sheet's torn edge hangs down. true: the lower sheet's torn edge bites up. */
  flip?: boolean;
  className?: string;
};

/** Torn-paper SVG edge placed between two sections of different tones. Decorative. */
export function TornEdge({ from, to, flip = false, className }: TornEdgeProps) {
  return (
    <div
      aria-hidden
      className={cn("relative -my-px h-[clamp(14px,2.6vw,36px)]", className)}
      style={{ background: TONE_FILL[flip ? from : to] }}
    >
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className={cn("block size-full", flip && "rotate-180")}
        style={{ fill: TONE_FILL[flip ? to : from] }}
      >
        <path d={TORN} />
      </svg>
    </div>
  );
}

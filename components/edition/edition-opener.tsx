"use client";

import { useRef, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useOptionalExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { DuotoneImage, type DuotoneTone } from "./duotone-image";
import type { EditionChapter } from "./chapter-index";
import { fitTitle, whenReady } from "./shared";

gsap.registerPlugin(ScrollTrigger);

type Art = { src: string; alt: string };

type BaseProps = {
  /** The page h1, verbatim existing copy. Also becomes data-edition-title for the chapter index. */
  title: string;
  /** Small mono line above the title (structural label, e.g. "EDITION 2026 · §00"). */
  kicker?: string;
  /** Chapter list inside the frame. Pass it for SSR; otherwise the provider's discovered chapters are used. */
  chapters?: EditionChapter[];
  tone?: DuotoneTone;
  className?: string;
  /** Extra attributes for the h1 (data-speakable, id…). */
  h1Props?: ComponentProps<"h1">;
  /** Extra layers inside the sticky stage, painted above the art and below the construction lines, frame and
   *  content (e.g. /impact's film, components/impact/film.tsx). */
  children?: ReactNode;
};

/** Anything else (data-*, aria-*, id…) lands on the root <section>. */
type RootProps = Omit<ComponentProps<"section">, "title" | "children" | "className" | "ref">;

export type EditionOpenerProps = BaseProps &
  RootProps &
  (
    | {
        /** expand (default): ~150vh sticky scrub, the frame's clip-path opens to full-bleed art. */
        variant?: "expand";
        /** Chapter 01 photo, printed as a duotone. */
        art: Art;
      }
    | {
        /** static: framed title, lines draw in once, no pin (secondary routes). */
        variant: "static";
        /** Optional photo shown inside the frame. */
        art?: Art;
      }
  );

// Cube-derived construction drawing (viewBox units, R = 300: the logo hexagon's circumradius). Each entry is one
// draw group. Also drawn out of the film's end-card logo by components/home/film-player.tsx.
const S = 259.81; // R·cos30
export const GROUPS: string[][] = [
  // 1. circumscribed circle + outer ring (drawn as two arcs so pathLength works like the lines)
  ["M300 0A300 300 0 1 1 -300 0A300 300 0 1 1 300 0", "M460 0A460 460 0 1 1 -460 0A460 460 0 1 1 460 0"],
  // 2. 30° isometric diagonals + vertical axis
  ["M-900 519.6L900 -519.6", "M-900 -519.6L900 519.6", "M0 -600V600"],
  // 3. hexagon
  [`M0 -300L${S} -150L${S} 150L0 300L-${S} 150L-${S} -150Z`],
  // 4. cube edges (the Y)
  [`M0 0V300M0 0L-${S} -150M0 0L${S} -150`],
  // 5. nested rhombi (top face ×.66, ×.33; side faces ×.5)
  [
    "M0 -249L171.47 -150L0 -51L-171.47 -150Z",
    "M0 -199.5L85.74 -150L0 -100.5L-85.74 -150Z",
    "M-64.95 37.5L-194.86 -37.5L-194.86 112.5L-64.95 187.5Z",
    "M64.95 37.5L194.86 -37.5L194.86 112.5L64.95 187.5Z",
  ],
  // 6. 30° lattice through the top/bottom vertices + side verticals
  [
    "M-900 -819.6L900 219.6",
    "M-900 219.6L900 -819.6",
    "M-900 -219.6L900 819.6",
    "M-900 819.6L900 -219.6",
    `M${S} -600V600`,
    `M-${S} -600V600`,
  ],
];

// Hidden until drawn; fully drawn when motion is off (CSS, so it also holds before hydration).
const STROKE =
  "[stroke-dasharray:1] [stroke-dashoffset:1] motion-reduce:[stroke-dashoffset:0] motion-off:[stroke-dashoffset:0]";

function ConstructionLines() {
  return (
    <svg
      data-lines
      aria-hidden
      viewBox="-800 -500 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full fill-none stroke-cream"
      strokeWidth={1}
      strokeOpacity={0.45}
    >
      {GROUPS.map((group, g) => (
        <g key={g} data-group={g}>
          {group.map((d) => (
            <path key={d} d={d} pathLength={1} vectorEffect="non-scaling-stroke" className={STROKE} />
          ))}
        </g>
      ))}
    </svg>
  );
}

// Frame box: square-ish on desktop, portrait on phones. The art's clip-path is derived from the
// same variables, so --p (0 → 1) opens the window from the frame to full-bleed.
// Static stages are 88svh tall, so their frame also stays ≥84px clear of the fixed nav on short laptop screens.
const FRAME_VARS = {
  expand: "[--fw:min(560px,calc(100vw-32px))] [--fh:min(78svh,520px)] md:[--fh:min(72svh,560px)]",
  static:
    "[--fw:min(560px,calc(100vw-32px))] [--fh:min(78svh,520px,calc(88svh-168px))] md:[--fh:min(72svh,560px,calc(88svh-168px))]",
};
const ART_CLIP = {
  "--p": 0,
  clipPath: "inset(calc((50% - var(--fh) / 2) * (1 - var(--p))) calc((50% - var(--fw) / 2) * (1 - var(--p))))",
} as CSSProperties;

/**
 * Editions opening frame: ink stage, cube construction lines drawing in, a centred frame holding
 * the page h1 + chapter list. "expand" scrubs the frame open into full-bleed duotone art while the
 * title/list slide toward the chapter index. Renders data-edition + data-edition-title (the chapter
 * index only appears on pages that have one) and data-surface="ink".
 */
export function EditionOpener({
  title,
  kicker,
  chapters,
  art,
  variant = "expand",
  tone,
  className,
  h1Props,
  children,
  ...rest
}: EditionOpenerProps) {
  const root = useRef<HTMLElement>(null);
  const experience = useOptionalExperience();
  const motion = experience?.motionEnabled ?? false;
  const list = chapters ?? experience?.chapters ?? [];
  const expand = variant === "expand";

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root);

      // Intro: lines draw in 6 groups (≤1.1s), then the frame border and chapter rows settle in.
      const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      q("[data-group]").forEach((group, i) =>
        intro.fromTo(
          group.querySelectorAll("path"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" },
          i * 0.1,
        ),
      );
      intro.fromTo(q("[data-frame-border]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3);
      intro.fromTo(q("[data-li]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.04 }, 0.5);
      const disposeReady = whenReady(() => intro.play());

      if (expand) {
        const pos = q<HTMLElement>("[data-content-pos]")[0];
        const toIndex = () => window.innerWidth >= 1280;
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(q("[data-art]"), { "--p": 1, duration: 0.8, ease: "power2.inOut" }, 0)
          .to(q("[data-scrim]"), { opacity: 0.4, duration: 0.8 }, 0)
          .to(q("[data-frame]"), { autoAlpha: 0, duration: 0.25 }, 0)
          .to(q("[data-lines]"), { autoAlpha: 0, duration: 0.5 }, 0)
          .to(
            q("[data-content]"),
            {
              x: () => (toIndex() && pos ? 24 - pos.offsetLeft : 0),
              y: () => (toIndex() && pos ? 104 - pos.offsetTop : -40),
              autoAlpha: 0,
              duration: 0.35,
              ease: "power2.in",
            },
            0,
          )
          .to({}, { duration: 0.2 });
      }

      return disposeReady;
    },
    { scope: root, dependencies: [motion, expand], revertOnUpdate: true },
  );

  return (
    <section
      {...rest}
      ref={root}
      data-edition=""
      data-edition-title={title}
      data-surface="ink"
      className={cn(
        "tone-ink relative",
        expand ? FRAME_VARS.expand : FRAME_VARS.static,
        expand && "h-[250svh] motion-reduce:h-auto motion-off:h-auto",
        className,
      )}
    >
      <div
        className={cn(
          "relative min-h-[560px] overflow-clip",
          expand ? "sticky top-0 h-svh motion-reduce:relative motion-off:relative" : "h-[88svh]",
        )}
      >
        {art ? (
          <div data-art className="absolute inset-0" style={ART_CLIP}>
            <DuotoneImage src={art.src} alt={art.alt} sizes="100vw" priority tone={tone} className="size-full" />
            <div data-scrim aria-hidden className="absolute inset-0 bg-ink opacity-55" />
          </div>
        ) : null}

        {children}

        <ConstructionLines />

        <div data-frame aria-hidden className="pointer-events-none absolute inset-0 m-auto h-(--fh) w-(--fw)">
          <div data-frame-border className="size-full border border-cream/80" />
        </div>

        <div data-content-pos className="absolute inset-0 m-auto h-(--fh) w-(--fw)">
          <div data-content className="@container flex size-full flex-col justify-between gap-6 p-5 text-cream md:p-7">
            {kicker ? (
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]">{kicker}</p>
            ) : (
              <span aria-hidden />
            )}
            {/* Scales with the frame (72px at its full 504px content width) and shrinks further (inline, so page
                overrides aren't needed) until the widest word fits: wraps between words only, never mid-word. */}
            <h1
              {...h1Props}
              style={{ fontSize: fitTitle(title, "min(72px,14.3cqi,10svh)"), ...h1Props?.style }}
              className={cn(
                "font-[family-name:var(--font-archivo)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-balance [font-stretch:125%] [hyphens:manual] [overflow-wrap:normal]",
                h1Props?.className,
              )}
            >
              {title}
            </h1>
            {list.length ? (
              <nav aria-label="In this edition">
                <ol className="space-y-1 [counter-reset:ch]">
                  {list.map((chapter, index) => (
                    <li key={`${chapter.id}-${index}`} data-li className="[counter-increment:ch]">
                      <a
                        href={chapter.id ? `#${chapter.id}` : undefined}
                        className="flex items-baseline gap-3 py-0.5 hover:underline hover:decoration-2 hover:underline-offset-4"
                      >
                        <span
                          aria-hidden
                          className="font-mono text-[11px] font-bold before:content-[counter(ch,decimal-leading-zero)]"
                        />
                        <span className="font-sans text-sm font-bold uppercase leading-tight tracking-[0.02em]">
                          {chapter.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : (
              <span aria-hidden />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

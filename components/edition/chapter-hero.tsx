"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useMotionEnabled } from "@/components/experience-provider";
import { ScrambleText } from "@/components/riot/scramble-text";
import { cn } from "@/lib/utils";
import { DuotoneImage, type DuotoneTone } from "./duotone-image";
import { EDITION_GUTTER, pad } from "./shared";

gsap.registerPlugin(ScrollTrigger);

export type ChapterHeroProps = {
  /** Section id (anchor + chapter index jump target). */
  id: string;
  /** Chapter number, rendered as §0N. */
  number: number;
  /** Giant chapter title; also the chapter index label. Existing copy only. */
  title: string;
  /** Mono label after the number: "§02 — LABEL". */
  kicker?: string;
  /** Full-bleed chapter art (real photo, printed as a duotone). */
  art: { src: string; alt: string };
  tone?: DuotoneTone;
  /** Chapter heroes are ink poster surfaces (chrome flips to paper). */
  surface?: "ink";
  /** Optional lede / actions under the title, inside the scrim band. */
  children?: ReactNode;
  className?: string;
};

/**
 * Editions chapter hero: full-bleed duotone art with a slow parallax, a §0N kicker and a giant wide
 * Archivo title in cream on an ink scrim band (≥4.5:1, no blur).
 */
export function ChapterHero({
  id,
  number,
  title,
  kicker,
  art,
  tone = "burgundy-orange",
  surface = "ink",
  children,
  className,
}: ChapterHeroProps) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root);
      gsap.fromTo(
        q("[data-media]"),
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      const title = q("[data-title]");
      gsap.from(title, {
        y: 48,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: title[0], start: "top 88%", once: true },
      });
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  const label = `§${pad(number)}${kicker ? ` — ${kicker}` : ""}`;

  return (
    <section
      ref={root}
      id={id}
      data-cinematic-section=""
      data-cinematic-title={title}
      data-chapter-number={pad(number)}
      data-surface={surface}
      className={cn(
        "tone-ink relative isolate flex min-h-[80svh] flex-col justify-end overflow-clip md:min-h-[125svh] md:justify-center",
        className,
      )}
    >
      <div data-media className="absolute inset-x-0 -inset-y-[8%] -z-10">
        <DuotoneImage src={art.src} alt={art.alt} sizes="100vw" tone={tone} className="size-full" />
      </div>
      {/* keeps the fixed chapter index legible over bright art */}
      <div aria-hidden className="absolute inset-y-0 left-0 -z-10 hidden w-[340px] bg-linear-to-r from-ink/80 to-transparent xl:block" />

      <div className="bg-ink/80 py-8 md:py-12">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <ScrambleText
            as="p"
            text={label}
            trigger="inview"
            className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange"
          />
          <h2
            data-title
            className="mt-3 break-words font-sans text-[clamp(64px,13vw,200px)] font-black uppercase leading-[0.85] tracking-[-0.03em] text-cream [font-stretch:125%]"
          >
            {title}
          </h2>
          {children ? <div className="mt-6 max-w-[60ch] font-serif text-lg text-cream md:text-xl">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

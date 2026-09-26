"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WIDE } from "@/components/chrome/wordmark";
import { ChapterHero, EDITION_GUTTER, StickyStack } from "@/components/edition";
import { useMotionEnabled } from "@/components/experience-provider";
import { TornEdge, Window } from "@/components/riot";
import { cn } from "@/lib/utils";
import { CHAPTERS, culturePillars, research } from "./content";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

// Satellite placement around the central card (≥1024px), Editions "Pulse" collage. depth = parallax factor.
const SATELLITES = [
  { place: "lg:left-0 lg:top-[2%] lg:w-[48%] lg:-rotate-3", depth: 1 },
  { place: "lg:right-0 lg:top-[7%] lg:w-[46%] lg:rotate-2", depth: 0.6 },
  { place: "lg:left-[3%] lg:bottom-[5%] lg:w-[46%] lg:rotate-2", depth: 0.8 },
  { place: "lg:right-[1%] lg:bottom-0 lg:w-[48%] lg:-rotate-2", depth: 1.2 },
];

/**
 * ch.04 — full-bleed chapter hero, then the culture pillars as a sticky copy stack beside a floating window-card collage of the
 * existing research metrics: a central card plus four satellites drifting at different parallax depths.
 */
export function CultureChapter() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        q<HTMLElement>("[data-depth]").forEach((card) => {
          const depth = Number(card.dataset.depth);
          gsap.fromTo(
            card,
            { y: 70 * depth },
            {
              y: -70 * depth,
              ease: "none",
              scrollTrigger: { trigger: q("[data-collage-track]")[0], start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  const collage = (
    <div className="grid gap-4 sm:grid-cols-2 lg:relative lg:block lg:h-full">
      <div className="sm:col-span-2 lg:absolute lg:inset-x-[12%] lg:top-[34%] lg:z-10">
        <div data-depth={0.3}>
          <Window title="2026 Metrics" bar="acid">
            <h3 className={cn(WIDE, "text-[clamp(20px,1.8vw,28px)] uppercase leading-[0.95] tracking-[-0.01em] [font-stretch:115%]")}>
              {research.title}
            </h3>
            <p className="mt-3 font-serif text-base leading-snug">{research.summary}</p>
          </Window>
        </div>
      </div>
      {research.metrics.map((metric, index) => {
        const satellite = SATELLITES[index];
        return (
          <div key={metric.label} className={cn("min-w-0 lg:absolute lg:z-20", satellite.place)}>
            <div data-depth={satellite.depth}>
              <Window title={`[M.${pad(index + 1)}]`} bar="orange" className="shadow-[6px_6px_0_0_var(--shadow-color)]" bodyClassName="p-3.5">
                <p className="font-display text-[clamp(40px,4.2vw,64px)] uppercase leading-[0.9]">{metric.value}</p>
                <p className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">{metric.label}</p>
                <p className="mt-2 font-serif text-sm leading-snug">{metric.copy}</p>
              </Window>
            </div>
          </div>
        );
      })}
    </div>
  );

  const items = culturePillars.map((pillar, index) => (
    <article key={pillar.title}>
      <p className="font-mono text-[11px] font-bold tracking-[0.14em] text-signal">
        [{pad(index + 1)}/{pad(culturePillars.length)}]
      </p>
      <h3 className={cn(WIDE, "mt-3 text-[clamp(30px,3.4vw,52px)] uppercase leading-[0.9] tracking-[-0.02em]")}>
        {pillar.title}
      </h3>
      <p className="mt-4 max-w-[46ch] font-serif text-lg leading-relaxed md:text-xl">{pillar.copy}</p>
    </article>
  ));

  return (
    <>
      <ChapterHero
        id={CHAPTERS[3].id}
        number={4}
        title={CHAPTERS[3].title}
        kicker={`[${pad(culturePillars.length)}]`}
        art={{ src: "/event_pictures/h4g/h4g1.jpg", alt: "Hack4Good v0" }}
        className="max-md:[&_h2]:text-[13.5vw]"
      >
        These aren&apos;t wall posters. This is how we actually operate every day.
      </ChapterHero>
      <TornEdge from="ink" to="paper" />
      {/* Chapter body: not a chapter of its own, so the index keeps §04 lit while you read it. */}
      <section ref={root} data-surface="paper" className="tone-paper relative overflow-x-clip py-16 md:py-24">
        <div data-collage-track className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <StickyStack media={collage} items={items} />
        </div>
      </section>
    </>
  );
}

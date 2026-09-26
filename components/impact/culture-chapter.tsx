"use client";

import { WIDE } from "@/components/chrome/wordmark";
import { ChapterHero, DuotoneImage, EDITION_GUTTER, StickyStack } from "@/components/edition";
import { TornEdge } from "@/components/riot";
import { cn } from "@/lib/utils";
import { CHAPTERS, culturePillars } from "./content";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ch.04 — full-bleed chapter hero, then the culture pillars as a sticky copy stack beside a pinned event photo.
 */
export function CultureChapter() {
  const media = (
    <DuotoneImage
      src="/event_pictures/h4g/h4g3.jpg"
      alt="The crew huddled around a laptop at Hack4Good v0"
      sizes="(min-width: 1024px) 45vw, 100vw"
      className="aspect-[4/5] border-3 border-ink shadow-[10px_10px_0_0_var(--ink)] lg:aspect-auto lg:h-full"
    />
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
      <section data-surface="paper" className="tone-paper relative overflow-x-clip py-16 md:py-24">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <StickyStack media={media} items={items} />
        </div>
      </section>
    </>
  );
}

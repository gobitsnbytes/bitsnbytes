"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { DuotoneImage } from "@/components/edition";
import { useExperience } from "@/components/experience-provider";
import { eventPhotos } from "@/lib/events-data";
import { cn } from "@/lib/utils";

import { BENTO_CELL, BENTO_COLS, interleave, packBento, spansFor } from "./bento";
import { GiantCount, SectionHead } from "./shared";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One continuous bento: every photo, events mixed round-robin, packed hole-free per breakpoint (pure, so the server
// and client render the same grid). tmp/round3/bento_check.ts proves every breakpoint has no holes.
const SHOTS = interleave(eventPhotos.map((group) => group.photos.map((photo) => ({ ...photo, event: group.event }))));
const OPTIONS = SHOTS.map((shot) => spansFor(shot.w / shot.h, BENTO_CELL, shot.feature));
const LAYOUTS = BENTO_COLS.map(
  (cols) => packBento(OPTIONS, cols) ?? SHOTS.map((_, i) => ({ x: i % cols, y: Math.floor(i / cols), w: 1, h: 1 })),
);

/** Per-breakpoint grid-area (--a2 / --a4 / --a6) and the matching `sizes` for one tile. */
function tile(i: number) {
  const style: Record<string, string> = {};
  const widths: string[] = [];
  BENTO_COLS.forEach((cols, b) => {
    const { x, y, w, h } = LAYOUTS[b][i];
    style[`--a${cols}`] = `${y + 1} / ${x + 1} / span ${h} / span ${w}`;
    widths.push(`${Math.round((w / cols) * 100)}vw`);
  });
  const [base, md, lg] = widths;
  return { style: style as CSSProperties, sizes: `(min-width: 1024px) ${lg}, (min-width: 768px) ${md}, ${base}` };
}

const GRID: CSSProperties = {
  gridTemplateColumns: "repeat(var(--cols), minmax(0, 1fr))",
  // Rows follow the column width (cqi = the grid's width), so every cell keeps the BENTO_CELL ratio.
  gridAutoRows: `calc((100cqi - (var(--cols) - 1) * var(--gap)) / var(--cols) / ${BENTO_CELL})`,
};

/**
 * /events [S.03] "In Pictures": one bento puzzle of every event photo. Tile spans follow each photo's aspect (and a
 * few feature photos take 2×2), so crops stay small and no cell is ever empty. Each tile is captioned with its event
 * (and title). Photos print as an ink/orange duotone and go full colour under the pointer; "Full colour" gives
 * keyboard / touch parity. Motion on: tiles rise out of depth in staggered batches as they scroll in (and reset when
 * scrolled back above, so they come at you again). Motion off: static, fully visible.
 */
export function EventGallery() {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const [colour, setColour] = useState(false);

  useGSAP(
    () => {
      if (!motion) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");
      const away = { opacity: 0, y: 72, scale: 0.9, rotateX: 12, transformPerspective: 900 };
      gsap.set(tiles, away);
      ScrollTrigger.batch(tiles, {
        start: "top 94%",
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.9, ease: "expo.out", stagger: 0.07, overwrite: true }),
        onLeaveBack: (batch) => gsap.set(batch, { ...away, overwrite: true }),
      });
    },
    { scope: rootRef, dependencies: [motion], revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      id="in-pictures"
      data-cinematic-section=""
      data-cinematic-title="In Pictures"
      data-chapter-number="03"
      data-surface="ink"
      className="tone-ink relative overflow-x-clip px-4 pb-24 pt-20 md:px-5 md:pb-32 md:pt-28"
    >
      <SectionHead label={<p>Photos</p>} section={3} className="mb-10" />
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <GiantCount count={SHOTS.length}>In Pictures</GiantCount>
        <button
          type="button"
          aria-pressed={colour}
          onClick={() => setColour((on) => !on)}
          className="mb-2 inline-flex h-10 cursor-pointer items-center gap-2 border-2 border-line px-3 font-mono text-xs font-bold uppercase tracking-[0.1em] hover:bg-fg/10 aria-pressed:bg-fg aria-pressed:text-surface"
        >
          <span aria-hidden className={cn("size-3 border-2 border-current", colour && "bg-orange")} />
          Full colour
        </button>
      </div>

      <div className="@container mt-14 md:mt-20">
        <ul
          style={GRID}
          className="grid gap-(--gap) [--cols:2] [--gap:12px] md:[--cols:4] md:[--gap:16px] lg:[--cols:6]"
        >
          {SHOTS.map((shot, i) => {
            const { style, sizes } = tile(i);
            return (
              <li
                key={shot.src}
                data-tile=""
                style={style}
                className="group relative min-h-0 min-w-0 [grid-area:var(--a2)] md:[grid-area:var(--a4)] lg:[grid-area:var(--a6)]"
              >
                <figure className="absolute inset-0 overflow-hidden border-3 border-line bg-ink">
                  <DuotoneImage src={shot.src} alt={shot.alt} sizes={sizes} tone="ink-orange" className="absolute inset-0" />
                  <Image
                    src={shot.src}
                    alt=""
                    fill
                    sizes={sizes}
                    className={cn(
                      "object-cover opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100 motion-reduce:transition-none motion-off:transition-none",
                      colour && "opacity-100",
                    )}
                  />
                  <figcaption className="absolute bottom-0 left-0 max-w-full bg-ink px-2 py-1.5 font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-paper md:text-[11px]">
                    {shot.event}
                    {shot.title ? <span className="text-orange"> · {shot.title}</span> : null}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

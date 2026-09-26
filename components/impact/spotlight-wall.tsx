"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { getImageProps } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WIDE } from "@/components/chrome/wordmark";
import { DuotoneImage, EDITION_GUTTER } from "@/components/edition";
import { useMotionEnabled } from "@/components/experience-provider";
import { Chapter } from "@/components/riot";
import { cn } from "@/lib/utils";
import { CHAPTERS, trackRecord } from "./content";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");
const POOL = 6;
/** Pointer travel (px) between two trail cards. */
const STEP = 120;

// Optimised URLs for the imperative trail <img>s (3:2 cards, ~288px wide).
const TRAIL_SRC = new Map(
  trackRecord.flatMap((item) =>
    item.photos.map((src) => {
      const { props } = getImageProps({ src, alt: "", width: 288, height: 192 });
      return [src, { src: props.src, srcSet: props.srcSet ?? "" }] as const;
    }),
  ),
);

// Static list under reduced motion / the site motion toggle: no pin, every line visible.
const STILL = "motion-reduce:static motion-reduce:h-auto motion-off:static motion-off:h-auto";

/**
 * ch.02 — revelatio "locations spotlight": a sticky Anton wall of the track record. Scroll moves a
 * single lit item (full opacity + orange underline) through the dimmed wall; a caption plate shows its
 * line and a duotone photo. Fine pointers also get an image trail of that item's real photos.
 */
export function SpotlightWall() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pool = useRef<(HTMLImageElement | null)[]>([]);
  const trailState = useRef({ x: 0, y: 0, moved: Infinity, slot: 0, photo: 0 });
  const activeRef = useRef(0);
  const motion = useMotionEnabled();
  const [active, setActive] = useState(0);
  const [finePointer, setFinePointer] = useState(false);
  const trail = motion && finePointer;

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const { contextSafe } = useGSAP(
    () => {
      if (!motion) return;
      const last = trackRecord.length - 1;
      ScrollTrigger.create({
        trigger: root.current?.querySelector("[data-wall-track]"),
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const index = Math.round(self.progress * last);
          if (index === activeRef.current) return;
          activeRef.current = index;
          setActive(index);
        },
      });
    },
    { scope: root, dependencies: [motion], revertOnUpdate: true },
  );

  const onPointerMove = contextSafe((event: PointerEvent<HTMLDivElement>) => {
    const box = stage.current;
    if (!trail || !box) return;
    const photos = trackRecord[activeRef.current].photos;
    if (!photos.length) return;

    const rect = box.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const state = trailState.current;
    state.moved += Math.hypot(x - state.x, y - state.y);
    state.x = x;
    state.y = y;
    if (state.moved < STEP) return;
    state.moved = 0;

    const img = pool.current[state.slot++ % POOL];
    const source = TRAIL_SRC.get(photos[state.photo++ % photos.length]);
    if (!img || !source) return;
    img.srcset = source.srcSet;
    img.src = source.src;
    gsap.killTweensOf(img);
    gsap.set(img, {
      x: x - img.offsetWidth / 2,
      y: y - img.offsetHeight / 2,
      rotation: gsap.utils.random(-5, 5),
      zIndex: state.slot,
    });
    gsap
      .timeline()
      .fromTo(img, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "expo.out" })
      .to(img, { autoAlpha: 0, scale: 0.96, duration: 0.5, ease: "power2.in" }, "+=0.4");
  });

  const current = trackRecord[active];

  return (
    <Chapter ref={root} id={CHAPTERS[1].id} title={CHAPTERS[1].title} number={2} tone="ink" className="py-0 md:py-0">
      <div
        data-wall-track
        className={cn("relative h-[calc(var(--n)*40svh_+_100svh)]", STILL)}
        style={{ "--n": trackRecord.length } as CSSProperties}
      >
        <div
          ref={stage}
          onPointerMove={onPointerMove}
          className={cn(
            "sticky top-0 flex h-svh min-h-[560px] flex-col overflow-clip pb-6 pt-[104px] motion-reduce:pb-20 motion-off:pb-20",
            STILL,
          )}
        >
          <div className={cn("flex min-h-0 flex-1 flex-col px-4 md:px-8", EDITION_GUTTER)}>
            <header className="flex items-baseline justify-between gap-4 border-b border-line/40 pb-3">
              <h2 className={cn(WIDE, "text-sm uppercase tracking-[0.18em]")}>
                {CHAPTERS[1].title}
              </h2>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">
                §02 — What we ran
              </p>
            </header>

            <ol className="mt-6 flex-1 font-display text-[clamp(34px,min(5.6vw,8.5svh),96px)] uppercase leading-[0.92] motion-reduce:space-y-8 motion-reduce:text-[clamp(32px,4.4vw,64px)] motion-off:space-y-8 motion-off:text-[clamp(32px,4.4vw,64px)]">
              {trackRecord.map((item, index) => {
                const on = index === active;
                return (
                  <li key={item.name} className="inline motion-reduce:block motion-off:block">
                    <h3
                      data-active={on}
                      className="relative inline-block opacity-25 transition-opacity duration-150 data-[active=true]:opacity-100 motion-reduce:mb-3 motion-reduce:opacity-100 motion-off:mb-3 motion-off:opacity-100"
                    >
                      {item.name}
                      <span
                        aria-hidden
                        data-active={on}
                        className="absolute inset-x-0 bottom-[0.02em] h-[0.07em] origin-left scale-x-0 bg-orange transition-transform duration-300 ease-riot data-[active=true]:scale-x-100 motion-reduce:hidden motion-off:hidden"
                      />
                    </h3>
                    {index < trackRecord.length - 1 ? (
                      <span aria-hidden className="mx-[0.22em] text-orange/60 motion-reduce:hidden motion-off:hidden">
                        /
                      </span>
                    ) : null}
                    <p className="sr-only motion-reduce:not-sr-only motion-reduce:max-w-[60ch] motion-reduce:font-serif motion-reduce:text-lg motion-reduce:normal-case motion-reduce:leading-snug motion-off:not-sr-only motion-off:max-w-[60ch] motion-off:font-serif motion-off:text-lg motion-off:normal-case motion-off:leading-snug">
                      {item.line}
                    </p>
                  </li>
                );
              })}
            </ol>

            {/* Caption plate for the lit item (visual only: every line is in the list above for AT). */}
            <div
              aria-hidden
              className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-t border-line/40 pt-4 md:gap-8 motion-reduce:hidden motion-off:hidden"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold tracking-[0.2em] text-signal">
                  [E.{pad(active + 1)}]
                </p>
                <p className="mt-2 max-w-[52ch] font-serif text-base leading-snug text-cream md:text-xl">{current.line}</p>
              </div>
              <div className="relative aspect-[3/2] w-[132px] border-2 border-line md:w-[240px]">
                {trackRecord.map((item, index) =>
                  item.photos.length ? (
                    <DuotoneImage
                      key={item.name}
                      src={item.photos[0]}
                      alt=""
                      sizes="(min-width: 768px) 240px, 132px"
                      tone="ink-orange"
                      className={cn(
                        "absolute! inset-0 transition-opacity duration-200",
                        index === active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  ) : null,
                )}
                {current.photos.length ? null : (
                  <span className="halftone-orange absolute inset-0 opacity-40" />
                )}
              </div>
            </div>
          </div>

          {trail ? (
            <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
              {Array.from({ length: POOL }, (_, index) => (
                // plain <img>: the trail sets src/srcset imperatively from getImageProps URLs
                <img
                  key={index}
                  ref={(el) => {
                    pool.current[index] = el;
                  }}
                  alt=""
                  decoding="async"
                  className="invisible absolute left-0 top-0 aspect-[3/2] w-[clamp(200px,20vw,288px)] border-3 border-ink object-cover opacity-0 shadow-[6px_6px_0_0_var(--orange)]"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Chapter>
  );
}

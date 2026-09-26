"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { WIDE } from "@/components/chrome/wordmark";
import { EDITION_GUTTER, StickyStack } from "@/components/edition";
import { useMotionEnabled } from "@/components/experience-provider";
import { Chapter, ChapterHead } from "@/components/riot";
import { cn } from "@/lib/utils";
import { CHAPTERS, coords, places } from "./content";

gsap.registerPlugin(ScrollTrigger);

const TeamGlobe = dynamic(() => import("@/components/team-globe"), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cream">
      [ · · · ]
    </div>
  ),
});

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ch.03 — the network globe pinned beside a sticky stack of the places the arcs run to. Whichever card
 * is on top turns the globe to face that place (snapped, not eased, when motion is off).
 */
export function GlobeChapter() {
  const root = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  const [active, setActive] = useState(0);
  const current = places[active];

  useGSAP(
    () => {
      const list = root.current?.querySelector("ol");
      if (!list) return;
      ScrollTrigger.create({
        trigger: list,
        start: "top 55%",
        end: "bottom 55%",
        onUpdate: (self) => setActive(Math.min(places.length - 1, Math.floor(self.progress * places.length))),
      });
    },
    { scope: root },
  );

  const media = (
    <div className="relative mx-auto aspect-square w-[min(100%,calc(100svh-150px))] overflow-hidden border-3 border-ink bg-[#3c0a12] shadow-[10px_10px_0_0_var(--ink)]">
      <TeamGlobe focus={current.at} animate={motion} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-ink/80 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cream"
      >
        <span className="truncate">
          <span className="text-orange">{current.place}</span> · {coords(current.at)}
        </span>
        <span className="shrink-0">[P.{pad(active + 1)}]</span>
      </div>
    </div>
  );

  const items = places.map((place, index) => (
    <article key={place.id}>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">
        [P.{pad(index + 1)}] {place.place} · {coords(place.at)}
      </p>
      <h3 className={cn(WIDE, "mt-3 text-[clamp(28px,3.2vw,48px)] uppercase leading-[0.9] tracking-[-0.02em]")}>
        {place.href ? (
          <Link href={place.href} className="underline decoration-orange decoration-[0.08em] underline-offset-[0.12em] hover:decoration-burgundy">
            {place.title}
          </Link>
        ) : (
          place.title
        )}
      </h3>
      {index === 0 ? (
        <ul className="mt-4 space-y-1 font-serif text-lg md:text-xl">
          {place.lines.map((line) => (
            <li key={line} className="before:mr-2 before:text-signal before:content-['→']">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 space-y-2">
          {place.lines.map((line, i) =>
            i === 0 && place.lines.length > 1 ? (
              <p key={line} className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
                {line}
              </p>
            ) : (
              <p key={line} className="max-w-[46ch] font-serif text-lg leading-snug md:text-xl">
                {line}
              </p>
            ),
          )}
        </div>
      )}
    </article>
  ));

  return (
    <Chapter ref={root} id={CHAPTERS[2].id} title={CHAPTERS[2].title} number={3} tone="cream">
      <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
        <ChapterHead
          number={3}
          label="On the map"
          title={CHAPTERS[2].title}
          description="The globe marks every fork city, from Bangalore to Lucknow. The stops below are the venues where our events ran."
        />
        <StickyStack media={media} items={items} />
      </div>
    </Chapter>
  );
}

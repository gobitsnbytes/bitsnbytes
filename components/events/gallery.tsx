"use client";

import { useState } from "react";
import Image from "next/image";

import { DuotoneImage } from "@/components/edition";
import { pad } from "@/components/edition/shared";
import { cn } from "@/lib/utils";

import { ParallaxMedia } from "./media";
import { GiantCount, SPAN_CLASS, SectionHead, spansFor } from "./shared";

type Shot = { src: string; title: string; description: string };

// Every "In Pictures" image from the event pages, with their existing titles and descriptions.
const GROUPS: { event: string; shots: Shot[] }[] = [
  {
    event: "Hack4Good v0",
    shots: [
      { src: "/event_pictures/h4g/h4g0.jpg", title: "Hack4Good Hackathon", description: "Teams hacking on autonomous agent workflows." },
      { src: "/event_pictures/h4g/h4g1.jpg", title: "Hardware & AI Devs", description: "Collaborative building and prompt testing." },
      { src: "/event_pictures/h4g/h4g2.jpeg", title: "Project Iteration", description: "Mentoring sessions and agent execution loops." },
      { src: "/event_pictures/h4g/h4g3.jpg", title: "D-Day Coding Sprint", description: "Building autonomous systems under high velocity." },
      { src: "/event_pictures/h4g/h7g.jpeg", title: "Pitching Session", description: "Showcasing agent deployments to the evaluators." },
    ],
  },
  {
    event: "Lucknow Build Guild",
    shots: ["bd1", "bd2", "bd3", "bd4", "bd5"].map((name) => ({
      src: `/event_pictures/${name}.jpg`,
      title: "Lucknow Build Guild",
      description: "Free hardware workshop and meetup",
    })),
  },
  {
    event: "GitHub Copilot Dev Days",
    shots: ["devday", "devday2", "devday3", "devday4", "founder-s"].map((name) => ({
      src: `/event_pictures/${name}.jpeg`,
      title: "GitHub Copilot Dev Days",
      description: "Community Developer Event",
    })),
  },
  {
    event: "Execron 1.0",
    shots: [1, 2, 3, 4, 5].map((n) => ({
      src: `/event_pictures/byteforge${n}.webp`,
      title: "Execron 1.0",
      description: "AI Hackathon & Workshop for Teens",
    })),
  },
  {
    event: "India Innovates 2026",
    shots: [
      { src: "/event_pictures/HEe93oOakAAi2Mi.jpg", title: "Opening Address", description: "Main stage opening session at India Innovates 2026." },
      { src: "/event_pictures/HEe923ub0AE-92F.jpg", title: "Plenary Session", description: "Live address from the central stage at Bharat Mandapam." },
      { src: "/event_pictures/866d62697f3d42819e2007714047a3a80001af45.jpg", title: "Jury Interaction", description: "On-floor demo review with students and evaluators." },
      { src: "/event_pictures/3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg", title: "Participant Teams", description: "Student teams preparing for demonstrations in the main hall." },
      { src: "/event_pictures/1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg", title: "Build Table", description: "Final-stage hardware and prototype iteration under evaluation windows." },
      { src: "/event_pictures/HEe923uagAATqvy.jpg", title: "Hall View", description: "Full auditorium turnout during keynote and showcase rounds." },
    ],
  },
];

const TOTAL = GROUPS.reduce((sum, group) => sum + group.shots.length, 0);
const SIZES: Record<number, string> = {
  2: "(min-width: 1024px) 25vw, 50vw",
  3: "(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw",
  4: "(min-width: 768px) 50vw, 100vw",
  8: "100vw",
};

/**
 * /events [S.03] "In Pictures": every event gallery in the inkfish mixed-width rhythm (25 / 37.5 / 50%,
 * rows closing to 8 columns; mobile: the lead shot(s) full width, the rest in pairs). Metadata row above
 * each photo. Photos print as an ink/orange duotone and go full colour under the pointer, with the
 * inverse parallax inside the mask; "Full colour" gives keyboard / touch parity.
 */
export function EventGallery() {
  const [colour, setColour] = useState(false);

  return (
    <section
      id="in-pictures"
      data-cinematic-section=""
      data-cinematic-title="In Pictures"
      data-chapter-number="03"
      data-surface="ink"
      className="tone-ink relative overflow-x-clip px-4 pb-24 pt-20 md:px-5 md:pb-32 md:pt-28"
    >
      <SectionHead label={<p>Photos</p>} section={3} className="mb-10" />
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <GiantCount count={TOTAL}>In Pictures</GiantCount>
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

      <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
        {GROUPS.map((group, g) => {
          const n = group.shots.length;
          const [first] = group.shots;
          const shared = group.shots.every((s) => s.title === first.title && s.description === first.description);
          const spans = spansFor(n, g % 2 === 1);
          // Mobile pairs: one lead shot for odd counts, two for even, so the 2-col grid always closes.
          const leads = n % 2 === 0 ? 2 : 1;
          return (
            <section key={group.event} aria-labelledby={`gallery-${g}`}>
              <header className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b-2 border-line pb-3">
                <h3
                  id={`gallery-${g}`}
                  className="font-sans text-[clamp(22px,2.6vw,36px)] font-black uppercase leading-none tracking-[-0.02em] [font-stretch:125%]"
                >
                  {group.event}
                </h3>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-signal">
                  [G.{pad(g + 1)}] · [{pad(n)}]
                </p>
                {shared ? <p className="basis-full font-serif text-base text-paper/85">{first.description}</p> : null}
              </header>
              <ul className="-mx-2.5 grid grid-cols-2 gap-y-8 md:grid-cols-8 md:gap-y-[52px]">
                {group.shots.map((shot, i) => {
                  const span = spans[i];
                  const alt = shared
                    ? `${shot.title}: ${shot.description} (photo ${i + 1} of ${n})`
                    : `${shot.title}: ${shot.description}`;
                  return (
                    <li key={shot.src} className={cn("px-2.5", i < leads ? "col-span-2" : "col-span-1", SPAN_CLASS[span])}>
                      <figure data-card className="group">
                        <figcaption className="flex items-start justify-between gap-3 pb-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em]">
                          <span className="min-w-0">
                            {shared ? (
                              group.event
                            ) : (
                              <>
                                {shot.title}
                                <span className="mt-0.5 block font-serif text-sm font-normal normal-case tracking-normal text-paper/80">
                                  {shot.description}
                                </span>
                              </>
                            )}
                          </span>
                          <span className="shrink-0 text-signal">
                            [{pad(i + 1)}/{pad(n)}]
                          </span>
                        </figcaption>
                        <ParallaxMedia
                          className="aspect-[4/3] border-3 border-line"
                          still={
                            <>
                              <DuotoneImage src={shot.src} alt={alt} sizes={SIZES[span]} tone="ink-orange" className="absolute inset-0" />
                              <Image
                                src={shot.src}
                                alt=""
                                fill
                                sizes={SIZES[span]}
                                className={cn(
                                  "object-cover opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100 motion-reduce:transition-none motion-off:transition-none",
                                  colour && "opacity-100",
                                )}
                              />
                            </>
                          }
                        />
                      </figure>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

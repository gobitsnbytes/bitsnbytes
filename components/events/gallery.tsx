"use client";

import { useState } from "react";
import Image from "next/image";

import { DuotoneImage } from "@/components/edition";
import { pad } from "@/components/edition/shared";
import { cn } from "@/lib/utils";

import { GiantCount, SectionHead } from "./shared";

/** w × h: displayed pixel size (after EXIF rotation), so every photo shows whole at its own ratio. */
type Shot = { src: string; title: string; description: string; w: number; h: number };

// Every "In Pictures" image from the event pages, with their existing titles and descriptions.
const GROUPS: { event: string; shots: Shot[] }[] = [
  {
    event: "Hack4Good v0",
    shots: [
      { src: "/event_pictures/h4g/h4g0.jpg", title: "Hack4Good Hackathon", description: "Teams hacking on autonomous agent workflows.", w: 3072, h: 4096 },
      { src: "/event_pictures/h4g/h4g1.jpg", title: "Hardware & AI Devs", description: "Collaborative building and prompt testing.", w: 4032, h: 3024 },
      { src: "/event_pictures/h4g/h4g2.jpeg", title: "Project Iteration", description: "Mentoring sessions and agent execution loops.", w: 4284, h: 5712 },
      { src: "/event_pictures/h4g/h4g3.jpg", title: "D-Day Coding Sprint", description: "Building autonomous systems under high velocity.", w: 4032, h: 3024 },
      { src: "/event_pictures/h4g/h7g.jpeg", title: "Pitching Session", description: "Showcasing agent deployments to the evaluators.", w: 4284, h: 5712 },
    ],
  },
  {
    event: "Lucknow Build Guild",
    shots: (
      [
        ["bd1", 3072, 3072],
        ["bd2", 3072, 3072],
        ["bd3", 4080, 3072],
        ["bd4", 4080, 3072],
        ["bd5", 3072, 4080],
      ] as const
    ).map(([name, w, h]) => ({
      src: `/event_pictures/${name}.jpg`,
      title: "Lucknow Build Guild",
      description: "Free hardware workshop and meetup",
      w,
      h,
    })),
  },
  {
    event: "GitHub Copilot Dev Days",
    shots: (
      [
        ["devday", 1280, 960],
        ["devday2", 960, 1280],
        ["devday3", 722, 1600],
        ["devday4", 1200, 1600],
        ["founder-s", 517, 720],
      ] as const
    ).map(([name, w, h]) => ({
      src: `/event_pictures/${name}.jpeg`,
      title: "GitHub Copilot Dev Days",
      description: "Community Developer Event",
      w,
      h,
    })),
  },
  {
    event: "Execron 1.0",
    shots: [608, 720, 720, 720, 608].map((h, i) => ({
      src: `/event_pictures/byteforge${i + 1}.webp`,
      title: "Execron 1.0",
      description: "AI Hackathon & Workshop for Teens",
      w: 1080,
      h,
    })),
  },
  {
    event: "India Innovates 2026",
    shots: [
      { src: "/event_pictures/HEe93oOakAAi2Mi.jpg", title: "Opening Address", description: "Main stage opening session at India Innovates 2026.", w: 1600, h: 1067 },
      { src: "/event_pictures/HEe923ub0AE-92F.jpg", title: "Plenary Session", description: "Live address from the central stage at Bharat Mandapam.", w: 1600, h: 1067 },
      { src: "/event_pictures/866d62697f3d42819e2007714047a3a80001af45.jpg", title: "Jury Interaction", description: "On-floor demo review with students and evaluators.", w: 801, h: 1200 },
      { src: "/event_pictures/3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg", title: "Participant Teams", description: "Student teams preparing for demonstrations in the main hall.", w: 1024, h: 757 },
      { src: "/event_pictures/1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg", title: "Build Table", description: "Final-stage hardware and prototype iteration under evaluation windows.", w: 1024, h: 687 },
      { src: "/event_pictures/HEe923uagAATqvy.jpg", title: "Hall View", description: "Full auditorium turnout during keynote and showcase rounds.", w: 1600, h: 1067 },
    ],
  },
];

const TOTAL = GROUPS.reduce((sum, group) => sum + group.shots.length, 0);
// A justified row holds ~2-4 photos; wide ones take up to half the row.
const SIZES = "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw";

/**
 * /events [S.03] "In Pictures": every event gallery as self-arranging justified rows. Each photo's flex-grow and
 * basis are its aspect ratio, so every photo in a row gets the same height and shows whole at its own ratio (no
 * cropping), rows fill edge to edge, and reading order stays left to right. The last row keeps the base height
 * (a spacer absorbs its free space). Caption row under each photo.
 * Photos print as an ink/orange duotone and go full colour under the pointer; "Full colour" gives
 * keyboard / touch parity.
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
              <ul className="flex flex-wrap gap-x-4 gap-y-8 [--row:clamp(150px,min(24vw,42svh),340px)] after:grow-[999] after:content-[''] md:gap-x-5 md:gap-y-10">
                {group.shots.map((shot, i) => {
                  const alt = shared
                    ? `${shot.title}: ${shot.description} (photo ${i + 1} of ${n})`
                    : `${shot.title}: ${shot.description}`;
                  return (
                    <li
                      key={shot.src}
                      className="min-w-0"
                      style={{ flexGrow: shot.w / shot.h, flexBasis: `calc(var(--row) * ${(shot.w / shot.h).toFixed(4)})` }}
                    >
                      <figure className="group flex flex-col-reverse">
                        <figcaption className="flex items-start justify-between gap-3 pt-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em]">
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
                        {/* Border outside, true ratio inside: the photo box matches the file exactly. */}
                        <div className="border-3 border-line bg-ink">
                          <div className="relative" style={{ aspectRatio: `${shot.w} / ${shot.h}` }}>
                            <DuotoneImage src={shot.src} alt={alt} sizes={SIZES} tone="ink-orange" className="absolute inset-0" />
                            <Image
                              src={shot.src}
                              alt=""
                              fill
                              sizes={SIZES}
                              className={cn(
                                "object-cover opacity-0 transition-opacity duration-300 ease-linear group-hover:opacity-100 motion-reduce:transition-none motion-off:transition-none",
                                colour && "opacity-100",
                              )}
                            />
                          </div>
                        </div>
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

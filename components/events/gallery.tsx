"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";

import { DuotoneImage, EDITION_GUTTER } from "@/components/edition";
import { pad } from "@/components/edition/shared";
import { Button, Chapter, ChapterHead } from "@/components/riot";
import { cn } from "@/lib/utils";

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
const BIG = "(min-width: 1280px) 38vw, (min-width: 768px) 50vw, 100vw";
const SMALL = "(min-width: 1280px) 19vw, (min-width: 768px) 25vw, 50vw";

// Lens: a full-colour copy under the duotone, uncovered by a circle that follows the pointer.
// "Full colour" (keyboard / touch parity) opens every lens at once.
const LENS = cn(
  "pointer-events-none absolute inset-0 [clip-path:circle(0px_at_var(--x,50%)_var(--y,50%))]",
  "transition-[clip-path] duration-200 ease-riot motion-reduce:transition-none motion-off:transition-none",
  "group-data-[lens=on]/tile:group-data-[colour=off]/gallery:[clip-path:circle(7.5rem_at_var(--x,50%)_var(--y,50%))]",
  "group-data-[colour=on]/gallery:[clip-path:circle(150%_at_50%_50%)]",
);

const moveLens = (event: PointerEvent<HTMLDivElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--x", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--y", `${event.clientY - box.top}px`);
};
const lensOn = (event: PointerEvent<HTMLDivElement>) => {
  if (event.pointerType === "touch") return;
  moveLens(event);
  event.currentTarget.dataset.lens = "on";
};
const lensOff = (event: PointerEvent<HTMLDivElement>) => {
  delete event.currentTarget.dataset.lens;
};

/** /events ch.03: "In Pictures", every event gallery as a duotone grid with a colour lens. */
export function EventGallery() {
  const [colour, setColour] = useState(false);

  return (
    <Chapter id="in-pictures" title="In Pictures" number={3} tone="ink">
      <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
        <ChapterHead number={3} label={`Photos [${pad(TOTAL)}]`} title="In Pictures" />
        <Button variant="outline" size="sm" aria-pressed={colour} onClick={() => setColour((on) => !on)} className="mb-12">
          <span aria-hidden className={cn("size-3 border-2 border-current", colour && "bg-orange")} />
          Full colour
        </Button>

        <div data-colour={colour ? "on" : "off"} className="group/gallery space-y-16 md:space-y-24">
          {GROUPS.map((group, g) => {
            const n = group.shots.length;
            const [first] = group.shots;
            const shared = group.shots.every((s) => s.title === first.title && s.description === first.description);
            // One big tile for odd counts, two for even: the 4-col grid always closes without gaps.
            const bigs = n % 2 === 0 ? 2 : 1;
            return (
              <section key={group.event} aria-labelledby={`gallery-${g}`}>
                <header className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-line pb-3">
                  <h3
                    id={`gallery-${g}`}
                    className="font-sans text-[clamp(22px,2.6vw,36px)] font-black uppercase leading-none tracking-[-0.02em] [font-stretch:125%]"
                  >
                    {group.event}
                  </h3>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-signal">
                    [G.{pad(g + 1)}] · [{pad(n)}]
                  </p>
                  {shared ? <p className="basis-full font-serif text-base text-paper/80">{first.description}</p> : null}
                </header>
                <ul className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                  {group.shots.map((shot, i) => {
                    const big = i < bigs;
                    const alt = shared ? `${shot.title}: ${shot.description} (photo ${i + 1} of ${n})` : `${shot.title}: ${shot.description}`;
                    return (
                      <li
                        key={shot.src}
                        className={cn("flex flex-col", big && "col-span-2 md:row-span-2", big && g % 2 === 1 && bigs === 1 && "md:col-start-3")}
                      >
                        <figure className="flex flex-1 flex-col">
                          <div
                            onPointerEnter={lensOn}
                            onPointerMove={moveLens}
                            onPointerLeave={lensOff}
                            className={cn(
                              "group/tile relative aspect-[4/3] overflow-hidden border-3 border-line",
                              big && "md:aspect-auto md:min-h-0 md:flex-1",
                            )}
                          >
                            <DuotoneImage src={shot.src} alt={alt} sizes={big ? BIG : SMALL} tone="ink-orange" className="absolute inset-0" />
                            <div aria-hidden className={LENS}>
                              <Image src={shot.src} alt="" fill sizes={big ? BIG : SMALL} className="object-cover" />
                            </div>
                          </div>
                          <figcaption className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
                            <span className="text-signal">[{pad(i + 1)}]</span>
                            {shared ? null : (
                              <>
                                {" "}
                                {shot.title}
                                <span className="mt-0.5 block font-serif text-sm font-normal normal-case tracking-normal text-paper/75">
                                  {shot.description}
                                </span>
                              </>
                            )}
                          </figcaption>
                        </figure>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </Chapter>
  );
}

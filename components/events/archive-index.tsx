"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { pad } from "@/components/edition/shared";
import { cn } from "@/lib/utils";

import { Barcode, WipeCell, wipe } from "./barcode";
import { GiantCount } from "./shared";

export type ArchiveEvent = {
  id: string;
  name: string;
  format?: string;
  date: string;
  venue: string;
  status: string;
  /** Link instead of a file: in-page (the upcoming series lives in [S.01]) or, with `external`, another site. */
  href?: string;
  /** `href` is another team's event page: opens in a new tab. */
  external?: boolean;
  /** The full event file (every existing detail). */
  detail?: ReactNode;
};

const MUTED = "opacity-80";
// Burgundy index numbers go ink/paper while a row is filled (burgundy on ink is < 4.5:1).
const SIGNAL = "text-signal group-data-[wipe=in]/row:text-inherit";

const fileId = (ev: ArchiveEvent) => `${ev.id}-file`;

/**
 * Collapsible file: stays in the DOM (inert while closed), opens via grid-template-rows 0fr → 1fr.
 * Closing it pauses its footage, so no audio keeps playing from a hidden file.
 */
function FilePanel({ ev, open }: { ev: ArchiveEvent; open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) ref.current?.querySelectorAll("video").forEach((video) => video.pause());
  }, [open]);
  return (
    <div
      ref={ref}
      id={fileId(ev)}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.19,1,.22,1)] motion-reduce:transition-none motion-off:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="bg-surface pb-14 pt-1">{ev.detail}</div>
      </div>
    </div>
  );
}

const ROW =
  "grid w-full cursor-pointer grid-cols-1 text-left font-mono text-xs uppercase tracking-[0.06em] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,4.5fr)] lg:gap-x-3";

/** Client half of [S.02]: giant count + the inkfish list (barcode stripe-wipe rows), one open file at a time. */
export function ArchiveIndex({ events }: { events: ArchiveEvent[] }) {
  const [open, setOpen] = useState<string | null>(null);

  // Deep links (the JSON-LD @ids, e.g. /events#execron-1-0) open that file.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (events.some((ev) => ev.id === id && ev.detail)) setOpen(id);
  }, [events]);

  // Page height changed: re-measure scroll-driven sections once the panel has settled.
  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 760);
    return () => window.clearTimeout(timer);
  }, [open]);

  const toggle = (id: string) => setOpen((current) => (current === id ? null : id));

  return (
    <>
      <GiantCount>Events</GiantCount>

      <ol className="mt-12 border-t-2 border-line md:mt-16">
        {events.map((ev, i) => {
          const cells = (
            <>
              <WipeCell delay={0} duration={300} pad="px-2 pt-3 md:py-3 lg:py-4" className="font-bold">
                {ev.name}
              </WipeCell>
              <Barcode base={200} step={9} className="hidden py-4 lg:flex" />
              <WipeCell
                delay={300}
                duration={600}
                pad="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-2 pb-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.6fr)_auto_1rem] md:py-3 lg:py-4"
              >
                <span>
                  <span className={SIGNAL}>[{pad(i + 1)}]</span> {ev.format ?? ev.status}
                </span>
                <span className={cn("col-span-2 row-start-2 md:col-span-1 md:row-start-auto", MUTED)}>
                  {ev.format ? `${ev.venue} · ${ev.status}` : ev.venue}
                </span>
                <span className="col-start-2 row-start-1 text-right tabular-nums md:col-start-auto md:row-start-auto">{ev.date}</span>
                <span aria-hidden className="hidden text-right md:block">
                  {ev.detail ? (open === ev.id ? "−" : "+") : ev.external ? "↗" : "→"}
                </span>
              </WipeCell>
            </>
          );
          return (
            <li key={ev.id} id={ev.id} className="group/row scroll-mt-28 border-b-2 border-line" {...wipe}>
              <h3>
                {ev.detail ? (
                  <button
                    type="button"
                    aria-expanded={open === ev.id}
                    aria-controls={fileId(ev)}
                    onClick={() => toggle(ev.id)}
                    className={ROW}
                  >
                    {cells}
                  </button>
                ) : ev.external ? (
                  <a href={ev.href} target="_blank" rel="noopener noreferrer" className={ROW}>
                    {cells}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <a href={ev.href} className={ROW}>
                    {cells}
                  </a>
                )}
              </h3>
              {ev.detail ? (
                <div className="px-2">
                  <FilePanel ev={ev} open={open === ev.id} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

"use client";

import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { pad } from "@/components/edition/shared";
import { useExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";

import { Barcode, WipeCell, wipe } from "./barcode";
import { ParallaxMedia } from "./media";
import { GiantCount, SPAN_CLASS, rowsOf, spansFor } from "./shared";

export type ArchiveEvent = {
  id: string;
  name: string;
  format?: string;
  date: string;
  venue: string;
  status: string;
  image: string;
  /** Existing footage: hover-to-play in the grid, clip in the list preview. */
  video?: string;
  /** In-page link instead of a file (the upcoming series lives in [S.01]). */
  href?: string;
  /** The full event file (every existing detail). */
  detail?: ReactNode;
};

type View = "grid" | "list";

const SIZES: Record<number, string> = {
  2: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw",
  3: "(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw",
  4: "(min-width: 768px) 50vw, 100vw",
  8: "100vw",
};

const MUTED = "opacity-80";
// Burgundy index numbers go ink/paper while a row is filled (burgundy on ink is < 4.5:1).
const SIGNAL = "text-signal group-data-[wipe=in]/row:text-inherit";

const fileId = (ev: ArchiveEvent) => `${ev.id}-file`;

/** Collapsible file: stays in the DOM (inert while closed), opens via grid-template-rows 0fr → 1fr. */
function FilePanel({
  ev,
  n,
  open,
  heading,
  onClose,
}: {
  ev: ArchiveEvent;
  n: number;
  open: boolean;
  heading: boolean;
  onClose: () => void;
}) {
  return (
    <div
      id={fileId(ev)}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.19,1,.22,1)] motion-reduce:transition-none motion-off:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="bg-surface pb-14 pt-1">
          {heading ? (
            <div className="mb-8 flex items-center justify-between gap-4 border-y-2 border-line py-2 font-mono text-xs font-bold uppercase tracking-[0.08em]">
              <h3>
                <span className="text-signal">[{pad(n)}]</span> {ev.name}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 cursor-pointer items-center gap-2 border-2 border-line px-3 uppercase hover:bg-fg hover:text-surface focus-visible:bg-fg focus-visible:text-surface"
              >
                Close file <span aria-hidden>✕</span>
              </button>
            </div>
          ) : null}
          {ev.detail}
        </div>
      </div>
    </div>
  );
}

function Card({ ev, n, span, open, onToggle }: { ev: ArchiveEvent; n: number; span: number; open: boolean; onToggle: () => void }) {
  const body = (
    <>
      {/* One line each (inkfish ellipsis) so media tops align across a row; the file holds the full text. */}
      <span className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 pb-3 font-mono text-xs uppercase tracking-[0.06em]">
        <span className="col-span-2 truncate font-bold">
          <span className="text-signal">[{pad(n)}]</span> {ev.name}
        </span>
        <span className={cn("truncate", MUTED)}>{ev.venue}</span>
        <span className={cn("text-right tabular-nums", MUTED)}>{ev.date}</span>
      </span>
      <ParallaxMedia
        video={ev.video}
        className="aspect-video border-3 border-line"
        still={<Image src={ev.image} alt="" fill sizes={SIZES[span]} className="object-cover" />}
      />
      <span className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em]">
        <span className={MUTED}>{ev.format ? `${ev.status} · ${ev.format}` : ev.status}</span>
        <span className="shrink-0 border-b-2 border-transparent group-hover:border-current group-focus-visible:border-current">
          {ev.detail ? (open ? "[−] Close file" : "[+] Open file") : "[→] S.01"}
        </span>
      </span>
    </>
  );
  const cls = "group block w-full cursor-pointer text-left";
  return ev.detail ? (
    <button
      type="button"
      data-card
      data-cursor-label="[View]"
      aria-expanded={open}
      aria-controls={fileId(ev)}
      onClick={onToggle}
      className={cls}
    >
      {body}
    </button>
  ) : (
    <a href={ev.href} data-card data-cursor-label="[View]" className={cls}>
      {body}
    </a>
  );
}

/** Client half of [S.02]: giant count + view toggle, grid and list views, one open file at a time. */
export function ArchiveIndex({ events }: { events: ArchiveEvent[] }) {
  const { motionEnabled: motion } = useExperience();
  const [view, setView] = useState<View>("grid");
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(0);

  // Deep links (the JSON-LD @ids, e.g. /events#execron-1-0) open that file.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (events.some((ev) => ev.id === id && ev.detail)) setOpen(id);
  }, [events]);

  // Page height changed: re-measure scroll-driven sections once the panel has settled.
  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 760);
    return () => window.clearTimeout(timer);
  }, [open, view]);

  const toggle = (id: string) => setOpen((current) => (current === id ? null : id));
  const close = (ev: ArchiveEvent) => {
    setOpen(null);
    document.querySelector<HTMLElement>(`[aria-controls="${fileId(ev)}"]`)?.focus();
  };
  const preview = (i: number | null) => {
    setActive(i);
    if (i !== null) setShown(i);
  };

  const spans = spansFor(events.length);
  const lgRows = rowsOf(spans);
  const mdRows = rowsOf(spans.map((span) => (span === 8 ? 8 : 4)));
  const order = (i: number, offset: number) =>
    ({ "--om": mdRows[i] * 100 + offset + i, "--ol": lgRows[i] * 100 + offset + i }) as CSSProperties;
  const live = active === null ? null : events[active];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
        <GiantCount count={events.length}>Events</GiantCount>
        <div role="group" aria-label="Layout" className="flex gap-2 pb-2 font-mono text-xs font-bold uppercase tracking-[0.1em]">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 border-2 border-line px-3 uppercase hover:bg-fg/10 aria-pressed:bg-fg aria-pressed:text-surface"
            >
              <svg viewBox="0 0 12 12" aria-hidden className="size-3 fill-current">
                {v === "grid" ? (
                  <path d="M0 0h5v5H0zM7 0h5v5H7zM0 7h5v5H0zM7 7h5v5H7z" />
                ) : (
                  <path d="M0 0h12v2H0zM0 5h12v2H0zM0 10h12v2H0z" />
                )}
              </svg>
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <div className="-mx-2.5 mt-12 grid grid-cols-1 md:mt-16 md:grid-cols-8">
          {events.map((ev, i) => (
            <Fragment key={ev.id}>
              <div
                id={ev.id}
                style={order(i, 0)}
                className={cn("scroll-mt-28 px-2.5 pb-10 md:order-(--om) md:pb-[52px] lg:order-(--ol)", SPAN_CLASS[spans[i]])}
              >
                <Card ev={ev} n={i + 1} span={spans[i]} open={open === ev.id} onToggle={() => toggle(ev.id)} />
              </div>
              {ev.detail ? (
                <div style={order(i, 50)} className="px-2.5 md:order-(--om) md:col-span-8 lg:order-(--ol)">
                  <FilePanel ev={ev} n={i + 1} open={open === ev.id} heading onClose={() => close(ev)} />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="relative mt-12 md:mt-16">
          <ol
            className="border-t-2 border-line xl:min-h-[305px]"
            onPointerLeave={() => preview(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) preview(null);
            }}
          >
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
                      {ev.detail ? (open === ev.id ? "−" : "+") : "→"}
                    </span>
                  </WipeCell>
                </>
              );
              // xl: rows stop short of the docked preview (540px + gap), so no copy ever sits over footage.
              const row =
                "grid w-full cursor-pointer grid-cols-1 text-left font-mono text-xs uppercase tracking-[0.06em] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,4.5fr)] lg:gap-x-3 xl:w-[calc(100%-560px)]";
              return (
                <li key={ev.id} id={ev.id} className="group/row scroll-mt-28 border-b-2 border-line" {...wipe}>
                  <h3 onPointerEnter={() => preview(i)} onFocus={() => preview(i)}>
                    {ev.detail ? (
                      <button
                        type="button"
                        aria-expanded={open === ev.id}
                        aria-controls={fileId(ev)}
                        onClick={() => toggle(ev.id)}
                        className={row}
                      >
                        {cells}
                      </button>
                    ) : (
                      <a href={ev.href} className={row}>
                        {cells}
                      </a>
                    )}
                  </h3>
                  {ev.detail ? (
                    <div onPointerEnter={() => preview(null)} className="px-2">
                      <FilePanel ev={ev} n={i + 1} open={open === ev.id} heading={false} onClose={() => close(ev)} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {/* inkfish sticky preview: docked bottom-right while a row is hovered / focused (xl+). */}
          <div
            aria-hidden
            className="pointer-events-none sticky bottom-5 z-10 -mt-[305px] ml-auto hidden h-[305px] w-[540px] xl:block"
          >
            <div
              className={cn(
                "relative size-full overflow-hidden border-3 border-line bg-ink transition-opacity duration-300 motion-reduce:transition-none motion-off:transition-none",
                live === null && "opacity-0",
              )}
            >
              {events.map((ev, i) => (
                <Image
                  key={ev.id}
                  src={ev.image}
                  alt=""
                  fill
                  sizes="540px"
                  className={cn("object-cover", i !== shown && "opacity-0")}
                />
              ))}
              {motion && live?.video ? (
                <video
                  key={live.video}
                  src={live.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 size-full object-cover"
                />
              ) : null}
              <span className="absolute bottom-2 left-2 border-2 border-paper bg-ink px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-paper">
                [{pad(shown + 1)}] {events[shown].name}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

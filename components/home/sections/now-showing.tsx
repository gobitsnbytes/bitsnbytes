import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { regionalSeriesEvent as event } from "@/lib/events-data";
import { WIDE } from "@/components/chrome/wordmark";
import { Button } from "@/components/ui/button";
import { Chapter, TornEdge } from "@/components/riot/chapter";
import { Tag } from "@/components/riot/marks";
import { Window } from "@/components/riot/window";
import { VideoModal } from "@/components/riot/video";

/**
 * "Now showing": the Regional Hackathon Series teaser (copy only from regionalSeriesEvent). Ink poster chapter:
 * giant title + one trailer line + venue/date on the left, the poster in a window on the right. The whole
 * window is the trailer trigger (VideoModal, sound on) with a PLAY TRAILER cursor tag.
 */
export function HomeNowShowing() {
  return (
    <>
      <TornEdge from="paper" to="ink" />
      <Chapter id="now-showing" title="now showing" number={4} tone="ink">
        <div className="grid items-center gap-12 px-[4vw] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">§04 — Now showing</p>
              <Tag tone="orange">{event.statusLabel}</Tag>
            </div>
            <h2 className={`${WIDE} mt-5 text-[clamp(44px,6.4vw,112px)] uppercase leading-[0.86]`}>{event.title}</h2>
            <p className="mt-8 max-w-[26ch] font-serif text-[clamp(22px,2.4vw,34px)] italic leading-[1.15]">
              {event.trailerLines[0]}
            </p>
            <p className="mt-8 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em]">
              <span aria-hidden className="size-2.5 bg-orange" />
              {event.finaleVenueLabel} · {event.finaleDateLabel}
            </p>
            <Button asChild variant="orange" className="mt-8">
              <Link href={event.href}>
                View event
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="group relative">
            <Window title={event.title} bar="orange" bodyClassName="p-0">
              <div className="relative aspect-video bg-ink">
                <Image src={event.posterSrc} alt="" fill sizes="(min-width: 1024px) 50vw, 92vw" className="object-cover" />
                <span aria-hidden className="absolute inset-0 grid place-items-center">
                  <span className="grid size-20 place-items-center border-3 border-ink bg-orange text-ink shadow-[6px_6px_0_0_var(--ink)] transition-[transform,box-shadow] duration-150 ease-riot group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[8px_8px_0_0_var(--ink)] group-active:translate-x-[3px] group-active:translate-y-[3px] group-active:shadow-none motion-reduce:transition-none">
                    <svg viewBox="0 0 24 24" className="size-8 fill-current">
                      <path d="M6 4l14 8-14 8z" />
                    </svg>
                  </span>
                </span>
              </div>
            </Window>
            {/* The whole window is the hit area. */}
            <VideoModal src={event.trailerSrc} poster={event.posterSrc} title={event.title}>
              <button
                type="button"
                aria-label={`Play trailer: ${event.title}`}
                data-cursor-label="PLAY TRAILER"
                className="absolute inset-0 z-10 cursor-pointer"
              />
            </VideoModal>
          </div>
        </div>
      </Chapter>
    </>
  );
}

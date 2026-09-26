"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Breadcrumbs } from "@/components/breadcrumb";
import { WIDE } from "@/components/chrome/wordmark";
import { pad } from "@/components/edition/shared";
import { useExperience } from "@/components/experience-provider";
import { eventsReel as CLIPS } from "@/lib/events-data";
import { cn } from "@/lib/utils";

import { Barcode, WipeArrow, WipeCell, wipe } from "./barcode";
import { ReelPlayer } from "./player";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HIGHLIGHTS = ["High Agency Shipping", "IIT Kanpur & Delhi Summits", "National Scale Partners"];
/** S.01 "View trailer" (and anything else) opens the player with: detail { index, from, start? }. */
export const WATCH_EVENT = "bnb:events-watch";
export type WatchDetail = { index: number; from: HTMLElement | null; start?: number };

const FRAME_MS = 1000 / 30;
const DWELL_MS = 1000;
const HOVER_MS = 600;

/*
 * /events hero: inkfish "playlist reel" (tmp/research-full.json → inkfish "Home hero: playlist reel").
 * 100svh ink header; the current clip sits full-bleed in a plain <video> (muted, playsInline, preload
 * metadata for the current item only, poster first) with a transform-only 0.5× scroll parallax, and
 * auto-advances on ended. The muted preview starts once the visitor stays: ~1s in view or ~600ms of
 * mouse hover. The whole reel is the play button: it opens the fullscreen player with sound, from the
 * preview's current time. Top: the mono playlist (cols 3–6) — event | 12-stripe barcode | [0N] title →;
 * the now-playing row's stripes fill with playback progress; a triangle collapses the list to it.
 * Text sits on explicit ink scrim bands. Motion off / reduced motion: posters only, no autoplay,
 * no parallax, no loop; click still plays.
 */
export function EventsReel() {
  const { motionEnabled: motion } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useRef(true);
  const armed = useRef(false);
  const listId = useId();
  const [index, setIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [player, setPlayer] = useState<WatchDetail | null>(null);
  const clip = CLIPS[index];

  // 0.5× parallax: the video drifts down half the scroll distance while the header leaves.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!motion || !root) return;
      gsap.to(mediaRef.current, {
        y: () => root.offsetHeight * 0.5,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
    },
    { scope: rootRef, dependencies: [motion], revertOnUpdate: true },
  );

  // Muted preview plays only with motion on, once armed (the visitor stayed), in view, tab visible and
  // the player closed. Armed after DWELL_MS in view (reset on leaving) or HOVER_MS of mouse hover.
  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;
    let dwell = 0;
    let hover = 0;
    const sync = () => {
      if (motion && armed.current && inView.current && !document.hidden && !player) video.play().catch(() => {});
      else video.pause();
    };
    const arm = () => {
      armed.current = true;
      sync();
    };
    const io = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      window.clearTimeout(dwell);
      if (!entry.isIntersecting) armed.current = false;
      else if (!armed.current) dwell = window.setTimeout(arm, DWELL_MS);
      sync();
    });
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !armed.current) hover = window.setTimeout(arm, HOVER_MS);
    };
    const leave = () => window.clearTimeout(hover);
    io.observe(root);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      window.clearTimeout(dwell);
      window.clearTimeout(hover);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [motion, player, index]);

  // Page-wide: one <video> at a time. Any play (reel, player, archive files) pauses every other video.
  useEffect(() => {
    const solo = (event: Event) =>
      document.querySelectorAll("video").forEach((video) => video !== event.target && video.pause());
    document.addEventListener("play", solo, true);
    return () => document.removeEventListener("play", solo, true);
  }, []);

  // While playing, the now-playing barcode fills with progress.
  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;
    const stripes = Array.from(listRef.current?.querySelectorAll<HTMLElement>(`[data-row="${index}"] [data-stripe]`) ?? []);
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      const p = video.duration ? (video.currentTime / video.duration) * stripes.length : 0;
      stripes.forEach((el, k) => (el.style.scale = `${Math.min(Math.max(p - k, 0), 1)} 1`));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, index]);

  // Other sections open the player through a window event (S.01 "View trailer").
  useEffect(() => {
    const onWatch = (event: Event) => {
      const detail = (event as CustomEvent<WatchDetail>).detail;
      if (detail && CLIPS[detail.index]) setPlayer(detail);
    };
    window.addEventListener(WATCH_EVENT, onWatch);
    return () => window.removeEventListener(WATCH_EVENT, onWatch);
  }, []);

  // Picking a playlist row is intent: the preview starts at once (motion on).
  const select = (i: number) => {
    armed.current = true;
    const video = videoRef.current;
    if (i === index && video) {
      video.currentTime = 0;
      if (motion) video.play().catch(() => {});
    }
    setIndex(i);
  };

  // Full-screen with sound, continuing from where the preview is.
  const watch = (event: MouseEvent<HTMLElement>) =>
    setPlayer({ index, from: event.currentTarget, start: videoRef.current?.currentTime });

  return (
    <section
      ref={rootRef}
      id="event-log"
      data-tour="page-hero"
      data-cinematic-section=""
      data-cinematic-title="the event log"
      data-surface="ink"
      className="tone-ink relative isolate flex min-h-[max(100svh,640px)] flex-col justify-between overflow-hidden"
    >
      <div ref={mediaRef} aria-hidden className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            if (motion) select((index + 1) % CLIPS.length);
          }}
          className="size-full bg-ink object-cover"
        />
      </div>

      {/* Top scrim band: nav clearance, path + kicker | playlist | lede. Controls sit above the play layer. */}
      <div className="grid gap-x-5 gap-y-5 bg-[linear-gradient(to_bottom,rgb(18_15_10/0.92),rgb(18_15_10/0.82)_calc(100%-var(--fade)),transparent)] px-4 pb-(--fade) pt-24 [--fade:40px] md:px-5 md:pt-[clamp(88px,13svh,112px)] lg:grid-cols-8 lg:[--fade:72px]">
        <div className="lg:col-span-2">
          <Breadcrumbs items={[{ name: "Events", href: "/events" }]} className="relative z-10 mb-3" />
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper/85">
            <span className="text-orange">Event Log</span> · GOBITSNBYTES FOUNDATION
          </p>
        </div>

        <div className="relative z-10 hidden lg:col-span-4 lg:col-start-3 lg:block">
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={listId}
            aria-label={collapsed ? "Show the playlist" : "Collapse the playlist"}
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -left-7 top-0 grid size-6 cursor-pointer place-items-center text-paper"
          >
            <svg
              viewBox="0 0 10 10"
              aria-hidden
              className={cn(
                "size-2.5 fill-current transition-transform duration-300 ease-[cubic-bezier(.25,1,.5,1)] motion-reduce:transition-none motion-off:transition-none",
                collapsed && "-rotate-90",
              )}
            >
              <path d="M0 2h10L5 9z" />
            </svg>
          </button>
          <ol ref={listRef} id={listId} aria-label="Playlist" className="font-mono text-[11px] font-bold uppercase tracking-[0.06em] xl:text-xs">
            {CLIPS.map((item, i) => {
              const current = i === index;
              return (
                <li
                  key={item.src}
                  data-row={i}
                  className={cn("group/row", collapsed && !current && "hidden")}
                  {...wipe}
                >
                  <button
                    type="button"
                    aria-current={current ? "true" : undefined}
                    onClick={() => select(i)}
                    className="grid h-6 w-full cursor-pointer grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,1.8fr)] items-stretch gap-x-3 text-left text-paper"
                  >
                    <WipeCell delay={0} duration={200} pad="truncate px-1.5 leading-6">
                      {item.event}
                    </WipeCell>
                    <Barcode progress={current} className="py-1.5" />
                    <WipeCell delay={200} duration={500} pad="flex items-center justify-between gap-2 px-1.5 leading-6">
                      <span className="truncate">
                        <span className={current ? "text-orange group-data-[wipe=in]/row:text-inherit" : undefined}>
                          [{pad(i + 1)}]
                        </span>{" "}
                        {item.title}
                      </span>
                      <WipeArrow shown={current} />
                    </WipeCell>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:col-span-2 lg:col-start-7">
          <p
            data-speakable="true"
            data-citation="true"
            className="max-w-[40ch] font-serif text-base leading-snug text-paper md:text-[17px]"
          >
            Hackathons, summits, and workshops where teen builders actually ship things across India.
          </p>
          <ul className="mt-3 font-mono text-[11px] font-bold uppercase leading-[1.8] tracking-[0.08em] text-paper/85">
            {HIGHLIGHTS.map((highlight, i) => (
              <li key={highlight}>
                <span className="text-orange">[{pad(i + 1)}]</span> {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/*
       * The reel itself is the play target: a transparent full-area button painted over the scrim bands
       * (positioned, so it stacks above them), under the z-10 controls. Clicks on the h1 / lede pass to it.
       */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Play ${clip.event} — ${clip.title}`}
        data-cursor-label="[Play]"
        onClick={watch}
        className="absolute inset-0 cursor-pointer focus-visible:outline-offset-[-6px]"
      />

      {/* Bottom scrim band: h1 | Scroll. */}
      <div className="grid items-end gap-5 bg-linear-to-t from-ink via-ink/90 to-transparent px-4 pb-5 pt-16 md:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:pt-[clamp(40px,12svh,112px)]">
        <h1
          data-speakable="true"
          className={cn(WIDE, "text-[clamp(32px,3.6vw,72px)] uppercase leading-[0.88] text-paper lg:pb-1")}
        >
          Where code meets <span className="block text-orange">the real world</span>
        </h1>

        <a
          href="#regional-series"
          className="group relative z-10 inline-flex items-end gap-3 justify-self-end text-paper md:gap-4"
        >
          <span className={cn(WIDE, "text-[28px] leading-none md:text-[40px]")}>Scroll</span>
          <svg viewBox="0 0 12 28" aria-hidden className="h-7 w-3 fill-none stroke-current stroke-2">
            <path d="M6 0v26M1 21l5 5 5-5" />
          </svg>
        </a>
      </div>

      <ReelPlayer
        clip={CLIPS[player?.index ?? index]}
        number={(player?.index ?? index) + 1}
        open={player !== null}
        from={player?.from ?? null}
        start={player?.start}
        onClose={(time) => {
          // Back from fullscreen, the preview carries on from where the viewer stopped (same clip only).
          if (time !== undefined && player?.index === index && videoRef.current) videoRef.current.currentTime = time;
          setPlayer(null);
        }}
      />
    </section>
  );
}

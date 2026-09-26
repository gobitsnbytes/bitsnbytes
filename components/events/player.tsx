"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { pad } from "@/components/edition/shared";
import { useExperience } from "@/components/experience-provider";
import { Button } from "@/components/riot";
import type { ReelClip } from "@/lib/events-data";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const mmss = (s: number) => (Number.isFinite(s) ? `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}` : "00:00");

/** Viewport inset of an element, for the clip-path expansion (bfcm theatre). */
function insetOf(el: HTMLElement | null) {
  const r = el?.getBoundingClientRect();
  if (!r || !r.width) return "inset(0px 0px 0px 0px)";
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const c = (n: number, max: number) => Math.min(Math.max(n, 0), max);
  return `inset(${c(r.top, vh)}px ${c(vw - r.right, vw)}px ${c(vh - r.bottom, vh)}px ${c(r.left, vw)}px)`;
}

const CTRL =
  "inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-2 border-2 border-paper bg-ink px-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-paper transition-colors duration-150 hover:bg-paper hover:text-ink focus-visible:bg-paper focus-visible:text-ink";

type Props = {
  clip: ReelClip;
  number: number;
  open: boolean;
  /** Element the player grows out of (and hands focus back to). */
  from: HTMLElement | null;
  /** Seconds to start from (continues the reel preview). */
  start?: number;
  /** Called with the playback time, so the reel preview can carry on from there. */
  onClose: (time?: number) => void;
};

// Burgundy → warm → orange stage for "gradient" clips: soft blooms over the brand ramp, oversized so it can drift.
export const GRADIENT = {
  background:
    "radial-gradient(40% 50% at 22% 30%, var(--warm), transparent 70%), radial-gradient(45% 55% at 78% 72%, var(--orange), transparent 70%), linear-gradient(135deg, var(--burgundy) 10%, var(--warm) 55%, var(--orange) 95%)",
};

/**
 * inkfish custom fullscreen player on a Radix Dialog (focus trap, Esc, aria-modal). The ink layer grows
 * from the trigger's rect with clip-path (≤ 600ms). Controls fade in on activity (.3s linear): dashed
 * 1px timeline (4px dash / 4px gap) + needle over a native range input (keyboard seek), mm:ss,
 * play/pause, mute, captions note, close. Motion off: opens and closes instantly.
 * It always tries to start with sound. Without a user gesture on the page yet (autoplay policy), it plays muted
 * behind a big "Tap for sound" control, and the visitor's next tap or key anywhere turns sound on.
 * `clip.mode === "gradient"`: the clip plays framed (contain, 16:9, capped at 1024px) on a slowly drifting brand
 * gradient with a halftone bite, once through, then offers replay / close.
 */
export function ReelPlayer({ clip, number, open, from, start, onClose }: Props) {
  const requestClose = useRef<() => void>(onClose);
  // `from` is cleared with the open state; keep the last trigger to hand focus back to.
  const lastFrom = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (from) lastFrom.current = from;
  }, [from]);
  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? null : requestClose.current())}>
      <Dialog.Portal>
        <Dialog.Content
          data-lenis-prevent
          {...(clip.note ? {} : { "aria-describedby": undefined })}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            requestClose.current();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            lastFrom.current?.focus({ preventScroll: true });
          }}
          className="fixed inset-0 z-[300] outline-none"
        >
          <Stage clip={clip} number={number} from={from} start={start} onClose={onClose} requestClose={requestClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Stage({
  clip,
  number,
  from,
  start,
  onClose,
  requestClose,
}: Omit<Props, "open"> & { requestClose: MutableRefObject<() => void> }) {
  const { motionEnabled: motion, lenis } = useExperience();
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const needleRef = useRef<HTMLSpanElement>(null);
  const idleTimer = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [idle, setIdle] = useState(false);
  // Sound was blocked by the autoplay policy (not the visitor's choice): show "Tap for sound".
  const [blocked, setBlocked] = useState(false);
  const [ended, setEnded] = useState(false);
  const gradient = clip.mode === "gradient";

  const { contextSafe } = useGSAP(
    () => {
      if (!motion) return;
      gsap.fromTo(
        stageRef.current,
        { clipPath: insetOf(from) },
        { clipPath: "inset(0px 0px 0px 0px)", duration: 0.6, ease: "power4.out" },
      );
      // The gradient stage drifts slowly (transform only).
      gsap.to("[data-drift]", {
        xPercent: 6,
        yPercent: -5,
        rotate: 10,
        scale: 1.1,
        duration: 16,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: stageRef },
  );

  // Close reverses the expansion back into the trigger, then unmounts.
  const close = contextSafe(() => {
    const video = videoRef.current;
    video?.pause();
    const done = () => onClose(video?.currentTime);
    if (!motion) return done();
    gsap.to(stageRef.current, { clipPath: insetOf(from), duration: 0.5, ease: "power3.inOut", onComplete: done });
  });
  useEffect(() => {
    requestClose.current = close;
  });

  // Scroll stays put underneath; start with sound from `start` when the page has had a user gesture (a click
  // to open always has), else muted with "Tap for sound".
  useEffect(() => {
    lenis?.stop();
    const video = videoRef.current;
    if (video) {
      if (start) video.currentTime = start;
      const quiet = () => {
        video.muted = true;
        setBlocked(true);
        video.play().catch(() => {});
      };
      if (navigator.userActivation?.hasBeenActive === false) quiet();
      else {
        video.muted = false;
        video.play().catch(quiet);
      }
    }
    return () => {
      lenis?.start();
      window.clearTimeout(idleTimer.current);
    };
  }, [lenis, start]);

  // While sound is blocked, the next tap or key anywhere turns it on (the sound controls handle their own click).
  useEffect(() => {
    if (!blocked) return;
    const unmute = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-sound]")) return;
      if (videoRef.current) videoRef.current.muted = false;
    };
    window.addEventListener("pointerdown", unmute, true);
    window.addEventListener("keydown", unmute, true);
    return () => {
      window.removeEventListener("pointerdown", unmute, true);
      window.removeEventListener("keydown", unmute, true);
    };
  }, [blocked]);

  // Needle + fill follow playback (transform only), only while playing.
  useEffect(() => {
    const video = videoRef.current;
    if (!playing || !video) return;
    let raf = 0;
    const tick = () => {
      const p = video.duration ? video.currentTime / video.duration : 0;
      if (fillRef.current) fillRef.current.style.scale = `${p} 1`;
      if (needleRef.current) needleRef.current.style.translate = `${p * 100}% 0`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const poke = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2500);
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setTime(value);
    const p = video.duration ? value / video.duration : 0;
    if (fillRef.current) fillRef.current.style.scale = `${p} 1`;
    if (needleRef.current) needleRef.current.style.translate = `${p * 100}% 0`;
  };

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const hidden = idle && playing && !blocked;
  const fade = cn(
    "transition-opacity duration-300 ease-linear motion-reduce:transition-none motion-off:transition-none has-[:focus-visible]:opacity-100",
    hidden && "opacity-0",
  );

  return (
    <div
      ref={stageRef}
      onPointerMove={poke}
      onPointerDown={poke}
      onKeyDown={poke}
      data-mode={gradient ? "gradient" : "cover"}
      className={cn("tone-ink absolute inset-0 overflow-hidden bg-ink", hidden && "cursor-none")}
    >
      {gradient ? (
        <div aria-hidden className="absolute inset-0 bg-burgundy">
          <div data-drift className="absolute -inset-1/4" style={GRADIENT} />
          <div className="halftone absolute inset-0 opacity-25 mix-blend-multiply" />
          <div className="dither absolute inset-0 opacity-60" />
        </div>
      ) : null}

      <div className={gradient ? "absolute inset-0 grid place-items-center px-4 pb-32 pt-24 md:px-10" : "contents"}>
        <div
          className={
            gradient
              ? "relative aspect-video w-[min(100%,calc((100svh_-_14rem)*16/9),1024px)] border-3 border-ink bg-ink shadow-[16px_16px_0_0_var(--ink)]"
              : "contents"
          }
        >
          <video
            ref={videoRef}
            src={clip.src}
            poster={clip.poster}
            playsInline
            preload="auto"
            onClick={toggle}
            onPlay={() => {
              setPlaying(true);
              setEnded(false);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setEnded(true);
            }}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onVolumeChange={(e) => {
              setMuted(e.currentTarget.muted);
              if (!e.currentTarget.muted) setBlocked(false);
            }}
            className={cn("bg-ink object-contain", gradient ? "size-full" : "absolute inset-0 size-full")}
          />
          {gradient && ended ? (
            <div className="absolute inset-0 grid place-items-center bg-ink/80 p-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="orange" onClick={replay}>
                  <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-none stroke-current stroke-[3]">
                    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" />
                  </svg>
                  Replay
                </Button>
                <Button variant="outline" onClick={() => requestClose.current()}>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {blocked ? (
        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <Button
            data-sound=""
            variant="orange"
            size="lg"
            aria-label="Turn the sound on"
            onClick={() => {
              if (videoRef.current) videoRef.current.muted = false;
            }}
            className="pointer-events-auto"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-6 fill-current">
              <path d="M3 9h4l5-4v14l-5-4H3z" />
              <path d="M16 8l6 8M22 8l-6 8" className="fill-none stroke-current stroke-[2.5]" />
            </svg>
            Tap for sound
          </Button>
        </div>
      ) : null}

      <div
        className={cn(
          "absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-linear-to-b from-ink via-ink/85 to-transparent px-4 pb-16 pt-4 md:px-5",
          fade,
        )}
      >
        <Dialog.Title className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-paper">
          <span className="text-orange">[{pad(number)}]</span> {clip.event} · {clip.title}
        </Dialog.Title>
        <button type="button" onClick={() => requestClose.current()} className={CTRL}>
          Close <span className="text-orange">[Esc]</span>
        </button>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/90 to-transparent px-4 pb-5 pt-20 md:px-5",
          fade,
        )}
      >
        <div className="flex items-center gap-3 md:gap-5">
          <button type="button" onClick={toggle} className={CTRL} aria-label={playing ? "Pause" : "Play"}>
            <svg viewBox="0 0 24 24" aria-hidden className="size-4 fill-current">
              {playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M6 4l14 8-14 8z" />}
            </svg>
            <span aria-hidden className="hidden sm:inline">{playing ? "Pause" : "Play"}</span>
          </button>

          <span className="font-mono text-xs font-bold tabular-nums text-paper">{mmss(time)}</span>

          <div className="relative h-10 min-w-0 flex-1 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus-ring)">
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-px bg-[repeating-linear-gradient(to_right,var(--paper)_0_4px,transparent_4px_8px)]"
            />
            <span ref={fillRef} aria-hidden className="absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-orange" />
            <span ref={needleRef} aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-orange" />
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(time, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${mmss(time)} of ${mmss(duration)}`}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </div>

          <span className="font-mono text-xs font-bold tabular-nums text-paper">{mmss(duration)}</span>

          <button
            type="button"
            data-sound=""
            aria-pressed={muted}
            onClick={() => {
              const video = videoRef.current;
              if (video) video.muted = !video.muted;
            }}
            className={cn(CTRL, "aria-pressed:bg-orange aria-pressed:text-ink")}
          >
            Mute
          </button>
        </div>
        {clip.note ? (
          <Dialog.Description className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-paper/85">
            {clip.note}
          </Dialog.Description>
        ) : null}
      </div>
    </div>
  );
}

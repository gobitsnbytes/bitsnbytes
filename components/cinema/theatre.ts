"use client";

import { useEffect, useRef, type RefObject } from "react";

import { duck } from "@/components/chrome/sound/engine";
import { whenReady } from "@/components/edition/shared";

/*
 * Netflix-style film moments shared by the home reel, /join and /impact:
 *   useDwell      the visitor stops scrolling on a film for ~2s → onDwell (the page takes it to full screen)
 *   setTheatre    html[data-theatre]: nav + floating chrome step aside, UI sounds duck under the film
 *   playWithSound start a film audibly with a volume ramp, or muted when the autoplay policy says no
 *   fadeVolume    rAF volume ramp (iOS ignores volume: callers still mute/unmute at the ends)
 *   watchFrames   frame-accurate media time via requestVideoFrameCallback (rAF fallback)
 *   hasSeen/markSeen  auto-play each film once per session; its Play button still replays it
 */

/** Something modal is up (Radix dialogs, menu, console, lightbox). Ambient panels (cookie banner) opt out. */
const COVER = '[role="dialog"]:not([data-ambient]), [role="alertdialog"]';
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

const motionAllowed = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  document.documentElement.dataset.immersiveMotion !== "off";

type DwellOptions = {
  /** Off while the film is already playing, motion is off, or it was seen this session. */
  enabled: boolean;
  onDwell: () => void;
  /** Scroll intent (wheel, touch drag, scroll keys, scrolling) while enabled: a playing film steps aside. */
  onStir?: (event: Event) => void;
  /** Stillness needed. */
  ms?: number;
  /** Share of the viewport the element must cover. */
  fill?: number;
};

/**
 * Fires `onDwell` once the loader is done and the visitor has given no scroll input, key or press for `ms` while
 * `ref` covers `fill` of the viewport, the tab is visible and nothing modal is open. Any of those re-arms it; only
 * scroll intent calls `onStir`. Mouse moves never count (hovering the film is watching it).
 * While the countdown runs on screen the element carries data-dwell="arming" (restarted per arm), so a CSS ring
 * can fill in sync: `group-data-[dwell=arming]:animate-[dwell_2s_linear_forwards]`.
 */
export function useDwell(ref: RefObject<HTMLElement | null>, { enabled, onDwell, onStir, ms = 2000, fill = 0.6 }: DwellOptions) {
  const handlers = useRef({ onDwell, onStir });
  useEffect(() => {
    handlers.current = { onDwell, onStir };
  });

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    let timer = 0;
    let ready = false;

    const away = () => {
      const r = el.getBoundingClientRect();
      const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      return (
        document.hidden ||
        !motionAllowed() ||
        Boolean(document.querySelector(COVER)) ||
        shown < Math.min(r.height, window.innerHeight) * fill
      );
    };
    const mark = (on: boolean) => {
      delete el.dataset.dwell;
      if (!on) return;
      void el.offsetWidth; // restart the ring animation
      el.dataset.dwell = "arming";
    };
    const fire = () => {
      mark(false);
      if (away()) return arm();
      handlers.current.onDwell();
    };
    function arm() {
      window.clearTimeout(timer);
      if (!ready) return;
      timer = window.setTimeout(fire, ms);
      mark(!away());
    }
    const stir = (event: Event) => {
      handlers.current.onStir?.(event);
      arm();
    };
    const key = (event: KeyboardEvent) => (SCROLL_KEYS.has(event.key) ? stir(event) : arm());
    const visible = () => (document.hidden ? (window.clearTimeout(timer), mark(false)) : arm());

    const disposeReady = whenReady(() => {
      ready = true;
      arm();
    });
    const opts = { passive: true, capture: true } as const;
    window.addEventListener("wheel", stir, opts);
    window.addEventListener("touchmove", stir, opts);
    window.addEventListener("scroll", stir, opts);
    window.addEventListener("pointerdown", arm, opts);
    window.addEventListener("keydown", key, true);
    document.addEventListener("visibilitychange", visible);
    return () => {
      disposeReady();
      window.clearTimeout(timer);
      mark(false);
      window.removeEventListener("wheel", stir, opts);
      window.removeEventListener("touchmove", stir, opts);
      window.removeEventListener("scroll", stir, opts);
      window.removeEventListener("pointerdown", arm, opts);
      window.removeEventListener("keydown", key, true);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [enabled, ms, fill, ref]);
}

/** html[data-theatre]: the nav and floating chrome step aside (chrome.css) and UI sounds duck under the film. */
export function setTheatre(on: boolean) {
  document.documentElement.toggleAttribute("data-theatre", on);
  duck(on);
}

const ramps = new WeakMap<HTMLMediaElement, number>();
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

/** Eases `video.volume` to `to` over `ms`, then runs `done`. A newer ramp on the same element cancels the old one. */
export function fadeVolume(video: HTMLMediaElement, to: number, ms: number, done?: () => void) {
  cancelAnimationFrame(ramps.get(video) ?? 0);
  const from = video.volume;
  const t0 = performance.now();
  const step = (now: number) => {
    const p = ms > 0 ? Math.min((now - t0) / ms, 1) : 1;
    video.volume = from + (to - from) * easeInOut(p);
    if (p < 1) ramps.set(video, requestAnimationFrame(step));
    else done?.();
  };
  ramps.set(video, requestAnimationFrame(step));
}

/**
 * Plays `video` with its sound ramping in over `ms` (volume 0 first, so nothing pops). Resolves true when audible,
 * false when the autoplay policy forced a muted start (no gesture on the page yet): show "Tap for sound".
 */
export async function playWithSound(video: HTMLVideoElement, ms = 1200) {
  const quiet = async () => {
    video.muted = true;
    await video.play().catch(() => {});
    return false;
  };
  if (navigator.userActivation?.hasBeenActive === false) return quiet();
  video.volume = 0;
  video.muted = false;
  try {
    await video.play();
  } catch {
    return quiet();
  }
  if (video.volume === 0) fadeVolume(video, 1, ms);
  return true; // iOS: volume is read-only (stays 1), so it is simply unmuted
}

/** Calls `onTime(mediaTime)` for every presented frame until disposed. */
export function watchFrames(video: HTMLVideoElement, onTime: (time: number) => void) {
  const rvfc = "requestVideoFrameCallback" in video;
  let handle = 0;
  let live = true;
  const tick = (_now?: number, meta?: VideoFrameCallbackMetadata) => {
    if (!live) return;
    onTime(meta?.mediaTime ?? video.currentTime);
    handle = rvfc ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(() => tick());
  };
  tick();
  return () => {
    live = false;
    if (rvfc) video.cancelVideoFrameCallback(handle);
    else cancelAnimationFrame(handle);
  };
}

const SEEN_KEY = "bnb-film-seen";
const seenList = (): string[] => {
  try {
    return JSON.parse(window.sessionStorage.getItem(SEEN_KEY) ?? "[]");
  } catch {
    return [];
  }
};
/** The film already auto-played (or was watched) this session. */
export const hasSeen = (src: string) => seenList().includes(src);
export function markSeen(src: string) {
  try {
    window.sessionStorage.setItem(SEEN_KEY, JSON.stringify([...new Set([...seenList(), src])]));
  } catch {
    // storage blocked: it may auto-play again, nothing breaks
  }
}

/**
 * How a 16:9 film sits in the viewport: cover on landscape screens, contain (letterboxed) on portrait ones so
 * centred titles in the frame never crop. Returns the painted frame rect, for lining DOM up with the picture.
 */
export function filmRect(box: DOMRect, aspect = 16 / 9) {
  const cover = box.width / box.height >= 1.2;
  const h = (cover ? Math.max : Math.min)(box.width / aspect, box.height);
  const w = h * aspect;
  return { cover, left: box.left + (box.width - w) / 2, top: box.top + (box.height - h) / 2, width: w, height: h };
}

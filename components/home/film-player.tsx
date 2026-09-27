"use client";

/*
 * FilmPlayer — the homepage film player with the trailer's end-card handoff, in two modes.
 *
 * The trailer ends with the character throwing the cube at the lens and a hard cut to a black end card whose flat
 * logo is public/logo.svg. We ride that cut into the site (both modes; media times):
 *   1. blow-open (OPEN_AT → CUT): the window scales up to fill the screen as the cube rushes the lens; chrome fades.
 *      "riser" starts here, sized to peak exactly on the cut.
 *   2. swap (the CUT frame, via requestVideoFrameCallback) + "impact": a real SVG logo lands pixel-exact on the
 *      video's logo; the video keeps playing hidden so its sound sting finishes.
 *   3. blueprint (+0.1 "shimmer"): the logo's cut-out pieces misregister, its fill wipes away to an outline, and the
 *      cube construction lines (the /about opener's drawing) draw out of it across the black.
 *   4. iris (+0.5 "whoosh"): the black stage opens through a hexagonal hole grown from the logo; the logo reassembles
 *      and flies into the nav's cube mark, which pops (+1.55 "land"); "resolve" as it settles (+2.0), closed.
 *
 * window (the hero's "Watch film", the reel's [ WATCH FILM ]): the trailer plays in a riot Window over an ink
 * overlay; the iris lands on the hero (scrolled to top while covered), whose wordmark rises again.
 *
 * theatre (HomeReel after a 2 s dwell: Netflix's billboard going full screen; seconds from the dwell):
 *   0.00  the Window appears exactly over the reel's window (same chrome, the reel's current frame drawn into a
 *         canvas) and the reel's preview pauses; "whoosh". It FLIPs to fill the screen (GROW, power3.inOut): title
 *         bar fades, border/shadow drop (the reel's own sit underneath), the black stage grows out of the section's
 *         visible area, and the picture dims to black by the end.
 *   0.70  the ident (components/cinema/ident.ts, its "sting" at full level: UI sound isn't ducked yet).
 *   1.85  the ident hands off: the trailer plays from 0 with sound (setTheatre ducks UI cues under it), or muted
 *         behind "Tap for sound". Close [Esc] + a "Scroll to return" hint show.
 *   cut   the handoff above, landing "stay": the page isn't moved; the nav is brought back while the stage is still
 *         black, the iris opens onto the reel where the visitor is (its preview resumes) and the logo flies into the
 *         nav mark (or fades in place if the mark still isn't on screen).
 *   Scroll intent (wheel, touch drag, scroll keys: on window, capture, and swallowed while the theatre is up), Esc
 *   or Close: the film's sound fades out (400 ms), the FLIP reverses into the reel's window (0.54 s), a 0.15 s
 *   crossfade onto the live preview, closed; focus returns to the reel's button without scrolling. The page never
 *   moved; the next scroll scrolls.
 *   During the handoff the same intent just hurries it along.
 *   A resize (a phone rotating, F11) refits the picture; a frame late past the cut or the film ending (a hidden tab
 *   pauses rVFC) still lands the end card; a start the autoplay policy refused outright rolls on "Tap for sound".
 * Reduced motion / motion toggle off: a plain player, no handoff, no theatre. Esc / Close / backdrop always close.
 */

import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useExperience } from "@/components/experience-provider";
import { Button } from "@/components/riot";
import { Window } from "@/components/riot/window";
import { LOGO_HEX, LOGO_PIECES } from "@/components/chrome/intro/data";
import { GROUPS } from "@/components/edition/edition-opener";
import { play } from "@/components/chrome/sound/engine";
import { playIdent } from "@/components/cinema/ident";
import { fadeVolume, filmRect, markSeen, playWithSound, setTheatre, watchFrames } from "@/components/cinema/theatre";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// /movie/bnb-trailer.mp4 cue points (the team's captioned cut, 30fps), measured from its frames. Re-measure if the
// edit changes timing.
const OPEN_AT = 6.9; // the cube rushes the lens
const CUT = 216 / 30; // first frame of the black end card (7.200s)
// End-card logo hexagon inside the frame: centre and height as fractions of the frame.
const CARD = { cx: 0.4995, cy: 0.5097, h: 0.8583 };
// logo.svg hexagon bounding box (its viewBox is 28 54 146 146); pointy-top, so circumradius = height / 2.
const HEX = { x: 44.568964, y: 64.293104, w: 113.603586, h: 129.724136 };
const VIEW = { x: 28, y: 54, size: 146 };
/** Theatre: reel window → full screen. */
const GROW = 0.7;
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);
const CLOSE =
  "cursor-pointer border-3 border-ink bg-paper px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[3px_3px_0_0_var(--orange)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--orange)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none";

/** Evenodd polygon: the whole viewport minus a pointy-top hexagon of radius r around (cx, cy). */
function iris(cx: number, cy: number, r: number) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)}px ${(cy + r * Math.sin(a)).toFixed(1)}px`;
  });
  return `polygon(evenodd, 0px 0px, ${W}px 0px, ${W}px ${H}px, 0px ${H}px, 0px 0px, ${hex.join(", ")}, ${hex[0]}, 0px 0px)`;
}

/** Sound on after an autoplay block, ramped so it doesn't pop. */
function unmute(video: HTMLVideoElement | null) {
  if (!video?.muted) return;
  video.volume = 0;
  video.muted = false;
  // The policy refused even the muted start (iOS Low Power Mode): this tap is the gesture that rolls it.
  if (video.paused) video.play().catch(() => {});
  fadeVolume(video, 1, 600);
}

type Mode = "window" | "theatre";
type Phase = "intro" | "play" | "open" | "handoff" | "exit";

type FilmPlayerProps = {
  src: string;
  poster?: string;
  title: string;
  /** Trigger element (rendered via asChild); always opens in window mode. */
  children: ReactNode;
  /** Controlled open state (optional; uncontrolled otherwise). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** theatre: opened by a dwell, grows out of `from` to full screen and hands back to it. */
  mode?: Mode;
  /** theatre: the reel's picture box (it holds the preview <video>) to grow from and return to. */
  from?: RefObject<HTMLElement | null>;
};

export function FilmPlayer({ src, poster, title, children, open, onOpenChange, mode = "window", from }: FilmPlayerProps) {
  const [innerOpen, setInnerOpen] = useState(false);
  const morphed = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  // Theatre closes through its own hand-back animation; FilmStage installs it here (null: close at once).
  const exitRef = useRef<(() => void) | null>(null);
  const theatre = mode === "theatre";

  const setOpen = (next: boolean) => {
    if (next) morphed.current = false;
    setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog.Root open={open ?? innerOpen} onOpenChange={setOpen}>
      <Dialog.Trigger ref={trigger} asChild>
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        {theatre ? null : (
          <Dialog.Overlay
            data-film-overlay=""
            className="fixed inset-0 z-[200] bg-ink/85 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none motion-off:animate-none"
          />
        )}
        <Dialog.Content
          data-lenis-prevent
          aria-describedby={undefined}
          onEscapeKeyDown={(event) => {
            if (!theatre || !exitRef.current) return;
            event.preventDefault();
            exitRef.current();
          }}
          onCloseAutoFocus={(event) => {
            // Theatre hands back to the reel where the visitor is: its button, without scrolling to it.
            if (theatre) {
              event.preventDefault();
              trigger.current?.focus({ preventScroll: true });
              return;
            }
            // After the handoff the page sits at the hero: keep it there and put focus on the hero's film button.
            if (!morphed.current) return;
            event.preventDefault();
            document.querySelector<HTMLElement>("[data-film-home]")?.focus({ preventScroll: true });
          }}
          onPointerDown={(event) => {
            // Theatre has no backdrop: a tap there is "Tap for sound", never a close.
            if (!theatre && event.target === event.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[201] outline-none"
        >
          <FilmStage
            src={src}
            poster={poster}
            title={title}
            mode={mode}
            from={from}
            exitRef={exitRef}
            onHandoff={() => {
              morphed.current = true;
            }}
            onDone={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type FilmStageProps = Omit<FilmPlayerProps, "children" | "open" | "onOpenChange" | "mode"> & {
  mode: Mode;
  exitRef: RefObject<(() => void) | null>;
  onHandoff: () => void;
  onDone: () => void;
};

function FilmStage({ src, poster, title, mode, from, exitRef, onHandoff, onDone }: FilmStageProps) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { motionEnabled, lenis } = useExperience();
  const maskId = `film-logo-${useId().replace(/:/g, "")}`;
  const theatre = mode === "theatre" && motionEnabled;
  // Theatre: the film is rolling (its controls show) / its sound was blocked by the autoplay policy.
  const [live, setLive] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const toTop = useCallback(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [lenis]);

  useGSAP(
    (_, contextSafe) => {
      const video = videoRef.current;
      const scope = root.current;
      markSeen(src); // watched: the reel won't auto-play it again this session
      if (!motionEnabled || !video || !scope || !contextSafe) return;
      const q = gsap.utils.selector(scope);
      const [win] = q("[data-win]");
      const [stage] = q("[data-stage]");
      const [still] = q<HTMLCanvasElement>("[data-still]");
      const [logo] = q<SVGSVGElement>("[data-logo]");
      const [lines] = q<SVGSVGElement>("[data-film-lines]");
      if (!win || !stage || !logo || !lines) return;
      const bar = q("[data-frame] > div:first-child");
      const html = document.documentElement;

      let phase: Phase = theatre ? "intro" : "play";
      let opening: gsap.core.Timeline | undefined;
      let landing: gsap.core.Timeline | undefined;
      let ident: ReturnType<typeof playIdent> | undefined;

      // Theatre: the reel's preview pauses under the film (resumed as the page comes back).
      const box = theatre ? from?.current : null;
      const reel = box?.querySelector("video");
      const reelWasPlaying = Boolean(reel && !reel.paused);
      const resumeReel = () => {
        if (reelWasPlaying) reel?.play().catch(() => {});
      };

      // Theatre 0.70: the ident on black, then the film from its first frame.
      const start = contextSafe(async () => {
        if (phase !== "intro") return;
        phase = "play";
        gsap.set(still, { autoAlpha: 0 });
        gsap.set(video, { opacity: 1 });
        setTheatre(true);
        setLive(true);
        const audible = await playWithSound(video);
        if ((phase as Phase) === "exit") {
          // Left while play() was settling (a slow network): its ramp-up replaced leave()'s fade-out.
          fadeVolume(video, 0, 200, () => video.pause());
          return;
        }
        if (!audible) setBlocked(true);
      });
      const roll = contextSafe(() => {
        if (phase !== "intro") return;
        ident = playIdent(scope);
        void ident.done.then(start);
      });

      // Theatre 0.00: FLIP from the reel's picture to the full-screen film rect (cover on landscape, contain on portrait).
      // Measured untransformed and all fromTo, so a resize (a phone rotating, F11) can rebuild it at any progress and
      // the hand-back still reverses to the reel's current window.
      const build = () => {
        gsap.set(win, { x: 0, y: 0, scale: 1 });
        const W = window.innerWidth;
        const H = window.innerHeight;
        const r = (box ?? video).getBoundingClientRect();
        const s = (box?.closest("section") ?? scope).getBoundingClientRect();
        const v = video.getBoundingClientRect();
        const w = win.getBoundingClientRect();
        const cx = v.left + v.width / 2;
        const cy = v.top + v.height / 2;
        const fill = filmRect(new DOMRect(0, 0, W, H));
        gsap.set(win, { transformOrigin: `${cx - w.left}px ${cy - w.top}px` });
        return gsap
          .timeline({ defaults: { duration: GROW, ease: "power3.inOut" }, onComplete: roll })
          .fromTo(
            win,
            { x: r.left + r.width / 2 - cx, y: r.top + r.height / 2 - cy, scale: r.width / v.width },
            { x: fill.left + fill.width / 2 - cx, y: fill.top + fill.height / 2 - cy, scale: fill.width / v.width },
            0,
          )
          // the section's visible slice (the curtain may still cover part of the reel) opens to the whole screen
          .fromTo(
            scope,
            { clipPath: `inset(${Math.max(s.top, 0)}px 0px ${Math.max(H - s.bottom, 0)}px 0px)` },
            { clipPath: "inset(0px 0px 0px 0px)" },
            0,
          )
          .set(q("[data-frame]"), { borderColor: "transparent", boxShadow: "none" }, 0)
          .fromTo(bar, { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "power1.out" }, 0)
          .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, 0)
          .fromTo(still, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "power1.in" }, GROW - 0.3);
      };
      const grow = contextSafe(() => {
        play("whoosh");
        // Only the attribute half of setTheatre (nav + floating chrome step aside): UI sound ducks once the film
        // plays, so the whoosh and the ident's sting ring at full level.
        html.toggleAttribute("data-theatre", true);
        gsap.set(win, { autoAlpha: 1 });
        opening = build();
      });
      const refit = contextSafe(() => {
        if (!opening || phase === "handoff" || phase === "exit") return;
        const at = opening.progress();
        opening.kill();
        opening = build();
        opening.progress(at, true); // (suppressed: a finished grow must not roll the ident twice)
      });

      if (theatre) {
        reel?.pause();
        gsap.set(win, { autoAlpha: 0 });
        gsap.set(video, { opacity: 0 });
        const img = box?.querySelector("img");
        const frame = reel && reel.readyState >= 2 ? reel : img?.complete && img.naturalWidth ? img : null;
        if (frame) still?.getContext("2d")?.drawImage(frame, 0, 0, still.width, still.height);
        grow(); // before the first paint: that frame is the reel's window, pixel for pixel
      }

      // Theatre hand-back (scroll intent, Esc, Close).
      const leave = contextSafe(() => {
        if (phase === "handoff") return void landing?.timeScale(3); // already landing on the page: hurry it
        if (phase === "exit") return;
        phase = "exit";
        ident?.kill();
        setLive(false);
        setBlocked(false); // a tap on the way out must not unmute (or roll) the leaving film
        setTheatre(false);
        play("close");
        if (video.paused || video.muted) video.pause();
        else fadeVolume(video, 0, 400, () => video.pause());
        resumeReel();
        if (!opening) return onDone();
        // back on the reel's window: a short crossfade onto its live preview
        opening.eventCallback("onReverseComplete", () => {
          gsap.to(win, { autoAlpha: 0, duration: 0.15, ease: "power1.out", onComplete: onDone });
        });
        opening.timeScale(1.3).reverse();
      });

      // 1. blow-open: scale the window about the video's centre until the video fills the screen.
      const blowOpen = contextSafe(() => {
        phase = "open";
        const lead = Math.max(0.12, CUT - video.currentTime);
        play("riser", lead); // peaks on the cut
        if (theatre) return; // already full screen
        video.controls = false;
        const v = video.getBoundingClientRect();
        const w = win.getBoundingClientRect();
        const scale = Math.min(window.innerWidth / v.width, window.innerHeight / v.height);
        gsap.set(win, { transformOrigin: `${v.left + v.width / 2 - w.left}px ${v.top + v.height / 2 - w.top}px` });
        opening = gsap
          .timeline({ defaults: { ease: "power2.in" } })
          .to([...q("[data-chrome]"), ...bar], { opacity: 0, duration: 0.15 }, 0)
          // the frame's border + hard shadow are cream in dark mode: drop them before they show in the side bars
          .set(q("[data-frame]"), { borderColor: "transparent", boxShadow: "none" }, 0)
          .to(stage, { opacity: 1, duration: 0.25 }, 0)
          .to(
            win,
            {
              x: window.innerWidth / 2 - (v.left + v.width / 2),
              y: window.innerHeight / 2 - (v.top + v.height / 2),
              scale,
              duration: lead,
            },
            0,
          );
      });

      // 2-4. swap onto the SVG logo at the cut, then blueprint → iris → landing.
      const handoff = contextSafe(() => {
        phase = "handoff";
        play("impact");
        onHandoff();
        video.controls = false;
        if (theatre) {
          // The nav comes back now, under the black, so it has settled by the time the logo flies into its mark.
          // The visitor scrolled down to get here (data-scroll-dir="down" hides it): the film ending is a pause.
          setTheatre(false);
          html.dataset.scrollDir = "up";
          setLive(false);
        }
        opening?.progress(1); // measure the settled, full-screen video (also covers a seek past the cue)
        gsap.set([...q("[data-chrome]"), ...bar], { opacity: 0 });
        gsap.set(stage, { opacity: 1 });
        const v = video.getBoundingClientRect();
        const h = CARD.h * v.height;
        const w = (h * HEX.w) / HEX.h;
        const cx = v.left + CARD.cx * v.width;
        const cy = v.top + CARD.cy * v.height;
        const radius = h / 2;
        gsap.set(logo, { left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity: 1 });
        gsap.set(win, { opacity: 0 }); // keeps playing underneath: the sound sting runs past the cut
        const span = (radius / 300) * 1800; // GROUPS are drawn at R = 300 within ±900
        gsap.set(lines, { left: cx - span / 2, top: cy - span / 2, width: span, height: span, opacity: 1 });
        if (!theatre) toTop(); // the page is fully covered: land the reveal on the hero

        const pieces = q("[data-piece]");
        const offset = (scale: number) => ({
          x: (i: number) => LOGO_PIECES[i % LOGO_PIECES.length].from.x * scale,
          y: (i: number) => LOGO_PIECES[i % LOGO_PIECES.length].from.y * scale,
        });
        const far = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
        const hole = { r: radius };
        const mark = document.querySelector<HTMLElement>(".bnb-nav .bnb-cube");

        const tl = gsap.timeline({
          onComplete: () => {
            play("resolve");
            onDone();
          },
        });
        landing = tl;
        // 3. blueprint
        tl.to(q("[data-film-lines] path"), { strokeDashoffset: 0, duration: 0.55, stagger: 0.05, ease: "power2.out" }, 0)
          .call(() => play("shimmer"), undefined, 0.1)
          .to(pieces, { ...offset(2.4), duration: 0.12, ease: "steps(2)" }, 0)
          .to(q("[data-hex-line]"), { opacity: 1, duration: 0.18, ease: "steps(3)" }, 0.12)
          .to(q("[data-float]"), { opacity: 1, duration: 0.18, ease: "steps(3)" }, 0.14)
          .to(q("[data-wipe]"), { y: HEX.h, duration: 0.3, ease: "steps(6)" }, 0.14);
        // 4. iris: onto the reel as it was (theatre), or onto the hero, whose wordmark rises again
        if (theatre) tl.call(resumeReel, undefined, 0.5);
        else {
          tl.set(document.querySelectorAll("[data-film-overlay]"), { opacity: 0 }, 0.5).call(
            () => {
              window.dispatchEvent(new Event("bnb:hero-replay"));
            },
            undefined,
            0.5,
          );
        }
        tl.call(() => play("whoosh", 1), undefined, 0.5)
          .to(
            hole,
            {
              r: far / Math.cos(Math.PI / 6) + 8,
              duration: 0.8,
              ease: "power3.inOut",
              onUpdate: () => {
                stage.style.clipPath = iris(cx, cy, hole.r);
              },
            },
            0.5,
          )
          .to(lines, { opacity: 0, duration: 0.45, ease: "power1.out" }, 0.6)
          // the logo reassembles as the iris opens…
          .to(pieces, { x: 0, y: 0, duration: 0.2, ease: "steps(1)" }, 0.62)
          .to(q("[data-float]"), { opacity: 0, duration: 0.2, ease: "steps(2)" }, 0.62)
          .to(q("[data-wipe]"), { y: 0, duration: 0.25, ease: "steps(6)" }, 0.62)
          .to(q("[data-hex-line]"), { opacity: 0, duration: 0.15 }, 0.8);

        // …and flies into the nav's cube mark (the mark's box is logo.svg's full 146-unit viewBox).
        if (mark) {
          let landed = true;
          tl.set(mark, { opacity: 0 }, 0.9).add(() => {
            const m = mark.getBoundingClientRect();
            // The nav is still off screen (hovering it mid-scroll, a stale scroll direction): fade out in place.
            if (m.bottom <= 0 || !m.width) {
              landed = false;
              gsap.to(logo, { opacity: 0, duration: 0.3 });
              return;
            }
            const unit = m.width / VIEW.size;
            const tx = m.left + (HEX.x - VIEW.x + HEX.w / 2) * unit;
            const ty = m.top + (HEX.y - VIEW.y + HEX.h / 2) * unit;
            gsap.to(logo, {
              x: tx - cx,
              y: ty - cy,
              scale: (HEX.h * unit) / h,
              duration: 0.6,
              ease: "expo.inOut",
            });
          }, 0.95);
          tl.set(logo, { opacity: 0 }, 1.55)
            .call(() => (landed ? play("land") : undefined), undefined, 1.55)
            .fromTo(mark, { opacity: 1, scale: 1.4 }, { scale: 1, duration: 0.45, ease: "back.out(3)" }, 1.55)
            .set(mark, { clearProps: "opacity,scale,transform" }, 2.0);
        } else {
          tl.to(logo, { opacity: 0, duration: 0.3 }, 1.1);
        }
      });

      // Frame-accurate cues: requestVideoFrameCallback reports the presented frame's media time.
      // Window mode stops cueing once the visitor seeks past the cut; theatre has no seek bar, so a late frame (a
      // hidden tab pauses rVFC) or the film simply ending still lands the end card.
      const stopFrames = watchFrames(video, (time) => {
        if (phase === "play" && time >= OPEN_AT && time < CUT) blowOpen();
        if ((phase === "play" || phase === "open") && time >= CUT && (theatre || time < CUT + 0.6)) handoff();
      });
      const ended = () => {
        if (phase === "play" || phase === "open") handoff();
      };

      // Theatre: scroll intent hands the film back, and is swallowed until it's gone (no Overlay, so no Radix scroll
      // lock): the page stays exactly where the film left it and the next scroll scrolls. Space on a focused
      // button is that button's. Esc is caught here too, ahead of the ident's any-key skip (registered later), so
      // leaving during the ident never rolls the film first; Radix's own Esc then finds us already leaving.
      const stir = (event: Event) => {
        if (event instanceof KeyboardEvent) {
          if (event.key === "Escape") return leave();
          if (!SCROLL_KEYS.has(event.key)) return;
          if (event.key === " " && event.target instanceof Element && event.target.closest("button")) return;
        }
        if (event.cancelable) event.preventDefault();
        leave();
      };
      const opts = { passive: false, capture: true } as const;
      if (theatre) {
        exitRef.current = leave;
        window.addEventListener("wheel", stir, opts);
        window.addEventListener("touchmove", stir, opts);
        window.addEventListener("keydown", stir, true);
        window.addEventListener("resize", refit);
        video.addEventListener("ended", ended);
      }

      return () => {
        phase = "exit"; // an ident killed below must not start the film
        stopFrames();
        ident?.kill();
        if (!theatre) return;
        exitRef.current = null;
        window.removeEventListener("wheel", stir, opts);
        window.removeEventListener("touchmove", stir, opts);
        window.removeEventListener("keydown", stir, true);
        window.removeEventListener("resize", refit);
        video.removeEventListener("ended", ended);
        setTheatre(false);
        resumeReel();
      };
    },
    { scope: root, dependencies: [motionEnabled, theatre] },
  );

  // Sound blocked by the autoplay policy: the next tap or (non-scroll) key anywhere turns it on.
  useEffect(() => {
    if (!blocked) return;
    const poke = (event: Event) => {
      if (event instanceof KeyboardEvent && (SCROLL_KEYS.has(event.key) || event.key === "Escape" || event.key === "Tab")) return;
      unmute(videoRef.current);
    };
    window.addEventListener("pointerdown", poke, true);
    window.addEventListener("keydown", poke, true);
    return () => {
      window.removeEventListener("pointerdown", poke, true);
      window.removeEventListener("keydown", poke, true);
    };
  }, [blocked]);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0">
      {/* Black stage behind the window: fades in on blow-open (theatre: on the grow), then becomes the iris. */}
      <div data-stage aria-hidden className="absolute inset-0 bg-black opacity-0" />

      <svg
        data-film-lines
        aria-hidden
        viewBox="-900 -900 1800 1800"
        className="fixed left-0 top-0 size-0 fill-none stroke-cream opacity-0"
        strokeWidth={1}
        strokeOpacity={0.45}
      >
        {GROUPS.flat().map((d) => (
          <path key={d} d={d} pathLength={1} vectorEffect="non-scaling-stroke" strokeDasharray={1} strokeDashoffset={1} />
        ))}
      </svg>

      {/* Centred by grid, not translate(-50%): GSAP owns this element's transform for the blow-open / FLIP. */}
      <div className="absolute inset-0 grid place-items-center">
      <div
        data-win
        className={cn(
          "pointer-events-auto w-[min(92vw,1100px,calc((100svh-8rem)*16/9))]",
          !theatre && "animate-in fade-in-0 zoom-in-95 duration-200 ease-riot motion-reduce:animate-none motion-off:animate-none",
        )}
      >
        <div data-chrome className={cn("mb-3 flex justify-end", theatre && "invisible")}>
          <Dialog.Close className={CLOSE}>Close ✕</Dialog.Close>
        </div>
        <Window
          data-frame=""
          bar="orange"
          // Black ground: when the title bar fades on blow-open, nothing light shows where it was. Theatre: the
          // reel's ink tokens, so the frame it lands back on is the reel's own.
          className={cn("bg-black", theatre && "[--line:var(--cream)] [--shadow-color:var(--cream)]")}
          bodyClassName="relative p-0"
          title={
            <Dialog.Title asChild>
              <span>{title}</span>
            </Dialog.Title>
          }
        >
          <video
            ref={videoRef}
            src={src}
            poster={theatre ? undefined : poster}
            autoPlay={!theatre}
            controls={!theatre}
            playsInline
            // Theatre: the dwell is intent; buffer through the grow + ident.
            preload={theatre ? "auto" : "metadata"}
            onVolumeChange={(event) => {
              if (!event.currentTarget.muted) setBlocked(false);
            }}
            className="block aspect-video w-full bg-black"
          />
          {theatre ? <canvas data-still aria-hidden width={960} height={540} className="absolute inset-0 size-full" /> : null}
        </Window>
      </div>
      </div>

      {/* The end-card logo, rebuilt: fill = hexagon with the four cut-outs masked away (so the hero shows through
          them after the iris), outline + loose white pieces for the blueprint beat. */}
      <svg
        data-logo
        aria-hidden
        viewBox={`${HEX.x} ${HEX.y} ${HEX.w} ${HEX.h}`}
        className="fixed left-0 top-0 size-0 overflow-visible opacity-0"
      >
        <defs>
          <clipPath id={`${maskId}-wipe`}>
            <rect data-wipe x={HEX.x} y={HEX.y} width={HEX.w} height={HEX.h} />
          </clipPath>
          <mask id={maskId} maskUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.size} height={VIEW.size}>
            <path d={LOGO_HEX} fill="white" />
            {LOGO_PIECES.map((piece) => (
              <path key={piece.d} data-piece d={piece.d} fill="black" />
            ))}
          </mask>
        </defs>
        <g data-hex-fill clipPath={`url(#${maskId}-wipe)`}>
          <path d={LOGO_HEX} fill="#faf8f5" mask={`url(#${maskId})`} />
        </g>
        <path
          data-hex-line
          d={LOGO_HEX}
          fill="none"
          stroke="#fee9cf"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          opacity={0}
        />
        <g data-float opacity={0} fill="#faf8f5">
          {LOGO_PIECES.map((piece) => (
            <path key={piece.d} data-piece d={piece.d} />
          ))}
        </g>
      </svg>

      {/* Theatre controls, over the ident (z-40): shown while the film rolls. */}
      {theatre ? (
        <div
          className={cn(
            "pointer-events-auto absolute right-4 top-4 z-50 flex items-center gap-4 transition-[opacity,visibility] duration-500 motion-reduce:transition-none md:right-5 md:top-5",
            !live && "invisible opacity-0",
          )}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper/75">Scroll to return</span>
          <button type="button" onClick={() => exitRef.current?.()} className={CLOSE}>
            Close <span className="text-burgundy">[Esc]</span>
          </button>
        </div>
      ) : null}
      {theatre && live && blocked ? (
        <div className="pointer-events-none absolute inset-0 z-50 grid place-items-center">
          <Button
            variant="orange"
            size="lg"
            aria-label="Turn the sound on"
            onClick={() => unmute(videoRef.current)}
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
    </div>
  );
}

"use client";

/*
 * FilmPlayer — the homepage "Watch film" player with the trailer's end-card handoff.
 *
 * The trailer ends with the character throwing the cube at the lens and a hard cut to a black end card whose flat
 * logo is public/logo.svg. We ride that cut into the site:
 *   1. blow-open (OPEN_AT → CUT): the window scales up to fill the screen as the cube rushes the lens; chrome fades.
 *   2. swap (the CUT frame, via requestVideoFrameCallback): a real SVG logo lands pixel-exact on the video's logo;
 *      the video keeps playing hidden so its sound sting finishes.
 *   3. blueprint: the logo's cut-out pieces misregister, its fill wipes away to an outline, and the cube construction
 *      lines (the /about opener's drawing) draw out of it across the black.
 *   4. iris: the black stage opens through a hexagonal hole grown from the logo, onto the hero (scrolled to top while
 *      covered), whose wordmark rises again; the logo reassembles and flies into the nav's cube mark, which pops.
 * Reduced motion / motion toggle off: a plain player, no handoff. Esc / Close / backdrop still close at any point.
 */

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { useExperience } from "@/components/experience-provider";
import { Window } from "@/components/riot/window";
import { LOGO_HEX, LOGO_PIECES } from "@/components/chrome/intro/data";
import { GROUPS } from "@/components/edition/edition-opener";

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

type FilmPlayerProps = {
  src: string;
  poster?: string;
  title: string;
  /** Trigger element (rendered via asChild). */
  children: ReactNode;
};

export function FilmPlayer({ src, poster, title, children }: FilmPlayerProps) {
  const [open, setOpen] = useState(false);
  const morphed = useRef(false);

  const onOpenChange = (next: boolean) => {
    if (next) morphed.current = false;
    setOpen(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          data-film-overlay=""
          className="fixed inset-0 z-[200] bg-ink/85 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none"
        />
        <Dialog.Content
          data-lenis-prevent
          aria-describedby={undefined}
          // After the handoff the page sits at the hero: keep it there and put focus on the hero's film button.
          onCloseAutoFocus={(event) => {
            if (!morphed.current) return;
            event.preventDefault();
            document.querySelector<HTMLElement>("[data-film-home]")?.focus({ preventScroll: true });
          }}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[201] outline-none"
        >
          <FilmStage
            src={src}
            poster={poster}
            title={title}
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

type FilmStageProps = Omit<FilmPlayerProps, "children"> & { onHandoff: () => void; onDone: () => void };

function FilmStage({ src, poster, title, onHandoff, onDone }: FilmStageProps) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { motionEnabled, lenis } = useExperience();
  const maskId = `film-logo-${useId().replace(/:/g, "")}`;

  const toTop = useCallback(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [lenis]);

  useGSAP(
    (_, contextSafe) => {
      const video = videoRef.current;
      const scope = root.current;
      if (!motionEnabled || !video || !scope || !contextSafe) return;
      const q = gsap.utils.selector(scope);
      const [win] = q("[data-win]");
      const [stage] = q("[data-stage]");
      const [logo] = q<SVGSVGElement>("[data-logo]");
      const [lines] = q<SVGSVGElement>("[data-film-lines]");
      if (!win || !stage || !logo || !lines) return;

      let phase: "play" | "open" | "handoff" = "play";
      let frameHandle = 0;
      let opening: gsap.core.Timeline | undefined;

      // 1. blow-open: scale the window about the video's centre until the video fills the screen.
      const blowOpen = contextSafe(() => {
        phase = "open";
        video.controls = false;
        const v = video.getBoundingClientRect();
        const w = win.getBoundingClientRect();
        const scale = Math.min(window.innerWidth / v.width, window.innerHeight / v.height);
        gsap.set(win, { transformOrigin: `${v.left + v.width / 2 - w.left}px ${v.top + v.height / 2 - w.top}px` });
        opening = gsap
          .timeline({ defaults: { ease: "power2.in" } })
          .to([...q("[data-chrome]"), ...q("[data-frame] > div:first-child")], { opacity: 0, duration: 0.15 }, 0)
          .to(stage, { opacity: 1, duration: 0.25 }, 0)
          .to(
            win,
            {
              x: window.innerWidth / 2 - (v.left + v.width / 2),
              y: window.innerHeight / 2 - (v.top + v.height / 2),
              scale,
              duration: Math.max(0.12, CUT - video.currentTime),
            },
            0,
          );
      });

      // 2-4. swap onto the SVG logo at the cut, then blueprint → iris → landing.
      const handoff = contextSafe(() => {
        phase = "handoff";
        onHandoff();
        video.controls = false;
        opening?.progress(1); // measure the settled, full-screen video (also covers a seek past the cue)
        gsap.set([...q("[data-chrome]"), ...q("[data-frame] > div:first-child")], { opacity: 0 });
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
        toTop(); // the page is fully covered: land the reveal on the hero

        const pieces = q("[data-piece]");
        const offset = (scale: number) => ({
          x: (i: number) => LOGO_PIECES[i % LOGO_PIECES.length].from.x * scale,
          y: (i: number) => LOGO_PIECES[i % LOGO_PIECES.length].from.y * scale,
        });
        const far = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));
        const hole = { r: radius };
        const mark = document.querySelector<HTMLElement>(".bnb-nav .bnb-cube");

        const tl = gsap.timeline({ onComplete: onDone });
        // 3. blueprint
        tl.to(q("[data-film-lines] path"), { strokeDashoffset: 0, duration: 0.55, stagger: 0.05, ease: "power2.out" }, 0)
          .to(pieces, { ...offset(2.4), duration: 0.12, ease: "steps(2)" }, 0)
          .to(q("[data-hex-line]"), { opacity: 1, duration: 0.18, ease: "steps(3)" }, 0.12)
          .to(q("[data-float]"), { opacity: 1, duration: 0.18, ease: "steps(3)" }, 0.14)
          .to(q("[data-wipe]"), { y: HEX.h, duration: 0.3, ease: "steps(6)" }, 0.14)
          // 4. iris onto the hero; the wordmark rises again behind it
          .set(document.querySelectorAll("[data-film-overlay]"), { opacity: 0 }, 0.5)
          .call(
            () => {
              window.dispatchEvent(new Event("bnb:hero-replay"));
            },
            undefined,
            0.5,
          )
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
          tl.set(mark, { opacity: 0 }, 0.9).add(() => {
            const m = mark.getBoundingClientRect();
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
            .fromTo(mark, { opacity: 1, scale: 1.4 }, { scale: 1, duration: 0.45, ease: "back.out(3)" }, 1.55)
            .set(mark, { clearProps: "opacity,scale,transform" }, 2.0);
        } else {
          tl.to(logo, { opacity: 0, duration: 0.3 }, 1.1);
        }
      });

      // Frame-accurate cues: requestVideoFrameCallback reports the presented frame's media time.
      const onFrame = (time: number) => {
        if (phase === "play" && time >= OPEN_AT && time < CUT) blowOpen();
        if (phase !== "handoff" && time >= CUT && time < CUT + 0.6) handoff();
      };
      const rvfc = "requestVideoFrameCallback" in video;
      const tick = (_now?: number, meta?: VideoFrameCallbackMetadata) => {
        onFrame(meta?.mediaTime ?? video.currentTime);
        if (phase === "handoff") return;
        frameHandle = rvfc
          ? video.requestVideoFrameCallback(tick)
          : requestAnimationFrame(() => tick());
      };
      tick();
      return () => {
        if (rvfc) video.cancelVideoFrameCallback(frameHandle);
        else cancelAnimationFrame(frameHandle);
      };
    },
    { scope: root, dependencies: [motionEnabled] },
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0">
      {/* Black stage behind the window: fades in on blow-open, then becomes the iris. */}
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

      {/* Centred by grid, not translate(-50%): GSAP owns this element's transform for the blow-open. */}
      <div className="absolute inset-0 grid place-items-center">
      <div
        data-win
        className="pointer-events-auto w-[min(92vw,1100px,calc((100svh-8rem)*16/9))] animate-in fade-in-0 zoom-in-95 duration-200 ease-riot motion-reduce:animate-none"
      >
        <div data-chrome className="mb-3 flex justify-end">
          <Dialog.Close className="cursor-pointer border-3 border-ink bg-paper px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[3px_3px_0_0_var(--orange)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--orange)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
            Close ✕
          </Dialog.Close>
        </div>
        <Window
          data-frame=""
          bar="orange"
          // Black ground: when the title bar fades on blow-open, nothing light shows where it was.
          className="bg-black"
          bodyClassName="p-0"
          title={
            <Dialog.Title asChild>
              <span>{title}</span>
            </Dialog.Title>
          }
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            controls
            playsInline
            preload="metadata"
            className="block aspect-video w-full bg-black"
          />
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
    </div>
  );
}

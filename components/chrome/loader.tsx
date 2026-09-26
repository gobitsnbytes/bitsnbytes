"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Wordmark } from "./wordmark";
import { LOGO_HEX, LOGO_PIECES, LOGO_VIEWBOX, TICKER_PATHS } from "./intro/data";
import "./intro/intro.css";

gsap.registerPlugin(useGSAP);

const SEEN_KEY = "bnb-loader-seen";
/** Page times (performance.now, ms): the panel is on screen from first paint, so budgets count from there. */
const HARD_CAP = 3500;
/** Length of the assembly timeline below (the cut is scheduled at this point). */
const ASSEMBLY_MS = 1450;
/** Time the rule needs to run out to 100% once loading is forced. */
const SLACK = 250;
/** Loading is forced to 100% by here so the assembly still lands before the hard cap. */
const LOAD_CAP = HARD_CAP - ASSEMBLY_MS - SLACK;
/** Late hydration speeds the assembly up to fit the cap, down to this much time; below it the intro is dropped. */
const MIN_ASSEMBLY_MS = 700;
/** Fastest the rule may fill, so a warm cache still reads as loading. */
const MIN_FILL_MS = 700;
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

// Runs during HTML parse, before the panel paints: only a first visit per session (motion allowed)
// ever shows the intro, so repeat visits never flash it.
const INIT = `try{var d=document.documentElement;if(!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&localStorage.getItem("bnb-immersive-motion")!=="off")d.dataset.loader="on"}catch(e){}`;

function markReady() {
  document.documentElement.dataset.loaded = "true";
  window.dispatchEvent(new CustomEvent("bnb:ready"));
}

/** kprverse title flicker: opacity jumps to random 0/1 every 50ms, landing on 1. */
const flicker = (steps: number) =>
  Array.from({ length: steps }, (_, i) => ({
    opacity: i === steps - 1 ? 1 : Math.round(Math.random()),
    duration: 0.05,
    ease: "steps(1)",
  }));

/**
 * First-visit intro (kprverse preloader + logo assembly). A paper panel with a hairline progress rule,
 * `LOADING - NN%` and a ticker of real repo paths; progress follows real readiness (hydration, fonts,
 * window load, first idle) and never goes backwards. Then the cube mark assembles (outline, stepped
 * fill, the four cut-outs flickering into place, the wordmark typing in) and hard-cuts to the page,
 * which rendered underneath all along. Click or any key skips; hard cap 3.5s. On exit (or at once
 * when it doesn't show) it sets html[data-loaded="true"] and dispatches "bnb:ready".
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // storage blocked: the intro simply shows again next visit
      }

      const root = ref.current;
      const t0 = performance.now();
      // Slow hydration: keep a short beat of loading, then fit the assembly into what's left of the cap.
      const loadCap = Math.max(LOAD_CAP, t0 + 250);
      const budget = HARD_CAP - SLACK - loadCap;
      // Not shown, or hydrated too late for the assembly to land before the hard cap.
      if (html.dataset.loader !== "on" || !root || budget < MIN_ASSEMBLY_MS) {
        delete html.dataset.loader;
        markReady();
        return;
      }

      const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
      const loading = $("[data-loading]");
      const fill = $("[data-fill]");
      const pct = $("[data-pct]");
      const file = $("[data-file]");
      const ring = $("[data-ring]");
      const mark = $("[data-mark]");
      const hexLine = $<SVGSVGElement>("[data-hex-line]");
      const hexFill = $<SVGSVGElement>("[data-hex-fill]");
      const word = $("[data-word]");
      const pieces = root.querySelectorAll<SVGPathElement>("[data-piece]");

      let over = false;
      const cut = () => {
        if (over) return;
        over = true;
        stop();
        tl.kill();
        delete html.dataset.loader;
        markReady();
      };

      // Assembly, built paused so every piece starts hidden/offset.
      gsap.set(hexLine, { opacity: 0 });
      gsap.set(hexFill, { clipPath: "inset(0% 0% 100% 0%)" });
      pieces.forEach((el, i) => gsap.set(el, { opacity: 0, ...LOGO_PIECES[i].from }));
      gsap.set(word, { clipPath: "inset(-30% 100% -50% 0%)" });

      const tl = gsap.timeline({ paused: true }).timeScale(Math.max(1, ASSEMBLY_MS / budget));
      tl.to(loading, { opacity: 0, duration: 0.1, ease: "none" })
        .set(mark, { opacity: 1 })
        .to(hexLine, { keyframes: flicker(3) }, 0.1)
        .to(hexFill, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "steps(6)" }, 0.22);
      pieces.forEach((el, i) => {
        const at = 0.55 + i * 0.13;
        tl.to(el, { keyframes: flicker(4) }, at).to(el, { x: 0, y: 0, duration: 0.2, ease: "steps(1)" }, at);
      });
      tl.to(word, { clipPath: "inset(-30% 0% -50% 0%)", duration: 0.3, ease: "steps(11)" }, 0.95).call(
        cut,
        undefined,
        ASSEMBLY_MS / 1000,
      );

      // Staged, monotonic readiness: hydration 10, fonts 30, window load 35, first idle after load 25.
      let target = 10;
      const stage = (weight: number) => {
        let hit = false;
        return () => {
          if (!hit) {
            hit = true;
            target += weight;
          }
        };
      };
      const onFonts = stage(30);
      const onIdle = stage(25);
      const onLoad = stage(35);
      const afterLoad = () => {
        onLoad();
        // The page is covered for the rest of the intro: warm the homepage's late assets (3D cube chunk, film
        // still) now, after window load so they never hold it back, instead of letting them pop in after the cut.
        if (window.location.pathname === "/") {
          import("@/components/home/logo-cube-scene").catch(() => {});
          new Image().src = "/movie/bnb-trailer-poster.jpg";
        }
        if ("requestIdleCallback" in window) requestIdleCallback(onIdle, { timeout: 300 });
        else setTimeout(onIdle, 100);
      };
      if (document.fonts) document.fonts.ready.then(onFonts, onFonts);
      else onFonts();
      if (document.readyState === "complete") afterLoad();
      else window.addEventListener("load", afterLoad, { once: true });

      let shown = 0;
      let painted = -1;
      let assembling = false;
      let last = t0;
      let fileIndex = 0;
      let nextFile = t0 + 150 + Math.random() * 250;
      // Cursor ring: lerp .4 toward the pointer (pointer:fine only; CSS parks it otherwise).
      const fine = matchMedia("(pointer: fine)").matches;
      let rx = 0;
      let ry = 0;
      let tx = 0;
      let ty = 0;
      let moved = false;

      const tick = () => {
        const now = performance.now();
        const dt = now - last;
        last = now;
        if (!assembling) {
          if (now >= loadCap) target = 100;
          const rate = ((now >= loadCap ? 4 : 1) * 100) / MIN_FILL_MS;
          const gap = target - shown;
          shown += Math.min(gap, Math.max(gap * 0.2, 0.4), rate * dt);
          fill.style.transform = `scaleX(${shown / 100})`;
          const n = Math.floor(shown);
          if (n !== painted) {
            painted = n;
            pct.textContent = String(n).padStart(2, "0");
          }
          if (now >= nextFile) {
            fileIndex = (fileIndex + 1) % TICKER_PATHS.length;
            file.textContent = TICKER_PATHS[fileIndex];
            nextFile = now + 150 + Math.random() * 250;
          }
          if (shown >= 100) {
            assembling = true;
            tl.play();
          }
        }
        if (moved) {
          rx += (tx - rx) * 0.4;
          ry += (ty - ry) * 0.4;
          ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
        }
      };

      const onMove = (event: PointerEvent) => {
        if (!moved) {
          moved = true;
          const box = ring.getBoundingClientRect();
          rx = box.left + box.width / 2;
          ry = box.top + box.height / 2;
        }
        tx = event.clientX;
        ty = event.clientY;
      };
      // No scroll under the intro: swallow wheel/touch before Lenis (bubble-phase window listener) or the page sees them.
      const block = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
      };
      const onKey = (event: KeyboardEvent) => {
        if (SCROLL_KEYS.has(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) event.preventDefault();
        cut();
      };
      const blockOpts = { capture: true, passive: false } as const;

      gsap.ticker.add(tick);
      if (fine) window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("wheel", block, blockOpts);
      window.addEventListener("touchmove", block, blockOpts);
      window.addEventListener("keydown", onKey, true);
      root.addEventListener("click", cut);
      const capTimer = window.setTimeout(cut, HARD_CAP - t0);

      function stop() {
        gsap.ticker.remove(tick);
        window.clearTimeout(capTimer);
        window.removeEventListener("load", afterLoad);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("wheel", block, blockOpts);
        window.removeEventListener("touchmove", block, blockOpts);
        window.removeEventListener("keydown", onKey, true);
        root?.removeEventListener("click", cut);
      }

      return stop;
    },
    { scope: ref },
  );

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INIT }} suppressHydrationWarning />
      <div
        ref={ref}
        aria-hidden
        className="bnb-intro fixed inset-0 z-[1000] select-none place-items-center overflow-hidden bg-paper text-ink"
      >
        <div data-loading className="w-[18rem] md:w-[54vw]">
          <div className="relative h-px bg-ink/10">
            <div data-fill className="absolute inset-0 origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-6 font-mono text-[11px] uppercase leading-none">
            <p className="flex items-center gap-2">
              <svg viewBox="0 0 6 7" className="h-[7px] w-[6px] fill-current">
                <path d="M0 0 6 3.5 0 7Z" />
              </svg>
              <span>
                Loading - <span data-pct>00</span>%
              </span>
            </p>
            <p data-file className="hidden truncate text-ink/70 md:block">
              {TICKER_PATHS[0]}
            </p>
          </div>
        </div>

        <div data-mark className="bnb-intro-mark flex flex-col items-center gap-[min(3vh,3vw)]">
          <div className="relative size-[min(42vh,46vw)]">
            <svg data-hex-line viewBox={LOGO_VIEWBOX} className="absolute inset-0 size-full overflow-visible">
              <path d={LOGO_HEX} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <svg data-hex-fill viewBox={LOGO_VIEWBOX} className="absolute inset-0 size-full fill-current">
              <path d={LOGO_HEX} />
            </svg>
            <svg viewBox={LOGO_VIEWBOX} className="absolute inset-0 size-full fill-paper">
              {LOGO_PIECES.map((piece) => (
                <path key={piece.d} data-piece d={piece.d} />
              ))}
            </svg>
          </div>
          <div data-word>
            <Wordmark className="text-[min(7vh,7vw)]" />
          </div>
        </div>

        <div
          data-ring
          className="bnb-intro-ring pointer-events-none flex size-[88px] items-center justify-center rounded-full border border-ink text-center font-mono text-[10px] uppercase leading-[1.3] tracking-[0.12em]"
        >
          Click
          <br />
          to skip
        </div>
      </div>
    </>
  );
}

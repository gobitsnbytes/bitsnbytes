"use client";

import { useEffect, useRef } from "react";
import { STAR_PATH } from "./wordmark";

const SEEN_KEY = "bnb-loader-seen";
const CAP_MS = 800;
const EXIT_MS = 900;

// Runs during HTML parse, before the overlay paints: only a first visit per session (motion allowed)
// ever shows the curtain, so repeat visits never flash ink.
const INIT = `try{var d=document.documentElement;if(!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&localStorage.getItem("bnb-immersive-motion")!=="off")d.dataset.loader="on"}catch(e){}`;

function markReady() {
  document.documentElement.dataset.loaded = "true";
  window.dispatchEvent(new CustomEvent("bnb:ready"));
}

/**
 * First-visit loader (buttermax glyph + inkfish yank). The page renders underneath from the first
 * paint, so LCP text never waits on it. Progress follows real readiness (document.fonts.ready or
 * window load, whichever first) with a hard 800ms cap. On exit it sets html[data-loaded="true"] and
 * dispatches "bnb:ready"; when it doesn't show, it does both immediately.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // storage blocked: the loader simply shows again next visit
    }

    const node = ref.current;
    const pct = pctRef.current;
    const bar = barRef.current;
    // Not shown, or hydrated so late that the CSS failsafe (2.4s) already hid the curtain.
    if (html.dataset.loader !== "on" || !node || !pct || !bar || performance.now() > 2400) {
      delete html.dataset.loader;
      markReady();
      return;
    }

    let raf = 0;
    let ready = false;
    let exiting = false;
    let shown = 0;
    let exitTimer = 0;
    const start = performance.now();
    const onReady = () => {
      ready = true;
    };

    const paint = (value: number) => {
      pct.textContent = `${String(Math.floor(value)).padStart(2, "0")}%`;
      bar.style.transform = `scaleX(${value / 100})`;
    };

    const exit = () => {
      if (exiting) return;
      exiting = true;
      cancelAnimationFrame(raf);
      paint(100);
      node.dataset.state = "exit";
      markReady();
      exitTimer = window.setTimeout(() => delete html.dataset.loader, EXIT_MS);
    };

    const tick = (now: number) => {
      // ease toward 90% while waiting, then run to 100 once ready
      const target = ready ? 100 : 90 * (1 - Math.exp(-(now - start) / 260));
      shown += (target - shown) * 0.22;
      if (ready && shown > 99.4) return exit();
      paint(Math.min(shown, 99));
      raf = requestAnimationFrame(tick);
    };

    document.fonts?.ready.then(onReady, onReady);
    if (document.readyState === "complete") onReady();
    else window.addEventListener("load", onReady, { once: true });
    const capTimer = window.setTimeout(exit, CAP_MS);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(capTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", onReady);
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INIT }} suppressHydrationWarning />
      <div
        ref={ref}
        aria-hidden
        className="bnb-loader fixed inset-0 z-[1000] items-center justify-center bg-ink text-paper"
      >
        <div className="bnb-loader-inner flex flex-col items-center gap-7">
          <svg viewBox="0 0 100 100" className="bnb-breathe size-20 text-orange md:size-28">
            <path d={STAR_PATH} fill="currentColor" />
          </svg>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em]">
            Loading [<span ref={pctRef}>00%</span>]
          </p>
        </div>
        <div
          ref={barRef}
          className="absolute inset-x-0 bottom-0 h-1 origin-left bg-orange"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </>
  );
}

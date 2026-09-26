"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useExperience } from "@/components/experience-provider";
import { cn } from "@/lib/utils";
import { ROUTES } from "../links";

gsap.registerPlugin(useGSAP);

const COLS = 10;
const ROWS = 7;
/** Seconds per mountain step (bottom-centre first, top corners last). */
const STEP = 0.03;
/** ± seconds of seeded jitter per tile. */
const JITTER = 0.05;
/** Per tile. Cover lands by ~0.57s (6 + 4.5 steps + jitter + duration). */
const DURATION = 0.2;
/** power3.out is easeOutQuart, i.e. inkfish's cubic-bezier(.165,.84,.44,1). */
const EASE = "power3.out";
/** A push that never commits (redirect back to this path, error) must not leave the page covered. */
const FAILSAFE_MS = 8000;

/** Route handlers (and /logo) need a real document load. */
const SKIP = new Set(["/logo", ...ROUTES.filter((route) => route.handler).map((route) => route.href)]);

// Deterministic hash in [0, 1) (murmur3 finaliser): server and client render the same grid, no
// Math.random at render.
const seeded = (n: number) => {
  let x = Math.imul(n, 0x9e3779b1);
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 2 ** 32;
};

const TILES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const tone = seeded(i + 211);
  return {
    delay: Math.max(0, (ROWS - 1 - row + Math.abs(col - (COLS - 1) / 2)) * STEP + (seeded(i + 1) - 0.5) * 2 * JITTER),
    fill: tone < 0.1 ? "bg-ink" : tone < 0.22 ? "bg-burgundy halftone-orange" : "bg-burgundy",
  };
});
const stagger = (index: number) => TILES[index].delay;

/** Same-origin page href for a plain left click (not keyboard, not a new tab, not this page), else null. */
function transitionHref(event: MouseEvent) {
  if (event.button !== 0 || event.detail === 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  if (anchor.closest("[data-no-transition]")) return null;
  const url = new URL(anchor.href);
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return null;
  if (SKIP.has(url.pathname) || url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return null;
  return url.pathname + url.search + url.hash;
}

type Phase = "idle" | "cover" | "reveal";

/**
 * inkfish pixel-mountain route transition. A fixed 10x7 tile grid, a sibling overlay of the page
 * (never a wrapper, so no transform lands on page ancestors). Pointer left-clicks on internal links
 * are intercepted before next/link acts (prefetching is untouched): tiles rise from the bottom
 * centre, the route is pushed once covered, and on the new pathname they retract upward.
 * Back/forward only reveals. Keyboard activation, reduced motion and the motion toggle navigate
 * instantly.
 */
export function RouteTransition() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { lenis, motionEnabled } = useExperience();

  // Latest values for the window listeners, which are registered once.
  const live = useRef({ lenis, motionEnabled, router });
  useLayoutEffect(() => {
    live.current = { lenis, motionEnabled, router };
  });

  const phase = useRef<Phase>("idle");
  const lastPath = useRef(pathname);
  const toTop = useRef(true);
  const popped = useRef(false);
  const failsafe = useRef(0);

  const { contextSafe } = useGSAP({ scope: root });

  const setPhase = (next: Phase) => {
    phase.current = next;
    if (root.current) root.current.dataset.state = next;
  };

  const reveal = contextSafe(() => {
    window.clearTimeout(failsafe.current);
    const tiles = root.current?.children;
    if (!tiles) return;
    setPhase("reveal");
    gsap.set(tiles, { transformOrigin: "50% 0%" });
    gsap.to(tiles, {
      scaleY: 0,
      duration: DURATION,
      ease: EASE,
      stagger,
      delay: 0.05,
      overwrite: true,
      onComplete: () => {
        setPhase("idle");
        live.current.lenis?.start();
      },
    });
  });

  // app/loading.tsx marks its fallback: stay covered until the new page has replaced it (capped by the failsafe).
  const revealWhenPainted = () => {
    const start = performance.now();
    const wait = () => {
      if (document.querySelector("[data-route-loading]") && performance.now() - start < FAILSAFE_MS) {
        requestAnimationFrame(wait);
      } else reveal();
    };
    wait();
  };

  const cover = contextSafe((href: string) => {
    const tiles = root.current?.children;
    if (!tiles) return;
    const { router } = live.current;
    router.prefetch(href);
    toTop.current = !href.includes("#");
    setPhase("cover");
    gsap.set(tiles, { transformOrigin: "50% 100%" });
    gsap.to(tiles, {
      scaleY: 1,
      duration: DURATION,
      ease: EASE,
      stagger,
      overwrite: true,
      onComplete: () => {
        // Stopped only once covered: Lenis' stop hides the scrollbar, which would shift the page.
        live.current.lenis?.stop();
        router.push(href);
        failsafe.current = window.setTimeout(reveal, FAILSAFE_MS);
      },
    });
  });

  useGSAP(
    () => {
      if (root.current) gsap.set(root.current.children, { scaleY: 0 });

      // Capture on window: runs before next/link's onClick, which then sees defaultPrevented and bails.
      const onClick = (event: MouseEvent) => {
        if (phase.current !== "idle" || !live.current.motionEnabled) return;
        const href = transitionHref(event);
        if (!href || !root.current) return;
        event.preventDefault();
        cover(href);
      };
      // Hash-only history steps keep the pathname, so they never arm a reveal.
      const onPopState = () => {
        popped.current = window.location.pathname !== lastPath.current;
      };

      window.addEventListener("click", onClick, true);
      window.addEventListener("popstate", onPopState);
      return () => {
        window.clearTimeout(failsafe.current);
        window.removeEventListener("click", onClick, true);
        window.removeEventListener("popstate", onPopState);
      };
    },
    { scope: root },
  );

  // Layout phase: tiles are in place before the new page's first paint.
  useGSAP(
    () => {
      if (lastPath.current === pathname) return;
      lastPath.current = pathname;
      const back = popped.current;
      popped.current = false;

      if (phase.current === "cover") {
        if (toTop.current) {
          const { lenis } = live.current;
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
          else window.scrollTo(0, 0);
        }
        revealWhenPainted();
      } else if (back && phase.current === "idle" && live.current.motionEnabled && root.current) {
        gsap.set(root.current.children, { scaleY: 1 });
        revealWhenPainted();
      }
    },
    { dependencies: [pathname] },
  );

  return (
    <div
      ref={root}
      aria-hidden
      data-state="idle"
      className="bnb-route fixed inset-0 z-[79] grid grid-cols-10 grid-rows-7"
    >
      {TILES.map((tile, i) => (
        <span key={i} className={cn("bnb-route-tile", tile.fill)} />
      ))}
    </div>
  );
}

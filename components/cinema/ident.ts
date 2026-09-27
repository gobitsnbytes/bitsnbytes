"use client";

import gsap from "gsap";

import { play } from "@/components/chrome/sound/engine";
import { LOGO_HEX, LOGO_PIECES, LOGO_VIEWBOX } from "@/components/chrome/intro/data";

/** Plate snaps in the ident; the "sting" cue lands its two hits on these (seconds from the call). */
export const IDENT_HITS = [0.3, 0.62] as const;
/** The film may start under the zoom-through from here. */
const HANDOFF = 1.15;
const END = 1.45;

const plate = (fill: string, id: string) =>
  `<g data-plate style="mix-blend-mode:screen"><path d="${LOGO_HEX}" fill="${fill}" mask="url(#${id})"/></g>`;

/**
 * The bits&bytes "ta-dum" (Netflix's N, ours): ~1.4 s on black before a film plays full screen. The cube's
 * outline draws, orange and burgundy riso plates land misregistered on the sting's first hit and snap into
 * register on the second (the cut-outs clicking home), a warm bloom, then the mark zooms through into the film.
 * Mounted into `host` (positioned); resolves `done` when the film should start. Click or any key skips it.
 * Motion off / reduced motion: resolves at once, nothing shown, no sting.
 */
export function playIdent(host: HTMLElement) {
  const html = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || html.dataset.immersiveMotion === "off") {
    return { done: Promise.resolve(), kill: () => {} };
  }

  const id = `ident-${Math.round(performance.now())}`;
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "pointer-events-auto absolute inset-0 z-40 grid place-items-center overflow-hidden bg-black";
  layer.innerHTML = `
    <div data-bloom class="absolute size-[70vmin] rounded-full opacity-0 [background:radial-gradient(closest-side,rgb(252_146_13/0.55),rgb(151_25_44/0.25)_55%,transparent)]"></div>
    <svg data-mark viewBox="${LOGO_VIEWBOX}" class="relative h-[max(22vh,120px)] w-auto overflow-visible">
      <defs>
        <mask id="${id}" maskUnits="userSpaceOnUse" x="28" y="54" width="146" height="146">
          <path d="${LOGO_HEX}" fill="white"/>
          ${LOGO_PIECES.map((p) => `<path data-piece d="${p.d}" fill="black"/>`).join("")}
        </mask>
      </defs>
      ${plate("#97192c", id)}${plate("#fc920d", id)}
      <g data-main><path d="${LOGO_HEX}" fill="#faf8f5" mask="url(#${id})"/></g>
      <path data-outline d="${LOGO_HEX}" pathLength="1" fill="none" stroke="#fee9cf" stroke-width="1.2"
        stroke-dasharray="1" stroke-dashoffset="1" vector-effect="non-scaling-stroke"/>
    </svg>`;
  host.append(layer);

  const q = gsap.utils.selector(layer);
  const [burgundy, orange] = q("[data-plate]");
  const pieces = q("[data-piece]");
  const [hit1, hit2] = IDENT_HITS;

  let resolve = () => {};
  const done = new Promise<void>((r) => (resolve = r));
  const finish = () => {
    resolve();
    tl.kill();
    layer.remove();
    window.removeEventListener("pointerdown", skip, true);
    window.removeEventListener("keydown", skip, true);
  };
  const skip = () => finish();

  play("sting");
  gsap.set([q("[data-main]"), burgundy, orange], { opacity: 0 });
  gsap.set(pieces, {
    x: (i: number) => LOGO_PIECES[i].from.x * 2.2,
    y: (i: number) => LOGO_PIECES[i].from.y * 2.2,
  });
  const tl = gsap
    .timeline()
    .to(q("[data-outline]"), { strokeDashoffset: 0, duration: hit1, ease: "power2.inOut" }, 0)
    // hit 1: the plates land misregistered
    .set(burgundy, { opacity: 1, x: -5, y: 3 }, hit1)
    .set(orange, { opacity: 1, x: 5, y: -3 }, hit1)
    .to(q("[data-main]"), { opacity: 1, duration: 0.12, ease: "steps(3)" }, hit1)
    // hit 2: into register, cut-outs home, bloom
    .to([burgundy, orange], { x: 0, y: 0, duration: 0.08, ease: "steps(2)" }, hit2)
    .to(pieces, { x: 0, y: 0, duration: 0.08, ease: "steps(2)" }, hit2)
    .to(q("[data-outline]"), { opacity: 0, duration: 0.2 }, hit2)
    .fromTo(q("[data-bloom]"), { scale: 0.5, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.3, ease: "power2.out" }, hit2)
    .to(q("[data-bloom]"), { opacity: 0, duration: 0.6, ease: "power1.in" }, hit2 + 0.3)
    .to(q("[data-mark]"), { scale: 1.04, duration: HANDOFF - hit2 - 0.1, ease: "sine.inOut" }, hit2)
    // zoom through into the film
    .to(q("[data-mark]"), { scale: 9, opacity: 0, duration: END - HANDOFF + 0.1, ease: "power3.in" }, HANDOFF - 0.1)
    .call(resolve, undefined, HANDOFF)
    .to(layer, { backgroundColor: "rgba(0,0,0,0)", duration: END - HANDOFF, ease: "none" }, HANDOFF)
    .call(finish, undefined, END);

  window.addEventListener("pointerdown", skip, true);
  window.addEventListener("keydown", skip, true);
  return { done, kill: finish };
}

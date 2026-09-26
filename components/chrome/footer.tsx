"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperience } from "@/components/experience-provider";
import { ScrambleText } from "@/components/riot/scramble-text";
import { FOOTER_COLUMNS, ROUTES, SOCIALS, TRUST_LINKS, pad } from "./links";
import { Wordmark } from "./wordmark";
import { LOGO_HEX, LOGO_PIECES, LOGO_VIEWBOX } from "./intro/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Geographic centre of India: we are pan-India, so no single city is "home".
const COORDS = "20.5937° N, 78.9629° E";

function ColumnHead({ children }: { children: ReactNode }) {
  return (
    <p className="mb-8 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
      <span aria-hidden className="size-2 shrink-0 bg-orange" />
      {children}
    </p>
  );
}

const linkClass =
  "underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-orange focus-visible:decoration-orange";

/**
 * Ink poster footer (buttermax + kprverse): a 4-column top row split by 2px paper rules, then a
 * full-bleed bits&bytes™ wordmark uncovered from a slot by a counter-translated mask scrub, with the
 * cube mark (public/logo.svg geometry, inline and opaque) locked into the "s" behind an ink knockout ring;
 * its pieces snap into register during the same scrub. Then the legal entity row.
 */
export function Footer() {
  const pathname = usePathname();
  const { motionEnabled } = useExperience();
  const rootRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  // Fit the wordmark edge to edge whatever face resolved (width axis, fallback fonts).
  useEffect(() => {
    const mark = markRef.current;
    const box = mark?.parentElement;
    if (!mark || !box) return;
    let lastWidth = 0;
    const fit = (force = false) => {
      const width = box.clientWidth;
      if (!width || (!force && width === lastWidth)) return;
      lastWidth = width;
      mark.style.fontSize = "";
      const size = parseFloat(getComputedStyle(mark).fontSize);
      mark.style.fontSize = `${(size * width * 0.97) / mark.scrollWidth}px`;
    };
    const observer = new ResizeObserver(() => fit());
    observer.observe(box);
    document.fonts?.ready.then(() => {
      fit(true);
      ScrollTrigger.refresh();
    });
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!motionEnabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline({
          scrollTrigger: { trigger: slotRef.current, start: "top bottom", end: "bottom bottom", scrub: true },
        })
        .fromTo(outerRef.current, { yPercent: 100 }, { yPercent: 0, ease: "none" }, 0)
        .fromTo(innerRef.current, { yPercent: -100 }, { yPercent: 0, ease: "none" }, 0)
        // Cube: the hexagon turns in from a tilted, slightly smaller print, then each cut-out piece snaps back
        // into register from its misregistered offset (the loader's assembly, scrubbed).
        .fromTo("[data-cube]", { rotate: -18, scale: 0.9 }, { rotate: 0, scale: 1, ease: "power2.out" }, 0.1)
        .fromTo(
          "[data-cube-piece]",
          { opacity: 0, x: (i: number) => LOGO_PIECES[i].from.x * 3, y: (i: number) => LOGO_PIECES[i].from.y * 3 },
          { opacity: 1, x: 0, y: 0, stagger: 0.08, ease: "power3.out" },
          0.35,
        );
    },
    { scope: rootRef, dependencies: [motionEnabled, pathname], revertOnUpdate: true },
  );

  return (
    <footer
      ref={rootRef}
      id="footer"
      data-surface="ink"
      className="tone-ink relative overflow-x-clip border-t-2 border-paper font-mono text-paper"
    >
      {/* Top row: gap-[2px] over a paper backdrop draws the 2px rules between columns. */}
      <div className="grid gap-[2px] bg-paper sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-ink px-5 pb-10 pt-8 md:px-8">
          <ColumnHead>Console</ColumnHead>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.08em]">
            bits&amp;bytes™ <span className="text-orange">· Teen-led</span>
          </p>
          <p className="mb-8 max-w-sm font-serif text-[15px] leading-relaxed text-paper/80">
            India&apos;s independent, teen-led builder network. Connecting the country&apos;s most ambitious teenage
            developers and designers to ship software from scratch.
          </p>
          <ul className="mb-8 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] leading-snug text-paper/70">
            {ROUTES.map((route, i) => {
              const content = (
                <>
                  <span aria-hidden className="text-paper/40">
                    {pad(i + 1)}{" "}
                  </span>
                  {route.href}
                </>
              );
              return (
                <li key={route.href}>
                  {route.handler ? (
                    <a href={route.href} className={`${linkClass} hover:text-paper`}>
                      {content}
                    </a>
                  ) : (
                    <Link href={route.href} className={`${linkClass} hover:text-paper`}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <ScrambleText
            as="p"
            text={COORDS}
            trigger="inview"
            className="block text-[12px] font-bold uppercase tracking-[0.14em] text-orange"
          />
          <p className="mt-2 text-[12px] uppercase tracking-[0.1em] text-paper/80">Pan-India</p>
        </div>

        <nav aria-label="Footer" className="bg-ink px-5 pb-10 pt-8 md:px-8">
          <ColumnHead>Index</ColumnHead>
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h2 className="mb-3 border-b border-paper/20 pb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-paper/70">
                  {column.title}
                </h2>
                <ul className="space-y-1.5 text-[13px] font-bold">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="bg-ink px-5 pb-10 pt-8 [--wipe-fill:var(--paper)] [--wipe-ink:var(--ink)] md:px-8">
          <ColumnHead>Social</ColumnHead>
          <ul className="flex flex-wrap gap-2">
            {SOCIALS.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noreferrer" className="bnb-btn">
                  {social.label}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-ink px-5 pb-10 pt-8 md:px-8">
          <ColumnHead>Contact</ColumnHead>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-paper/70">Connect</p>
          <a
            href="mailto:hello@gobitsnbytes.org"
            className="mb-8 inline-block break-all text-lg font-bold text-paper underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
          >
            hello@gobitsnbytes.org
          </a>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-paper/70">Trust Center</p>
          <p className="mb-4 max-w-sm font-serif text-[15px] leading-relaxed text-paper/80">
            The public rules for a teen-led network: safety, privacy, brand stewardship, and participation standards.
          </p>
          <ul className="border-t border-paper/20">
            {TRUST_LINKS.map((link) => (
              <li key={link.href} className="border-b border-paper/20">
                <Link href={link.href} className="group flex items-baseline justify-between gap-3 py-2">
                  <span>
                    <span className="block text-[13px] font-bold uppercase tracking-[0.06em] group-hover:text-orange">
                      {link.label}
                    </span>
                    <span className="block font-serif text-[13px] leading-snug text-paper/70">{link.note}</span>
                  </span>
                  <span aria-hidden className="text-orange transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Wordmark slot: the clip box (slot) stays put, the window (outer) rises, the type (inner) counter-moves. */}
      <div ref={slotRef} className="overflow-clip">
        <div ref={outerRef} className="overflow-hidden">
          <div ref={innerRef} className="flex justify-center px-[1.5vw] pb-[8vw] pt-[5vw]">
            {/* Two-colour poster: orange type, ink knockout. The cube takes the place of the "s" (centred on its glyph:
                1.91em of the 4.12em lockup, x-height middle) and is opaque (paper body, ink cut-outs), so no letter
                shows through it; its ink ring traps it between "t" and "&" the same way the script is trapped. */}
            <div ref={markRef} className="relative flex text-[19vw] leading-none text-orange [--wm-knockout:var(--ink)]">
              <Wordmark />
              {/* The wrapper owns position + translate(-50%); GSAP only transforms the svg inside (an svg has no
                  offsetWidth, so GSAP would freeze a CSS translate into stale px once fit() resizes the type). */}
              <span aria-hidden className="pointer-events-none absolute left-[46.4%] top-[56%] size-[0.9em] -translate-x-1/2 -translate-y-1/2">
              <svg
                data-cube=""
                viewBox={LOGO_VIEWBOX}
                className="size-full overflow-visible"
              >
                <path
                  d={LOGO_HEX}
                  className="fill-paper stroke-ink [paint-order:stroke_fill] [stroke-linejoin:round] [stroke-width:9]"
                />
                <g className="fill-ink">
                  {LOGO_PIECES.map((piece) => (
                    <path key={piece.d} data-cube-piece="" d={piece.d} />
                  ))}
                </g>
              </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 border-t-2 border-paper px-5 py-6 text-[11px] md:flex-row md:items-end md:justify-between md:px-8">
        <div className="space-y-1">
          <p className="font-bold uppercase tracking-tight">GOBITSNBYTES FOUNDATION · bits&amp;bytes™</p>
          <p className="text-paper/80">
            © {new Date().getFullYear()} GOBITSNBYTES FOUNDATION. All rights reserved. | CIN: U85500UP2026NPL248652
          </p>
          <p className="text-[10px] text-paper/70">
            Regd. Office: 265/1 Patrakar Colony, Ashok Nagar, Prayagraj - 211001, UP, India · Section 8 Non-Profit
          </p>
        </div>
        <div className="space-y-2 md:text-right">
          <p className="font-serif text-[12px] text-paper/80">
            Grievance Officer:{" "}
            <a href="mailto:grievance@gobitsnbytes.org" className="text-orange underline">
              grievance@gobitsnbytes.org
            </a>{" "}
            · Inquiries:{" "}
            <a href="mailto:hello@gobitsnbytes.org" className="text-orange underline">
              hello@gobitsnbytes.org
            </a>
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 uppercase tracking-[0.1em] md:justify-end">
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className={linkClass}>
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link href="/cookies" className={linkClass}>
              Cookies
            </Link>
            <span aria-hidden>·</span>
            <Link href="/refund" className={linkClass}>
              Refunds
            </Link>
            <span aria-hidden>·</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("bnb-reopen-cookie-consent"))}
              className="cursor-pointer uppercase tracking-[0.1em] text-orange underline"
            >
              Cookie Preferences
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

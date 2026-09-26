"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useExperience } from "@/components/experience-provider";
import { ScrambleText } from "@/components/riot/scramble-text";
import { PRIMARY, isActive } from "./links";
import { MenuPanel } from "./menu";
import { CubeMark, Wordmark } from "./wordmark";
import "./chrome.css";

/**
 * buttermax nav: fixed, three zones (cube mark home | small wordmark | square outline buttons + MENU).
 * Colours come only from CSS on html[data-nav-surface]; hide-on-scroll from html[data-scrolled] +
 * html[data-scroll-dir] (see chrome.css). Mobile: cube + MENU.
 */
export function Nav() {
  const pathname = usePathname();
  const { motionEnabled, startTour } = useExperience();
  const reduceMotion = useReducedMotion();

  // Open state is tied to the path it was opened on, so any route change closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt !== null && openAt === pathname;
  // drop a stale open state (back/forward) so returning to that path doesn't re-open the menu
  if (openAt !== null && !open) setOpenAt(null);
  const [instant, setInstant] = useState(false);
  const viaKeyboard = useRef(false);
  const tourPending = useRef(false);

  const onOpenChange = (next: boolean) => {
    if (next) setInstant(viaKeyboard.current || !motionEnabled || Boolean(reduceMotion));
    setOpenAt(next ? pathname : null);
  };

  return (
    <header
      data-tour="navigation"
      data-menu-open={open || undefined}
      className="bnb-nav pointer-events-none fixed inset-x-0 top-0 z-[70]"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          aria-label="bits&bytes™ home"
          className="pointer-events-auto relative justify-self-start p-1 after:absolute after:-inset-2"
        >
          <CubeMark className="size-8 md:size-9" />
        </Link>

        <Link
          href="/"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-auto hidden text-[22px] md:block"
        >
          <Wordmark />
        </Link>

        <Dialog.Root open={open} onOpenChange={onOpenChange}>
          <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-1.5 justify-self-end">
            {PRIMARY.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="bnb-btn hidden md:inline-flex"
                >
                  {active ? <span aria-hidden className="size-1.5 bg-current" /> : null}
                  <ScrambleText text={link.label} trigger="hover" />
                </Link>
              );
            })}
            <Dialog.Trigger
              className="bnb-btn"
              onPointerDown={() => {
                viaKeyboard.current = false;
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") viaKeyboard.current = true;
              }}
            >
              <ScrambleText text="Menu" trigger="hover" />
            </Dialog.Trigger>
          </nav>

          <AnimatePresence
            onExitComplete={() => {
              // the tour highlights page elements: start it only once the menu is fully gone
              if (!tourPending.current) return;
              tourPending.current = false;
              startTour();
            }}
          >
            {open ? (
              <MenuPanel
                key="menu"
                pathname={pathname}
                instant={instant}
                onNavigate={() => setOpenAt(null)}
                onTour={() => {
                  tourPending.current = true;
                  setOpenAt(null);
                }}
              />
            ) : null}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </header>
  );
}

export default Nav;

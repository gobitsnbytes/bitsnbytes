"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useExperience } from "@/components/experience-provider";
import { ScrambleText } from "@/components/riot/scramble-text";
import { isShortcut, openConsole, useShortcutsEnabled } from "./hotkeys/shortcuts";
import { PRIMARY, isActive } from "./links";
import { MenuPanel } from "./menu";
import { RouteTransition } from "./transition/route-transition";
import { CubeMark, Wordmark } from "./wordmark";
import "./chrome.css";

/** stripe.dev bracket key. Decorative (aria-keyshortcuts carries it). Shown from xl, where five keyed chips
 * still leave the wordmark centred; hidden on touch widths. */
const Key = ({ k }: { k: string }) => (
  <span aria-hidden className="tracking-normal max-xl:hidden">
    [{k}]
  </span>
);

/**
 * buttermax nav: fixed, three zones (cube mark home | small wordmark | square outline buttons + MENU).
 * Colours come only from CSS on html[data-nav-surface]; hide-on-scroll from html[data-scrolled] +
 * html[data-scroll-dir] (see chrome.css). Mobile: cube + MENU.
 * stripe.dev hotkeys: [E] [A] [J] routes, [C] console, [M] menu, [1]-[9] chapters. Bare keys only,
 * never while typing or with a dialog open, and switchable off in the menu (WCAG 2.1.4).
 * Also mounts the route transition (a fixed sibling of the header, never inside its transform).
 */
export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { motionEnabled, lenis, chapters } = useExperience();
  const reduceMotion = useReducedMotion();
  const shortcuts = useShortcutsEnabled();

  // Open state is tied to the path it was opened on, so any route change closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt !== null && openAt === pathname;
  // drop a stale open state (back/forward) so returning to that path doesn't re-open the menu
  if (openAt !== null && !open) setOpenAt(null);
  const [instant, setInstant] = useState(false);
  const viaKeyboard = useRef(false);

  const onOpenChange = (next: boolean) => {
    if (next) setInstant(viaKeyboard.current || !motionEnabled || Boolean(reduceMotion));
    setOpenAt(next ? pathname : null);
  };

  // Re-bound every render so it always sees the current route, chapters and menu handler.
  useEffect(() => {
    if (!shortcuts) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isShortcut(event)) return;
      const key = event.key.toUpperCase();
      const link = PRIMARY.find((item) => item.key === key);
      const chapter = /^[1-9]$/.test(key) ? chapters[Number(key) - 1] : undefined;
      const section = chapter ? document.getElementById(chapter.id) : null;

      if (link) {
        if (pathname !== link.href) router.push(link.href);
      } else if (key === "M") {
        viaKeyboard.current = true;
        onOpenChange(true);
      } else if (key === "C") {
        openConsole(true);
      } else if (section) {
        // Keyboard-initiated: jump without animation, then move focus. Nav clearance comes from the
        // scroll-margin-top ExperienceProvider puts on chapters (Lenis and scrollIntoView both honour it).
        if (lenis) lenis.scrollTo(section, { immediate: true });
        else section.scrollIntoView({ block: "start" });
        if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
        section.focus({ preventScroll: true });
      } else {
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <header
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
                    aria-keyshortcuts={shortcuts ? link.key : undefined}
                    className="bnb-btn hidden md:inline-flex"
                  >
                    <Key k={link.key} />
                    <ScrambleText text={link.label} trigger="hover" />
                  </Link>
                );
              })}
              {/* Toggles the console (exempt from its click-outside). Below lg the menu's Console entry and the C key cover it. */}
              <button
                type="button"
                data-console-toggle
                className="bnb-btn hidden lg:inline-flex"
                aria-keyshortcuts={shortcuts ? "C" : undefined}
                title="Open or close the AI assistant console"
                onClick={() => openConsole(true)}
              >
                <Key k="C" />
                <ScrambleText text="Console" trigger="hover" />
              </button>
              <Dialog.Trigger
                className="bnb-btn"
                aria-keyshortcuts={shortcuts ? "M" : undefined}
                onPointerDown={() => {
                  viaKeyboard.current = false;
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") viaKeyboard.current = true;
                }}
              >
                <Key k="M" />
                <ScrambleText text="Menu" trigger="hover" />
              </Dialog.Trigger>
            </nav>

            <AnimatePresence>
              {open ? (
                <MenuPanel
                  key="menu"
                  pathname={pathname}
                  instant={instant}
                  onNavigate={() => setOpenAt(null)}
                />
              ) : null}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </header>
      <RouteTransition />
    </>
  );
}

export default Nav;

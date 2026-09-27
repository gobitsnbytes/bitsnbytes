"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, type Transition } from "framer-motion";
import { useTheme } from "next-themes";
import { useExperience } from "@/components/experience-provider";
import { ScrambleText } from "@/components/riot/scramble-text";
import { cn } from "@/lib/utils";
import { openConsole, setShortcutsEnabled, useShortcutsEnabled } from "./hotkeys/shortcuts";
import { getVolume, play, setSoundEnabled, setVolume, useSoundEnabled } from "./sound/engine";
import { ROUTES, SOCIALS, isActive, pad } from "./links";
import { CubeMark } from "./wordmark";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING: Transition = { type: "spring", stiffness: 520, damping: 44 };
const NONE: Transition = { duration: 0 };

/** Visual brackets only; screen readers just hear the value. */
const Bracket = ({ children }: { children: string }) => (
  <span>
    <span aria-hidden>[</span>
    {children}
    <span aria-hidden>]</span>
  </span>
);

type MenuPanelProps = {
  pathname: string | null;
  /** Keyboard-opened, reduced motion or motion toggle off: no animation in or out. */
  instant: boolean;
  onNavigate: () => void;
};

/**
 * kprverse menu: a burgundy rail slides in first, then the ink panel wipes out from behind it
 * (clip-path) with giant Archivo links for every public route. Rendered inside the nav's
 * Dialog.Root + AnimatePresence, so Radix gives focus trap, Esc, aria-expanded and focus return.
 */
export function MenuPanel({ pathname, instant, onNavigate }: MenuPanelProps) {
  const { motionEnabled, toggleMotion, lenis } = useExperience();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";
  const shortcuts = useShortcutsEnabled();
  const sound = useSoundEnabled();
  const toConsole = useRef(false);

  // Freeze the page behind the menu (Radix locks native scroll; Lenis needs its own stop).
  useEffect(() => {
    if (!lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis]);

  const pick = (animated: Transition) => (instant ? NONE : animated);
  const item = {
    closed: { opacity: 0, x: 48 },
    open: { opacity: 1, x: 0, transition: pick(SPRING) },
  };

  return (
    <Dialog.Portal forceMount>
      <Dialog.Overlay forceMount asChild>
        <motion.div
          className="bnb-menu-underlay fixed inset-0 z-[80]"
          initial={instant ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: pick({ duration: 0.2, delay: 0.1 }) }}
          transition={pick({ duration: 0.2, ease: EASE_OUT })}
        />
      </Dialog.Overlay>

      <Dialog.Content
        forceMount
        asChild
        aria-describedby={undefined}
        // Console entry: open it only once the menu is gone and Radix has handed focus back to MENU, so
        // the console's prompt keeps focus and Esc there returns to MENU.
        onCloseAutoFocus={() => {
          if (toConsole.current) setTimeout(openConsole);
        }}
      >
        <div
          data-lenis-prevent
          className="fixed inset-y-0 right-0 z-[81] flex w-full flex-row-reverse outline-none md:w-[min(100vw,68rem)]"
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>

          {/* Rail: leads the open, trails the close. First in DOM so Close gets initial focus. */}
          <motion.div
            className="relative z-10 flex w-16 shrink-0 flex-col items-center justify-between bg-burgundy py-4 text-paper [--focus-ring:var(--marker)] md:w-[88px] md:py-5"
            initial={instant ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: pick({ ...SPRING, delay: 0.12 }) }}
            transition={pick(SPRING)}
          >
            <Dialog.Close className="bnb-btn h-10 w-12 px-0 [--wipe-fill:var(--paper)] [--wipe-ink:var(--burgundy)] md:w-14">
              <span aria-hidden>✕</span>
              <span className="sr-only">Close menu</span>
            </Dialog.Close>
            <CubeMark className="size-9 md:size-11" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
              bits&amp;bytes™ · EST. 2025
            </p>
          </motion.div>

          {/* Panel: wipes out from behind the rail. */}
          <motion.div
            className="tone-ink flex min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
            initial={instant ? false : { clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            exit={{ clipPath: "inset(0 0 0 100%)", transition: pick({ duration: 0.2, ease: [0.55, 0, 0.68, 0.2] }) }}
            transition={pick({ duration: 0.34, ease: EASE_OUT, delay: 0.08 })}
          >
            <div className="flex items-center justify-between border-b border-paper/20 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] md:px-8">
              <span className="flex items-center gap-2 text-orange">
                <span aria-hidden className="size-2 bg-orange" />
                Index
              </span>
              <span className="text-paper/70">[{pad(ROUTES.length)}] routes</span>
            </div>

            <nav aria-label="All pages" className="px-2 py-3 md:px-4">
              <motion.ul
                className="grid md:grid-cols-2 md:gap-x-4"
                initial={instant ? false : "closed"}
                animate="open"
                variants={{ open: { transition: { staggerChildren: instant ? 0 : 0.035, delayChildren: instant ? 0 : 0.16 } } }}
              >
                {ROUTES.map((route, index) => {
                  const active = isActive(pathname, route.href);
                  const inner = (
                    <>
                      <ScrambleText
                        text={pad(index + 1)}
                        trigger="mount"
                        delay={instant ? 0 : 160 + index * 35}
                        className={cn(
                          "w-6 shrink-0 self-start pt-[0.35em] font-mono text-[11px] font-bold tracking-[0.1em]",
                          active ? "text-ink" : "text-orange group-hover:text-ink group-focus-visible:text-ink",
                        )}
                      />
                      <span>{route.label}</span>
                    </>
                  );
                  const className = cn(
                    "flex items-start gap-3 px-3 py-1.5 font-[family-name:var(--font-archivo)] text-[clamp(26px,min(4.2vw,6svh),58px)] font-black uppercase leading-[0.9] tracking-[-0.03em] [font-stretch:112%]",
                    active ? "bg-marker text-ink" : "bnb-pass group",
                  );
                  return (
                    <motion.li key={route.href} variants={item} className="border-b border-paper/15">
                      {route.handler ? (
                        <a href={route.href} className={className} onClick={onNavigate}>
                          {inner}
                        </a>
                      ) : (
                        <Link
                          href={route.href}
                          className={className}
                          aria-current={active ? "page" : undefined}
                          onClick={onNavigate}
                        >
                          {inner}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            <div className="mt-auto [--wipe-fill:var(--paper)] [--wipe-ink:var(--ink)]">
              <div className="flex flex-wrap items-center gap-2 border-t border-paper/20 px-5 py-4 md:px-8">
                <span className="mr-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">Settings</span>
                <button
                  type="button"
                  className="bnb-btn"
                  onClick={() => setTheme(dark ? "light" : "dark")}
                  title={`Switch to ${dark ? "light" : "dark"} theme`}
                >
                  Theme <Bracket>{dark ? "Dark" : "Light"}</Bracket>
                </button>
                <button
                  type="button"
                  className="bnb-btn"
                  onClick={toggleMotion}
                  aria-pressed={motionEnabled}
                  title={`${motionEnabled ? "Pause" : "Play"} immersive motion`}
                >
                  Motion <Bracket>{motionEnabled ? "On" : "Off"}</Bracket>
                </button>
                <button
                  type="button"
                  className="bnb-btn"
                  onClick={() => setSoundEnabled(!sound)}
                  aria-pressed={sound}
                  aria-keyshortcuts={shortcuts ? "S" : undefined}
                  title={`Turn interface sound ${sound ? "off" : "on"}`}
                >
                  Sound <Bracket>{sound ? "On" : "Off"}</Bracket>
                </button>
                {sound && (
                  <label className="bnb-btn" style={{ gap: "0.5em", borderRadius: 0 }}>
                    Volume
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      defaultValue={Math.round(getVolume() * 100)}
                      onChange={(e) => {
                        const v = Number(e.currentTarget.value) / 100;
                        setVolume(v);
                        play("focus", Math.round(v * 6)); // hear the new level; the note climbs with it
                      }}
                      style={{ accentColor: "currentColor", width: "6em", borderRadius: 0 }}
                    />
                  </label>
                )}
                <button
                  type="button"
                  className="bnb-btn"
                  onClick={() => setShortcutsEnabled(!shortcuts)}
                  aria-pressed={shortcuts}
                  title={`Turn single-key keyboard shortcuts ${shortcuts ? "off" : "on"}`}
                >
                  Shortcuts <Bracket>{shortcuts ? "On" : "Off"}</Bracket>
                </button>
                <button
                  type="button"
                  className="bnb-btn"
                  aria-keyshortcuts={shortcuts ? "C" : undefined}
                  title="Open the AI assistant console"
                  onClick={() => {
                    toConsole.current = true;
                    onNavigate();
                  }}
                >
                  Console
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-paper/20 px-5 py-4 md:px-8">
                <span className="mr-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">Social</span>
                {SOCIALS.map((social) => (
                  <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="bnb-btn">
                    {social.label}
                    <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

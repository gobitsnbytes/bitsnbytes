"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "bnb_cookie_consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual trigger to reopen banner from footer
  useEffect(() => {
    const handleReopen = () => setVisible(true);
    window.addEventListener("bnb-reopen-cookie-consent", handleReopen);
    return () => window.removeEventListener("bnb-reopen-cookie-consent", handleReopen);
  }, []);

  const handleChoice = (choice: "all" | "essential") => {
    try {
      const payload = {
        choice,
        timestamp: new Date().toISOString(),
        version: "2026.1",
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Handle storage errors safely
    }
    setVisible(false);
  };

  if (!mounted) {
    return null;
  }

  const offset = reduceMotion ? 0 : 24;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="dialog"
          data-ambient=""
          data-theatre-hide=""
          aria-label="Cookie and Privacy Choices"
          aria-live="polite"
          initial={{ y: offset, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: offset, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-md border-3 border-line bg-surface text-fg shadow-[6px_6px_0_0_var(--shadow-color)] sm:bottom-6 sm:right-6"
        >
          {/* Window chrome title bar */}
          <div className="flex items-center justify-between gap-3 border-b-3 border-line bg-ink px-3 py-2 text-paper">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="flex gap-1">
                <span className="size-2.5 bg-burgundy" />
                <span className="size-2.5 bg-orange" />
                <span className="size-2.5 bg-cream" />
              </span>
              <div>
                <h3 className="font-mono text-[11px] font-bold uppercase leading-none tracking-[0.14em]">
                  Cookie &amp; Privacy Consent
                </h3>
                <p className="mt-1 font-mono text-[10px] font-bold leading-none text-orange">GOBITSNBYTES FOUNDATION</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChoice("essential")}
              className="grid size-7 cursor-pointer place-items-center border-2 border-paper font-mono text-xs font-bold text-paper transition-colors hover:bg-paper hover:text-ink [--focus-ring:var(--marker)]"
              aria-label="Close and continue with essential cookies only"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>

          <div className="p-4 sm:p-5">
            <p className="font-serif text-sm leading-relaxed">
              We use strictly essential local storage to remember your theme and motion settings, plus privacy-first telemetry to monitor site speed. In accordance with India&apos;s DPDP Act, 2023, we never track children or serve targeted ads.
            </p>

            <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => handleChoice("all")}
                className="cursor-pointer border-2 border-line bg-burgundy px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-paper shadow-[3px_3px_0_0_var(--shadow-color)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={() => handleChoice("essential")}
                className="cursor-pointer border-2 border-line bg-surface px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-fg shadow-[3px_3px_0_0_var(--shadow-color)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--shadow-color)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none"
              >
                Essential Only
              </button>
              <Link
                href="/cookies"
                className="px-1 py-1 text-center font-mono text-[11px] font-bold underline underline-offset-4 hover:text-signal"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

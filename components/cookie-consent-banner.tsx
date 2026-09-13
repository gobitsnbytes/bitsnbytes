"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "bnb_cookie_consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted || !visible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.aside
        role="dialog"
        aria-label="Cookie and Privacy Choices"
        aria-live="polite"
        initial={{ y: 50, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] border-3 border-border bg-card text-foreground p-5 sm:p-6 shadow-[6px_6px_0px_0px_var(--border)] rounded-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-border bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_var(--border)] shrink-0">
              <Cookie className="h-4 w-4 text-[#97192c]" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-black uppercase tracking-wider text-foreground">
                Cookie &amp; Privacy Consent
              </h3>
              <p className="text-[10px] font-mono text-primary dark:text-accent font-bold">
                GOBITSNBYTES FOUNDATION
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleChoice("essential")}
            className="p-1 border border-border bg-card text-foreground hover:bg-secondary transition-colors"
            aria-label="Close and continue with essential cookies only"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-foreground/90 font-medium">
          We use strictly essential local storage to remember your theme and motion settings, plus privacy-first telemetry to monitor site speed. In accordance with India&apos;s DPDP Act, 2023, we never track children or serve targeted ads.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-border/20">
          <button
            type="button"
            onClick={() => handleChoice("all")}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-[#97192c] text-white border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-y-0 active:shadow-none transition-all cursor-pointer font-mono"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={() => handleChoice("essential")}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-card text-foreground border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] hover:bg-secondary active:translate-y-0 active:shadow-none transition-all cursor-pointer font-mono"
          >
            Essential Only
          </button>
          <Link
            href="/cookies"
            className="inline-flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-foreground/70 hover:text-primary dark:hover:text-accent underline transition-colors px-1 py-1"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Cookie Policy
          </Link>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

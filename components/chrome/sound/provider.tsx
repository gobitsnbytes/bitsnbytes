"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { useExperience } from "@/components/experience-provider";
import { isShortcut, useShortcutsEnabled } from "../hotkeys/shortcuts";
import { RECIPES, panAt, panOf, play, scrollAir, unlock, useSoundEnabled, type SoundName } from "./engine";

const INTERACTIVE =
  "a[href], button, [role=button], [role=tab], [role=switch], [role=menuitem], [role=checkbox], summary, input, select, textarea, label[for], [data-sound]:not(html)";
const DISABLED = ":disabled, [aria-disabled=true]";
/** Controls whose own toggle cue is their release (no glass pluck on top). */
const TOGGLES = "input[type=checkbox], input[type=radio], [role=switch], [role=checkbox], [aria-pressed]";
const TEXT = "textarea, input:not([type]), input[type=text], input[type=email], input[type=search], input[type=url], input[type=tel], input[type=password], input[type=number]";
const SECTION = "main [data-cinematic-section]";
/** Hotkeys sing a scale degree each ([S] is heard through the sound switch itself). */
const HOTKEY_NOTES: Record<string, number> = { E: 0, A: 1, J: 2, C: 3, M: 4 };
/** Open/close/toggle cues only follow a real gesture, so page load and programmatic state never sound. */
const GESTURE_WINDOW_MS = 1200;

/** Last real pointer position; module scope so it survives the effect re-running (route change, HMR). */
let px = -1;
let py = -1;

const el = (target: EventTarget | null) => (target instanceof Element ? target : null);

/** data-sound="none" silences an element; data-sound="<cue>" swaps its press cue. */
function cue(target: Element, fallback: SoundName): SoundName | null {
  const override = target.closest<HTMLElement>("[data-sound]:not(html)")?.dataset.sound;
  if (override === "none") return null;
  return override && override in RECIPES ? (override as SoundName) : fallback;
}

/** The control's own degree (0..6), hashed from its label, text or href: the same button always sings the same note. */
const degrees = new WeakMap<Element, number>();
function degree(target: Element) {
  let d = degrees.get(target);
  if (d === undefined) {
    const key =
      target.getAttribute("aria-label") || target.textContent?.trim().slice(0, 48) || target.getAttribute("href") || target.tagName;
    let h = 0x811c9dc5; // FNV-1a
    for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193);
    d = (h >>> 0) % 7;
    degrees.set(target, d);
  }
  return d;
}

/** The outermost chapter under the viewport's centre line (nested sections belong to their chapter). */
function sectionAtCentre() {
  let hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)?.closest(SECTION) ?? null;
  while (hit?.parentElement?.closest(SECTION)) hit = hit.parentElement.closest(SECTION);
  return hit;
}

/**
 * Global sound delegation: document-level listeners, no per-component wiring. Listens to nothing while sound is off;
 * the engine never creates an AudioContext before a gesture.
 *   hover (fine pointers only)  felt tap at the control's degree, panned to the pointer
 *   press / release             woody knock on pointerdown, glassy pluck on click (touch: both on the click, with a
 *                               6 ms tick of haptics, so a swipe that starts on a link stays silent)
 *   focus-visible, typing       soft sine at the control's degree; soft typewriter, panned to the field
 *   toggles, open / close       two-note marimba; an airy swell (aria-checked/pressed/expanded, data-state, dialogs)
 *   scroll                      one continuous air texture following speed, and a bell per chapter reached, walking
 *                               up the scale, so scrolling a page plays a quiet melody
 *   route change / loader done  nav / ready
 */
export function SoundProvider() {
  const on = useSoundEnabled();
  const shortcuts = useShortcutsEnabled();
  const pathname = usePathname();
  const { lenis, motionEnabled } = useExperience();

  useEffect(() => {
    document.documentElement.dataset.sound = on ? "on" : "off";
  }, [on]);

  // Any route change (link, hotkey, back/forward) lands with the nav cue; a no-op while sound is off.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    play("nav");
  }, [pathname]);

  useEffect(() => {
    if (!on) return;
    const fine = window.matchMedia("(pointer: fine)");
    let hovered: Element | null = null;
    let lastGesture = 0;
    let lastTabKey = 0;
    let touch = false;

    const gesture = () => {
      lastGesture = performance.now();
      unlock();
    };
    const recent = () => performance.now() - lastGesture < GESTURE_WINDOW_MS;
    const target = (event: Event) => {
      const found = el(event.target)?.closest(INTERACTIVE);
      return found && !found.matches(DISABLED) ? found : null;
    };

    // Boundary events precede pointermove, so an "over" at the last move's position means the page moved under a
    // still pointer (scrolling, a route swap): that is not a hover and stays silent.
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      if (!fine.matches || e.pointerType !== "mouse") return;
      const t = target(e);
      if (t === hovered) return;
      hovered = t;
      if (t && (e.clientX !== px || e.clientY !== py) && cue(t, "hover")) play("hover", degree(t), { pan: panAt(e.clientX) });
    };
    const press = (t: Element, clientX: number) => {
      const name = cue(t, "press");
      if (name) play(name, degree(t), { pan: panAt(clientX) });
      return Boolean(name);
    };
    const onDown = (e: PointerEvent) => {
      gesture();
      touch = e.pointerType === "touch";
      const t = target(e);
      // A touch may be the start of a scroll: its knock (and haptic) wait for the click that proves it was a tap.
      if (t && !touch) press(t, e.clientX);
    };
    const onClick = (e: MouseEvent) => {
      if (!e.isTrusted) return;
      gesture(); // on touch screens click (not touchstart/pointerdown) is the activation that lets audio start
      const t = target(e);
      if (t && touch && e.detail > 0 && press(t, e.clientX)) navigator.vibrate?.(6); // Android; absent elsewhere
      if (!t || t.matches(TOGGLES) || !cue(t, "release")) return;
      // detail 0: keyboard activation, so the cue sits where the control is
      play("release", degree(t), { pan: e.detail === 0 ? panOf(t) : panAt(e.clientX) });
    };
    const onKey = (e: KeyboardEvent) => {
      if (!e.isTrusted) return;
      gesture();
      if (e.key === "Tab" || e.key.startsWith("Arrow")) lastTabKey = performance.now();
      const d = HOTKEY_NOTES[e.key.toUpperCase()];
      if (shortcuts && d !== undefined && isShortcut(e)) play("release", d);
    };
    const onFocus = (e: FocusEvent) => {
      const t = el(e.target);
      if (!t || performance.now() - lastTabKey > 150 || !t.matches(":focus-visible") || !cue(t, "focus")) return;
      play("focus", degree(t), { pan: panOf(t) });
    };
    const onInput = (e: Event) => {
      const t = el(e.target);
      if (e.isTrusted && t?.matches(TEXT) && cue(t, "key")) play("key", 0, { pan: panOf(t) });
    };
    const onChange = (e: Event) => {
      const t = e.target;
      if (!e.isTrusted || !(t instanceof HTMLInputElement)) return;
      if (t.type === "checkbox" || t.type === "radio") play(t.checked ? "toggleOn" : "toggleOff");
    };

    const observer = new MutationObserver((records) => {
      if (!recent()) return;
      for (const r of records) {
        const t = r.target as Element;
        if (r.type === "childList") {
          for (const n of r.addedNodes) {
            if (n instanceof Element && (n.matches("[role=dialog]") || n.querySelector("[role=dialog]"))) play("open");
          }
          continue;
        }
        const value = r.attributeName === "open" ? String(t.hasAttribute("open")) : t.getAttribute(r.attributeName!);
        if (value === r.oldValue) continue;
        if (r.attributeName === "aria-checked" || r.attributeName === "aria-pressed" || value === "checked" || value === "unchecked") {
          play(value === "true" || value === "checked" ? "toggleOn" : "toggleOff");
        } else if (value === "true" || value === "open") play("open");
        else if (value === "false" || value === "closed") play("close");
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["aria-expanded", "data-state", "open", "aria-checked", "aria-pressed"],
    });

    // Scroll, once per frame: the air texture follows speed (Lenis when it runs, native delta otherwise; teleports
    // such as a route's jump to top don't count), and reaching a new chapter rings its bell. The chapter under the
    // centre on arrival is only noted, so a page never chimes by itself.
    let raf = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let chapter: Element | null | undefined;
    let probed = 0;
    const frame = () => {
      raf = 0;
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      const v = dy > window.innerHeight ? 0 : lenis ? Math.abs(lenis.velocity) : (dy / Math.max(1, now - lastT)) * 16;
      lastY = window.scrollY;
      lastT = now;
      scrollAir(Math.min(1, v / 60) * (motionEnabled ? 1 : 0.6));
      if (now - probed < 120) return; // chapters change slowly: hit-test a few times a second, not every frame
      probed = now;
      const hit = sectionAtCentre();
      if (!hit || hit === chapter) return;
      if (chapter !== undefined) {
        const all = Array.from(document.querySelectorAll(SECTION)).filter((s) => !s.parentElement?.closest(SECTION));
        play("section", all.indexOf(hit));
      }
      chapter = hit;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    chapter = sectionAtCentre() ?? undefined;

    const onReady = () => play("ready");

    const opts = { capture: true, passive: true } as const;
    document.addEventListener("pointerover", onOver, opts);
    document.addEventListener("pointermove", onMove, opts);
    document.addEventListener("pointerdown", onDown, opts);
    document.addEventListener("touchstart", gesture, opts);
    document.addEventListener("click", onClick, opts);
    document.addEventListener("keydown", onKey, opts);
    document.addEventListener("focusin", onFocus, opts);
    document.addEventListener("input", onInput, opts);
    document.addEventListener("change", onChange, opts);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("bnb:ready", onReady);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver, opts);
      document.removeEventListener("pointermove", onMove, opts);
      document.removeEventListener("pointerdown", onDown, opts);
      document.removeEventListener("touchstart", gesture, opts);
      document.removeEventListener("click", onClick, opts);
      document.removeEventListener("keydown", onKey, opts);
      document.removeEventListener("focusin", onFocus, opts);
      document.removeEventListener("input", onInput, opts);
      document.removeEventListener("change", onChange, opts);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("bnb:ready", onReady);
    };
    // pathname: a new page starts with its first chapter noted, not chimed
  }, [on, shortcuts, lenis, motionEnabled, pathname]);

  return null;
}

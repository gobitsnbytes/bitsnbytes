"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Driver, DriveStep } from "driver.js";

import { ChapterIndex, type EditionChapter } from "@/components/edition/chapter-index";

gsap.registerPlugin(ScrollTrigger);

const MOTION_STORAGE_KEY = "bnb-immersive-motion";
/**
 * Fixed nav (~91px) clearance, applied once: as scroll-margin-top on every chapter. Lenis' scrollTo
 * and native scrollIntoView both honour it, so never pass an extra offset for chapter jumps.
 */
const NAV_OFFSET = 96;
/** Viewport line (px from the top) whose section decides html[data-nav-surface]. */
const SURFACE_LINE = 40;

type ExperienceContextValue = {
  /** false until the preference is resolved on the client, under reduced motion, or with the site toggle off. */
  motionEnabled: boolean;
  toggleMotion: () => void;
  startTour: () => void;
  /** The one Lenis instance (null when motion is off, on /qna, or before mount). */
  lenis: Lenis | null;
  /** Chapters discovered on the current page ([data-cinematic-section], top level, in order). */
  chapters: EditionChapter[];
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function getSectionLabel(section: HTMLElement, index: number) {
  const explicitLabel = section.dataset.cinematicTitle;
  if (explicitLabel) return explicitLabel;

  const heading = section.querySelector<HTMLElement>("h1, h2");
  const headingText = heading?.textContent?.replace(/\s+/g, " ").trim();
  if (headingText) return headingText.slice(0, 34);

  return `chapter ${String(index + 1).padStart(2, "0")}`;
}

function topLevel(selector: string) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (section) => !section.parentElement?.closest("[data-cinematic-section]"),
  );
}

const getChapterSections = () => topLevel("main [data-cinematic-section]");

function setRootAttr(key: "navSurface" | "scrolled" | "scrollDir", value: string) {
  const root = document.documentElement;
  if (root.dataset[key] !== value) root.dataset[key] = value;
}

export function useExperience() {
  const value = useContext(ExperienceContext);
  if (!value) {
    throw new Error("useExperience must be used inside ExperienceProvider");
  }
  return value;
}

/** Like useExperience, but returns null outside the provider. */
export function useOptionalExperience() {
  return useContext(ExperienceContext);
}

/**
 * Motion gate for page choreography. false outside the provider, before the preference resolves,
 * under prefers-reduced-motion and with the site toggle off. Use it as a useGSAP dependency.
 */
export function useMotionEnabled() {
  return useContext(ExperienceContext)?.motionEnabled ?? false;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [settledPath, setSettledPath] = useState<string | null>(null);
  // null = not resolved yet (server render / first client frame).
  const [motionPref, setMotionPref] = useState<boolean | null>(null);
  const motionEnabled = motionPref === true;
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [chapters, setChapters] = useState<EditionChapter[]>([]);
  const [editionTitle, setEditionTitle] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const tourRef = useRef<Driver | null>(null);

  useEffect(() => {
    setSettledPath(null);
    setEditionTitle(null);
    setChapters([]);
    sectionsRef.current = [];
    const settleTimer = window.setTimeout(() => setSettledPath(pathname), 480);
    return () => window.clearTimeout(settleTimer);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stored = window.localStorage.getItem(MOTION_STORAGE_KEY);
    const enabled = stored === null ? !media.matches : stored === "on";
    setMotionPref(enabled && !media.matches);

    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMotionPref(false);
    };

    media.addEventListener("change", onPreferenceChange);
    return () => media.removeEventListener("change", onPreferenceChange);
  }, []);

  useEffect(() => {
    if (motionPref === null) return;
    document.documentElement.dataset.immersiveMotion = motionPref ? "on" : "off";
  }, [motionPref]);

  useEffect(() => {
    if (!motionEnabled || pathname === "/qna") return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      syncTouch: false,
      anchors: true, // hash targets are chapters: their scroll-margin-top clears the nav
      stopInertiaOnNavigate: true,
      prevent: (node) =>
        node instanceof HTMLElement &&
        Boolean(node.closest("[data-lenis-prevent]")),
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => instance.raf(time * 1000);

    instance.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      setLenis(null);
      instance.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
      instance.destroy();
    };
  }, [motionEnabled, pathname]);

  // Chrome state on <html>: data-nav-surface / data-scrolled / data-scroll-dir. Runs immediately on
  // every route so the nav is right on the first frame, and again once the route settles to pick up
  // late-mounted sections; ScrollTrigger's own resize/load refreshes correct mid-transition positions.
  useGSAP(
    () => {
      const surfaces = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));

      // Innermost / last [data-surface] crossing the line wins; nothing there = "paper".
      const syncSurface = () => {
        let surface = "paper";
        for (const el of document.querySelectorAll<HTMLElement>("[data-surface]")) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= SURFACE_LINE && bottom > SURFACE_LINE) surface = el.dataset.surface || surface;
        }
        setRootAttr("navSurface", surface);
      };

      setRootAttr("scrollDir", "up");
      setRootAttr("scrolled", window.scrollY > 80 ? "true" : "false");
      syncSurface();

      surfaces.forEach((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: `top ${SURFACE_LINE}px`,
          end: `bottom ${SURFACE_LINE}px`,
          refreshPriority: -1,
          onToggle: syncSurface,
        }),
      );

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (self.direction) setRootAttr("scrollDir", self.direction > 0 ? "down" : "up");
          setRootAttr("scrolled", self.scroll() > 80 ? "true" : "false");
        },
      });

      ScrollTrigger.addEventListener("refresh", syncSurface);
      return () => ScrollTrigger.removeEventListener("refresh", syncSurface);
    },
    { dependencies: [pathname, settledPath], revertOnUpdate: true },
  );

  // Chapter discovery + active tracking for the chapter index (edition pages only).
  useGSAP(
    () => {
      if (settledPath !== pathname) return;

      const sections = getChapterSections();
      const edition = document.querySelector<HTMLElement>("[data-edition]");
      sectionsRef.current = sections;

      // Every chapter needs an anchor for the index links.
      const named = sections.filter((section) => !section.id);
      named.forEach((section) => (section.id = `chapter-${String(sections.indexOf(section) + 1).padStart(2, "0")}`));
      setChapters(sections.map((section, index) => ({ id: section.id, title: getSectionLabel(section, index) })));
      setEditionTitle(edition ? (edition.dataset.editionTitle ?? "") : null);
      setActiveIndex(0);

      // Every jump (Lenis, anchors, scrollIntoView) lands below the fixed nav.
      const margined = sections.filter((section) => !section.style.scrollMarginTop);
      margined.forEach((section) => (section.style.scrollMarginTop = `${NAV_OFFSET}px`));

      if (edition) {
        // Resolve from every trigger on each toggle, not just the one that fired: early toggles (before fonts and
        // images settle the layout) used to leave a later chapter lit while the reader was still in the opener.
        const triggers: ScrollTrigger[] = [];
        const sync = () => {
          let index = -1;
          triggers.forEach((trigger, i) => {
            if (trigger.isActive) index = i;
          });
          if (index >= 0) setActiveIndex(index);
          else if (triggers[0] && triggers[0].scroll() < triggers[0].start) setActiveIndex(0);
        };
        sections.forEach((section) =>
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "top center",
              end: "bottom center",
              refreshPriority: -1,
              onToggle: sync,
              onRefresh: sync,
            }),
          ),
        );
      }

      const refreshTimers = [
        window.setTimeout(() => ScrollTrigger.refresh(), 160),
        window.setTimeout(() => ScrollTrigger.refresh(), 900),
      ];

      return () => {
        refreshTimers.forEach(window.clearTimeout);
        margined.forEach((section) => section.style.removeProperty("scroll-margin-top"));
        named.forEach((section) => section.removeAttribute("id"));
      };
    },
    {
      dependencies: [pathname, settledPath],
      revertOnUpdate: true,
    },
  );

  const jumpToChapter = useCallback(
    (index: number, viaKeyboard: boolean) => {
      const section = sectionsRef.current[index];
      if (!section) return;

      const focusSection = () => {
        if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
        section.focus({ preventScroll: true });
      };

      // Keyboard-initiated jumps don't animate.
      if (lenis) {
        lenis.scrollTo(section, { immediate: viaKeyboard, onComplete: focusSection });
      } else {
        section.scrollIntoView({ behavior: motionEnabled && !viaKeyboard ? "smooth" : "auto", block: "start" });
        focusSection();
      }
    },
    [lenis, motionEnabled],
  );

  const startTour = useCallback(async () => {
    const { driver } = await import("driver.js");
    tourRef.current?.destroy();

    const topLevelSections = topLevel("main section, main [data-cinematic-section]");

    const candidateSteps: Array<{
      element: Element | null;
      popover: DriveStep["popover"];
    }> = [
      {
        element: document.querySelector('[data-tour="navigation"]'),
        popover: {
          title: "Site navigation",
          description:
            "Use these links to explore our events, programmes, impact, team, and press resources.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element:
          document.querySelector('[data-tour="page-hero"]') ??
          document.querySelector("main h1"),
        popover: {
          title: "About this page",
          description:
            "This introduction gives you the key information first. Scroll down for details and supporting work.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: document.querySelector('[data-tour="prospectus"]'),
        popover: {
          title: "Partnership prospectus",
          description:
            "Download our 2026 prospectus for partnership opportunities, programmes, reach, and contact information.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: topLevelSections[1] ?? topLevelSections[0] ?? null,
        popover: {
          title: "Scroll progress",
          description:
            "The page marker shows which section you are reading and how far you have progressed.",
          side: "top",
          align: "start",
        },
      },
      {
        element: document.querySelector('[data-tour="footer-trust"]'),
        popover: {
          title: "Trust center",
          description:
            "Read our safety, privacy, conduct, and intellectual-property policies from the footer.",
          side: "top",
          align: "center",
        },
      },
    ];

    const steps: DriveStep[] = candidateSteps
      .filter(
        (step): step is { element: Element; popover: DriveStep["popover"] } =>
          Boolean(step.element),
      )
      .map((step) => ({
        element: step.element,
        popover: step.popover,
      }));

    if (!steps.length) return;

    const tour = driver({
      animate: motionEnabled,
      duration: motionEnabled ? 260 : 0,
      smoothScroll: motionEnabled,
      allowClose: true,
      allowScroll: true,
      overlayColor: "#120f0a",
      overlayOpacity: 0.82,
      stagePadding: 10,
      stageRadius: 0,
      popoverClass: "bnb-driver-popover",
      showProgress: true,
      progressText: "{{current}} / {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
      steps,
      onDestroyed: () => {
        tourRef.current = null;
      },
    });

    tourRef.current = tour;
    tour.drive();
  }, [motionEnabled]);

  useEffect(() => () => tourRef.current?.destroy(), [pathname]);

  const toggleMotion = useCallback(() => {
    setMotionPref((current) => {
      const next = !current;
      window.localStorage.setItem(MOTION_STORAGE_KEY, next ? "on" : "off");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ motionEnabled, toggleMotion, startTour, lenis, chapters }),
    [motionEnabled, startTour, toggleMotion, lenis, chapters],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      {editionTitle !== null && chapters.length > 0 && (
        <ChapterIndex
          title={editionTitle}
          chapters={chapters}
          active={activeIndex}
          onJump={jumpToChapter}
        />
      )}
    </ExperienceContext.Provider>
  );
}

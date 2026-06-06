"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
// PageSection import removed for consistent UI layout matching /press
import { GlassContainer } from "@/components/ui/glass-container";
import { Gallery4 } from "@/components/ui/gallery4";
import { Button } from "@/components/ui/button";
import { githubDevDayEvent, lucknowBuildGuildEvent, hack4goodEvent } from "@/lib/events-data";
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Clock,
  Building2,
  Activity,
  Eye,
  Check,
  ExternalLink,
} from "lucide-react";

const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((m) => ({
      default: m.WebGLShader,
    })),
  { loading: () => null, ssr: false },
);

// ── Component ─────────────────────────────────────────────────────────────

export default function Events() {
  const [activeEvent, setActiveEvent] = useState<
    "all" | "lucknow-build-guild" | "copilot" | "execron" | "india-innovates"
  >("all");

  return (
    <>
      {/* Hero Section - Consistent with /press and /impact */}
      <section
        className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32"
        aria-labelledby="events-hero-title"
      >
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="px-6 py-8 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-pink)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                </span>
                Events
              </span>
              <h1
                id="events-hero-title"
                className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl"
              >
                Where code meets <br className="hidden sm:block" /> the real
                world
              </h1>
              <p className="max-w-2xl text-white/80 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                Hackathons, summits, and workshops where teen builders actually
                ship things.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ── Event Toggle Tabs ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.1 }}
          className="mx-auto flex w-fit max-w-[95vw] flex-wrap items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-1.5 backdrop-blur-md mb-8"
          role="tablist"
          aria-label="Filter events"
        >
          <button
            type="button"
            onClick={() => setActiveEvent("all")}
            aria-selected={activeEvent === "all"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] active:scale-[0.96] ${
              activeEvent === "all"
                ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            All Events
          </button>
          <button
            type="button"
            onClick={() => setActiveEvent("lucknow-build-guild")}
            aria-selected={activeEvent === "lucknow-build-guild"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] active:scale-[0.96] ${
              activeEvent === "lucknow-build-guild"
                ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Archived: Lucknow Build Guild
          </button>
          <button
            type="button"
            onClick={() => setActiveEvent("copilot")}
            aria-selected={activeEvent === "copilot"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] active:scale-[0.96] ${
              activeEvent === "copilot"
                ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Archived: Copilot Dev Days
          </button>
          <button
            type="button"
            onClick={() => setActiveEvent("execron")}
            aria-selected={activeEvent === "execron"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] active:scale-[0.96] ${
              activeEvent === "execron"
                ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Archived: Execron 1.0
          </button>
          <button
            type="button"
            onClick={() => setActiveEvent("india-innovates")}
            aria-selected={activeEvent === "india-innovates"}
            role="tab"
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] active:scale-[0.96] ${
              activeEvent === "india-innovates"
                ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Archived: India Innovates
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvent}
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          >
            {/* ── Hack4Good v0 ────────────────────────────────────────────── */}
            {(activeEvent === "all" || activeEvent === "hack4good") && (
              <GlassContainer
                glowColor="pink"
                animated={false}
                className="overflow-hidden"
                noEntry
              >
                {/* ── Banner image header ── */}
                <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5">
                  <Image
                    src="/event_pictures/h4g/h4gbanner.jpg"
                    alt="Hack4Good v0 Banner"
                    width={1920}
                    height={640}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                {/* ── Details grid ── */}
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                    <div>
                      <span className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider block mb-1">
                        Archived · Apr 2 – May 3, 2026
                      </span>
                      <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                        Hack4Good v0
                      </h2>
                      <p className="text-sm text-white/70 mt-1">
                        Architect Your Autonomy. Lucknow's first Agentic AI hackathon.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                      Archived Event
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                      Community Partner: bits&amp;bytes™
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                      Agentic AI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="prose prose-invert max-w-none text-white/80 space-y-8 lg:col-span-2">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          Event Summary
                        </h2>
                        <p className="leading-relaxed">
                          Hack4Good v0 is a 24-hour Agentic AI hackathon created to kickstart and shape a stronger hackathon and builder culture in Lucknow. At its core, the event is about moving beyond traditional coding and enabling students to build intelligent AI agents capable of planning workflows, navigating systems, and executing tasks autonomously.
                        </p>
                        <p className="leading-relaxed mt-3">
                          Bringing together student developers, beginners, and curious builders, Hack4Good focuses on hands-on experimentation, collaboration, and real-world problem solving. Participants explore diverse ideas, right from automation tools to creative systems, all while learning how to design and build with emerging AI paradigms.
                        </p>
                        <p className="leading-relaxed mt-3">
                          More than just a simple hackathon, Hack4Good is an effort to establish a sustainable, high-impact tech ecosystem in the city. By creating a space for students to build, connect, and grow together, it aims to lay the foundation for a thriving hackathon community in Lucknow, one that continuously drives innovation, opportunity, and technical excellence forward!
                        </p>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white mb-4">
                          Themes
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-1">
                              The Architect
                            </h3>
                            <p className="text-xs text-white/70 leading-relaxed">
                              Build tools for builders. Create agents that auto-fix bugs, refactor legacy code, or automate deployments. <em className="text-[var(--brand-coral)] block mt-1">Ex: Auto-fix runtime errors &amp; push hotfixes.</em>
                            </p>
                          </div>
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-1">
                              The Investigator
                            </h3>
                            <p className="text-xs text-white/70 leading-relaxed">
                              Process information at scale. Design agents that scrape complex web structures, analyze unstructured data, and generate actionable insights. <em className="text-[var(--brand-coral)] block mt-1">Ex: Monitor crypto-sentiment on 50+ subreddits.</em>
                            </p>
                          </div>
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-1">
                              The Artist
                            </h3>
                            <p className="text-xs text-white/70 leading-relaxed">
                              Automate art. Build agents that edit video, generate assets, and tell stories autonomously. <em className="text-[var(--brand-coral)] block mt-1">Ex: Autonomous news anchor from RSS feeds.</em>
                            </p>
                          </div>
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-1">
                              The Liaison
                            </h3>
                            <p className="text-xs text-white/70 leading-relaxed">
                              Unify the fractured web. Connect the disconnected. Stitch together daily use applications into one seamless workflow. <em className="text-[var(--brand-coral)] block mt-1">Ex: Sync calendar based on email priority.</em>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          Prizes
                        </h2>
                        <p className="text-sm text-white/60 mb-4">
                          Compete for a ₹35K prize pool. Get a participation certificate on completion.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                            <div className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider mb-1">
                              First Place
                            </div>
                            <div className="text-xl font-black text-white">₹ 20,000</div>
                            <div className="text-[10px] text-white/50 mt-0.5">1 winner</div>
                          </div>
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                            <div className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider mb-1">
                              Second Place
                            </div>
                            <div className="text-xl font-black text-white">₹ 10,000</div>
                            <div className="text-[10px] text-white/50 mt-0.5">1 winner</div>
                          </div>
                          <div className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                            <div className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider mb-1">
                              Third Place
                            </div>
                            <div className="text-xl font-black text-white">₹ 5,000</div>
                            <div className="text-[10px] text-white/50 mt-0.5">1 winner</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                          Partners &amp; Sponsors
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {/* GitHub Card */}
                          <div className="relative overflow-hidden bg-white rounded-2xl border border-neutral-200 shadow-md p-6 flex flex-col items-center justify-center min-h-[180px] text-center hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#97192C]" />
                            <div className="h-16 flex items-center justify-center w-full">
                              <img
                                src="/partners/github.jpg"
                                alt="GitHub Logo"
                                className="h-14 w-auto object-contain"
                              />
                            </div>
                            <span className="font-bold text-neutral-900 text-sm mt-3">GitHub</span>
                            <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#791423] tracking-wide">
                              Platinum
                            </span>
                          </div>

                          {/* Notion Card */}
                          <div className="relative overflow-hidden bg-white rounded-2xl border border-neutral-200 shadow-md p-6 flex flex-col items-center justify-center min-h-[180px] text-center hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#97192C]" />
                            <div className="h-16 flex items-center justify-center w-full">
                              <img
                                src="/partners/notion.png"
                                alt="Notion Logo"
                                className="h-14 w-auto object-contain"
                              />
                            </div>
                            <span className="font-bold text-neutral-900 text-sm mt-3">Notion</span>
                            <span className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#791423] tracking-wide">
                              Gold
                            </span>
                          </div>

                          {/* Pure Buttons Card */}
                          <div className="relative overflow-hidden bg-white rounded-2xl border border-neutral-200 shadow-md p-6 flex flex-col items-center justify-center min-h-[180px] text-center hover:shadow-lg transition-all duration-300">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#97192C]" />
                            <div className="h-16 flex items-center justify-center w-full">
                              <img
                                src="/partners/pure_buttons.png"
                                alt="Pure Buttons Logo"
                                className="h-10 w-auto object-contain"
                              />
                            </div>
                            <span className="font-bold text-neutral-900 text-sm mt-3">Pure Buttons</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Event Quick Info */}
                      <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                        {[
                          {
                            icon: <Calendar className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Date",
                            value: hack4goodEvent.dateLabel,
                          },
                          {
                            icon: <MapPin className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Venue",
                            value: hack4goodEvent.venueLabel,
                          },
                          {
                            icon: <Users className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Team Size",
                            value: hack4goodEvent.teamSizeLabel,
                          },
                          {
                            icon: <Trophy className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Total Prizes",
                            value: hack4goodEvent.prizePoolLabel,
                          },
                          {
                            icon: <Eye className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Impressions",
                            value: hack4goodEvent.impressionsLabel,
                          },
                          {
                            icon: <Activity className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Registrations",
                            value: hack4goodEvent.registrationsLabel,
                          },
                          {
                            icon: <Users className="h-4 w-4 text-(--brand-pink)" />,
                            label: "On Ground",
                            value: `${hack4goodEvent.onGroundLabel} people`,
                          },
                          {
                            icon: <Check className="h-4 w-4 text-(--brand-pink)" />,
                            label: "Status",
                            value: hack4goodEvent.statusLabel,
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="flex items-center justify-between px-5 py-3.5"
                          >
                            <div className="flex items-center gap-2.5">
                              {s.icon}
                              <span className="text-xs text-white/60 font-medium">
                                {s.label}
                              </span>
                            </div>
                            <span className="text-xs font-black text-white text-right">
                              {s.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Event Timeline */}
                      <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                          Schedule
                        </h3>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                              <div className="w-px h-full bg-white/10" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Registration</p>
                              <p className="text-[10px] text-white/50">02 Apr – 28 Apr 2026 (Online)</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                              <div className="w-px h-full bg-white/10" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Team Formation</p>
                              <p className="text-[10px] text-white/50">02 Apr – 28 Apr 2026 (Online)</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                              <div className="w-px h-full bg-white/10" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Idea Submission</p>
                              <p className="text-[10px] text-white/50">07 Apr – 28 Apr 2026 (Online · Elimination)</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-[var(--brand-coral)]" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">Coding Round</p>
                              <p className="text-[10px] text-white/50">02 May (12:00 PM) – 03 May (11:00 AM) (Offline · 24H)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Event Support */}
                      <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                          Support &amp; Contacts
                        </h3>
                        <div className="text-xs space-y-2 text-white/70">
                          <div>
                            <p className="font-bold text-white">Event Organization</p>
                            <a href="mailto:hack4good.cc@gmail.com" className="text-(--brand-pink) hover:underline block mt-0.5">
                              hack4good.cc@gmail.com
                            </a>
                          </div>
                          <div className="pt-1">
                            <p className="font-bold text-white">Nitya Pandey</p>
                            <p className="text-[10px] text-white/50">Lead Organizer</p>
                            <a href="mailto:nityaaaawwww@gmail.com" className="text-(--brand-pink) hover:underline block mt-0.5">
                              nityaaaawwww@gmail.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aftermovie Video Player */}
                  <div className="mt-16 border-t border-white/10 pt-12 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          Event Aftermovie
                        </h3>
                        <p className="text-sm text-white/65">
                          Highlights and on-floor moments from Hack4Good v0 in Lucknow.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                          Aftermovie
                        </span>
                        <span className="inline-flex items-center rounded-full border border-(--brand-pink)/40 bg-(--brand-pink)/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-(--brand-pink)">
                          May 2026
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/15 bg-black/40 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-md">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(228,90,146,0.15),transparent_50%)]" />
                      <video
                        className="relative z-10 w-full max-h-[75vh] object-contain rounded-[1rem] border border-white/10 bg-black"
                        controls
                        playsInline
                        preload="metadata"
                        poster="/event_pictures/h4g/h4g.jpg"
                      >
                        <source
                          src="/event_pictures/h4g/h4g.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div className="mt-16 border-t border-white/10 pt-12">
                    <Gallery4
                      title="In Pictures"
                      description="Moments from the 24-hour Agentic AI hacking sprint."
                      items={[
                        {
                          id: "h4g-pic0",
                          title: "Hack4Good Hackathon",
                          description: "Teams hacking on autonomous agent workflows.",
                          href: "#",
                          image: "/event_pictures/h4g/h4g0.jpg",
                        },
                        {
                          id: "h4g-pic1",
                          title: "Hardware & AI Devs",
                          description: "Collaborative building and prompt testing.",
                          href: "#",
                          image: "/event_pictures/h4g/h4g1.jpg",
                        },
                        {
                          id: "h4g-pic2",
                          title: "Project Iteration",
                          description: "Mentoring sessions and agent execution loops.",
                          href: "#",
                          image: "/event_pictures/h4g/h4g2.jpeg",
                        },
                        {
                          id: "h4g-pic3",
                          title: "D-Day Coding Sprint",
                          description: "Building autonomous systems under high velocity.",
                          href: "#",
                          image: "/event_pictures/h4g/h4g3.jpg",
                        },
                        {
                          id: "h4g-pic4",
                          title: "Pitching Session",
                          description: "Showcasing agent deployments to the evaluators.",
                          href: "#",
                          image: "/event_pictures/h7g.jpeg",
                        },
                      ]}
                    />
                  </div>
                </div>
              </GlassContainer>
            )}


            {/* ── Lucknow Build Guild ───────────────────────────────────────── */}
            {(activeEvent === "all" || activeEvent === "lucknow-build-guild") && (
                <GlassContainer
                  glowColor="pink"
                  animated={false}
                  className="overflow-hidden"
                  noEntry
                >
                  {/* ── Banner image header ── */}
                  <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5">
                    <Image
                      src="/images/lko-build-guild.jpg"
                      alt="Lucknow Build Guild"
                      width={1920}
                      height={640}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                  {/* ── Details grid ── */}
              <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                    <div>
                      <span className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider block mb-1">
                        Archived · Apr 19, 2026
                      </span>
                      <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                        Lucknow Build Guild
                      </h2>
                      <p className="text-sm text-white/70 mt-1">
                        Free hardware workshop and meetup in Lucknow.
                      </p>
                    </div>
                  </div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                    Archived Event
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    Sponsored* by Bits&amp;Bytes
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="prose prose-invert max-w-none text-white/80 space-y-6 lg:col-span-2">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Event Summary
                      </h2>
                      <p>
                        Lucknow Build Guild was a free hardware workshop and
                        meetup on <strong>19 April</strong> at{" "}
                        <strong>SureStay by Best Western</strong>. People came
                        to build hardware, meet other builders, and learn from
                        each other.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        What we worked on
                      </h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Hands-on hardware building and practical workflows.
                        </li>
                        <li>Meeting local tech people.</li>
                        <li>Peer learning with a room full of builders.</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Host
                      </h2>
                      <p>
                        Event host:{" "}
                        <strong>{lucknowBuildGuildEvent.hostName}</strong>.
                        Explore:{" "}
                        <Link
                          href={lucknowBuildGuildEvent.hostLinktree}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-(--brand-pink) hover:underline underline-offset-2"
                        >
                          Linktree
                        </Link>{" "}
                        and{" "}
                        <Link
                          href={lucknowBuildGuildEvent.hostGithub}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-(--brand-pink) hover:underline underline-offset-2"
                        >
                          GitHub
                        </Link>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                      {[
                        {
                          icon: (
                            <Calendar className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Date",
                          value: lucknowBuildGuildEvent.dateLabel,
                        },
                        {
                          icon: (
                            <MapPin className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Venue",
                          value: lucknowBuildGuildEvent.venueLabel,
                        },
                        {
                          icon: (
                            <Users className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Format",
                          value: lucknowBuildGuildEvent.formatLabel,
                        },
                        {
                          icon: (
                            <Check className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Status",
                          value: lucknowBuildGuildEvent.statusLabel,
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between px-5 py-3.5"
                        >
                          <div className="flex items-center gap-2.5">
                            {s.icon}
                            <span className="text-sm text-white/60 font-medium">
                              {s.label}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white text-right">
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className="w-full rounded-2xl bg-white/10 border border-white/20 py-5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <Link
                        href={lucknowBuildGuildEvent.eventSite}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Event Website
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-12">
                  <Gallery4
                    title="In Pictures"
                    description=""
                    items={[
                      {
                        id: "lbg-1",
                        title: "Lucknow Build Guild",
                        description: "Free hardware workshop and meetup",
                        href: "#",
                        image: "/event_pictures/bd1.jpg",
                      },
                      {
                        id: "lbg-2",
                        title: "Lucknow Build Guild",
                        description: "Free hardware workshop and meetup",
                        href: "#",
                        image: "/event_pictures/bd2.jpg",
                      },
                      {
                        id: "lbg-3",
                        title: "Lucknow Build Guild",
                        description: "Free hardware workshop and meetup",
                        href: "#",
                        image: "/event_pictures/bd3.jpg",
                      },
                      {
                        id: "lbg-4",
                        title: "Lucknow Build Guild",
                        description: "Free hardware workshop and meetup",
                        href: "#",
                        image: "/event_pictures/bd4.jpg",
                      },
                      {
                        id: "lbg-5",
                        title: "Lucknow Build Guild",
                        description: "Free hardware workshop and meetup",
                        href: "#",
                        image: "/event_pictures/bd5.jpg",
                      },
                    ]}
                  />
                </div>
              </div>
            </GlassContainer>
        )}

        {/* ── GitHub Copilot Dev Days — Featured Spotlight ──────────────── */}
        {(activeEvent === "all" || activeEvent === "copilot") && (
            <GlassContainer
              glowColor="pink"
              animated={false}
              className="overflow-hidden"
              noEntry
            >
              {/* ── Banner image header ── */}
              <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5">
                <Image
                  src="/images/copilot-dev-day.png"
                  alt="GitHub Copilot Dev Days | Lucknow"
                  width={1920}
                  height={640}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* ── Details grid ── */}
              <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                    <div>
                      <span className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider block mb-1">
                        Archived · Apr 19
                      </span>
                      <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                        GitHub Copilot Dev Days | Lucknow
                      </h2>
                      <p className="text-sm text-white/70 mt-1">
                        AI-assisted coding with GitHub Copilot, a community developer event.
                      </p>
                    </div>
                  </div>
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                    Archived Event
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    Hosted by Bits&amp;Bytes
                  </span>
                </div>

                {/* Stats + details two-column */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="prose prose-invert max-w-none text-white/80 space-y-6 lg:col-span-2">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Event Summary
                      </h2>
                      <p>
                        A community developer event in Lucknow where students
                        and developers explored how AI-assisted development
                        works in real projects.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        What we covered
                      </h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          How GitHub Copilot works inside modern dev
                          environments.
                        </li>
                        <li>
                          Integrating AI-assisted coding into real workflows.
                        </li>
                        <li>Prompt techniques for better code suggestions.</li>
                        <li>
                          Using AI responsibly in your development workflow.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Partners & Details
                      </h2>
                      <p>
                        The event was hosted by <strong>bits&bytes™</strong>,
                        with community partners including{" "}
                        <strong>Coding Connoisseurs</strong>,{" "}
                        <strong>Aryan Singh</strong>, and{" "}
                        <strong>Notion Lucknow</strong>. All participants
                        observed the official{" "}
                        <Link
                          href="https://www.microsoft.com/en-us/events/code-of-conduct"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-(--brand-pink) hover:underline underline-offset-2"
                        >
                          GitHub Event Code of Conduct
                        </Link>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                      {[
                        {
                          icon: (
                            <Calendar className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Date",
                          value: githubDevDayEvent.dateLabel,
                        },
                        {
                          icon: (
                            <MapPin className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Venue",
                          value: githubDevDayEvent.venueLabel,
                        },
                        {
                          icon: (
                            <Users className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Format",
                          value: githubDevDayEvent.formatLabel,
                        },
                        {
                          icon: (
                            <Check className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Status",
                          value: githubDevDayEvent.statusLabel,
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between px-5 py-3.5"
                        >
                          <div className="flex items-center gap-2.5">
                            {s.icon}
                            <span className="text-sm text-white/60 font-medium">
                              {s.label}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white text-right">
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                      <a
                        href={githubDevDayEvent.lumaCheckoutUrl}
                        className="luma-checkout--button inline-flex w-full items-center justify-center rounded-xl bg-(--brand-pink) px-4 py-3 text-sm font-bold text-white transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.01] active:scale-[0.97] hover:brightness-110"
                        data-luma-action="checkout"
                        data-luma-event-id={githubDevDayEvent.lumaEventId}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register for Event
                      </a>
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-white/10 border border-white/20 py-5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <Link
                        href={githubDevDayEvent.archiveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Event Archive
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* ── Gallery ── */}
                <div className="mt-16 border-t border-white/10 pt-12">
                  <Gallery4
                    title="In Pictures"
                    description=""
                    items={[
                      {
                        id: "dev-1",
                        title: "GitHub Copilot Dev Days",
                        description: "Community Developer Event",
                        href: "#",
                        image: "/event_pictures/devday.jpeg",
                      },
                      {
                        id: "dev-2",
                        title: "GitHub Copilot Dev Days",
                        description: "Community Developer Event",
                        href: "#",
                        image: "/event_pictures/devday2.jpeg",
                      },
                      {
                        id: "dev-3",
                        title: "GitHub Copilot Dev Days",
                        description: "Community Developer Event",
                        href: "#",
                        image: "/event_pictures/devday3.jpeg",
                      },
                      {
                        id: "dev-4",
                        title: "GitHub Copilot Dev Days",
                        description: "Community Developer Event",
                        href: "#",
                        image: "/event_pictures/devday4.jpeg",
                      },
                      {
                        id: "dev-5",
                        title: "GitHub Copilot Dev Days",
                        description: "Community Developer Event",
                        href: "#",
                        image: "/event_pictures/founder-s.jpeg",
                      },
                    ]}
                  />
                </div>
              </div>
            </GlassContainer>
        )}

        {/* ── Execron 1.0 ─────────────────────────────────────────────────── */}
        {(activeEvent === "all" || activeEvent === "execron") && (
            <GlassContainer
              glowColor="pink"
              animated={false}
              className="overflow-hidden"
              noEntry
            >
              {/* ── Banner image header ── */}
              <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5 flex items-center justify-center min-h-[320px] border-b border-white/10">
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                    <Activity className="h-12 w-12 text-(--brand-pink)" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-white mb-2">
                    Execron 1.0
                  </h3>
                  <p className="text-white/60 font-medium">
                    Build. Break. Repeat. Ship Something Real.
                  </p>
                </div>
              </div>

              {/* ── Details ── */}
              <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                    <div>
                      <span className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider block mb-1">
                        Archived · Mar 19-22, 2026
                      </span>
                      <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                        Execron 1.0
                      </h2>
                      <p className="text-sm text-white/70 mt-1">
                        AI Hackathon & Workshop for Teens at IIT Kanpur.
                      </p>
                    </div>
                  </div>
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                    Archived Event
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    <Trophy className="h-3 w-3 text-(--brand-pink)" />
                    In Collaboration with TechKriti '26, IIT Kanpur
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    <Building2 className="h-3 w-3 text-(--brand-pink)" />
                    IIT Kanpur
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="prose prose-invert max-w-none text-white/80 space-y-6 lg:col-span-2">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Event Summary
                      </h2>
                      <p>
                        An AI Hackathon & Workshop for students in{" "}
                        <strong>Classes 9–12</strong>. In collaboration with{" "}
                        <strong>TechKriti '26, IIT Kanpur</strong>. A 4-hour
                        workshop followed by a 24-hour hackathon sprint.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        What happened
                      </h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          A 4-hour hands-on workshop on modern tech topics.
                        </li>
                        <li>A 24-hour hackathon sprint with mentor support.</li>
                        <li>
                          Mentorship from IIT Kanpur alumni and industry
                          experts.
                        </li>
                        <li>
                          Full access to TechKriti '26: mega hackathons, pro
                          shows, and the robotics expo.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Topics Covered
                      </h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>AI & ML</strong> — Models and real-world AI
                          applications.
                        </li>
                        <li>
                          <strong>Web Development</strong> — Modern frameworks
                          and responsive design.
                        </li>
                        <li>
                          <strong>App Development</strong> — Mobile creation and
                          UI/UX.
                        </li>
                        <li>
                          <strong>Cybersecurity</strong> — Ethical hacking and
                          fundamentals.
                        </li>
                        <li>
                          <strong>Cloud Computing</strong> — Platforms and
                          deployment.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Schedule
                      </h2>
                      <p>
                        Workshop batches were held from{" "}
                        <strong>19–21 March 2026</strong>. The grand finale took
                        place on <strong>22 March 2026</strong>. Team sizes
                        ranged from 1 to 4 members. Registration closed on 18
                        March 2026.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                      {[
                        {
                          icon: (
                            <Calendar className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Date",
                          value: "Mar 19–22, 2026",
                        },
                        {
                          icon: (
                            <MapPin className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Venue",
                          value: "IIT Kanpur",
                        },
                        {
                          icon: (
                            <Users className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Team Size",
                          value: "1–4 members",
                        },
                        {
                          icon: (
                            <Building2 className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Partners",
                          value: "ByteForge, bits&bytes™",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between px-5 py-3.5"
                        >
                          <div className="flex items-center gap-2.5">
                            {s.icon}
                            <span className="text-sm text-white/60 font-medium">
                              {s.label}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white text-right">
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className="w-full rounded-2xl bg-white/10 border border-white/20 py-5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <Link
                        href="https://byteforge.paxus.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Official Site (Archived)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-12">
                  <Gallery4
                    title="In Pictures"
                    description=""
                    items={[
                      {
                        id: "ex-1",
                        title: "Execron 1.0",
                        description: "AI Hackathon & Workshop for Teens",
                        href: "#",
                        image: "/event_pictures/byteforge1.webp",
                      },
                      {
                        id: "ex-2",
                        title: "Execron 1.0",
                        description: "AI Hackathon & Workshop for Teens",
                        href: "#",
                        image: "/event_pictures/byteforge2.webp",
                      },
                      {
                        id: "ex-3",
                        title: "Execron 1.0",
                        description: "AI Hackathon & Workshop for Teens",
                        href: "#",
                        image: "/event_pictures/byteforge3.webp",
                      },
                      {
                        id: "ex-4",
                        title: "Execron 1.0",
                        description: "AI Hackathon & Workshop for Teens",
                        href: "#",
                        image: "/event_pictures/byteforge4.webp",
                      },
                      {
                        id: "ex-5",
                        title: "Execron 1.0",
                        description: "AI Hackathon & Workshop for Teens",
                        href: "#",
                        image: "/event_pictures/byteforge5.webp",
                      },
                    ]}
                  />
                </div>
              </div>
            </GlassContainer>
        )}

        {/* ── India Innovates 2026 ──────────────────────────────────────── */}
        {(activeEvent === "all" || activeEvent === "india-innovates") && (
            <GlassContainer
              glowColor="pink"
              animated={false}
              className="overflow-hidden"
              noEntry
            >
              {/* ── Banner image header ── */}
              <div className="relative w-full overflow-hidden rounded-t-[2.25rem] bg-white/5">
                <Image
                  src="/images/banner.jpeg"
                  alt="India Innovates 2026 — Bharat Mandapam, New Delhi"
                  width={1920}
                  height={640}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* ── Details grid ── */}
              <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                    <div>
                      <span className="text-xs font-bold text-[var(--brand-coral)] uppercase tracking-wider block mb-1">
                        Archived · Mar 28, 2026
                      </span>
                      <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                        India Innovates 2026
                      </h2>
                      <p className="text-sm text-white/70 mt-1">
                        World's Largest Civic Tech Hackathon.
                      </p>
                    </div>
                  </div>
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                    Archived Event
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    <Trophy className="h-3 w-3 text-(--brand-pink)" />
                    Official Executive Partner: bits&bytes™
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="prose prose-invert max-w-none text-white/80 space-y-6 lg:col-span-2">
                    <p className="text-lg text-white font-medium">
                      <strong>India Innovates 2026</strong> is now archived.{" "}
                      <strong>bits&bytes™ (GobitsnBytes)</strong> was listed as
                      the <strong>Official Executive Partner</strong> for the
                      finale.
                    </p>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Event Summary
                      </h2>
                      <p>
                        India Innovates 2026 was presented as the{" "}
                        <strong>World's Largest Civic Tech Hackathon</strong>,
                        held on <strong>March 28, 2026</strong> at{" "}
                        <strong>
                          Bharat Mandapam, Pragati Maidan, New Delhi
                        </strong>{" "}
                        (9 AM - 7 PM). Organizers included{" "}
                        <strong>HN Group</strong> and <strong>MCD</strong>, with
                        partner institutions such as{" "}
                        <strong>IIT Kharagpur, NSUT, GGSIPU, and DDU</strong>.{" "}
                        <Link
                          href="https://indiainnovates.org"
                          target="_blank"
                          className="text-(--brand-pink) hover:underline"
                        >
                          [indiainnovates]
                        </Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Scale
                      </h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>1.26 crore+</strong> total applicants
                          nationwide.{" "}
                          <Link
                            href="https://www.tribuneindia.com/news/j-k/ju-team-among-top-15-at-india-innovates-2026/"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [tribuneindia]
                          </Link>
                        </li>
                        <li>
                          <strong>28,000+ to 5,000+ to 15 teams</strong> across
                          three elimination rounds.{" "}
                          <Link
                            href="https://www.dailyexcelsior.com/ju-students-outshine-at-india-innovates-2026/"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [dailyexcelsior]
                          </Link>
                        </li>
                        <li>
                          <strong>₹10 lakh+</strong> prize pool, including{" "}
                          <strong>₹1L, ₹75K, ₹50K, and ₹25K per domain</strong>.{" "}
                          <Link
                            href="https://indiainnovates.org"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [indiainnovates]
                          </Link>
                        </li>
                        <li>
                          Domains:{" "}
                          <strong>
                            Urban Solutions, Digital Democracy, and Open
                            Innovation
                          </strong>
                          .{" "}
                          <Link
                            href="https://indiainnovates.org"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [indiainnovates]
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Finale Format
                      </h2>
                      <p>
                        It was not a build-on-site round. Teams developed in
                        advance, and the final day focused on{" "}
                        <strong>live product demonstrations</strong> reviewed by
                        investors, officials, diplomats, and founders.{" "}
                        <Link
                          href="https://indiainnovates.org"
                          target="_blank"
                          className="text-(--brand-pink) hover:underline"
                        >
                          [indiainnovates]
                        </Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Dignitaries and Finalists
                      </h2>
                      <p>
                        Confirmed attendees included{" "}
                        <strong>Delhi CM Rekha Gupta</strong>, the{" "}
                        <strong>Bihar Assembly Speaker</strong>, and{" "}
                        <strong>MP Manoj Tiwari (North East Delhi)</strong>.{" "}
                        <Link
                          href="https://www.newdelhitimes.com/delhi-cm-rekha-gupta-attends-india-innovates-2026-hackathon-highlights-youth-driven-innovation/"
                          target="_blank"
                          className="text-(--brand-pink) hover:underline"
                        >
                          [newdelhitimes]
                        </Link>
                      </p>
                      <p>
                        <strong>Team Dupahar</strong> from the University of
                        Jammu reached the Top 15 and was reported as the only
                        finalist team from J&K.{" "}
                        <Link
                          href="https://www.tribuneindia.com/news/j-k/ju-team-among-top-15-at-india-innovates-2026/"
                          target="_blank"
                          className="text-(--brand-pink) hover:underline"
                        >
                          [tribuneindia]
                        </Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        What happened after
                      </h2>
                      <p>
                        Following the finale, selected teams entered a{" "}
                        <strong>ministry-level presentation stage</strong> for
                        post-event review and exposure.{" "}
                        <Link
                          href="https://indiainnovates.org"
                          target="_blank"
                          className="text-(--brand-pink) hover:underline"
                        >
                          [indiainnovates]
                        </Link>
                      </p>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        Press coverage
                      </h2>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <code>#IndiaInnovates2026</code> was trending on X
                          (Twitter) on event day.{" "}
                          <Link
                            href="https://x.com/search?q=%23IndiaInnovates2026"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [x]
                          </Link>
                        </li>
                        <li>
                          Event updates were also posted by Delhi CM via
                          official channels.{" "}
                          <Link
                            href="https://www.newdelhitimes.com/delhi-cm-rekha-gupta-attends-india-innovates-2026-hackathon-highlights-youth-driven-innovation/"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [newdelhitimes]
                          </Link>
                        </li>
                        <li>
                          Coverage includes Tribune India, Daily Excelsior, and
                          New Delhi Times.{" "}
                          <Link
                            href="https://www.dailyexcelsior.com/ju-students-outshine-at-india-innovates-2026/"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [dailyexcelsior]
                          </Link>
                        </li>
                        <li>
                          The @hn.india account described it as a historic
                          moment involving 5,000 innovators.{" "}
                          <Link
                            href="https://www.instagram.com/p/DWMfnECE8Eu/"
                            target="_blank"
                            className="text-(--brand-pink) hover:underline"
                          >
                            [instagram]
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                      {[
                        {
                          icon: (
                            <Calendar className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Date",
                          value: "Mar 28, 2026",
                        },
                        {
                          icon: (
                            <MapPin className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Venue",
                          value: "Bharat Mandapam, New Delhi",
                        },
                        {
                          icon: (
                            <Users className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Scale",
                          value: "1.26 crore+ applicants",
                        },
                        {
                          icon: (
                            <Check className="h-4 w-4 text-(--brand-pink)" />
                          ),
                          label: "Status",
                          value: "Concluded",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="flex items-center justify-between px-5 py-3.5"
                        >
                          <div className="flex items-center gap-2.5">
                            {s.icon}
                            <span className="text-sm text-white/60 font-medium">
                              {s.label}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white text-right">
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      asChild
                      className="w-full rounded-2xl bg-white/10 border border-white/20 py-5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      <Link
                        href="https://indiainnovates.org"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Official Site (Archived)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-12 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Event Video
                      </h3>
                      <p className="text-sm text-white/65">
                        Stage highlights and on-floor moments from the finale.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        Archive Footage
                      </span>
                      <span className="inline-flex items-center rounded-full border border-(--brand-pink)/40 bg-(--brand-pink)/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-(--brand-pink)">
                        March 2026
                      </span>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/15 bg-black/40 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-md">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(228,90,146,0.15),transparent_50%)]" />
                    <video
                      className="relative z-10 w-full max-h-[75vh] object-contain rounded-[1rem] border border-white/10 bg-black"
                      controls
                      playsInline
                      preload="metadata"
                      poster="/event_pictures/HEe923ub0AE-92F.jpg"
                    >
                      <source
                        src="/event_pictures/india-innovates-2026-stage-address.mp4"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-12">
                  <Gallery4
                    title="In Pictures"
                    description=""
                    items={[
                      {
                        id: "img-1",
                        title: "Opening Address",
                        description:
                          "Main stage opening session at India Innovates 2026.",
                        href: "#",
                        image: "/event_pictures/HEe93oOakAAi2Mi.jpg",
                      },
                      {
                        id: "img-2",
                        title: "Plenary Session",
                        description:
                          "Live address from the central stage at Bharat Mandapam.",
                        href: "#",
                        image: "/event_pictures/HEe923ub0AE-92F.jpg",
                      },
                      {
                        id: "img-3",
                        title: "Jury Interaction",
                        description:
                          "On-floor demo review with students and evaluators.",
                        href: "#",
                        image:
                          "/event_pictures/866d62697f3d42819e2007714047a3a80001af45.jpg",
                      },
                      {
                        id: "img-4",
                        title: "Participant Teams",
                        description:
                          "Student teams preparing for demonstrations in the main hall.",
                        href: "#",
                        image:
                          "/event_pictures/3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg",
                      },
                      {
                        id: "img-5",
                        title: "Build Table",
                        description:
                          "Final-stage hardware and prototype iteration under evaluation windows.",
                        href: "#",
                        image:
                          "/event_pictures/1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg",
                      },
                      {
                        id: "img-6",
                        title: "Hall View",
                        description:
                          "Full auditorium turnout during keynote and showcase rounds.",
                        href: "#",
                        image: "/event_pictures/HEe923uagAATqvy.jpg",
                      },
                    ]}
                  />
                </div>
              </div>
            </GlassContainer>
        )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>
      <Script
        id="luma-checkout"
        src="https://embed.lu.ma/checkout-button.js"
        strategy="afterInteractive"
      />
    </>
  );
}

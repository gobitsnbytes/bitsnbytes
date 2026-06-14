"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowUp,
  Mail,
  ChevronDown
} from "lucide-react";
import { githubDevDayEvent, lucknowBuildGuildEvent, hack4goodEvent } from "@/lib/events-data";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

// Starburst component for retro branding
const Starburst = ({ className = "text-[#97192c]", size = 32 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M50 0 L58 28 L85 15 L70 39 L97 50 L70 61 L85 85 L58 72 L50 100 L42 72 L15 85 L30 61 L3 50 L30 39 L15 15 L42 28 Z" />
  </svg>
);

// Sparkle Star icon
const SparkleStar = ({ className = "text-[#fc920d]", size = 16 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
);

// Custom Neobrutalist Horizontal Image Gallery Slider
function NeobrutalistGallery({ 
  title, 
  items 
}: { 
  title: string; 
  items: Array<{ id: string; title: string; description: string; image: string }> 
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-mono text-sm font-black uppercase text-[#97192c] border-b border-[#120f0a]/15 pb-2">
        {title}
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] scrollbar-color-[#97192c] [#eae8e4] -mx-4 px-4 sm:mx-0 sm:px-0">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="shrink-0 w-[280px] sm:w-[320px] bg-white border-[3px] border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] p-2 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#120f0a] transition-all"
          >
            <div className="aspect-[4/3] relative w-full overflow-hidden border-2 border-[#120f0a]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 260px, 300px"
                className="object-cover"
              />
            </div>
            <div className="mt-2 p-1">
              <h5 className="font-mono text-xs font-black uppercase truncate text-[#120f0a]">{item.title}</h5>
              <p className="text-[10px] text-[#716f6c] truncate mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Events() {
  const [activeEvent, setActiveEvent] = useState<
    "all" | "hack4good" | "lucknow-build-guild" | "copilot" | "execron" | "india-innovates"
  >("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#eae8e4] text-[#120f0a] pt-28 pb-20 relative z-10 font-sans selection:bg-[#fc920d] selection:text-[#120f0a]">
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.06] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Banner Header */}
        <header className="mb-12 border-b-4 border-[#120f0a] pb-10 relative">
          <div className="absolute -right-6 -top-6 hidden md:block animate-spin-slow">
            <Starburst size={90} className="text-[#97192c]" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#97192c] text-white border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fc920d] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#fc920d]" />
              </span>
              Event Log
            </span>
            <span className="text-xs font-mono text-[#716f6c] font-semibold">
              GOBITSNBYTES FOUNDATION
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#120f0a] leading-none mb-6">
            Where code meets <br />
            <span className="bg-[#fc920d] px-2 py-0.5 border-[3px] border-[#120f0a] inline-block shadow-[4px_4px_0px_0px_#120f0a] -rotate-1">the real world</span>
          </h1>

          <p className="font-serif-brand text-lg md:text-xl text-[#413f3b] max-w-[70ch] leading-relaxed">
            Hackathons, summits, and workshops where teen builders actually ship things.
          </p>

          {/* Quick Highlight Cards */}
          <div className="flex flex-wrap gap-2.5 mt-6">
            {["High Agency Shipping", "IIT Kanpur & Delhi Summits", "National Scale Partners"].map((hl, idx) => (
              <span key={idx} className="bg-white border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#120f0a] flex items-center gap-1">
                <SparkleStar size={10} className="text-[#97192c]" />
                {hl}
              </span>
            ))}
          </div>
        </header>

        {/* ── Event Toggle Tabs ────────────────────────────────────────── */}
        <div 
          className="flex flex-wrap items-center gap-2.5 mb-10 text-xs font-mono font-bold"
          role="tablist"
          aria-label="Filter events"
        >
          {[
            { id: "all", label: "All Events" },
            { id: "hack4good", label: "Archived: Hack4Good" },
            { id: "lucknow-build-guild", label: "Build Guild" },
            { id: "copilot", label: "Copilot Days" },
            { id: "execron", label: "Execron 1.0" },
            { id: "india-innovates", label: "India Innovates" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveEvent(tab.id as any)}
              aria-selected={activeEvent === tab.id}
              role="tab"
              className={`border-2 border-[#120f0a] px-4 py-2 transition-all shadow-[2.5px_2.5px_0px_0px_#120f0a] uppercase tracking-wide ${
                activeEvent === tab.id
                  ? "bg-[#fc920d] text-[#120f0a] translate-x-[1.5px] translate-y-[1.5px] shadow-[1px_1px_0px_0px_#120f0a]"
                  : "bg-white text-[#716f6c] hover:text-[#120f0a] hover:bg-neutral-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* main list container */}
        <div className="space-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {/* ── Hack4Good v0 ────────────────────────────────────────────── */}
              {(activeEvent === "all" || activeEvent === "hack4good") && (
                <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] relative overflow-hidden">
                  
                  {/* Banner image */}
                  <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] border-b-4 border-[#120f0a] overflow-hidden bg-neutral-100">
                    <Image
                      src="/event_pictures/h4g/h4gbanner.jpg"
                      alt="Hack4Good v0 Banner"
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Two-Column details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    {/* Left Column: Description & Details */}
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
                      <div>
                        <span className="inline-block bg-[#fee9cf] text-[#120f0a] border-2 border-[#120f0a] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a] mb-2.5">
                          Archived · Apr 2 – May 3, 2026
                        </span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-[#120f0a]">
                          Hack4Good v0
                        </h2>
                        <p className="font-serif-brand text-base leading-relaxed text-[#413f3b] mt-2">
                          Architect Your Autonomy. Lucknow's first Agentic AI hackathon.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["Archived Event", "Community Partner: bits&bytes™", "Agentic AI"].map((tag, idx) => (
                          <span key={idx} className="bg-[#f7f1ec] border border-[#120f0a] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Event Summary
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          Hack4Good v0 is a 24-hour Agentic AI hackathon created to kickstart and shape a stronger hackathon and builder culture in Lucknow. At its core, the event is about moving beyond traditional coding and enabling students to build intelligent AI agents capable of planning workflows, navigating systems, and executing tasks autonomously.
                        </p>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          Bringing together student developers, beginners, and curious builders, Hack4Good focuses on hands-on experimentation, collaboration, and real-world problem solving. Participants explore diverse ideas, right from automation tools to creative systems, all while learning how to design and build with emerging AI paradigms.
                        </p>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          More than just a simple hackathon, Hack4Good is an effort to establish a sustainable, high-impact tech ecosystem in the city. By creating a space for students to build, connect, and grow together, it aims to lay the foundation for a thriving hackathon community in Lucknow!
                        </p>
                      </div>

                      {/* Themes */}
                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Themes
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {[
                            {
                              t: "The Architect",
                              d: "Build tools for builders. Create agents that auto-fix bugs, refactor legacy code, or automate deployments. Ex: Auto-fix runtime errors & push hotfixes."
                            },
                            {
                              t: "The Investigator",
                              d: "Process information at scale. Design agents that scrape complex web structures, analyze unstructured data, and generate actionable insights. Ex: Monitor crypto-sentiment on 50+ subreddits."
                            },
                            {
                              t: "The Artist",
                              d: "Automate art. Build agents that edit video, generate assets, and tell stories autonomously. Ex: Autonomous news anchor from RSS feeds."
                            },
                            {
                              t: "The Liaison",
                              d: "Unify the fractured web. Connect the disconnected. Stitch together daily use applications into one seamless workflow. Ex: Sync calendar based on email priority."
                            }
                          ].map((theme, idx) => (
                            <div key={idx} className="bg-white border-2 border-[#120f0a] p-4 shadow-[3px_3px_0px_0px_#120f0a]">
                              <h4 className="font-bold text-xs uppercase font-mono text-[#97192c] mb-1.5 flex items-center gap-1.5">
                                <SparkleStar size={10} className="text-[#fc920d]" />
                                {theme.t}
                              </h4>
                              <p className="text-xs text-[#413f3b] leading-relaxed font-serif-brand">{theme.d}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prizes */}
                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Prizes
                        </h3>
                        <p className="text-xs font-mono text-[#716f6c] mb-3">Compete for a ₹35K prize pool. Get a participation certificate on completion.</p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="bg-[#fc920d] border-2 border-[#120f0a] p-3 text-center shadow-[3px_3px_0px_0px_#120f0a]">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#120f0a] opacity-80">First Place</div>
                            <div className="text-lg font-black font-mono mt-0.5">₹ 20,000</div>
                          </div>
                          <div className="bg-[#fee9cf] border-2 border-[#120f0a] p-3 text-center shadow-[3px_3px_0px_0px_#120f0a]">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#97192c]">Second Place</div>
                            <div className="text-lg font-black font-mono mt-0.5">₹ 10,000</div>
                          </div>
                          <div className="bg-white border-2 border-[#120f0a] p-3 text-center shadow-[3px_3px_0px_0px_#120f0a]">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#716f6c]">Third Place</div>
                            <div className="text-lg font-black font-mono mt-0.5">₹ 5,000</div>
                          </div>
                        </div>
                      </div>

                      {/* Partners */}
                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Partners & Sponsors
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {[
                            { name: "GitHub", src: "/partners/github.jpg", level: "Platinum" },
                            { name: "Notion", src: "/partners/notion.png", level: "Gold" },
                            { name: "Pure Buttons", src: "/partners/pure_buttons.png" }
                          ].map((p, idx) => (
                            <div key={idx} className="bg-white border-2 border-[#120f0a] p-4 text-center shadow-[3px_3px_0px_0px_#120f0a] flex flex-col items-center justify-center min-h-[140px] relative overflow-hidden">
                              <div className="absolute top-0 left-0 right-0 h-1 bg-[#97192c]" />
                              <div className="h-10 w-full relative mb-2">
                                <Image
                                  src={p.src}
                                  alt={p.name}
                                  fill
                                  sizes="100px"
                                  className="object-contain"
                                />
                              </div>
                              <span className="font-mono text-xs font-bold text-[#120f0a]">{p.name}</span>
                              {p.level && (
                                <span className="mt-1 bg-[#fee9cf] text-[#97192c] border border-[#97192c] text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5">
                                  {p.level}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Quick Stats, Timeline, Video */}
                    <div className="p-6 md:p-8 border-t-4 lg:border-t-0 lg:border-l-4 border-[#120f0a] bg-[#f7f1ec] space-y-6">
                      
                      {/* Stats list */}
                      <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] overflow-hidden">
                        {[
                          { label: "Date", val: hack4goodEvent.dateLabel },
                          { label: "Venue", val: hack4goodEvent.venueLabel },
                          { label: "Team Size", val: hack4goodEvent.teamSizeLabel },
                          { label: "Total Prizes", val: hack4goodEvent.prizePoolLabel },
                          { label: "Impressions", val: hack4goodEvent.impressionsLabel },
                          { label: "Registrations", val: hack4goodEvent.registrationsLabel },
                          { label: "On Ground", val: `${hack4goodEvent.onGroundLabel} people` },
                          { label: "Status", val: hack4goodEvent.statusLabel }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-[#120f0a]/10 last:border-0 text-xs font-mono">
                            <span className="font-semibold text-[#716f6c]">{stat.label}</span>
                            <span className="font-black text-[#120f0a]">{stat.val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Timeline */}
                      <div className="bg-white border-2 border-[#120f0a] p-4 shadow-[3px_3px_0px_0px_#120f0a] space-y-4">
                        <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-[#97192c] border-b border-[#120f0a]/10 pb-2">
                          Schedule
                        </h4>
                        <div className="space-y-4">
                          {[
                            { title: "Registration", sub: "02 Apr – 28 Apr 2026 (Online)" },
                            { title: "Team Formation", sub: "02 Apr – 28 Apr 2026 (Online)" },
                            { title: "Idea Submission", sub: "07 Apr – 28 Apr 2026 (Elimination)" },
                            { title: "Coding Round", sub: "02 May (12:00 PM) – 03 May (11:00 AM) (Offline · 24H)" }
                          ].map((step, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="flex flex-col items-center">
                                <span className="w-5 h-5 flex items-center justify-center border-2 border-[#120f0a] bg-[#fc920d] text-[9px] font-mono font-bold">
                                  {idx + 1}
                                </span>
                                {idx < 3 && <div className="w-0.5 h-8 bg-[#120f0a]" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-black font-mono leading-none">{step.title}</p>
                                <p className="text-[9px] text-[#716f6c] mt-1">{step.sub}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Support Contacts */}
                      <div className="bg-[#fee9cf] border-2 border-[#120f0a] p-4 shadow-[3px_3px_0px_0px_#120f0a] space-y-3">
                        <h4 className="font-bold text-xs uppercase font-mono tracking-wider">Contacts</h4>
                        <div className="text-[10px] space-y-2 text-[#413f3b] font-mono">
                          <div>
                            <p className="font-bold text-black">Event Org</p>
                            <a href="mailto:hack4good.cc@gmail.com" className="text-[#97192c] hover:underline block">
                              hack4good.cc@gmail.com
                            </a>
                          </div>
                          <div className="pt-1">
                            <p className="font-bold text-black">Nitya Pandey (Lead)</p>
                            <a href="mailto:nityaaaawwww@gmail.com" className="text-[#97192c] hover:underline block">
                              nityaaaawwww@gmail.com
                            </a>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Aftermovie Player */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 space-y-4">
                    <h4 className="font-mono text-sm font-black uppercase text-[#97192c]">Event Aftermovie</h4>
                    <p className="text-xs text-[#716f6c] font-mono -mt-2">Highlights and on-floor moments from Hack4Good v0 in Lucknow.</p>
                    <div className="border-[3px] border-[#120f0a] bg-black p-1 shadow-[4px_4px_0px_0px_#120f0a]">
                      <video
                        className="w-full max-h-[60vh] object-contain bg-black"
                        controls
                        playsInline
                        preload="metadata"
                        poster="/event_pictures/h4g/h4g.jpg"
                      >
                        <source src="/event_pictures/h4g/h4g.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* Pictures Slider */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 bg-[#f7f1ec]">
                    <NeobrutalistGallery
                      title="In Pictures"
                      items={[
                        {
                          id: "h4g-pic0",
                          title: "Hack4Good Hackathon",
                          description: "Teams hacking on autonomous agent workflows.",
                          image: "/event_pictures/h4g/h4g0.jpg",
                        },
                        {
                          id: "h4g-pic1",
                          title: "Hardware & AI Devs",
                          description: "Collaborative building and prompt testing.",
                          image: "/event_pictures/h4g/h4g1.jpg",
                        },
                        {
                          id: "h4g-pic2",
                          title: "Project Iteration",
                          description: "Mentoring sessions and agent execution loops.",
                          image: "/event_pictures/h4g/h4g2.jpeg",
                        },
                        {
                          id: "h4g-pic3",
                          title: "D-Day Coding Sprint",
                          description: "Building autonomous systems under high velocity.",
                          image: "/event_pictures/h4g/h4g3.jpg",
                        },
                        {
                          id: "h4g-pic4",
                          title: "Pitching Session",
                          description: "Showcasing agent deployments to the evaluators.",
                          image: "/event_pictures/h7g.jpeg",
                        },
                      ]}
                    />
                  </div>

                </div>
              )}

              {/* ── Lucknow Build Guild ───────────────────────────────────────── */}
              {(activeEvent === "all" || activeEvent === "lucknow-build-guild") && (
                <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] relative overflow-hidden">
                  
                  {/* Banner image */}
                  <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] border-b-4 border-[#120f0a] overflow-hidden bg-neutral-100">
                    <Image
                      src="/images/lko-build-guild.jpg"
                      alt="Lucknow Build Guild"
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-6">
                      <div>
                        <span className="inline-block bg-[#f4d9d1] text-[#120f0a] border-2 border-[#120f0a] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a] mb-2.5">
                          Archived · Apr 19, 2026
                        </span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-[#120f0a]">
                          Lucknow Build Guild
                        </h2>
                        <p className="font-serif-brand text-base leading-relaxed text-[#413f3b] mt-2">
                          Free hardware workshop and meetup in Lucknow.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["Archived Event", "Sponsored* by bits&bytes™"].map((tag, idx) => (
                          <span key={idx} className="bg-[#f7f1ec] border border-[#120f0a] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Event Summary
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          Lucknow Build Guild was a free hardware workshop and meetup on <strong>19 April</strong> at <strong>SureStay by Best Western</strong>. People came to build hardware, meet other builders, and learn from each other.
                        </p>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          What we worked on
                        </h3>
                        <ul className="list-disc pl-5 font-serif-brand text-sm text-[#413f3b] space-y-1">
                          <li>Hands-on hardware building and practical workflows.</li>
                          <li>Meeting local tech people and fostering network connections.</li>
                          <li>Peer learning with a room full of active student builders.</li>
                        </ul>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3 font-mono text-xs">
                        <h3 className="text-sm font-black uppercase text-[#120f0a]">Host</h3>
                        <p>
                          Event host: <strong>{lucknowBuildGuildEvent.hostName}</strong>. Explore:{" "}
                          <a href={lucknowBuildGuildEvent.hostLinktree} target="_blank" rel="noopener noreferrer" className="text-[#97192c] hover:underline font-bold">
                            Linktree
                          </a>{" "}
                          and{" "}
                          <a href={lucknowBuildGuildEvent.hostGithub} target="_blank" rel="noopener noreferrer" className="text-[#97192c] hover:underline font-bold">
                            GitHub
                          </a>.
                        </p>
                      </div>

                    </div>

                    <div className="p-6 md:p-8 border-t-4 lg:border-t-0 lg:border-l-4 border-[#120f0a] bg-[#f7f1ec] space-y-6">
                      
                      <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] overflow-hidden">
                        {[
                          { label: "Date", val: lucknowBuildGuildEvent.dateLabel },
                          { label: "Venue", val: lucknowBuildGuildEvent.venueLabel },
                          { label: "Format", val: lucknowBuildGuildEvent.formatLabel },
                          { label: "Status", val: lucknowBuildGuildEvent.statusLabel }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-[#120f0a]/10 last:border-0 text-xs font-mono">
                            <span className="font-semibold text-[#716f6c]">{stat.label}</span>
                            <span className="font-black text-[#120f0a]">{stat.val}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href={lucknowBuildGuildEvent.eventSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center border-3 border-[#120f0a] bg-[#fc920d] text-[#120f0a] py-3 text-sm font-black uppercase font-mono shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      >
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </a>

                    </div>

                  </div>

                  {/* Pictures Slider */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 bg-[#f7f1ec]">
                    <NeobrutalistGallery
                      title="In Pictures"
                      items={[
                        { id: "lbg-1", title: "Lucknow Build Guild", description: "Free hardware workshop and meetup", image: "/event_pictures/bd1.jpg" },
                        { id: "lbg-2", title: "Lucknow Build Guild", description: "Free hardware workshop and meetup", image: "/event_pictures/bd2.jpg" },
                        { id: "lbg-3", title: "Lucknow Build Guild", description: "Free hardware workshop and meetup", image: "/event_pictures/bd3.jpg" },
                        { id: "lbg-4", title: "Lucknow Build Guild", description: "Free hardware workshop and meetup", image: "/event_pictures/bd4.jpg" },
                        { id: "lbg-5", title: "Lucknow Build Guild", description: "Free hardware workshop and meetup", image: "/event_pictures/bd5.jpg" },
                      ]}
                    />
                  </div>

                </div>
              )}

              {/* ── GitHub Copilot Dev Days ──────────────────────────────────── */}
              {(activeEvent === "all" || activeEvent === "copilot") && (
                <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] relative overflow-hidden">
                  
                  {/* Banner image */}
                  <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] border-b-4 border-[#120f0a] overflow-hidden bg-neutral-100">
                    <Image
                      src="/images/copilot-dev-day.png"
                      alt="GitHub Copilot Dev Days | Lucknow"
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-6">
                      <div>
                        <span className="inline-block bg-[#fee9cf] text-[#120f0a] border-2 border-[#120f0a] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a] mb-2.5">
                          Archived · Apr 19
                        </span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-[#120f0a]">
                          GitHub Copilot Dev Days | Lucknow
                        </h2>
                        <p className="font-serif-brand text-base leading-relaxed text-[#413f3b] mt-2">
                          AI-assisted coding with GitHub Copilot, a community developer event.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["Archived Event", "Hosted by bits&bytes™"].map((tag, idx) => (
                          <span key={idx} className="bg-[#f7f1ec] border border-[#120f0a] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Event Summary
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          A community developer event in Lucknow where students and developers explored how AI-assisted development works in real projects.
                        </p>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          What we covered
                        </h3>
                        <ul className="list-disc pl-5 font-serif-brand text-sm text-[#413f3b] space-y-1">
                          <li>How GitHub Copilot works inside modern dev environments.</li>
                          <li>Integrating AI-assisted coding into real production workflows.</li>
                          <li>Prompting techniques for better, more accurate code suggestions.</li>
                          <li>Using AI responsibly in your daily development loops.</li>
                        </ul>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3 font-mono text-xs">
                        <h3 className="text-sm font-black uppercase text-[#120f0a]">Partners & Details</h3>
                        <p className="leading-relaxed">
                          The event was hosted by <strong>bits&bytes™</strong>, with community partners including <strong>Coding Connoisseurs</strong>, <strong>Aryan Singh</strong>, and <strong>Notion Lucknow</strong>. All participants observed the official{" "}
                          <a href="https://www.microsoft.com/en-us/events/code-of-conduct" target="_blank" rel="noopener noreferrer" className="text-[#97192c] hover:underline font-bold">
                            GitHub Event Code of Conduct
                          </a>.
                        </p>
                      </div>

                    </div>

                    <div className="p-6 md:p-8 border-t-4 lg:border-t-0 lg:border-l-4 border-[#120f0a] bg-[#f7f1ec] space-y-6">
                      
                      <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] overflow-hidden">
                        {[
                          { label: "Date", val: githubDevDayEvent.dateLabel },
                          { label: "Venue", val: githubDevDayEvent.venueLabel },
                          { label: "Format", val: githubDevDayEvent.formatLabel },
                          { label: "Status", val: githubDevDayEvent.statusLabel }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-[#120f0a]/10 last:border-0 text-xs font-mono">
                            <span className="font-semibold text-[#716f6c]">{stat.label}</span>
                            <span className="font-black text-[#120f0a]">{stat.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 font-mono">
                        <a
                          href={githubDevDayEvent.lumaCheckoutUrl}
                          className="luma-checkout--button inline-flex w-full items-center justify-center border-3 border-[#120f0a] bg-[#fc920d] text-[#120f0a] py-3 text-sm font-black uppercase shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                          data-luma-action="checkout"
                          data-luma-event-id={githubDevDayEvent.lumaEventId}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register for Event
                        </a>

                        <a
                          href={githubDevDayEvent.archiveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center border-3 border-[#120f0a] bg-white text-[#120f0a] py-3 text-sm font-black uppercase shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                          View Archive <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </div>

                    </div>

                  </div>

                  {/* Pictures Slider */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 bg-[#f7f1ec]">
                    <NeobrutalistGallery
                      title="In Pictures"
                      items={[
                        { id: "dev-1", title: "GitHub Copilot Dev Days", description: "Community Developer Event", image: "/event_pictures/devday.jpeg" },
                        { id: "dev-2", title: "GitHub Copilot Dev Days", description: "Community Developer Event", image: "/event_pictures/devday2.jpeg" },
                        { id: "dev-3", title: "GitHub Copilot Dev Days", description: "Community Developer Event", image: "/event_pictures/devday3.jpeg" },
                        { id: "dev-4", title: "GitHub Copilot Dev Days", description: "Community Developer Event", image: "/event_pictures/devday4.jpeg" },
                        { id: "dev-5", title: "GitHub Copilot Dev Days", description: "Community Developer Event", image: "/event_pictures/founder-s.jpeg" },
                      ]}
                    />
                  </div>

                </div>
              )}

              {/* ── Execron 1.0 ─────────────────────────────────────────────────── */}
              {(activeEvent === "all" || activeEvent === "execron") && (
                <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] relative overflow-hidden">
                  
                  {/* Banner header placeholder */}
                  <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] border-b-4 border-[#120f0a] overflow-hidden bg-[#fee9cf] flex items-center justify-center p-6 text-center">
                    <div className="space-y-2 max-w-lg">
                      <div className="inline-flex p-3 border-2 border-black bg-white rounded-none shadow-[2px_2px_0px_0px_#000] mb-2">
                        <Activity className="w-8 h-8 text-[#97192c]" />
                      </div>
                      <h3 className="text-2xl font-black uppercase font-mono tracking-tight">Execron 1.0</h3>
                      <p className="text-xs text-[#716f6c] font-mono uppercase tracking-widest">Build. Break. Repeat. Ship Something Real.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-6">
                      <div>
                        <span className="inline-block bg-[#df8e74] text-[#120f0a] border-2 border-[#120f0a] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a] mb-2.5">
                          Archived · Mar 19-22, 2026
                        </span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-[#120f0a]">
                          Execron 1.0
                        </h2>
                        <p className="font-serif-brand text-base leading-relaxed text-[#413f3b] mt-2">
                          AI Hackathon & Workshop for Teens at IIT Kanpur.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["Archived Event", "TechKriti '26 Collaboration", "IIT Kanpur"].map((tag, idx) => (
                          <span key={idx} className="bg-[#f7f1ec] border border-[#120f0a] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Event Summary
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          An AI Hackathon & Workshop for students in <strong>Classes 9–12</strong>. In collaboration with <strong>TechKriti '26, IIT Kanpur</strong>. A 4-hour workshop followed by a 24-hour hackathon sprint.
                        </p>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          What happened
                        </h3>
                        <ul className="list-disc pl-5 font-serif-brand text-sm text-[#413f3b] space-y-1">
                          <li>A 4-hour hands-on workshop on modern tech topics.</li>
                          <li>A 24-hour hackathon sprint with direct mentor support.</li>
                          <li>Mentorship from IIT Kanpur alumni and industry experts.</li>
                          <li>Full access to TechKriti '26: mega hackathons, pro shows, and the robotics expo.</li>
                        </ul>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Topics Covered
                        </h3>
                        <div className="grid gap-2 grid-cols-2 text-xs font-mono">
                          {["AI & ML", "Web Dev", "App Dev", "Cybersecurity", "Cloud Computing"].map((topic, idx) => (
                            <span key={idx} className="bg-white border border-[#120f0a] px-3 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#120f0a]">
                              <Check className="w-3.5 h-3.5 text-[#97192c]" /> {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    <div className="p-6 md:p-8 border-t-4 lg:border-t-0 lg:border-l-4 border-[#120f0a] bg-[#f7f1ec] space-y-6">
                      
                      <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] overflow-hidden">
                        {[
                          { label: "Date", val: "Mar 19–22, 2026" },
                          { label: "Venue", val: "IIT Kanpur" },
                          { label: "Team Size", val: "1–4 members" },
                          { label: "Partners", val: "ByteForge, bits&bytes™" }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-[#120f0a]/10 last:border-0 text-xs font-mono">
                            <span className="font-semibold text-[#716f6c]">{stat.label}</span>
                            <span className="font-black text-[#120f0a]">{stat.val}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href="https://byteforge.paxus.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center border-3 border-[#120f0a] bg-[#fc920d] text-[#120f0a] py-3 text-sm font-black uppercase font-mono shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      >
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </a>

                    </div>

                  </div>

                  {/* Pictures Slider */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 bg-[#f7f1ec]">
                    <NeobrutalistGallery
                      title="In Pictures"
                      items={[
                        { id: "ex-1", title: "Execron 1.0", description: "AI Hackathon & Workshop for Teens", image: "/event_pictures/byteforge1.webp" },
                        { id: "ex-2", title: "Execron 1.0", description: "AI Hackathon & Workshop for Teens", image: "/event_pictures/byteforge2.webp" },
                        { id: "ex-3", title: "Execron 1.0", description: "AI Hackathon & Workshop for Teens", image: "/event_pictures/byteforge3.webp" },
                        { id: "ex-4", title: "Execron 1.0", description: "AI Hackathon & Workshop for Teens", image: "/event_pictures/byteforge4.webp" },
                        { id: "ex-5", title: "Execron 1.0", description: "AI Hackathon & Workshop for Teens", image: "/event_pictures/byteforge5.webp" },
                      ]}
                    />
                  </div>

                </div>
              )}

              {/* ── India Innovates 2026 ──────────────────────────────────────── */}
              {(activeEvent === "all" || activeEvent === "india-innovates") && (
                <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] relative overflow-hidden">
                  
                  {/* Banner image */}
                  <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] border-b-4 border-[#120f0a] overflow-hidden bg-neutral-100">
                    <Image
                      src="/images/banner.jpeg"
                      alt="India Innovates 2026 — Bharat Mandapam, New Delhi"
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    
                    <div className="lg:col-span-2 p-6 md:p-8 space-y-6">
                      <div>
                        <span className="inline-block bg-[#fee9cf] text-[#120f0a] border-2 border-[#120f0a] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a] mb-2.5">
                          Archived · Mar 28, 2026
                        </span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-[#120f0a]">
                          India Innovates 2026
                        </h2>
                        <p className="font-serif-brand text-base leading-relaxed text-[#413f3b] mt-2">
                          World's Largest Civic Tech Hackathon.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {["Archived Event", "Official Executive Partner: bits&bytes™"].map((tag, idx) => (
                          <span key={idx} className="bg-[#f7f1ec] border border-[#120f0a] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shadow-[1.5px_1.5px_0px_0px_#120f0a]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-4">
                        <p className="font-serif-brand text-base font-bold text-[#120f0a]">
                          India Innovates 2026 is now archived. bits&bytes™ acted as the Official Executive Partner for the finale.
                        </p>
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a] pt-2">
                          Event Summary
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          India Innovates 2026 was presented as the <strong>World's Largest Civic Tech Hackathon</strong>, held on <strong>March 28, 2026</strong> at <strong>Bharat Mandapam, Pragati Maidan, New Delhi</strong> (9 AM - 7 PM). Organizers included <strong>HN Group</strong> and <strong>MCD</strong>, with partner institutions such as <strong>IIT Kharagpur, NSUT, GGSIPU, and DDU</strong>.
                        </p>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Scale
                        </h3>
                        <ul className="list-disc pl-5 font-serif-brand text-sm text-[#413f3b] space-y-1.5">
                          <li><strong>1.26 crore+</strong> total applicants nationwide.</li>
                          <li><strong>28,000+ to 5,000+ to 15 teams</strong> across three elimination rounds.</li>
                          <li><strong>₹10 lakh+</strong> prize pool, including ₹1L, ₹75K, ₹50K, and ₹25K per domain.</li>
                          <li>Domains: <strong>Urban Solutions, Digital Democracy, and Open Innovation</strong>.</li>
                        </ul>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Finale Format
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          It was not a build-on-site round. Teams developed in advance, and the final day focused on <strong>live product demonstrations</strong> reviewed by investors, officials, diplomats, and founders.
                        </p>
                      </div>

                      <div className="border-t border-[#120f0a]/10 pt-6 space-y-3">
                        <h3 className="text-lg font-black uppercase font-mono tracking-tight text-[#120f0a]">
                          Dignitaries and Finalists
                        </h3>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          Confirmed attendees included <strong>Delhi CM Rekha Gupta</strong>, the <strong>Bihar Assembly Speaker</strong>, and <strong>MP Manoj Tiwari (North East Delhi)</strong>.
                        </p>
                        <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                          <strong>Team Dupahar</strong> from the University of Jammu reached the Top 15 and was reported as the only finalist team from J&K.
                        </p>
                      </div>

                    </div>

                    <div className="p-6 md:p-8 border-t-4 lg:border-t-0 lg:border-l-4 border-[#120f0a] bg-[#f7f1ec] space-y-6">
                      
                      <div className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a] overflow-hidden">
                        {[
                          { label: "Date", val: "Mar 28, 2026" },
                          { label: "Venue", val: "Bharat Mandapam, New Delhi" },
                          { label: "Scale", val: "1.26 crore+ applicants" },
                          { label: "Status", val: "Concluded" }
                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between px-4 py-2.5 border-b border-[#120f0a]/10 last:border-0 text-xs font-mono">
                            <span className="font-semibold text-[#716f6c]">{stat.label}</span>
                            <span className="font-black text-[#120f0a]">{stat.val}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href="https://indiainnovates.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center border-3 border-[#120f0a] bg-[#fc920d] text-[#120f0a] py-3 text-sm font-black uppercase font-mono shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                      >
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </a>

                    </div>

                  </div>

                  {/* Stage Address Video Player */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 space-y-4">
                    <h4 className="font-mono text-sm font-black uppercase text-[#97192c]">Event Video</h4>
                    <p className="text-xs text-[#716f6c] font-mono -mt-2">Stage highlights and on-floor moments from the finale.</p>
                    <div className="border-[3px] border-[#120f0a] bg-black p-1 shadow-[4px_4px_0px_0px_#120f0a]">
                      <video
                        className="w-full max-h-[60vh] object-contain bg-black"
                        controls
                        playsInline
                        preload="metadata"
                        poster="/event_pictures/HEe923ub0AE-92F.jpg"
                      >
                        <source src="/event_pictures/india-innovates-2026-stage-address.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>

                  {/* Pictures Slider */}
                  <div className="border-t-4 border-[#120f0a] p-6 md:p-8 bg-[#f7f1ec]">
                    <NeobrutalistGallery
                      title="In Pictures"
                      items={[
                        { id: "img-1", title: "Opening Address", description: "Main stage opening session at India Innovates 2026.", image: "/event_pictures/HEe93oOakAAi2Mi.jpg" },
                        { id: "img-2", title: "Plenary Session", description: "Live address from the central stage at Bharat Mandapam.", image: "/event_pictures/HEe923ub0AE-92F.jpg" },
                        { id: "img-3", title: "Jury Interaction", description: "On-floor demo review with students and evaluators.", image: "/event_pictures/866d62697f3d42819e2007714047a3a80001af45.jpg" },
                        { id: "img-4", title: "Participant Teams", description: "Student teams preparing for demonstrations in the main hall.", image: "/event_pictures/3d53b4900bb7c0176eadb242c495cbfb3634ffb3.jpg" },
                        { id: "img-5", title: "Build Table", description: "Final-stage hardware and prototype iteration under evaluation windows.", image: "/event_pictures/1ae8b9183c456f721ab4a04a7cbd0268ce3b2e97.jpg" },
                        { id: "img-6", title: "Hall View", description: "Full auditorium turnout during keynote and showcase rounds.", image: "/event_pictures/HEe923uagAATqvy.jpg" },
                      ]}
                    />
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <Script
        id="luma-checkout"
        src="https://embed.lu.ma/checkout-button.js"
        strategy="afterInteractive"
      />
    </div>
  );
}

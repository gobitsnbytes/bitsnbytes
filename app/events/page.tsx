"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageSection } from "@/components/page-section";
import { GlassContainer } from "@/components/ui/glass-container";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
  GlowingCardNumber,
} from "@/components/ui/glowing-card";
import { Button } from "@/components/ui/button";
import { Gallery4 } from "@/components/ui/gallery4";
import {
  ExternalLink,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Clock,
  Database,
  Landmark,
  Lightbulb,
  Building2,
  Check,
  ChevronRight,
  Activity,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((m) => ({ default: m.WebGLShader })),
  { loading: () => null, ssr: false },
);

// ── Static data ──────────────────────────────────────────────────────────────

const stages = [
  {
    title: "Submit Your Presentation",
    period: "24 Jan – 10 Mar 2026",
    copy: "Submit a presentation around the solution you have built. Best solutions get an exhibition space to display to investors, founders, policy makers, and industry leaders.",
    start: new Date("2026-01-24T00:00:00"),
    end: new Date("2026-03-10T23:59:59"),
  },
  {
    title: "Evaluation",
    period: "11 Mar – 15 Mar 2026",
    copy: "Core Committee members and mentors will thoroughly review all submitted PPTs and shortlist teams based on quality, feasibility, innovation, and impact.",
    start: new Date("2026-03-11T00:00:00"),
    end: new Date("2026-03-15T23:59:59"),
  },
  {
    title: "The Grand Finale",
    period: "28 Mar 2026",
    copy: "Solutions presented to judges at Bharat Mandapam. On-the-spot evaluation by judges and ministries to declare winners across all domains.",
    start: new Date("2026-03-28T00:00:00"),
    end: new Date("2026-03-28T23:59:59"),
  },
];

const problemStatements: { domain: string; items: string[] }[] = [
  {
    domain: "Politics & Civic Tech",
    items: [
      "AI-powered Avatar Platform",
      "AI-powered Inbound/Outbound Calling Agent",
      "Hyper-Local Targeting Engine",
      "Smart Political CRM (P-CRM)",
      "Secure E-Voting System",
      "AI Co-Pilot for Politicians",
      "VR Townhall Platform",
      "AI-powered Social Media Management System",
    ],
  },
  {
    domain: "Data Mining and Processing",
    items: [
      "AI-powered Global Ontology Engine",
      "AI-Driven Booth Management System",
      "Party Worker Management System",
      "AI-driven Sentiment Analysis Engine",
    ],
  },
];

const domainIcon: Record<string, React.ReactNode> = {
  "Politics & Civic Tech": <Landmark className="h-3.5 w-3.5" />,
  "Data Mining and Processing": <Database className="h-3.5 w-3.5" />,
  "Open Innovation": <Lightbulb className="h-3.5 w-3.5" />,
};

const prizeRows = [
  { pos: "1st Prize", politics: "₹1,50,000", data: "₹1,50,000" },
  { pos: "2nd Prize", politics: "₹1,00,000", data: "₹1,00,000" },
  { pos: "3rd Prize", politics: "₹50,000", data: "₹50,000" },
  { pos: "Runner-up", politics: "₹35,000", data: "₹35,000" },
];

const additionalOutcomes = [
  { title: "Pitch to Power", copy: "Present your solution directly to government bodies and political parties." },
  { title: "Gov Apprenticeship", copy: "Paid government apprenticeship with potential for a full-time opportunity." },
  { title: "Cultural Night", copy: "Exclusive cultural programme hosted for all participants after the exhibition." },
  { title: "Round 1 Certs", copy: "Participation certificates awarded for all teams completing Round 1." },
  { title: "Open to All", copy: "No age, college, or background restrictions — eligibility is universal." },
];

const programSteps = [
  "Register on Unstop",
  "Top teams receive Exhibition Booth Space",
  "Live showcase at Bharat Mandapam",
  "On-the-spot evaluation by judges",
  "Winners announced — Top 3 per domain",
];

const faqs = [
  {
    q: "What is India Innovates 2026?",
    a: "India's Biggest Tech Innovation Summit where Code Meets Constitution. Organized by MCD, DDU College, IIT Kharagpur, DTC, NSUT, GGSIPU, THE FISTA, and CBPACS at Bharat Mandapam, New Delhi, with Bits&Bytes as the Executive Partner. It invites India's brightest student innovators to bring working products and breakthrough ideas."
  },
  {
    q: "What is Bits&Bytes' role in the event?",
    a: "As the Executive Partner, Bits&Bytes handles everything operational: managing participant groups, answering queries, designing social media creatives, creating docs/SOPs, conducting college outreach, and leading full on-ground coordination."
  },
  {
    q: "Who can participate?",
    a: "Open to all students, professionals, and tech enthusiasts from across India. Whether you are a student, working professional, or startup founder, you are welcome to participate."
  },
  {
    q: "What is the team size to participate?",
    a: "Teams must have 3-6 members."
  },
  {
    q: "What are the prerequisites considered for registering?",
    a: "Participants may need to have knowledge and skills in areas such as electronics, programming, data analytics, and IoT technologies, depending on the theme. Participants must bring their own laptops, sensors, microcontrollers, and other necessary tools."
  },
  {
    q: "Where is the venue?",
    a: "Bharat Mandapam, Pragati Maidan, New Delhi. This state-of-the-art venue hosted the G20 Summit in 2023."
  },
  {
    q: "How to register for the event?",
    a: "Click the Register button on the Unstop registration page. Complete your registration there and our organizing team will contact you with further details."
  }
];

const visionMission = [
  {
    title: "Vision",
    icon: <Eye className="h-5 w-5 text-(--brand-pink)" />,
    copy: "Contributing to Viksit Bharat 2047 — a developed India by its centenary of independence. Our vision is to empower young innovators to build solutions that transform governance, strengthen democracy, enhance citizen services, and secure our digital future."
  },
  {
    title: "Mission",
    icon: <Trophy className="h-5 w-5 text-(--brand-pink)" />,
    copy: "To bridge the gap between innovation and implementation by bringing together student innovators, government bodies, and industry leaders under one roof. Our mission is to identify breakthrough ideas that can be adopted at scale to serve the nation."
  }
];

// ── Component ─────────────────────────────────────────────────────────────

export default function Events() {
  const [activeEvent, setActiveEvent] = useState<"all" | "copilot" | "india-innovates">("all");
  const [showBanner, setShowBanner] = useState(true);
  const bannerRef = useRef<HTMLDivElement>(null);
  const now = useMemo(() => new Date(), []);
  const liveIndexes = useMemo(
    () => new Set(stages.map((s, i) => (now >= s.start && now <= s.end ? i : -1)).filter((i) => i !== -1)),
    [now],
  );

  const dismissBanner = useCallback(() => setShowBanner(false), []);

  useEffect(() => {
    if (!showBanner) return;

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowBanner(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showBanner]);

  return (
    <>
      {/* ── Important Update Banner ────────────────────────────────────────── */}
      <div
        ref={bannerRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: showBanner ? "200px" : "0px",
          opacity: showBanner ? 1 : 0,
        }}
      >
        <div className="relative bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 border-b border-amber-500/20 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 pr-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="text-xs sm:text-sm text-white/80 leading-relaxed">
                <span className="font-bold text-amber-400">Important Update — Guinness World Record Attempt:</span>{" "}
                We are attempting records for the Largest Civic Tech Hackathon and Largest Hackathon Under Roof.
                To comply with official Guinness guidelines, the Cybersecurity domain has been removed for new registrations and merged under Open Innovation.
                <span className="block mt-1 text-white/60">
                  Already registered in Cybersecurity? Your participation, prizes, and evaluation remain fully valid.
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={dismissBanner}
            className="absolute top-2 right-2 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6">
          <GlassContainer className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--brand-pink) opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-(--brand-pink)" />
                </span>
                Events
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-extrabold text-white tracking-tighter drop-shadow-2xl">
                Where code meets <br className="hidden sm:block" /> every boundary
              </h1>
              <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/80 font-medium leading-relaxed">
                Join thousands of student innovators at hackathons, summits, and workshops that
                turn teen builders into tomorrow&apos;s founders and policymakers.
              </p>
            </div>
          </GlassContainer>
        </div>
      </section>

      <main className="bg-transparent flex flex-col pt-12">
        {/* ── Event Toggle Tabs ────────────────────────────────────────── */}
        <div className="mx-auto flex flex-wrap w-fit items-center justify-center gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-1.5 backdrop-blur-md mb-8">
          <button
            onClick={() => setActiveEvent("all")}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeEvent === "all"
              ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
              : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveEvent("copilot")}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeEvent === "copilot"
              ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
              : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
          >
            GitHub Copilot Dev Days
          </button>
          <button
            onClick={() => setActiveEvent("india-innovates")}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${activeEvent === "india-innovates"
              ? "bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.3)]"
              : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
          >
            India Innovates 2026
          </button>
        </div>

        {/* ── GitHub Copilot Dev Days — Featured Spotlight ──────────────── */}
        {(activeEvent === "all" || activeEvent === "copilot") && (
          <PageSection
            eyebrow="Upcoming · Apr 19"
            title="GitHub Copilot Dev Days | Lucknow"
            description="AI-Assisted Coding with GitHub Copilot — A Community Developer Event."
          >
            <GlassContainer glowColor="pink" animated={false} className="overflow-hidden">

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
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                    Workshop / Developer Event
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Registration Open
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                    Hosted by Bits&amp;Bytes
                  </span>
                </div>

                {/* Stats + details two-column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Left — key stats */}
                  <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    {[
                      { icon: <Calendar className="h-4 w-4 text-(--brand-pink)" />, label: "Date", value: "Sunday, April 19, 2026" },
                      { icon: <Clock className="h-4 w-4 text-(--brand-pink)" />, label: "Time", value: "10:00 AM – 2:00 PM IST" },
                      { icon: <MapPin className="h-4 w-4 text-(--brand-pink)" />, label: "Venue", value: <Link href="https://www.google.com/maps/search/?api=1&query=26.9109169%2C80.9464606&query_place_id=ChIJSydGKnNXmTkRj475BfUXmeA" target="_blank" className="hover:text-(--brand-pink) hover:underline underline-offset-2">Cubispace, Lucknow</Link> },
                      { icon: <Users className="h-4 w-4 text-(--brand-pink)" />, label: "Format", value: "In-Person · Approval Required" },
                      { icon: <Building2 className="h-4 w-4 text-(--brand-pink)" />, label: "Host", value: "Bits&Bytes" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {s.icon}
                          <span className="text-sm text-white/60 font-medium">{s.label}</span>
                        </div>
                        <span className="text-sm font-black text-white text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right — description, what you'll learn, CTA */}
                  <div className="flex flex-col gap-5">

                    {/* Community Partners */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-2.5">Community Partners</p>
                      <div className="flex flex-wrap gap-2">
                        {["Coding Connoisseurs", "Aryan Singh", "Notion Lucknow"].map((d) => (
                          <span key={d} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* What You Will Learn */}
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-2.5">What You Will Learn</p>
                      <ul className="space-y-1.5">
                        {[
                          "How GitHub Copilot works inside modern dev environments",
                          "Integrating AI-assisted coding into real workflows",
                          "Prompt techniques for better code suggestions",
                          "Responsible and efficient use of AI in development",
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-white/65">
                            <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-(--brand-pink)" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* About */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/50 leading-relaxed space-y-1">
                      <p className="font-semibold text-white/70 text-[11px] uppercase tracking-wider mb-1">About</p>
                      <p>Artificial intelligence is rapidly changing the way developers write and think about code. This community developer event in Lucknow brings together students, developers, and technology enthusiasts to explore how AI-assisted development works in real projects.</p>
                      <p className="mt-2">All participants are expected to follow the <Link href="https://www.microsoft.com/en-us/events/code-of-conduct" target="_blank" rel="noopener noreferrer" className="text-(--brand-pink) hover:underline underline-offset-2">GitHub Event Code of Conduct</Link>.</p>
                    </div>

                    {/* CTA */}
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-(--brand-pink) py-5 text-sm font-bold text-white shadow-[0_0_24px_rgba(228,90,146,0.35)] hover:opacity-90 mt-auto"
                    >
                      <Link
                        href="https://luma.com/xtxua1jl"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Request to Join on Luma
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </GlassContainer>
          </PageSection>
        )}

        {/* ── India Innovates 2026 ──────────────────────────────────────── */}
        {(activeEvent === "all" || activeEvent === "india-innovates") && (
          <>
            <PageSection
              eyebrow="Upcoming · Mar 28"
              title="India Innovates 2026"
              description="India's Biggest Tech Innovation Summit — Where Code Meets Constitution."
            >
              <GlassContainer glowColor="pink" animated={false} className="overflow-hidden">

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
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white bg-(--brand-pink)">
                      Conference / Innovation Summit
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Registration Open
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md">
                      <Users className="h-3 w-3 text-(--brand-pink)" />
                      21,437 Registered
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                      <Image src="/images/mcd.jpeg" alt="MCD Logo" width={16} height={16} className="rounded-full object-cover" />
                      Municipal Corporation of Delhi
                    </span>
                  </div>

                  {/* Stats + details two-column */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left — key stats */}
                    <div className="space-y-0 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                      {[
                        { icon: <Trophy className="h-4 w-4 text-(--brand-pink)" />, label: "Prize Pool", value: "₹10,05,000" },
                        { icon: <Users className="h-4 w-4 text-(--brand-pink)" />, label: "Team Size", value: "3 – 6 Members" },
                        { icon: <Calendar className="h-4 w-4 text-(--brand-pink)" />, label: "Reg. Deadline", value: "5 Mar 2026, 10:59 PM IST" },
                        { icon: <Activity className="h-4 w-4 text-(--brand-pink)" />, label: "Registrations", value: "21,437" },
                        { icon: <Eye className="h-4 w-4 text-(--brand-pink)" />, label: "Impressions", value: "13,08,296+" },
                        { icon: <Clock className="h-4 w-4 text-(--brand-pink)" />, label: "Timings", value: "9 AM – 7 PM" },
                      ].map((s) => (
                        <div key={s.label} className="flex items-center justify-between px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            {s.icon}
                            <span className="text-sm text-white/60 font-medium">{s.label}</span>
                          </div>
                          <span className="text-sm font-black text-white text-right">{s.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Right — domains, quick info, CTA */}
                    <div className="flex flex-col gap-5">
                      {/* Domains */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-2.5">Challenge Domains</p>
                        <div className="flex flex-wrap gap-2">
                          {["Politics & Civic Tech", "Data Mining and Processing", "Open Innovation"].map((d) => (
                            <span key={d} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                              {domainIcon[d]}{d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Additional outcomes quick list */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-2.5">Win Beyond Cash</p>
                        <ul className="space-y-1.5">
                          {[
                            "Pitch directly to government & political parties",
                            "Paid government apprenticeship opportunity",
                            "Cultural Night for all participants",
                          ].map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs text-white/65">
                              <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-(--brand-pink)" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Rules quick note */}
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/50 leading-relaxed space-y-1">
                        <p className="font-semibold text-white/70 text-[11px] uppercase tracking-wider mb-1">Key Rules</p>
                        <p>• Projects must be original & built for this event</p>
                        <p>• Plagiarism = instant disqualification</p>
                        <p>• Open-source tools & datasets allowed</p>
                        <p>• Jury decisions are final</p>
                      </div>

                      {/* CTA */}
                      <Button
                        asChild
                        className="w-full rounded-2xl bg-(--brand-pink) py-5 text-sm font-bold text-white shadow-[0_0_24px_rgba(228,90,146,0.35)] hover:opacity-90 mt-auto"
                      >
                        <Link
                          href="https://unstop.com/conferences/india-innovates-2026-municipal-corporation-of-delhi-1625920"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Register on Unstop
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassContainer>
            </PageSection>

            {/* ── Past Events Gallery ─────────────────────────────────────────────── */}
            <PageSection
              align="left"
              className="pb-0"
            >
              <Gallery4
                title="In Pictures"
                description=""
                items={[
                  {
                    id: "img-1",
                    title: "Opening Ceremony",
                    description: "The energy was palpable as we kickstarted the hackathon.",
                    href: "#",
                    image: "/event_pictures/697362a9af5f9_2b7a6686.webp",
                  },
                  {
                    id: "img-2",
                    title: "Deep Coding",
                    description: "Teams engaged in intense coding sessions.",
                    href: "#",
                    image: "/event_pictures/697362a9bfbb7_2b7a6474.webp",
                  },
                  {
                    id: "img-3",
                    title: "Mentorship",
                    description: "Industry experts guiding the builders.",
                    href: "#",
                    image: "/event_pictures/697362a9ed0a0_2b7a6465.webp",
                  },
                  {
                    id: "img-4",
                    title: "Collaboration",
                    description: "Hackers teaming up to build something great.",
                    href: "#",
                    image: "/event_pictures/697362aa203ce_2b7a6472.webp",
                  },
                  {
                    id: "img-5",
                    title: "Project Showcases",
                    description: "Presenting the final prototypes to the judges.",
                    href: "#",
                    image: "/event_pictures/697362aa29673_2b7a6578__1_.webp",
                  },
                  {
                    id: "img-6",
                    title: "Judging Details",
                    description: "Going through the projects thoroughly.",
                    href: "#",
                    image: "/event_pictures/697362aa2c388_2b7a6482.webp",
                  },
                  {
                    id: "img-7",
                    title: "Networking",
                    description: "Building connections that last beyond the event.",
                    href: "#",
                    image: "/event_pictures/697362aa317f1_2b7a6406.webp",
                  },
                  {
                    id: "img-8",
                    title: "Winners Announcement",
                    description: "Celebrating the hard work and innovation.",
                    href: "#",
                    image: "/event_pictures/697362aa3a417_2b7a6874.webp",
                  },
                ]}
              />
            </PageSection>

            {/* ── How It Works ──────────────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: Program Structure"
              title="How it works"
              description="Five steps from registration to the winners' announcement."
            >
              <GlassContainer glowColor="both" animated={false} className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                  {programSteps.map((step, idx) => (
                    <div key={step} className="relative flex flex-col items-center text-center gap-3">
                      {/* connector line (desktop only) */}
                      {idx < programSteps.length - 1 && (
                        <div className="hidden sm:block absolute top-5 left-[58%] right-0 h-px bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
                      )}
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--brand-pink)/40 bg-(--brand-pink)/10 text-sm font-black text-(--brand-pink)">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-[11px] text-white/70 font-medium leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </GlassContainer>
            </PageSection>

            {/* ── Event Stages timeline ─────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: Timeline"
              title="Three stages to the finale"
              description="From submitting your idea to standing on the floor at Bharat Mandapam."
            >
              <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
                {stages.map((stage, idx) => (
                  <li key={stage.title} className={["md:[grid-area:1/1/2/5]", "md:[grid-area:1/5/2/9]", "md:[grid-area:1/9/2/13]"][idx]}>
                    <GlowingCard animationDelay={idx * 0.1}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <GlowingCardNumber index={idx + 1} />
                          {liveIndexes.has(idx) && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              </span>
                              Live
                            </span>
                          )}
                        </div>
                        <GlowingCardTitle className="mt-3">{stage.title}</GlowingCardTitle>
                        <p className="text-xs font-semibold text-(--brand-pink)">{stage.period}</p>
                        <GlowingCardDescription>{stage.copy}</GlowingCardDescription>
                      </div>
                    </GlowingCard>
                  </li>
                ))}
              </ul>
            </PageSection>

            {/* ── Problem Statements ────────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: Challenge Domains"
              title="What are you building?"
              description="Pick a domain, pick a problem. Every statement is a real challenge waiting for a real solution."
            >
              <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 lg:gap-4">
                {problemStatements.map(({ domain, items }, idx) => (
                  <li key={domain} className={["md:[grid-area:1/1/2/7]", "md:[grid-area:1/7/2/13]"][idx]}>
                    <GlowingCard animationDelay={idx * 0.1}>
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                          <span className="text-(--brand-pink)">{domainIcon[domain]}</span>
                          <span className="text-xs font-bold text-white">{domain}</span>
                        </div>
                        <ul className="space-y-2.5">
                          {items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-white/65">
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-(--brand-pink)" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </GlowingCard>
                  </li>
                ))}
              </ul>
            </PageSection>

            {/* ── Prize Pool ────────────────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: Prizes"
              title="₹10,05,000 prize pool"
              description="Top solutions across every domain take home cash prizes — plus a certificate for every participant."
            >
              <GlassContainer className="overflow-x-auto" glowColor="pink" animated={false}>
                <div className="p-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Position</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/50">
                          <span className="inline-flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-(--brand-pink)" />Politics &amp; Civic Tech</span>
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/50">
                          <span className="inline-flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-(--brand-pink)" />Data Mining</span>
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {prizeRows.map((row, i) => (
                        <tr key={row.pos} className={`border-b border-white/5 transition-colors hover:bg-white/5 ${i === 0 ? "bg-(--brand-pink)/5" : ""}`}>
                          <td className="px-5 py-4 font-semibold text-white">
                            {i === 0 && <Trophy className="inline h-3.5 w-3.5 mr-1.5 text-amber-400" />}
                            {row.pos}
                          </td>
                          <td className="px-5 py-4 text-white/85">{row.politics} <span className="text-[10px] text-white/40">+ Cert</span></td>
                          <td className="px-5 py-4 text-white/85">{row.data}    <span className="text-[10px] text-white/40">+ Cert</span></td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="px-5 py-3 text-xs text-white/40 italic">
                          All registered participants receive a Participation Certificate.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassContainer>
            </PageSection>

            {/* ── Additional Outcomes ──────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: Beyond the Prize"
              title="What you actually walk away with"
              description="Cash is just the start. India Innovates 2026 opens doors no other hackathon can."
            >
              <ul className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {additionalOutcomes.map(({ title, copy }, idx) => (
                  <li
                    key={title}
                    className={
                      idx === 0 || idx === 1 || idx === 2
                        ? "sm:col-span-2 lg:col-span-2"
                        : idx === 3
                          ? "sm:col-span-2 lg:col-span-2 lg:col-start-2"
                          : "sm:col-span-2 sm:col-start-2 lg:col-span-2 lg:col-start-4"
                    }
                  >
                    <GlowingCard animationDelay={idx * 0.08}>
                      <div className="space-y-3">
                        <GlowingCardNumber index={idx + 1} />
                        <GlowingCardTitle className="mt-3">{title}</GlowingCardTitle>
                        <GlowingCardDescription>{copy}</GlowingCardDescription>
                      </div>
                    </GlowingCard>
                  </li>
                ))}
              </ul>
            </PageSection>

            {/* ── Vision & Mission ──────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: Vision"
              title="Building for the Nation"
              description="Contributing to Viksit Bharat 2047."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visionMission.map((item, idx) => (
                  <GlowingCard key={item.title} animationDelay={idx * 0.1}>
                    <div className="space-y-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-(--brand-pink)/30 bg-(--brand-pink)/10 text-(--brand-pink)">
                        {item.icon}
                      </div>
                      <GlowingCardTitle className="mt-3">{item.title}</GlowingCardTitle>
                      <GlowingCardDescription>{item.copy}</GlowingCardDescription>
                    </div>
                  </GlowingCard>
                ))}
              </div>
            </PageSection>

            {/* ── FAQs ──────────────────────────────────────────────────────── */}
            <PageSection
              align="center"
              eyebrow="India Innovates: FAQs"
              title="Frequently Asked Questions"
              description="Everything you need to know about the event."
            >
              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors text-left">
                    <h3 className="text-[15px] font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </PageSection>
          </>
        )}

      </main>
    </>
  );
}

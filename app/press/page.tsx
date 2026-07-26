"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Palette,
  Type,
  Users,
  Mail,
  ExternalLink,
  FileText,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { TEAM_MEMBERS } from "@/lib/team-data";
import logoSvg from "@public/logo.svg";

// IMPECCABLE_PREFLIGHT: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:using_css_styling_no_new_image_assets_needed mutation=open

// Starburst icon for Neobrutalist design accent
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

const colorPaletteRows = [
  {
    title: "Burgundy",
    description: "The core. Serious. Doesn't beg for attention.",
    colors: [
      { step: "Base", hex: "#97192C" },
      { step: "20%", hex: "#791423" },
      { step: "40%", hex: "#5B0F1A" },
      { step: "60%", hex: "#3C0A12" },
      { step: "80%", hex: "#1E0509" },
    ],
  },
  {
    title: "Neutrals",
    description: "So everything else doesn't look like a mess.",
    colors: [
      { step: "Base", hex: "#120F0A" },
      { step: "20%", hex: "#413F3B" },
      { step: "40%", hex: "#716F6C" },
      { step: "60%", hex: "#A09F9D" },
      { step: "80%", hex: "#D0CFCE" },
    ],
  },
  {
    title: "Orange",
    description: "Chaos, but controlled. Where things pop.",
    colors: [
      { step: "Base", hex: "#FC920D" },
      { step: "20%", hex: "#FDA83D" },
      { step: "40%", hex: "#FDBE6E" },
      { step: "60%", hex: "#FED39E" },
      { step: "80%", hex: "#FEE9CF" },
    ],
  },
  {
    title: "Gradients / Warm Accents",
    description: "Movement. Nothing here is static.",
    colors: [
      { step: "Base", hex: "#C94218" },
      { step: "20%", hex: "#D46846" },
      { step: "40%", hex: "#DF8E74" },
      { step: "60%", hex: "#E9B3A3" },
      { step: "80%", hex: "#F4D9D1" },
    ],
  },
];

const executiveLeadership = TEAM_MEMBERS.filter(
  (member) => member.role.startsWith("Chief"),
);

const departmentLeads = TEAM_MEMBERS.filter(
  (member) => member.role.startsWith("Head"),
);

export default function PressKit() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.success(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#eae8e4] text-[#120f0a] pt-28 pb-20 relative z-10 font-sans selection:bg-[#fc920d] selection:text-[#120f0a]">
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.06] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Banner Header */}
        <header className="mb-12 border-b-4 border-[#120f0a] pb-10 relative">
          <div className="absolute -right-6 -top-6 hidden md:block animate-spin-slow">
            <Starburst size={80} className="text-[#fc920d]" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#97192c] text-white border-2 border-[#120f0a] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a]">
              <ImageIcon className="h-3.5 w-3.5 text-[#fc920d]" />
              Brand Guidelines
            </span>
            <span className="text-xs font-mono text-[#716f6c] font-semibold">
              GOBITSNBYTES FOUNDATION
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#120f0a] leading-none mb-6">
            Press kit &amp; <br />
            <span className="bg-[#fc920d] px-2 py-0.5 border-[3px] border-[#120f0a] inline-block shadow-[4px_4px_0px_0px_#120f0a] -rotate-1">brand assets</span>
          </h1>

          <p className="font-serif text-lg md:text-xl text-[#413f3b] max-w-[70ch] leading-relaxed">
            Official logos, color palettes, typography specs, public facts, and media contact paths for bits&bytes™.
          </p>
        </header>

        {/* Main Content Area */}
        <main className="space-y-12">
          
          {/* Logo Downloads */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#120f0a]/15 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider">
                    <ImageIcon className="h-6 w-6 text-[#97192c]" />
                    Official Logos
                  </h2>
                  <p className="text-sm text-[#716f6c] font-medium mt-1">
                    Download the official bits&bytes™ cube monogram and wordmark assets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SVG Logo */}
                <div className="border-3 border-[#120f0a] rounded-none p-6 bg-[#fee9cf]/20 flex flex-col items-center justify-between gap-6 shadow-[4px_4px_0px_0px_#120f0a]">
                  <div className="relative flex h-32 w-32 items-center justify-center border-3 border-[#120f0a] bg-white shadow-inner rounded-none">
                    <Image src={logoSvg} alt="bits&bytes logo SVG" fill className="p-4 object-contain -translate-y-[5px] invert dark:invert-0" />
                  </div>
                  <div className="text-center w-full relative">
                    <h3 className="font-black text-[#120f0a] text-lg uppercase tracking-tight">Vector SVG Logo</h3>
                    <p className="text-xs text-[#716f6c] font-semibold mt-1">Best for web layouts and high-resolution scaling.</p>
                    <a
                      href="/logo.svg"
                      download="bitsnbytes-logo.svg"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 mt-4 border-2 border-[#120f0a] bg-[#fc920d] text-[#120f0a] font-bold text-sm hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_#120f0a] active:translate-y-0.5 active:shadow-none transition-all rounded-none w-full"
                    >
                      <Download className="h-4 w-4" />
                      Download SVG
                    </a>
                  </div>
                </div>

                {/* PNG Logo */}
                <div className="border-3 border-[#120f0a] rounded-none p-6 bg-[#fee9cf]/20 flex flex-col items-center justify-between gap-6 shadow-[4px_4px_0px_0px_#120f0a]">
                  <div className="relative flex h-32 w-32 items-center justify-center border-3 border-[#120f0a] bg-white shadow-inner rounded-none">
                    <Image src="/logo.png" alt="bits&bytes logo PNG" fill className="p-4 object-contain -translate-y-[5px] invert dark:invert-0" />
                  </div>
                  <div className="text-center w-full relative">
                    <h3 className="font-black text-[#120f0a] text-lg uppercase tracking-tight">Raster PNG Logo</h3>
                    <p className="text-xs text-[#716f6c] font-semibold mt-1">Raster image file with transparent background.</p>
                    <a
                      href="/logo.png"
                      download="bitsnbytes-logo.png"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 mt-4 border-2 border-[#120f0a] bg-white text-[#120f0a] font-bold text-sm hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_#120f0a] active:translate-y-0.5 active:shadow-none transition-all rounded-none w-full"
                    >
                      <Download className="h-4 w-4" />
                      Download PNG
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Brand Colors */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider border-b border-[#120f0a]/15 pb-4">
                  <Palette className="h-6 w-6 text-[#fc920d]" />
                  Color Palettes
                </h2>
                <p className="text-sm text-[#716f6c] font-semibold mt-3">
                  Click any color swatch to copy its HEX value. We default to Burgundy and Plum tones.
                </p>
              </div>

              <div className="space-y-8 divide-y-2 divide-[#120f0a]/10">
                {colorPaletteRows.map((row, idx) => (
                  <div key={row.title} className={`grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 ${idx > 0 ? "pt-8" : ""}`}>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-[#120f0a] uppercase tracking-tight">
                        {row.title}
                      </h3>
                      <p className="text-sm text-[#413f3b] leading-relaxed font-serif">
                        {row.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 md:grid md:grid-cols-5 md:gap-4">
                      {row.colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => copyToClipboard(color.hex)}
                          className="group relative flex flex-row md:flex-col items-center md:items-stretch overflow-hidden border-2 border-[#120f0a] bg-white p-2.5 md:p-0 text-left transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_#120f0a] rounded-none cursor-pointer"
                        >
                          <div 
                            className="h-10 w-10 md:h-16 md:w-full border-r-2 md:border-r-0 md:border-b-2 border-[#120f0a] shrink-0" 
                            style={{ backgroundColor: color.hex }} 
                          />
                          <div className="ml-3 md:ml-0 p-0 md:p-3 flex-1 flex flex-row md:flex-col justify-between items-center md:items-stretch">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-mono font-bold text-[#716f6c]">{color.step}</span>
                              <span className="text-sm md:text-xs font-mono font-black text-[#120f0a] mt-0.5">{color.hex}</span>
                            </div>
                            <div className="md:absolute md:right-2 md:top-2 border-2 border-[#120f0a] bg-[#fc920d] p-1 text-[#120f0a] rounded-none md:opacity-0 transition-opacity group-hover:opacity-100 ml-auto md:ml-0 shadow-[1px_1px_0px_0px_#120f0a]">
                              {copiedColor === color.hex ? (
                                <Check className="h-3.5 w-3.5 text-white" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Typography Specimen */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider border-b border-[#120f0a]/15 pb-4">
                  <Type className="h-6 w-6 text-[#97192c]" />
                  Typography Specimens
                </h2>
                <p className="text-sm text-[#716f6c] font-semibold mt-3">
                  Our identity uses robust Helvetica Now headings combined with traditional Georgia Pro body elements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-3 border-[#120f0a] p-6 bg-[#fee9cf]/20 space-y-4 rounded-none shadow-[4px_4px_0px_0px_#120f0a]">
                  <div className="flex justify-between items-center text-xs text-[#716f6c] font-mono font-bold border-b border-[#120f0a]/10 pb-2">
                    <span>PRIMARY / DISPLAY FONT</span>
                    <span>HELVETICA NOW</span>
                  </div>
                  <h3 className="font-sans font-black text-3xl sm:text-4xl text-[#120f0a] tracking-tight uppercase leading-none">
                    HEADING DISPLAY SPECIMEN
                  </h3>
                  <p className="text-sm text-[#413f3b] font-medium leading-relaxed">
                    Use heavier Helvetica Now weights for headings, events banner titles, and action items. Bold, striking, and confident.
                  </p>
                </div>

                <div className="border-3 border-[#120f0a] p-6 bg-[#f4d9d1]/20 space-y-4 rounded-none shadow-[4px_4px_0px_0px_#120f0a]">
                  <div className="flex justify-between items-center text-xs text-[#716f6c] font-mono font-bold border-b border-[#120f0a]/10 pb-2">
                    <span>SECONDARY / BODY FONT</span>
                    <span>GEORGIA PRO</span>
                  </div>
                  <p className="font-serif text-lg text-[#120f0a] leading-relaxed">
                    "This is a specimen of Georgia Pro. We use it for long-form reading, paragraphs, team profiles, and descriptive documentation."
                  </p>
                  <p className="text-xs text-[#716f6c] font-semibold">
                    Traditional, highly readable, and grounds the visual design in narrative clarity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* About & Public Facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <div className="border-4 border-[#120f0a] bg-white p-6 shadow-[8px_8px_0px_0px_#120f0a] rounded-none md:col-span-2 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-[#120f0a] flex items-center gap-2 uppercase tracking-tight border-b border-[#120f0a]/10 pb-2">
                  <FileText className="h-5 w-5 text-[#97192c]" />
                  About bits&amp;bytes™
                </h3>
                <p className="text-sm text-[#413f3b] leading-relaxed font-serif">
                  bits&bytes™ is an independent, youth-led builder network that runs hackathons, developer meetups, open-source squads, and cohort-based programs. Founded in November 2025 after a major partner hackathon was cancelled, the team built a durable student-led alternative where teenagers ship real software, learn in public, and organize with serious safety standards.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                <div className="border-2 border-[#120f0a] bg-[#fee9cf] p-3 text-center shadow-[2px_2px_0px_0px_#120f0a]">
                  <p className="text-2xl font-black text-[#97192c] tracking-tight">1400+</p>
                  <p className="text-[9px] text-[#716f6c] font-mono font-bold uppercase tracking-wider mt-0.5">Active Builders</p>
                </div>
                <div className="border-2 border-[#120f0a] bg-[#f4d9d1] p-3 text-center shadow-[2px_2px_0px_0px_#120f0a]">
                  <p className="text-2xl font-black text-[#fc920d] tracking-tight">
                    <Link href="/fork" className="hover:underline transition-colors">
                      5+ Forks
                    </Link>
                  </p>
                  <p className="text-[9px] text-[#716f6c] font-mono font-bold uppercase tracking-wider mt-0.5">Chapters</p>
                </div>
                <div className="border-2 border-[#120f0a] bg-[#fee9cf] p-3 text-center shadow-[2px_2px_0px_0px_#120f0a]">
                  <p className="text-2xl font-black text-[#97192c] tracking-tight">4+</p>
                  <p className="text-[9px] text-[#716f6c] font-mono font-bold uppercase tracking-wider mt-0.5">Events</p>
                </div>
                <div className="border-2 border-[#120f0a] bg-[#f4d9d1] p-3 text-center shadow-[2px_2px_0px_0px_#120f0a]">
                  <p className="text-2xl font-black text-[#120f0a] tracking-tight">16.5 Yrs</p>
                  <p className="text-[9px] text-[#716f6c] font-mono font-bold uppercase tracking-wider mt-0.5">Mean Age</p>
                </div>
              </div>
            </div>

            <div className="border-4 border-[#120f0a] bg-white p-6 shadow-[8px_8px_0px_0px_#120f0a] rounded-none flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-[#120f0a] flex items-center gap-2 uppercase tracking-tight border-b border-[#120f0a]/10 pb-2">
                  <Info className="h-4 w-4 text-[#fc920d]" />
                  Public Facts
                </h3>
                <div className="text-xs text-[#413f3b] space-y-3 font-mono font-semibold pt-2">
                  <div>
                    <span className="text-[#716f6c] block uppercase text-[9px] font-bold tracking-wider">Public Brand</span>
                    <span className="font-black text-[#120f0a]">bits&amp;bytes™</span>
                  </div>
                  <div>
                    <span className="text-[#716f6c] block uppercase text-[9px] font-bold tracking-wider">Operator</span>
                    <span className="text-[#120f0a]">GOBITSNBYTES FOUNDATION</span>
                  </div>
                  <div>
                    <span className="text-[#716f6c] block uppercase text-[9px] font-bold tracking-wider">Structure</span>
                    <span className="text-[#120f0a]">Section 8 non-profit company in India</span>
                  </div>
                  <div>
                    <span className="text-[#716f6c] block uppercase text-[9px] font-bold tracking-wider">Use This Name</span>
                    <span className="leading-relaxed block text-[#120f0a]">bits&amp;bytes™ in public copy, bitsnbytes where symbols are restricted.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Rules */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-start">
              <div>
                <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider border-b border-[#120f0a]/15 pb-4">
                  <ShieldCheck className="h-6 w-6 text-[#fc920d]" />
                  Usage Rules
                </h2>
                <p className="text-sm text-[#413f3b] mt-4 font-serif leading-relaxed">
                  Press and partners may use official assets for accurate coverage of bits&bytes™. Co-branded materials, merch, sponsorship announcements, and anything implying endorsement need written approval.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Do not distort, recolor, rotate, or add effects to the logo.",
                  "Do not use bits&bytes™ branding for fundraising without approval.",
                  "Do not publish participant data, private chats, or minor photos without consent.",
                  "Use the Code of Conduct and Privacy Policy for safety-sensitive questions.",
                ].map((rule) => (
                  <div key={rule} className="border-2 border-[#120f0a] bg-[#fee9cf] p-4 text-xs sm:text-sm font-bold leading-relaxed text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a] rounded-none">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leadership & Contacts */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#120f0a] flex items-center gap-2 uppercase tracking-tight border-b border-[#120f0a]/10 pb-2">
                    <Users className="h-5 w-5 text-[#97192c]" />
                    Executive Leadership
                  </h3>
                  <ul className="space-y-3">
                    {executiveLeadership.map((member) => (
                      <li key={member.name} className="grid gap-1 border-b border-[#120f0a]/10 pb-3 text-sm sm:grid-cols-[10rem_1fr] sm:items-baseline">
                        <span className="font-black text-[#120f0a]">{member.name}</span>
                        <span className="text-xs font-semibold text-[#716f6c]">{member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#120f0a] flex items-center gap-2 uppercase tracking-tight border-b border-[#120f0a]/10 pb-2">
                    <Users className="h-5 w-5 text-[#97192c]" />
                    Department Leads
                  </h3>
                  <ul className="space-y-3">
                    {departmentLeads.map((member) => (
                      <li key={member.name} className="grid gap-1 border-b border-[#120f0a]/10 pb-3 text-sm sm:grid-cols-[10rem_1fr] sm:items-baseline">
                        <span className="font-black text-[#120f0a]">{member.name}</span>
                        <span className="text-xs font-semibold text-[#716f6c]">{member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-3 border-[#120f0a] bg-white p-6 space-y-4 rounded-none shadow-[4px_4px_0px_0px_#120f0a]">
                <h3 className="text-lg font-black text-[#120f0a] flex items-center gap-2 uppercase border-b border-[#120f0a]/10 pb-2">
                  <Mail className="h-4 w-4 text-[#97192c]" />
                  Media Contact
                </h3>
                <p className="text-sm text-[#413f3b] font-serif leading-relaxed">
                  For press inquiries, brand permissions, partnership queries, or logo authorization:
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:hello@gobitsnbytes.org"
                    className="inline-flex items-center gap-2 font-mono text-[#97192c] font-black hover:underline hover:text-[#fc920d]"
                  >
                    hello@gobitsnbytes.org
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="pt-4 border-t border-[#120f0a]/10">
                  <h4 className="text-xs font-black uppercase text-[#120f0a]">Boilerplate for Journalists</h4>
                  <p className="text-xs text-[#413f3b] font-serif leading-relaxed mt-1 italic">
                    "bits&amp;bytes™ is an independent, student-led youth builder network operated by GOBITSNBYTES FOUNDATION (Section 8 non-profit). Founded in Lucknow, India, it connects 1,400+ teenage developers to ship real-world software and run independent hackathons."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Digital PR & Academic Citation Guide */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider border-b border-[#120f0a]/15 pb-4">
                  <FileText className="h-6 w-6 text-[#fc920d]" />
                  Citations &amp; Digital PR Guidelines
                </h2>
                <p className="text-sm text-[#716f6c] font-semibold mt-3">
                  When citing bits&amp;bytes™ research, event metrics, or brand publications, please use the standard citations below:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-[#120f0a] bg-[#fee9cf]/30 p-4 rounded-none shadow-[2px_2px_0px_0px_#120f0a]">
                  <h3 className="text-xs font-mono font-black uppercase text-[#97192c]">APA Citation Format</h3>
                  <p className="text-xs font-mono text-[#120f0a] mt-2 bg-white p-2.5 border border-[#120f0a] select-all">
                    GOBITSNBYTES FOUNDATION. (2026). India Youth Tech &amp; Builder Research Metrics. bits&amp;bytes™. https://gobitsnbytes.org/impact
                  </p>
                </div>

                <div className="border-2 border-[#120f0a] bg-[#f4d9d1]/30 p-4 rounded-none shadow-[2px_2px_0px_0px_#120f0a]">
                  <h3 className="text-xs font-mono font-black uppercase text-[#97192c]">BibTeX Format</h3>
                  <pre className="text-[10px] font-mono text-[#120f0a] mt-2 bg-white p-2.5 border border-[#120f0a] overflow-x-auto select-all">
{`@misc{bitsnbytes2026,
  author = {GOBITSNBYTES FOUNDATION},
  title = {bits&bytes: India's Teen Builder Network},
  year = {2026},
  publisher = {GOBITSNBYTES FOUNDATION},
  url = {https://gobitsnbytes.org}
}`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Backlink Badge Magnet Kit for External Blogs, Repos & Partners */}
          <section className="bg-white border-4 border-[#120f0a] p-6 md:p-8 shadow-[8px_8px_0px_0px_#120f0a] rounded-none">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#120f0a] flex items-center gap-3 uppercase tracking-wider border-b border-[#120f0a]/15 pb-4">
                  <ExternalLink className="h-6 w-6 text-[#97192c]" />
                  Embed Badges &amp; Link to Us (Backlink Kit)
                </h2>
                <p className="text-sm text-[#716f6c] font-semibold mt-3">
                  Are you a partner, student builder, event organizer, or tech blogger? Add our official badge to your GitHub README or site to link back to bits&amp;bytes™.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-3 border-[#120f0a] bg-[#faf8f5] p-5 shadow-[4px_4px_0px_0px_#120f0a]">
                  <h3 className="text-xs font-mono font-black uppercase text-[#120f0a] mb-2">Markdown Logo Link (GitHub READMEs)</h3>
                  <div className="bg-white border-2 border-[#120f0a] p-3 text-[11px] font-mono select-all overflow-x-auto text-[#120f0a]">
                    {`[![bits&bytes™ logo](https://gobitsnbytes.org/logo)](https://gobitsnbytes.org)`}
                  </div>
                  <p className="text-[10px] text-[#716f6c] mt-2 font-serif">Copy and paste into your project README.md file to link to us.</p>
                </div>

                <div className="border-3 border-[#120f0a] bg-[#faf8f5] p-5 shadow-[4px_4px_0px_0px_#120f0a]">
                  <h3 className="text-xs font-mono font-black uppercase text-[#120f0a] mb-2">HTML Logo Badge (Websites &amp; Blogs)</h3>
                  <div className="bg-white border-2 border-[#120f0a] p-3 text-[11px] font-mono select-all overflow-x-auto text-[#120f0a]">
                    {`<a href="https://gobitsnbytes.org" target="_blank" rel="noopener"><img src="https://gobitsnbytes.org/logo" alt="bits&bytes™ - India's Youth Builder Network" height="36" /></a>`}
                  </div>
                  <p className="text-[10px] text-[#716f6c] mt-2 font-serif">Copy and paste into your website footer or partner section.</p>
                </div>
              </div>
            </div>
          </section>
          
        </main>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Brand",
            "name": "bits&bytes™",
            "alternateName": ["bits&bytes", "bitsnbytes", "GOBITSNBYTES FOUNDATION"],
            "url": "https://gobitsnbytes.org",
            "logo": "https://gobitsnbytes.org/logo.svg",
            "description": "Official brand assets, logos, public facts, and press guidelines for bits&bytes™ (GOBITSNBYTES FOUNDATION).",
            "owner": {
              "@type": "Organization",
              "name": "GOBITSNBYTES FOUNDATION",
              "url": "https://gobitsnbytes.org",
            },
          }),
        }}
      />
    </div>
  );
}

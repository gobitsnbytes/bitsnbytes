"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
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
} from "lucide-react";

import { GlassContainer } from "@/components/ui/glass-container";
import { TEAM_MEMBERS } from "@/lib/team-data";
import logoSvg from "@public/logo.svg";

const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((mod) => ({
      default: mod.WebGLShader,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

const colors = {
  core: [
    { name: "Burgundy Base", hex: "#97192C", desc: "Core brand identity voice" },
    { name: "Burgundy Dark", hex: "#5B0F1A", desc: "Heavy weights & backgrounds" },
    { name: "Neutral Warm", hex: "#120F0A", desc: "Dark layouts background" },
  ],
  accents: [
    { name: "Orange Pop", hex: "#FC920D", desc: "Emphasis & active elements" },
    { name: "Vibrant Pink", hex: "#E45A92", desc: "Interactive states & highlights" },
    { name: "Rich Plum", hex: "#5D2F77", desc: "Secondary depth layering" },
    { name: "Deep Purple", hex: "#3E1E68", desc: "Core system brand accent" },
  ],
};

const leadership = TEAM_MEMBERS.filter(
  (member) => member.role.startsWith("Chief") || member.role.startsWith("Head"),
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
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="px-6 py-8 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <ImageIcon className="h-3.5 w-3.5 text-[var(--brand-pink)]" />
                Media & Branding Resources
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Press Kit & Brand Assets
              </h1>
              <p className="max-w-2xl text-white/80 text-sm sm:text-base md:text-lg">
                Official logos, color palettes, typography specs, public facts, and media contact paths for bits&bytes™.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Logo Downloads */}
          <GlassContainer className="p-8 sm:p-12 border-white/10" glowColor="purple">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                    <ImageIcon className="h-6 w-6 text-[var(--brand-pink)]" />
                    Official Logos
                  </h2>
                  <p className="text-sm text-white/70 mt-1">
                    Download the official bits&bytes™ cube monogram and wordmark assets.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SVG Logo */}
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex flex-col items-center justify-between gap-6">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-[14px] border border-[rgba(208,207,206,0.14)] bg-[var(--bb-neutral-100)] shadow-inner">
                    <Image src={logoSvg} alt="bits&bytes logo SVG" width={104} height={104} className="object-contain" />
                  </div>
                  <div className="text-center w-full">
                    <h3 className="font-bold text-white text-lg">Vector SVG Logo</h3>
                    <p className="text-xs text-white/60 mt-1">Best for web layouts and high-resolution scaling.</p>
                    <a
                      href="/logo.svg"
                      download="bitsnbytes-logo.svg"
                      className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 rounded-xl bg-[var(--brand-pink)] text-white font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_14px_rgba(228,90,146,0.3)]"
                    >
                      <Download className="h-4 w-4" />
                      Download SVG
                    </a>
                  </div>
                </div>

                {/* PNG Logo */}
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5 flex flex-col items-center justify-between gap-6">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-[14px] border border-[rgba(208,207,206,0.14)] bg-[var(--bb-neutral-100)] shadow-inner">
                    <Image src="/logo.png" alt="bits&bytes logo PNG" width={104} height={104} className="object-contain" />
                  </div>
                  <div className="text-center w-full">
                    <h3 className="font-bold text-white text-lg">Raster PNG Logo</h3>
                    <p className="text-xs text-white/60 mt-1">Raster image file with transparent background.</p>
                    <a
                      href="/logo.png"
                      download="bitsnbytes-logo.png"
                      className="inline-flex items-center gap-2 px-5 py-2.5 mt-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 active:scale-95 transition-all"
                    >
                      <Download className="h-4 w-4" />
                      Download PNG
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Brand Colors */}
          <GlassContainer className="p-8 sm:p-12 border-white/10" glowColor="coral">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                  <Palette className="h-6 w-6 text-[var(--brand-coral)]" />
                  Color Palettes
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  Click any color swatch to copy its HEX value. We default to layered burgundy and plum tones.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-3">Core Identity Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {colors.core.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => copyToClipboard(color.hex)}
                        className="group relative min-h-32 overflow-hidden rounded-[14px] border border-[rgba(208,207,206,0.14)] bg-[rgba(18,15,10,0.48)] text-left shadow-[0_18px_44px_rgba(18,15,10,0.24)] transition-[border-color,transform,box-shadow] duration-200 ease-out hover:border-[rgba(252,146,13,0.36)] hover:shadow-[var(--glow-soft)] active:scale-[0.98]"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-14 border-b border-white/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="relative flex min-h-32 flex-col justify-end p-4 pt-16">
                          <h4 className="font-display text-base font-black text-white">{color.name}</h4>
                          <p className="mt-1 text-xs text-[var(--bb-orange-60)] font-mono">{color.hex}</p>
                          <p className="mt-2 text-xs leading-snug text-white/54">{color.desc}</p>
                        </div>
                        <div className="absolute right-3 top-3 rounded-lg bg-[rgba(18,15,10,0.42)] p-1.5 text-white/72 opacity-80 transition-opacity group-hover:opacity-100">
                          {copiedColor === color.hex ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white/60" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-3">Accent / Interaction Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {colors.accents.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => copyToClipboard(color.hex)}
                        className="group relative min-h-28 overflow-hidden rounded-[14px] border border-[rgba(208,207,206,0.14)] bg-[rgba(18,15,10,0.48)] text-left shadow-[0_14px_36px_rgba(18,15,10,0.2)] transition-[border-color,transform,box-shadow] duration-200 ease-out hover:border-[rgba(252,146,13,0.36)] hover:shadow-[var(--glow-soft)] active:scale-[0.98]"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-12 border-b border-white/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="relative flex min-h-28 flex-col justify-end p-3 pt-14">
                          <h4 className="font-display text-sm font-black text-white">{color.name}</h4>
                          <p className="mt-1 text-[0.68rem] text-[var(--bb-orange-60)] font-mono">{color.hex}</p>
                          <p className="mt-1 text-[0.68rem] leading-snug text-white/52">{color.desc}</p>
                        </div>
                        <div className="absolute right-2.5 top-2.5 rounded-lg bg-[rgba(18,15,10,0.42)] p-1.5 text-white/72 opacity-80 transition-opacity group-hover:opacity-100">
                          {copiedColor === color.hex ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5 text-white/60" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* Typography Specimen */}
          <GlassContainer className="p-8 sm:p-12 border-white/10" glowColor="both">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                  <Type className="h-6 w-6 text-[var(--brand-pink)]" />
                  Typography Specimens
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  Our identity uses robust Helvetica Now headings combined with traditional Georgia Pro body elements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5 space-y-4">
                  <div className="flex justify-between items-center text-xs text-white/50 font-mono">
                    <span>PRIMARY / DISPLAY FONT</span>
                    <span>HELVETICA NOW</span>
                  </div>
                  <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none">
                    HEADING DISPLAY SPECIMEN
                  </h3>
                  <p className="text-sm text-white/60">
                    Use heavier Helvetica Now weights for headings, events banner titles, and action items. Bold, striking, and confident.
                  </p>
                </div>

                <div className="border border-white/10 rounded-2xl p-6 bg-white/5 space-y-4">
                  <div className="flex justify-between items-center text-xs text-white/50 font-mono">
                    <span>SECONDARY / BODY FONT</span>
                    <span>GEORGIA PRO</span>
                  </div>
                  <p className="font-serif-brand text-lg text-white/90 leading-relaxed">
                    "This is a specimen of Georgia Pro. We use it for long-form reading, paragraphs, team profiles, and descriptive documentation."
                  </p>
                  <p className="text-xs text-white/60">
                    Traditional, highly readable, and grounds the visual design in narrative clarity.
                  </p>
                </div>
              </div>
            </div>
          </GlassContainer>

          {/* About & Public Facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <GlassContainer className="p-6 border-white/10 h-full" containerClassName="h-full md:col-span-2" glowColor="purple">
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[var(--brand-pink)]" />
                    About bits&bytes™
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed font-serif-brand">
                    bits&bytes™ is an independent, youth-led builder network that runs hackathons, developer meetups, open-source squads, and cohort-based programs. Founded in November 2025 after a major partner hackathon was cancelled, the team built a durable student-led alternative where teenagers ship real software, learn in public, and organize with serious safety standards.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border border-white/10 bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-[var(--brand-pink)] font-display">1500+</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Active Builders</p>
                  </div>
                  <div className="border border-white/10 bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-[var(--brand-coral)] font-display">2700+</p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Submissions Reviewed</p>
                  </div>
                </div>
              </div>
            </GlassContainer>

            <GlassContainer className="p-6 border-white/10 h-full" containerClassName="h-full" glowColor="coral">
              <div className="space-y-4 flex flex-col h-full">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--brand-coral)]" />
                  Public Facts
                </h3>
                <div className="text-xs text-white/80 space-y-3 font-mono flex-1 flex flex-col justify-between pt-2">
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] tracking-wider">Public Brand</span>
                    <span className="font-semibold text-white">bits&bytes™</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] tracking-wider">Operator</span>
                    <span>GOBITSNBYTES FOUNDATION</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] tracking-wider">Structure</span>
                    <span>Section 8 non-profit company in India</span>
                  </div>
                  <div>
                    <span className="text-white/40 block uppercase text-[9px] tracking-wider">Use This Name</span>
                    <span className="not-italic leading-relaxed block text-white/90">bits&bytes™ in public copy, bitsnbytes where symbols are restricted.</span>
                  </div>
                </div>
              </div>
            </GlassContainer>
          </div>

          <GlassContainer className="p-8 sm:p-10 border-white/10" glowColor="purple">
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-start">
              <div>
                <h2 className="font-display text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                  <ShieldCheck className="h-6 w-6 text-[var(--brand-coral)]" />
                  Usage Rules
                </h2>
                <p className="text-sm text-white/70 mt-2 font-serif-brand leading-relaxed">
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
                  <div key={rule} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/76">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </GlassContainer>

          {/* Leadership & Contacts */}
          <GlassContainer className="p-8 sm:p-12 border-white/10" glowColor="both">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                  <Users className="h-5 w-5 text-[var(--brand-pink)]" />
                  Executive Leadership
                </h3>
                <ul className="space-y-3">
                  {leadership.map((member) => (
                    <li key={member.name} className="grid gap-1 border-b border-white/5 pb-3 text-sm sm:grid-cols-[10rem_1fr] sm:items-baseline">
                      <span className="font-semibold text-white">{member.name}</span>
                      <span className="text-xs leading-relaxed text-white/60">{member.role}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-white/10 bg-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--brand-pink)]" />
                  Media Contact
                </h3>
                <p className="text-sm text-white/80 font-serif-brand leading-relaxed">
                  For press inquiries, brand permissions, partnership queries, or logo authorization:
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:hello@gobitsnbytes.org"
                    className="inline-flex items-center gap-2 font-mono text-[var(--brand-pink)] font-bold hover:underline"
                  >
                    hello@gobitsnbytes.org
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </GlassContainer>
          
        </div>
      </main>
    </>
  );
}

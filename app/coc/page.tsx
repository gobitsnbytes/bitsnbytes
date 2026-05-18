"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Heart,
  Users,
  MessageCircle,
  Shield,
  AlertTriangle,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassContainer } from "@/components/ui/glass-container";

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

const values = [
  {
    icon: Heart,
    title: "Be Warm & Welcoming",
    description:
      "Make people feel at home. New members shouldn't feel like they walked into the wrong classroom.",
  },
  {
    icon: Users,
    title: "Be Patient & Chill",
    description:
      "Everyone learns differently. Everyone speaks differently. Take a breath before replying.",
  },
  {
    icon: MessageCircle,
    title: "Respect is Non-Negotiable",
    description:
      "We'll disagree sometimes, and that's fine. Just don't make it personal. The goal isn't to \"win,\" it's to learn.",
  },
  {
    icon: Sparkles,
    title: "Build Together",
    description:
      'Instead of "this sucks," try "here\'s how we can make this cooler." No unnecessary sniping or derailing.',
  },
];

const notAllowed = [
  "Harassment or discrimination of any kind",
  "Bullying or intentionally isolating someone",
  "Unwanted romantic or sexual advances",
  "Sharing explicit or inappropriate content",
  "Spamming, trolling, or derailing discussions",
  "Misusing club funds or resources",
  "Doxxing or sharing private information",
];

const strikes = [
  {
    number: "1",
    title: "First Strike",
    description: "Formal warning. May include an apology request.",
    color: "bg-yellow-500",
  },
  {
    number: "2",
    title: "Second Strike",
    description: "Temporary ban from events and community spaces.",
    color: "bg-orange-500",
  },
  {
    number: "3",
    title: "Third Strike",
    description: "Permanent removal from the Bits&Bytes community.",
    color: "bg-red-500",
  },
];

const appliesTo = [
  "All offline meetups, workshops, and events",
  "Discord, WhatsApp, and other official online spaces",
  "Any club-affiliated projects or collaborations",
  "Social media interactions under the Bits&Bytes name",
];

export default function CodeOfConduct() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[58vh] sm:min-h-[64vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <Shield className="h-3.5 w-3.5" />
                Community Guidelines
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Code of Conduct
              </h1>
              <div className="inline-block bg-(--brand-pink) text-white px-8 py-4 rounded-full text-lg md:text-xl font-black shadow-[0_0_40px_rgba(228,90,146,0.6)] animate-bounce-subtle">
                TL;DR: Be nice. Be cool. Don't cause chaos.
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* What We Stand For */}
        <PageSection
          align="center"
          eyebrow="Our Promise"
          title="What we stand for"
          description="Bits&Bytes is home for builders, dreamers, designers, and that one person who always knows the shortcut keys."
        >
          <div className="mx-auto max-w-3xl">
            <GlassContainer
              className="p-8 md:p-12 text-center"
              glowColor="both"
            >
              <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
                We want this place to feel friendly, safe, and welcoming for
                everyone, no matter who they are or where they come from. This
                document keeps the vibe right so people can actually build
                things without garbage getting in the way.
              </p>
            </GlassContainer>
          </div>
        </PageSection>

        {/* Values */}
        <PageSection
          align="center"
          eyebrow="Values"
          title="The energy we expect"
          description="Here's the vibe we need from everyone who joins our world."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value, index) => (
              <GlassContainer
                key={value.title}
                className="p-6 md:p-8"
                glowColor={index % 2 === 0 ? "pink" : "purple"}
                delay={index * 0.1}
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-(--brand-pink) shadow-inner">
                    <value.icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl md:text-2xl font-black text-white">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-base text-white/70 font-medium leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        {/* Where This Applies */}
        <PageSection
          align="center"
          eyebrow="Scope"
          title="Where this applies"
          description="If it has the Bits&Bytes name on it, this code covers it."
        >
          <div className="mx-auto max-w-2xl">
            <GlassContainer className="p-8 md:p-10" glowColor="purple">
              <ul className="space-y-4 md:space-y-6">
                {appliesTo.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 text-base md:text-lg text-white font-medium"
                  >
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-(--brand-pink) shadow-[0_0_10px_var(--brand-pink)]" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassContainer>
          </div>
        </PageSection>

        {/* Not Allowed */}
        <PageSection
          align="center"
          eyebrow="Boundaries"
          title="Things we don't allow"
          description="Straightforward list of nope. Don't be harmful, creepy, or chaotic."
        >
          <div className="mx-auto max-w-2xl">
            <GlassContainer
              className="p-8 md:p-10 border-red-500/20"
              glowColor="none"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-lg font-black text-red-500 uppercase tracking-widest">
                  Zero Tolerance
                </span>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {notAllowed.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 text-base md:text-lg text-white/80 font-medium"
                  >
                    <span className="text-red-500 font-black shrink-0">✕</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassContainer>
          </div>
        </PageSection>

        {/* Consequences */}
        <PageSection
          align="center"
          eyebrow="Accountability"
          title="What happens if you break the rules"
          description="We follow a simple three-strike system to keep things fair."
        >
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-3">
              {strikes.map((strike, index) => (
                <GlassContainer
                  key={strike.number}
                  className="p-6 md:p-8 text-center"
                  glowColor={
                    index === 0 ? "none" : index === 1 ? "purple" : "pink"
                  }
                  delay={index * 0.15}
                >
                  <div
                    className={cn(
                      "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white font-black text-2xl shadow-lg border-4 border-white/20",
                      strike.color === "bg-yellow-500"
                        ? "bg-yellow-500 shadow-yellow-500/20"
                        : strike.color === "bg-orange-500"
                          ? "bg-orange-500 shadow-orange-500/20"
                          : "bg-red-500 shadow-red-500/20",
                    )}
                  >
                    {strike.number}
                  </div>
                  <h3 className="font-display text-xl font-black text-white">
                    {strike.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/60 font-medium leading-relaxed">
                    {strike.description}
                  </p>
                </GlassContainer>
              ))}
            </div>

            <div className="mt-8">
              <GlassContainer className="p-6 text-center" glowColor="none">
                <p className="text-sm md:text-base text-white/70 font-medium leading-relaxed">
                  <strong className="text-white font-black uppercase tracking-tighter mr-2">
                    Important:
                  </strong>{" "}
                  For serious violations, we may act immediately without a
                  warning. The Bits&Bytes team decides what counts as a
                  violation. The goal is keeping the community functional.
                </p>
              </GlassContainer>
            </div>
          </div>
        </PageSection>

        {/* Reporting */}
        <PageSection
          align="center"
          eyebrow="Speak Up"
          title="Reporting problems"
          description="If something's wrong, don't ignore it. Tell us."
        >
          <div className="mx-auto max-w-2xl">
            <GlassContainer
              className="p-8 md:p-12 text-center"
              glowColor="pink"
            >
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 shadow-inner">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-(--brand-pink) text-white shadow-[0_0_20px_rgba(228,90,146,0.5)]">
                    <Mail className="h-8 w-8" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm text-white/50 font-bold uppercase tracking-[0.2em] mb-1">
                      Email us at
                    </p>
                    <a
                      href="mailto:hello@gobitsnbytes.org"
                      className="text-2xl md:text-3xl font-black text-white hover:text-(--brand-pink) transition-colors tracking-tighter"
                    >
                      hello@gobitsnbytes.org
                    </a>
                  </div>
                </div>

                <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed">
                  Or message any team member privately. Share context or
                  screenshots if possible. Your report stays{" "}
                  <strong className="text-white font-bold">
                    100% confidential
                  </strong>
                  . We'll handle things calmly and fairly.
                </p>
              </div>
            </GlassContainer>
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection align="center">
          <GlassContainer className="p-10 md:p-20 text-center" glowColor="both">
            <p className="text-xl md:text-3xl font-black text-white leading-tight max-w-3xl mx-auto tracking-tighter">
              "Bits&Bytes exists to be a space where people can actually build
              things.
              <span className="block mt-2 text-[var(--brand-pink)]">
                Help us keep it that way.
              </span>
              "
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="group rounded-full bg-[var(--brand-pink)] px-10 py-7 text-lg font-black text-white shadow-lg shadow-[var(--brand-pink)/20] hover:shadow-xl hover:shadow-[var(--brand-pink)/40] transition-transform transition-colors transition-opacity hover:scale-105 w-full sm:w-auto"
              >
                <Link href="/join">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 px-10 py-7 text-lg font-bold text-white backdrop-blur-md hover:bg-white/10 w-full sm:w-auto transition-transform transition-colors transition-opacity"
              >
                <Link href="/contact">Contact the Team</Link>
              </Button>
            </div>
          </GlassContainer>
        </PageSection>
      </main>
    </>
  );
}

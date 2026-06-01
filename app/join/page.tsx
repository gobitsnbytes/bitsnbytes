"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Rocket,
  Heart,
  Zap,
} from "lucide-react";

// Lazy load WebGL shader
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

const NOTION_JOIN_FORM_URL =
  "https://perfect-dinghy-781.notion.site/33949ed2fc338035bd3bef46155035f5?pvs=105";
const DISCORD_INVITE_URL = "https://discord.gg/rjqPfwKKTE";

const benefits = [
  {
    icon: Users,
    title: "Join a tight-knit crew",
    description:
      "Work alongside 1500+ teen builders across India who are actually building things.",
  },
  {
    icon: Rocket,
    title: "Ship real projects",
    description:
      "Build projects with mentorship at every step, from idea to deployment.",
  },
  {
    icon: Zap,
    title: "Attend exclusive events",
    description:
      "Get priority access to hackathons, workshops, and events with people who actually work in the industry.",
  },
  {
    icon: Heart,
    title: "Grow together",
    description:
      "Pair programming, code reviews, and study groups help everyone level up faster.",
  },
];

const expectations = [
  "Be a student (ages 13-19) who cares about tech",
  "Commit 2-4 hours per week for activities",
  "Join our Discord and stay active in discussions",
  "Participate in at least one project or event per quarter",
  "Support fellow members and don't be a jerk",
];

const faqs = [
  {
    question: "Do I need coding experience to join?",
    answer:
      "No. We welcome beginners and pair them with mentors. What matters is that you actually want to build things.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "We recommend 2-4 hours per week, but it's flexible. Some weeks you might attend a workshop, others you might work on a project async.",
  },
  {
    question: "Is there a membership fee?",
    answer: "No. Bits&Bytes is free. Tech education shouldn't cost money.",
  },
  {
    question: "I'm not from Lucknow. Can I still join?",
    answer:
      "Absolutely! While we started in Lucknow, we now have members across India. Most activities happen online via Discord.",
  },
];

import { GlassContainer } from "@/components/ui/glass-container";

export default function Join() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32"
        aria-labelledby="join-hero-title"
      >
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-24">
          <div className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--brand-pink) opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-(--brand-pink)" />
                </span>
                Applications Open
              </span>
              <h1
                id="join-hero-title"
                className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl"
              >
                Join the crew
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                Tell us how you want to build with us. We'll connect you with
                squads, mentors, and real projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* Main CTA Section */}
        <PageSection align="center">
          <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
            <GlassContainer
              className="p-8 md:p-12 text-center"
              glowColor="both"
            >
              <div className="flex flex-col items-center gap-6">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 font-bold uppercase tracking-widest">
                  <Clock className="h-4 w-4 text-(--brand-pink)" />
                  <span>Takes less than 2 minutes</span>
                </div>

                <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    asChild
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-(--brand-pink) px-10 py-4 text-lg md:text-xl font-black text-white shadow-lg shadow-[#e45a92]/20 hover:shadow-xl hover:shadow-[#e45a92]/40 transition-transform transition-colors transition-opacity hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 w-full sm:w-auto"
                  >
                    <a
                      href={NOTION_JOIN_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Bits&Bytes lead application in Notion"
                    >
                      Join as a Lead
                      <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-10 py-4 text-lg md:text-xl font-black text-white shadow-lg shadow-white/10 hover:border-white/60 hover:bg-white/20 transition-transform transition-colors transition-opacity hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 w-full sm:w-auto"
                  >
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Join Bits&Bytes Discord"
                    >
                      Join as a Member
                      <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>

                <p className="text-sm text-white/50 font-medium">
                  We review applications weekly · You&apos;ll hear back within 7
                  days
                </p>
              </div>
            </GlassContainer>
          </div>
        </PageSection>

        {/* Benefits Section */}
        <PageSection
          align="center"
          eyebrow="Why Join"
          title="What you'll get as a member"
          description="Being part of Bits&Bytes is more than a Discord invite."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <GlassContainer
                key={benefit.title}
                className="p-6 md:p-8"
                glowColor={index % 2 === 0 ? "pink" : "purple"}
                delay={index * 0.1}
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-(--brand-pink) shadow-inner">
                    <benefit.icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl md:text-2xl font-black text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-base text-white/70 font-medium leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        {/* Expectations Section */}
        <PageSection
          align="center"
          eyebrow="Expectations"
          title="What we look for"
          description="We want to make sure Bits&Bytes is the right fit for you."
        >
          <div className="mx-auto max-w-2xl">
            <GlassContainer className="p-8 md:p-10" glowColor="purple">
              <ul className="space-y-4 md:space-y-6">
                {expectations.map((expectation, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 text-base md:text-lg text-white font-medium"
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-(--brand-pink) mt-0.5" />
                    <span>{expectation}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassContainer>
          </div>
        </PageSection>

        {/* FAQ Section */}
        <PageSection
          align="center"
          eyebrow="FAQ"
          title="Common questions"
          description="Things people ask before applying."
        >
          <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
            {faqs.map((faq, index) => (
              <GlassContainer
                key={index}
                className="p-6 md:p-8"
                glowColor="none"
                delay={index * 0.1}
              >
                <h3 className="font-display text-lg md:text-xl font-black text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-base text-white/60 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </GlassContainer>
            ))}
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection align="center">
          <div className="mx-auto max-w-2xl text-center space-y-4 sm:space-y-6">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Ready to start building?
            </h2>
            <p className="text-sm sm:text-base text-white/70 px-4 sm:px-0">
              Join 1500+ teen builders who ship real projects.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="group rounded-full bg-[var(--brand-pink)] px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-lg shadow-[#e45a92]/20 hover:shadow-xl hover:shadow-[#e45a92]/40 transition-transform transition-colors transition-opacity hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 w-full sm:w-auto"
              >
                <a
                  href={NOTION_JOIN_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Bits&Bytes lead application in Notion"
                >
                  Join as a Lead
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                className="group rounded-full border border-white/30 bg-white/10 px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-lg shadow-white/10 hover:border-white/60 hover:bg-white/20 transition-transform transition-colors transition-opacity hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 w-full sm:w-auto"
              >
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Bits&Bytes Discord"
                >
                  Join as a Member
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-white/60">
              Questions? Reach us at{" "}
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="font-bold text-[var(--brand-pink)] hover:underline"
              >
                hello@gobitsnbytes.org
              </a>
            </p>
          </div>
        </PageSection>
      </main>
    </>
  );
}

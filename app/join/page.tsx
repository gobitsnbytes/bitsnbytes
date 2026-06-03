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
  GitFork,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

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
    answer: "No. bits&bytes™ is free. Tech education shouldn't cost money.",
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
          <div className="mx-auto w-full max-w-5xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Discord Community */}
              <GlassContainer className="p-6 md:p-8 flex flex-col justify-between h-full text-center md:text-left" glowColor="pink">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 mx-auto md:mx-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[var(--brand-pink)] shadow-inner">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">Join Community</h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed font-medium">
                      Hop onto our Discord server. Chat with 1500+ student builders, find project teams, and attend online study sessions.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    className="group w-full rounded-full bg-white/10 border border-white/20 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all hover:scale-[1.02]"
                  >
                    <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                      Join Discord
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </GlassContainer>

              {/* Option 2: Contributor Application */}
              <GlassContainer className="p-6 md:p-8 flex flex-col justify-between h-full text-center md:text-left" glowColor="both">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 mx-auto md:mx-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[var(--brand-pink)] shadow-inner">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">Become a Contributor</h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed font-medium">
                      Apply to build our core open-source software projects, organize developer cohorts, or manage outreach.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    className="group w-full rounded-full bg-[var(--brand-pink)] py-3 text-sm font-black text-white shadow-lg shadow-[#e45a92]/20 hover:shadow-xl hover:shadow-[#e45a92]/40 transition-all hover:scale-[1.02]"
                  >
                    <a href={NOTION_JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </GlassContainer>

              {/* Option 3: Fork Lead Application */}
              <GlassContainer className="p-6 md:p-8 flex flex-col justify-between h-full text-center md:text-left" glowColor="purple">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 mx-auto md:mx-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[var(--brand-pink)] shadow-inner">
                    <GitFork className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-white uppercase tracking-tight">Launch a Fork</h3>
                    <p className="mt-2 text-sm text-white/70 leading-relaxed font-medium">
                      Bring bits&bytes to your city. Gather local builders, host workshops/hacknights, and run your city's tech scene.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    className="group w-full rounded-full bg-white/10 border border-white/20 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all hover:scale-[1.02]"
                  >
                    <Link href="/fork">
                      Explore Forks
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </GlassContainer>
            </div>
            
            <p className="text-center text-xs text-white/40 font-mono mt-4">
              We review contributor and fork applications weekly • Expected response time: 7 days
            </p>
          </div>
        </PageSection>

        {/* Benefits Section */}
        <PageSection
          align="center"
          eyebrow="Why Join"
          title="What you'll get as a member"
          description="Being part of bits&bytes™ is more than a Discord invite."
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
          description="We want to make sure bits&bytes™ is the right fit for you."
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
                className="group rounded-full bg-white/10 border border-white/30 px-6 py-4 h-auto text-sm font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-all hover:scale-105 w-full sm:w-auto"
              >
                <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                  Join Discord
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                className="group rounded-full bg-[var(--brand-pink)] px-6 py-4 h-auto text-sm font-semibold text-white shadow-lg shadow-[#e45a92]/20 hover:shadow-xl hover:shadow-[#e45a92]/40 transition-all hover:scale-105 w-full sm:w-auto"
              >
                <a href={NOTION_JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Become a Contributor
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                className="group rounded-full bg-white/10 border border-white/30 px-6 py-4 h-auto text-sm font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-all hover:scale-105 w-full sm:w-auto"
              >
                <Link href="/fork">
                  Launch a Fork
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
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

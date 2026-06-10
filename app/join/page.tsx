"use client";

import { motion } from "framer-motion";
import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Rocket,
  Heart,
  Zap,
  GitFork,
} from "lucide-react";
import Link from "next/link";

const NOTION_JOIN_FORM_URL =
  "https://perfect-dinghy-781.notion.site/33949ed2fc338035bd3bef46155035f5?pvs=105";
const DISCORD_INVITE_URL = "https://discord.gg/rjqPfwKKTE";

const benefits = [
  {
    icon: Users,
    title: "Join a tight-knit crew",
    description:
      "Work alongside 1400+ teen builders across India who are actually building things.",
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

const DiscordIcon = ({ className, ...props }: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.894.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.92 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.197.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

export default function Join() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center overflow-hidden text-[#120f0a] pt-24 md:pt-32"
        aria-labelledby="join-hero-title"
      >
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="px-6 py-8 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 border-2 border-[#120f0a] bg-[#fc920d] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#97192c] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#97192c]" />
                </span>
                Applications Open
              </span>
              <h1
                id="join-hero-title"
                className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#120f0a] uppercase tracking-tight leading-none"
              >
                Join the crew
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#413f3b] max-w-2xl mx-auto leading-relaxed font-semibold">
                Tell us how you want to build with us. We'll connect you with
                squads, mentors, and real projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent pb-16">
        {/* Main CTA Section */}
        <PageSection align="center">
          <div className="mx-auto w-full max-w-5xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option 1: Discord Community */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-6 md:p-8 flex flex-col justify-between h-full text-center md:text-left">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 mx-auto md:mx-0 items-center justify-center border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]">
                    <DiscordIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-[#120f0a] uppercase tracking-tight">Join Community</h3>
                    <p className="mt-2 text-sm text-[#413f3b] leading-relaxed font-semibold">
                      Hop onto our Discord server. Chat with 1400+ student builders, find project teams, and attend online study sessions.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    className="group w-full rounded-none bg-white text-sm font-black uppercase tracking-wider text-[#120f0a] border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer py-3 h-auto"
                  >
                    <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                      Join Discord
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Option 2: Contributor Application */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-6 md:p-8 flex flex-col justify-between h-full text-center md:text-left">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 mx-auto md:mx-0 items-center justify-center border-2 border-[#120f0a] bg-[#fc920d] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-[#120f0a] uppercase tracking-tight">Become a Contributor</h3>
                    <p className="mt-2 text-sm text-[#413f3b] leading-relaxed font-semibold">
                      Apply to build our core open-source software projects, organize developer cohorts, or manage outreach.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    className="group w-full rounded-none bg-[#97192c] text-sm font-black uppercase tracking-wider text-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer py-3 h-auto"
                  >
                    <a href={NOTION_JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Option 3: Fork Lead Application */}
              <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-6 md:p-8 flex flex-col justify-between h-full text-center md:text-left">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 mx-auto md:mx-0 items-center justify-center border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]">
                    <GitFork className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-[#120f0a] uppercase tracking-tight">Launch a Fork</h3>
                    <p className="mt-2 text-sm text-[#413f3b] leading-relaxed font-semibold">
                      Bring bits&bytes to your city. Gather local builders, host workshops/hacknights, and run your city's tech scene.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    className="group w-full rounded-none bg-white text-sm font-black uppercase tracking-wider text-[#120f0a] border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer py-3 h-auto"
                  >
                    <Link href="/fork">
                      Explore Forks
                      <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-[#716f6c] font-mono mt-4">
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
              <div
                key={benefit.title}
                className="bg-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] p-6 md:p-8"
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center border-2 border-[#120f0a] bg-[#fee9cf] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]">
                    <benefit.icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl md:text-2xl font-black text-[#120f0a] uppercase">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-base text-[#413f3b] font-semibold leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
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
            <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-8 md:p-10">
              <ul className="space-y-4 md:space-y-6">
                {expectations.map((expectation, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 text-base md:text-lg text-[#120f0a] font-semibold"
                  >
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[#97192c] mt-0.5" />
                    <span>{expectation}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
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
              <div
                key={index}
                className="bg-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] p-6 md:p-8"
              >
                <h3 className="font-display text-lg md:text-xl font-black text-[#120f0a] uppercase">
                  {faq.question}
                </h3>
                <p className="mt-3 text-base text-[#413f3b] font-semibold leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection align="center">
          <div className="mx-auto max-w-4xl text-center space-y-4 sm:space-y-6 bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-8 md:p-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#120f0a] uppercase tracking-tight leading-none">
              Ready to start building?
            </h2>
            <p className="text-base text-[#413f3b] px-4 sm:px-0 font-semibold leading-relaxed">
              Join 1400+ teen builders who ship real projects.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="w-full sm:w-auto h-14 rounded-none bg-white text-sm font-black uppercase tracking-wider text-[#120f0a] border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer px-8"
              >
                <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                  Join Discord
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                className="w-full sm:w-auto h-14 rounded-none bg-[#97192c] text-sm font-black uppercase tracking-wider text-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer px-8"
              >
                <a href={NOTION_JOIN_FORM_URL} target="_blank" rel="noopener noreferrer">
                  Become a Contributor
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                asChild
                className="w-full sm:w-auto h-14 rounded-none bg-[#fc920d] text-sm font-black uppercase tracking-wider text-[#120f0a] border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer px-8"
              >
                <Link href="/fork">
                  Launch a Fork
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-[#413f3b] font-semibold pt-4">
              Questions? Reach us at{" "}
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="font-black text-[#97192c] hover:underline"
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

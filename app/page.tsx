"use client";

import Link from "next/link";
import {
  ArrowRight,
  CodeXml,
  Users,
  Rocket,
  Lightbulb,
  Trophy,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { HeroFuturistic } from "@/components/ui/hero-futuristic";
import { PageSection } from "@/components/page-section";
import { Features } from "@/components/ui/features-8";
import { Button } from "@/components/ui/button";
import { LoadingInline } from "@/components/loading-wrapper";
import { Partners } from "@/components/partners";

// Lazy load heavy components
const Testimonial = dynamic(
  () =>
    import("@/components/ui/design-testimonial").then((mod) => ({
      default: mod.Testimonial,
    })),
  {
    loading: () => <LoadingInline />,
    ssr: true,
  },
);

// GlassIcons removed in favor of Features bento grid

const stats = [
  { value: "1400+", label: "Community Members", detail: "active builders nationwide" },
  { 
    value: "5+ Forks", 
    label: "Local Hubs", 
    detail: (
      <span>
        city chapters — view at{" "}
        <a 
          href="/fork" 
          className="text-primary dark:text-accent underline hover:text-accent dark:hover:text-primary transition-colors font-bold"
        >
          gobitsnbytes.org/fork
        </a>
      </span>
    )
  },
  { value: "4+ Events", label: "Nationwide Events", detail: "hackathons and workshops" },
  { value: "16.5 Years", label: "Mean Team Age", detail: "average age of our team" },
];

interface HomeFAQItem {
  question: string;
  answer: string;
}

const homeFaqs: HomeFAQItem[] = [
  {
    question: "Who can join bits&bytes™?",
    answer:
      "Any teenager aged 13-19 interested in coding, designing, or building products. Beginners are extremely welcome! No prior experience is required—you will learn by doing alongside other builders.",
  },
  {
    question: "Are the hackathons and workshops free?",
    answer:
      "Yes, all bits&bytes™ events, cohorts, hackathons, and workshops are 100% free to attend, with meals, drinks, and stickers fully covered.",
  },
  {
    question: "What makes bits&bytes™ different from other student groups?",
    answer:
      "We are completely student-led, youth-led, and independent. We focus 100% on shipping real projects and developer agency. There are no passive lectures or boring slides—just pure coding and building.",
  },
  {
    question: "How do local hubs (Forks) work?",
    answer:
      "Forks are our local student-led chapters. Any teen builder can apply to start a Fork in their school or city to run events and workshops under our brand, with operational support and mentorship from Upstream.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col w-full max-w-full overflow-x-hidden">
        <HeroFuturistic />

        <PageSection
          eyebrow="Impact"
          title="Shipped, not just taught"
          description="A teen-led builders network. Workshops and hackathons that end with something shipped, not just something learned."
        >
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="bg-card border-4 border-border shadow-[6px_6px_0px_0px_var(--border)] p-5 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_var(--border)] duration-200"
              >
                <div className="space-y-2 sm:space-y-4 text-card-foreground">
                  <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight uppercase">
                    {stat.value}
                  </p>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground uppercase tracking-tight">
                      {stat.label}
                    </h3>
                    <div className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">
                      {stat.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        <PageSection
          eyebrow="What We Do"
          title="What we actually do"
          description="The stuff we run"
          align="center"
        >
          <Features />
        </PageSection>

        <Partners />

        {/* Homepage FAQ Section */}
        <PageSection
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about joining India's boldest builder network."
          align="center"
        >
          <div className="mx-auto max-w-4xl space-y-4 text-left">
            {homeFaqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="bg-card border-3 border-border shadow-[4px_4px_0px_0px_var(--border)]"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors bg-card hover:bg-accent/10"
                  >
                    <h3 className="text-base sm:text-lg font-black text-foreground pr-4 leading-tight uppercase tracking-tight">
                      {faq.question}
                    </h3>
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center border-2 border-border bg-card text-foreground transition-all duration-200 shadow-[2px_2px_0px_0px_var(--border)]",
                        isOpen && "rotate-180 bg-[#fc920d] text-[#120f0a] shadow-none translate-x-[2px] translate-y-[2px]",
                      )}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t-2 border-border mt-1 pt-4 bg-card">
                          <p className="text-sm sm:text-base text-muted-foreground font-semibold leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </PageSection>

        <PageSection
          eyebrow="Stories"
          title="Voices from the crew"
          align="center"
        >
          <Suspense fallback={<LoadingInline />}>
            <Testimonial />
          </Suspense>
        </PageSection>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": homeFaqs.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}

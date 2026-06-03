"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, ArrowRight } from "lucide-react";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can I come with a pre-formed team? Do I need to?",
    answer:
      "Either way works. You can show up with a team already, or you can form one at the event. At the start, everyone pitches ideas for apps or games they want to build, and you can join any idea that interests you. Your team doesn't have to be from your school or your grade.",
  },
  {
    question: "What if I want to come with a pre-formed team?",
    answer:
      "Totally fine. We do suggest staying open to adding new teammates though. More people often means better ideas, and it's usually more fun.",
  },
  {
    question: "What if I decide not to work with a team at all?",
    answer:
      "Also fine. Plenty of people work solo. That said, most people end up having more fun on a team.",
  },
  {
    question: "What is bits&bytes™?",
    answer:
      "A student-led, youth-led builder network that runs hackathons and events. Our hackathons are loosely inspired by Hack Club's format but we do our own thing. We care about creativity, and a lot of attendees are new to coding. If that sounds fun, come through.",
  },
  {
    question: "Can I volunteer for bits&bytes™?",
    answer:
      "Yes. We're almost always looking for organizers, day-of volunteers, workshop leads, and mentors. Reach out through our contact page.",
  },
  {
    question: "What kind of things can be made at our hackathons?",
    answer:
      "Anything you want. Well, almost anything. You can't make something that violates our Code of Conduct. It's a bit less strict than 'school appropriate,' but no offensive language targeting people's gender, race, sexual orientation, religion, or disabilities. No sexualized content, no harassment, nothing unsafe or illegal.",
  },
  {
    question: "What do most people make?",
    answer:
      "Most people make games. A good chunk make mobile apps. A smaller number build websites or hardware projects. You can even make non-coding things: people have presented paintings and recorded albums. If you don't know what to make, you can always join an existing team.",
  },
  {
    question: "Can I show existing projects at bits&bytes™?",
    answer: "No. All projects have to be built during the event.",
  },
  {
    question: "Can parents attend bits&bytes™?",
    answer:
      "Not on the main floor, for security reasons. They can come to the kickoff and the awards ceremony. Parents can also attend if they volunteer and pass a background check, or if they're chaperoning a school group.",
  },
  {
    question: "Should we bring anything to the hackathon?",
    answer:
      "Bring a laptop. That's the main thing. You can bring whatever else you want on your device.",
  },
  {
    question: "For students staying overnight, what should they bring?",
    answer:
      "Toothbrush, toothpaste, a sleeping bag, a pillow, and a camping pad if you have one.",
  },
  {
    question: "For students with desktop computers, what should they bring?",
    answer:
      "We'd rather you bring a laptop. If you bring a desktop, you need to bring everything: keyboard, mouse, monitor, headphones (no speakers), a wifi adapter (venues don't let you plug into ethernet), and all your cables.",
  },
  {
    question: "Can students leave the hackathon and then come back?",
    answer:
      "Yes, but minors need a parent to pick them up or a signed note to leave on their own. You might not be able to come back at any hour. Venues lock down overnight, and security may not let you back in until morning.",
  },
];

import { GlassContainer } from "@/components/ui/glass-container";

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[58vh] sm:min-h-[64vh] flex items-center justify-center overflow-hidden text-white pt-24 md:pt-32">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-20">
          <div className="px-6 py-12 md:py-20 sm:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-6">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70 font-bold">
                FAQ
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight font-black text-white tracking-tighter drop-shadow-2xl">
                Frequently Asked <br className="hidden sm:block" /> Questions
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                Questions people actually ask us about bits&bytes™.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* FAQ Accordion */}
        <PageSection>
          <div className="mx-auto max-w-4xl space-y-4 md:space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(index);

              return (
                <GlassContainer
                  key={index}
                  className="p-0"
                  glowColor="none"
                  containerClassName="rounded-[2rem]"
                  delay={index * 0.08}
                  layout
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 p-6 md:p-8 text-left transition-colors hover:bg-white/5"
                  >
                    <h3 className="font-display text-lg md:text-xl font-black text-white pr-4 leading-tight">
                      {faq.question}
                    </h3>
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--brand-pink) transition-transform transition-colors transition-opacity duration-300",
                        isOpen &&
                          "rotate-180 bg-(--brand-pink) text-white border-(--brand-pink)/50",
                      )}
                    >
                      <ChevronDown className="h-6 w-6" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/5 mt-2 pt-6">
                          <p className="text-base md:text-lg text-white/70 font-medium leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassContainer>
              );
            })}
          </div>
        </PageSection>

        {/* Still have questions CTA */}
        <PageSection align="center">
          <GlassContainer className="p-10 md:p-20 text-center" glowColor="both">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-tighter drop-shadow-2xl">
              Still have questions?
            </h2>
            <p className="mt-4 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Can't find what you need? Reach out and we'll get back to you.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="group rounded-full bg-[var(--brand-pink)] px-10 py-7 text-lg font-black text-white shadow-lg shadow-[var(--brand-pink)/20] hover:shadow-xl hover:shadow-[var(--brand-pink)/40] transition-transform transition-colors transition-opacity hover:scale-105 w-full sm:w-auto"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 px-10 py-7 text-lg font-bold text-white backdrop-blur-md hover:bg-white/10 w-full sm:w-auto transition-transform transition-colors transition-opacity"
              >
                <Link href="/join">Apply to Join</Link>
              </Button>
            </div>
          </GlassContainer>
        </PageSection>
      </main>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  {
    question: "Is bits&bytes™ a legally registered organization?",
    answer:
      "Yes. To establish a permanent and independent home for the network, GOBITSNBYTES FOUNDATION was legally incorporated as a Section 8 non-profit company in India on 2 June 2026. The Foundation is governed by its Board of Directors.",
  },
  {
    question: "What is a Fork? How can I run one?",
    answer:
      "A Fork is a recognized local, institutional, or thematic operating node of the bits&bytes™ Network recognized under authority of GOBITSNBYTES FOUNDATION. Local student-led teams can apply to run their own events and dev squads under our brand. All local operations are supported and governed by our Upstream teams.",
  },
  {
    question: "Do I own what I build at hackathons?",
    answer:
      "Yes, you retain full ownership of the intellectual property (projects, code, designs, presentations) you create. By submitting your project on our platforms or showcasing it, you grant GOBITSNBYTES FOUNDATION a perpetual, royalty-free, non-exclusive license to share it for our non-profit educational and community-showcasing purposes.",
  },
  {
    question: "What happens if someone breaks the rules?",
    answer:
      "We enforce our Code of Conduct strictly to keep the community safe. Depending on the violation, actions range from warnings and role removal to suspension from events and permanent ban. Serious violations may be escalated to legal authorities. Anyone disciplined has 14 days to appeal the decision in writing to the Board of Directors.",
  },
  {
    question: "How is my data handled?",
    answer:
      "We act as a Data Fiduciary under the Digital Personal Data Protection Act, 2023 (DPDP Act). We only collect what is needed for event logistics, safety, and consent. We never sell your data, and minor data is protected with extra safeguarding measures under POCSO and the DPDP Act.",
  },
  {
    question: "Can I use the bits&bytes™ brand?",
    answer:
      "Recognized Forks and approved volunteers are granted a revocable, non-exclusive, royalty-free license to use the brand for authorized activities only. Brand usage must adhere to our creative guidelines. No local group or individual is authorized to raise money or sign contracts on behalf of the brand.",
  },
];

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
      <section className="relative flex items-center justify-center overflow-hidden text-[#120f0a] pt-24 md:pt-32">
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="px-6 py-8 text-center">
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 border-2 border-[#120f0a] bg-[#fc920d] px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]">
                FAQ
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[#120f0a] uppercase tracking-tight leading-none">
                Frequently Asked <br className="hidden sm:block" /> Questions
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#413f3b] max-w-2xl mx-auto leading-relaxed font-semibold">
                Questions people actually ask us about bits&bytes™.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent pb-16">
        {/* FAQ Accordion */}
        <PageSection>
          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(index);

              return (
                <div
                  key={index}
                  className="bg-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a]"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 p-6 md:p-8 text-left transition-colors bg-white hover:bg-[#fee9cf]"
                  >
                    <h3 className="font-display text-lg md:text-xl font-black text-[#120f0a] pr-4 leading-tight uppercase">
                      {faq.question}
                    </h3>
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#120f0a] bg-white text-[#120f0a] transition-all duration-200 shadow-[2px_2px_0px_0px_#120f0a]",
                        isOpen && "rotate-180 bg-[#fc920d] shadow-none translate-x-[2px] translate-y-[2px]",
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
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 border-t-2 border-[#120f0a] mt-2 pt-6 bg-white">
                          <p className="text-base md:text-lg text-[#413f3b] font-semibold leading-relaxed">
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

        {/* Still have questions CTA */}
        <PageSection align="center">
          <div className="bg-white border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] p-8 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-black text-[#120f0a] uppercase tracking-tight leading-none">
              Still have questions?
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#413f3b] max-w-2xl mx-auto font-semibold leading-relaxed">
              Can&apos;t find what you need? Reach out and we&apos;ll get back to you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="w-full sm:w-auto h-14 rounded-none bg-[#97192c] text-sm font-black uppercase tracking-wider text-white border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer px-8"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                className="w-full sm:w-auto h-14 rounded-none bg-white text-sm font-black uppercase tracking-wider text-[#120f0a] border-3 border-[#120f0a] shadow-[4px_4px_0px_0px_#120f0a] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#120f0a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer px-8"
              >
                <Link href="/join">Apply to Join</Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  );
}

import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumb";
import { FaqFeed } from "@/components/faq/faq-feed";
import {
  HollowWord,
  LAB_TEXT,
  LabCell,
  LabGlobe,
  LabGrid,
  LabHero,
  LabTitle,
  PixelGlyph,
  RouterFigure,
  TableHeader,
} from "@/components/lab";
import { Button } from "@/components/riot";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can I come with a pre-formed team? Do I need to?",
    answer:
      "Either works. Bring a team, or find one at the event. At the start, everyone pitches ideas for apps or games they want to build, and you can join whichever one pulls you in. Your team doesn't have to be from your school or your grade.",
  },
  {
    question: "What if I want to come with a pre-formed team?",
    answer:
      "That's fine. We'd still say stay open to adding a teammate. New people bring ideas your group wouldn't have had, and it's usually more fun.",
  },
  {
    question: "What if I decide not to work with a team at all?",
    answer:
      "Also fine. Plenty of people build solo. Most do end up having more fun on a team, though.",
  },
  {
    question: "What is bits&bytes™?",
    answer:
      "A teen-led builder network that runs hackathons and events across India. The format borrows loosely from Hack Club, but we run it our own way. We care more about what you make than how long you've been coding, and a lot of the people in the room are new to it.",
  },
  {
    question: "Does it cost anything to join?",
    answer: "No. bits&bytes™ is free to join.",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No. Beginners are welcome, and we pair them with mentors. What matters is that you actually want to build something.",
  },
  {
    question: "Can I volunteer for bits&bytes™?",
    answer:
      "Yes. We almost always need organizers, day-of volunteers, workshop leads and mentors. Reach out through our contact page.",
  },
  {
    question: "What kind of things can be made at our hackathons?",
    answer:
      "Almost anything. The limit is our Code of Conduct. It's a bit looser than 'school appropriate', but it's firm: no offensive language targeting people's gender, race, sexual orientation, religion or disabilities, no sexualized content, no harassment, and nothing unsafe or illegal.",
  },
  {
    question: "What do most people make?",
    answer:
      "Games, mostly. A good chunk make mobile apps, and a smaller group builds websites or hardware. Some projects have no code at all: people have presented paintings and recorded albums. If you don't know what to make, join a team that does.",
  },
  {
    question: "Can I show existing projects at bits&bytes™?",
    answer: "No. Everything you present has to be built during the event.",
  },
  {
    question: "Can parents attend bits&bytes™?",
    answer:
      "Not on the main floor, for security reasons. They're welcome at the kickoff and the awards ceremony. A parent can also stay if they volunteer and pass a background check, or if they're chaperoning a school group.",
  },
  {
    question: "Should we bring anything to the hackathon?",
    answer:
      "A laptop. That's the main thing. Anything else you want to bring can live on your device.",
  },
  {
    question: "For students staying overnight, what should they bring?",
    answer:
      "A toothbrush, toothpaste, a sleeping bag, a pillow, and a camping pad if you have one.",
  },
  {
    question: "For students with desktop computers, what should they bring?",
    answer:
      "Honestly, a laptop is much easier. If you bring a desktop, you bring all of it: keyboard, mouse, monitor, headphones (no speakers), a wifi adapter (venues won't let you plug into ethernet) and every cable.",
  },
  {
    question: "Can students leave the hackathon and then come back?",
    answer:
      "Yes, but minors need a parent to pick them up or a signed note to leave on their own. Coming back isn't possible at every hour. Venues lock down overnight, and security may not let you in again until morning.",
  },
  {
    question: "Is bits&bytes™ a legally registered organization?",
    answer:
      "Yes. GOBITSNBYTES FOUNDATION was incorporated as a Section 8 non-profit company in India on 2 June 2026, so the network has a permanent, independent legal home. The Foundation is governed by its Board of Directors.",
  },
  {
    question: "What is a Fork? How can I run one?",
    answer:
      "On GitHub, a fork is your own copy of a repo: you change it and run it your way, and it stays linked to the original so work flows back. A bits&bytes™ fork is the same idea for a city or school. A local team takes the playbook and brand from upstream, runs its own room and ships back. Forks are recognized under the authority of GOBITSNBYTES FOUNDATION. Apply at gobitsnbytes.org/fork.",
  },
  {
    question: "Do I own what I build at hackathons?",
    answer:
      "Yes. You keep full ownership of the intellectual property (projects, code, designs, presentations) you create. By submitting your project on our platforms or showcasing it, you grant GOBITSNBYTES FOUNDATION a perpetual, royalty-free, non-exclusive license to share it for our non-profit educational and community-showcasing purposes.",
  },
  {
    question: "What happens if someone breaks the rules?",
    answer:
      "We enforce our Code of Conduct strictly, because it's what keeps the room safe. Depending on the violation, that can mean a warning, role removal, suspension from events or a permanent ban. Serious violations may be escalated to legal authorities. Anyone disciplined has 14 days to appeal the decision in writing to the Board of Directors.",
  },
  {
    question: "How is my data handled?",
    answer:
      "We act as a Data Fiduciary under the Digital Personal Data Protection Act, 2023 (DPDP Act). We only collect what we need for event logistics, safety and consent. We never sell your data, and data about minors gets extra safeguards under POCSO and the DPDP Act.",
  },
  {
    question: "Can I use the bits&bytes™ brand?",
    answer:
      "Recognized Forks and approved volunteers are granted a revocable, non-exclusive, royalty-free license to use the brand for authorized activities only. Brand usage must adhere to our creative guidelines. No local group or individual is authorized to raise money or sign contracts on behalf of the brand.",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

const QUESTIONS_TITLE = `Questions [${pad(faqs.length)}]`;

const moreLinks = [
  { href: "/events", label: "Pan-India Hackathons" },
  { href: "/fork", label: "Student Chapter Hubs (Forks)" },
  { href: "/impact", label: "What We've Shipped" },
  { href: "/press", label: "Press & Media Kit" },
  { href: "/coc", label: "Code of Conduct" },
];

const SECTION = "gap-y-10 pt-24 min-[760px]:pt-[136px]";

/** Label + arrow that nudges on hover/focus (the Button asChild link carries `group`). */
function Cta({ children }: { children: string }) {
  return (
    <>
      {children}
      <span
        aria-hidden
        className="transition-transform duration-200 ease-riot group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </>
  );
}

export default function FAQ() {
  return (
    <>
      <section
        data-cinematic-section=""
        data-cinematic-title="Frequently Asked Questions"
        data-surface="paper"
      >
        <LabHero
          lines={["Frequently ", "Asked ", "Questions"]}
          glyph={<PixelGlyph text="FAQ" decorative />}
          aside={<LabGlobe />}
          subtitle={
            <p data-speakable="true" data-citation="true">
              Questions people actually ask us about bits&amp;bytes™.
            </p>
          }
        >
          <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} className="mb-0" />
        </LabHero>
      </section>

      {/* stripe.dev "Featured" feed: sticky directory + Fig. 1, disclosure rows with mono indices */}
      <LabGrid
        as="section"
        id="questions"
        data-cinematic-section=""
        data-cinematic-title={QUESTIONS_TITLE}
        data-surface="paper"
        aria-labelledby="questions-title"
        className={SECTION}
      >
        <LabCell>
          <LabTitle id="questions-title" count={faqs.length}>
            Questions
          </LabTitle>
        </LabCell>
        <FaqFeed faqs={faqs} seed="Frequently Asked Questions" />
      </LabGrid>

      {/* close: title + actions, then the router (sticky Fig. 2 re-seeds on link hover), outlined word */}
      <section
        id="still-have-questions"
        data-cinematic-section=""
        data-cinematic-title="Still have questions?"
        data-surface="paper"
        aria-labelledby="still-title"
        className="pt-24 min-[760px]:pt-[160px]"
      >
        <LabGrid className="gap-y-10">
          <LabCell>
            <LabTitle id="still-title" className="min-[760px]:whitespace-normal">
              Still have questions?
            </LabTitle>
          </LabCell>
          <LabCell span="1/15">
            <p className={LAB_TEXT.lg}>Didn&apos;t see your question here? Write to us and we&apos;ll get back to you.</p>
          </LabCell>
          <LabCell className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="orange">
              <Link href="/contact" className="group">
                <Cta>Contact Us</Cta>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/join">Apply to Join</Link>
            </Button>
          </LabCell>
          <TableHeader label="Links" count={moreLinks.length} className="col-span-full mt-14" />
          <RouterFigure
            fig={2}
            items={moreLinks.map((link) => ({ title: link.label, type: link.href, href: link.href }))}
          />
        </LabGrid>
        <HollowWord text="Questions" />
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map((faq) => ({
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

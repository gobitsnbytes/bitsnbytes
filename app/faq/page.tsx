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

const pad = (n: number) => String(n).padStart(2, "0");

const QUESTIONS_TITLE = `Questions [${pad(faqs.length)}]`;

const moreLinks = [
  { href: "/events", label: "Pan-India Hackathons" },
  { href: "/fork", label: "Student Chapter Hubs (Forks)" },
  { href: "/impact", label: "Community Metrics" },
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
        data-tour="page-hero"
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
            <p className={LAB_TEXT.lg}>Can&apos;t find what you need? Reach out and we&apos;ll get back to you.</p>
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

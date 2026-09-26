import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumb";
import { EditionOpener, EDITION_GUTTER, FeedList, FeedRow, SerifStatement } from "@/components/edition";
import { Staircase } from "@/components/join/staircase";
import { Button, Chapter, TornEdge } from "@/components/riot";
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

const pad = (n: number) => String(n).padStart(2, "0");

const QUESTIONS_TITLE = `Questions [${pad(faqs.length)}]`;

const chapters = [
  { id: "questions", title: QUESTIONS_TITLE },
  { id: "still-have-questions", title: "Still have questions?" },
];

const moreLinks = [
  { href: "/events", label: "Pan-India Hackathons" },
  { href: "/fork", label: "Student Chapter Hubs (Forks)" },
  { href: "/impact", label: "Community Metrics" },
  { href: "/press", label: "Press & Media Kit" },
  { href: "/coc", label: "Code of Conduct" },
];

const GUTTER = cn("px-4 md:px-8", EDITION_GUTTER);

export default function FAQ() {
  return (
    <>
      <div data-tour="page-hero">
        <EditionOpener
          variant="static"
          title="Frequently Asked Questions"
          kicker="FAQ"
          chapters={chapters}
          art={{ src: "/event_pictures/h4g/h4g_standee.jpg", alt: "Hack4Good event standee at the venue" }}
        />
      </div>
      <TornEdge from="ink" to="paper" />

      {/* §01: the full list as a stripe.dev table-list (mono index, barcode hover, expo-out disclosure) */}
      <Chapter id="questions" title={QUESTIONS_TITLE} number={1} className="md:pt-20">
        <div className={GUTTER}>
          <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
        </div>
        <SerifStatement className="py-0 pb-12 md:py-0 md:pb-20">
          <span data-speakable="true" data-citation="true">
            Questions people actually ask us about bits&amp;bytes™.
          </span>
        </SerifStatement>
        <div className={GUTTER}>
          <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">
            <span>§01 — FAQ</span>
            <span aria-hidden>[{pad(faqs.length)}]</span>
          </div>
          <FeedList>
            {faqs.map((faq, index) => (
              <FeedRow key={faq.question} date={`Q.${pad(index + 1)}`} title={faq.question}>
                <p className="max-w-[65ch] font-serif text-lg leading-relaxed">{faq.answer}</p>
              </FeedRow>
            ))}
          </FeedList>
        </div>
      </Chapter>

      <TornEdge from="paper" to="ink" />

      {/* §02: ink close, kprverse staircase headline */}
      <Chapter id="still-have-questions" title="Still have questions?" number={2} tone="ink" className="md:py-32">
        <div className={GUTTER}>
          <p className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">§02</p>
          <Staircase lines={["Still have", "questions?"]} />
          <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="max-w-[40ch] font-serif text-xl leading-snug md:text-2xl">
              Can&apos;t find what you need? Reach out and we&apos;ll get back to you.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="orange" size="lg">
                <Link href="/contact" className="group">
                  Contact Us
                  <span
                    aria-hidden
                    className="transition-transform duration-200 ease-riot group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/join">Apply to Join</Link>
              </Button>
            </div>
          </div>

          <div className="mt-14 border-t-3 border-line pt-5">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs font-bold uppercase tracking-[0.12em]">
              {moreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="underline decoration-2 underline-offset-4 transition-colors hover:text-orange"
                  >
                    <span aria-hidden>[</span>
                    {link.label}
                    <span aria-hidden>]</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Chapter>

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

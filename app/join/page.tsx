import Link from "next/link";

import { WIDE } from "@/components/chrome/wordmark";
import { ChapterHero, EditionOpener, EDITION_GUTTER, FeedList, FeedRow, SerifStatement } from "@/components/edition";
import { Staircase } from "@/components/join/staircase";
import { Button, Chapter, ChapterHead, ScrambleText, TornEdge } from "@/components/riot";
import { cn } from "@/lib/utils";

const NOTION_JOIN_FORM_URL =
  "https://perfect-dinghy-781.notion.site/33949ed2fc338035bd3bef46155035f5?pvs=105";
const DISCORD_INVITE_URL = "https://discord.gg/rjqPfwKKTE";

const pad = (n: number) => String(n).padStart(2, "0");

const paths = [
  {
    title: "Join Community",
    description:
      "Hop onto our Discord server. Chat with 1400+ student builders, find project teams, and attend online study sessions.",
    cta: "Join Discord",
    href: DISCORD_INVITE_URL,
    external: true,
    variant: "outline",
  },
  {
    title: "Become a Contributor",
    description:
      "Apply to build our core open-source software projects, organize developer cohorts, or manage outreach.",
    cta: "Apply Now",
    href: NOTION_JOIN_FORM_URL,
    external: true,
    variant: "burgundy",
  },
  {
    title: "Launch a Fork",
    description:
      "Bring bits&bytes to your city. Gather local builders, host workshops/hacknights, and run your city's tech scene.",
    cta: "Explore Forks",
    href: "/fork",
    external: false,
    variant: "outline",
  },
] as const;

const benefits = [
  {
    title: "Join a tight-knit crew",
    description: "Work alongside 1400+ teen builders across India who are actually building things.",
  },
  {
    title: "Ship real projects",
    description: "Build projects with mentorship at every step, from idea to deployment.",
  },
  {
    title: "Attend exclusive events",
    description:
      "Get priority access to hackathons, workshops, and events with people who actually work in the industry.",
  },
  {
    title: "Grow together",
    description: "Pair programming, code reviews, and study groups help everyone level up faster.",
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

const chapters = [
  { id: "applications", title: "Applications Open" },
  { id: "why-join", title: "Why Join" },
  { id: "expectations", title: "What we look for" },
  { id: "join-faq", title: "Common questions" },
  { id: "start-building", title: "Ready to start building?" },
];

const GUTTER = cn("px-4 md:px-8", EDITION_GUTTER);

/** Button contents shared by every CTA: label + arrow that nudges on hover/focus. */
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

/** Anchor for Button asChild: forwards the Slot's className so the button styles land on the link. */
function CtaLink({
  href,
  external,
  children,
  className,
}: {
  href: string;
  external: boolean;
  children: string;
  className?: string;
}) {
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("group", className)}>
      <Cta>{children}</Cta>
    </a>
  ) : (
    <Link href={href} className={cn("group", className)}>
      <Cta>{children}</Cta>
    </Link>
  );
}

export default function Join() {
  return (
    <>
      <div data-tour="page-hero">
        <EditionOpener
          variant="static"
          title="Join the crew"
          kicker="Applications Open"
          chapters={chapters}
          art={{ src: "/event_pictures/h4g/h4g_hackers.jpg", alt: "Builders at their laptops during a bits&bytes™ hackathon" }}
        />
      </div>
      <TornEdge from="ink" to="paper" />

      {/* §01: three ways in, as an inkfish table-list */}
      <Chapter id="applications" title="Applications Open" number={1} className="md:pt-20">
        <div className={GUTTER}>
          <ScrambleText
            as="p"
            text={`§01 — Applications Open [${pad(paths.length)}]`}
            className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal"
          />
        </div>
        <SerifStatement as="h2" className="py-0 md:py-0">
          Tell us how you want to build with us. We&apos;ll connect you with squads, mentors, and real projects.
        </SerifStatement>
        <div className={GUTTER}>
          <ol className="mt-12 border-t-3 border-line md:mt-16">
            {paths.map((path, index) => (
              <li
                key={path.title}
                className="group/path relative isolate grid gap-4 border-b-3 border-line py-7 md:grid-cols-[5rem_minmax(0,1.1fr)_minmax(0,1.3fr)_auto] md:items-center md:gap-8 md:py-9"
              >
                {/* row fill wipes in on hover / keyboard focus (transform only) */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-left scale-x-0 bg-surface-2 transition-transform duration-500 ease-[cubic-bezier(.25,1,.5,1)] group-focus-within/path:scale-x-100 group-hover/path:scale-x-100 motion-reduce:transition-none motion-off:transition-none"
                />
                <span className="font-mono text-xs font-bold tracking-[0.1em] text-signal">[{pad(index + 1)}]</span>
                <h3 className={cn(WIDE, "text-[clamp(28px,3.4vw,52px)] uppercase leading-[0.9]")}>{path.title}</h3>
                <p className="max-w-[46ch] font-serif text-base leading-relaxed text-fg/80 md:text-lg">{path.description}</p>
                <Button asChild variant={path.variant} className="justify-self-start">
                  <CtaLink href={path.href} external={path.external}>
                    {path.cta}
                  </CtaLink>
                </Button>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-fg/70">
            We review contributor and fork applications weekly • Expected response time: 7 days
          </p>
        </div>
      </Chapter>

      {/* §02: Editions chapter hero, then the member benefits as a hairline works-grid */}
      <ChapterHero
        id="why-join"
        number={2}
        title="Why Join"
        art={{ src: "/event_pictures/devday2.jpeg", alt: "A builder takes the mic during a bits&bytes™ session" }}
      >
        Being part of bits&bytes™ is more than a Discord invite.
      </ChapterHero>
      <TornEdge from="ink" to="paper" />
      <div data-surface="paper" className="tone-paper py-16 md:py-24">
        <div className={GUTTER}>
          <h3 className="border-b-3 border-line pb-4 font-display text-[clamp(40px,7vw,112px)] uppercase leading-[0.86]">
            What you&apos;ll get as a member
          </h3>
          <ul className="grid md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <li
                key={benefit.title}
                className="flex flex-col gap-4 border-b-2 border-line py-8 md:min-h-64 md:p-10 md:odd:border-r-2 md:odd:pl-0"
              >
                <span className="font-mono text-xs font-bold tracking-[0.1em] text-signal">[{pad(index + 1)}]</span>
                <h4 className={cn(WIDE, "text-[clamp(26px,2.8vw,44px)] uppercase leading-[0.92]")}>{benefit.title}</h4>
                <p className="mt-auto max-w-[40ch] font-serif text-base leading-relaxed text-fg/80 md:text-lg">
                  {benefit.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* §03: expectations checklist */}
      <Chapter id="expectations" title="What we look for" number={3} tone="cream">
        <div className={GUTTER}>
          <ChapterHead
            number={3}
            label="Expectations"
            title="What we look for"
            description="We want to make sure bits&bytes™ is the right fit for you."
          />
          <ol className="max-w-5xl">
            {expectations.map((expectation, index) => (
              <li
                key={expectation}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b-2 border-line py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:py-6"
              >
                <span className="font-mono text-xs font-bold tracking-[0.1em] text-signal">[{pad(index + 1)}]</span>
                <span className="font-sans text-[clamp(20px,2.4vw,34px)] font-extrabold uppercase leading-[1.02] tracking-[-0.01em]">
                  {expectation}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      {/* §04: stripe.dev table-list FAQ */}
      <Chapter id="join-faq" title="Common questions" number={4}>
        <div className={GUTTER}>
          <ChapterHead number={4} label="FAQ" title="Common questions" description="Things people ask before applying." />
          <FeedList>
            {faqs.map((faq, index) => (
              <FeedRow key={faq.question} date={`Q.${pad(index + 1)}`} title={faq.question}>
                <p className="max-w-[65ch] font-serif text-lg leading-relaxed">{faq.answer}</p>
              </FeedRow>
            ))}
          </FeedList>
        </div>
      </Chapter>

      {/* §05: orange campaign close with the staircase headline */}
      <Chapter id="start-building" title="Ready to start building?" number={5} tone="orange" className="md:py-32">
        <div className={GUTTER}>
          <p className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.2em]">§05</p>
          <Staircase lines={["Ready to", "start", "building?"]} />
          <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <p className="max-w-[36ch] font-serif text-xl leading-snug md:text-2xl">
              Join 1400+ teen builders who ship real projects.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button asChild variant="outline" size="lg">
                <CtaLink href={DISCORD_INVITE_URL} external>
                  Join Discord
                </CtaLink>
              </Button>
              <Button asChild variant="burgundy" size="lg">
                <CtaLink href={NOTION_JOIN_FORM_URL} external>
                  Become a Contributor
                </CtaLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <CtaLink href="/fork" external={false}>
                  Launch a Fork
                </CtaLink>
              </Button>
            </div>
          </div>
          <p className="mt-12 border-t-3 border-line pt-5 font-mono text-xs font-bold uppercase tracking-[0.12em]">
            Questions? Reach us at{" "}
            <a
              href="mailto:hello@gobitsnbytes.org"
              className="normal-case underline decoration-2 underline-offset-4 hover:decoration-4"
            >
              hello@gobitsnbytes.org
            </a>
          </p>
        </div>
      </Chapter>
    </>
  );
}

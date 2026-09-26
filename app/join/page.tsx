import { ConsoleWindow } from "@/components/contact/console-window";
import { LabIndexRow, LabRow } from "@/components/faq/lab-row";
import {
  FigWindow,
  HollowWord,
  LAB_HOVER,
  LAB_STICKY,
  LAB_TEXT,
  LabCell,
  LabFeed,
  LabFooterRows,
  LabGlobe,
  LabGrid,
  LabHero,
  LabLink,
  LabTag,
  LabTitle,
  PixelGlyph,
  TableHeader,
} from "@/components/lab";
import { Button } from "@/components/riot";
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
    variant: "outline",
  },
  {
    title: "Become a Contributor",
    description:
      "Apply to build our core open-source software projects, organize developer cohorts, or manage outreach.",
    cta: "Apply Now",
    href: NOTION_JOIN_FORM_URL,
    variant: "burgundy",
  },
  {
    title: "Launch a Fork",
    description:
      "Bring bits&bytes to your city. Gather local builders, host workshops/hacknights, and run your city's tech scene.",
    cta: "Explore Forks",
    href: "/fork",
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

const SECTION = "gap-y-10 pt-24 min-[760px]:pt-[136px]";
const WRAP = "min-[760px]:whitespace-normal";

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

export default function Join() {
  return (
    <>
      <section data-tour="page-hero" data-cinematic-section="" data-cinematic-title="Join the crew" data-surface="paper">
        <LabHero
          lines={["Join the ", "crew"]}
          glyph={<PixelGlyph text="JOIN" decorative />}
          aside={<LabGlobe />}
          subtitle={
            <p>Tell us how you want to build with us. We&apos;ll connect you with squads, mentors, and real projects.</p>
          }
        >
          <LabTag>Applications Open</LabTag>
        </LabHero>
      </section>

      {/* the three ways in, inside console chrome, beside the seeded Fig. 1 */}
      <LabGrid
        as="section"
        id="applications"
        data-cinematic-section=""
        data-cinematic-title="Applications Open"
        data-surface="paper"
        aria-labelledby="applications-title"
        className={SECTION}
      >
        <LabCell>
          <LabTitle id="applications-title" count={paths.length}>
            Applications Open
          </LabTitle>
        </LabCell>
        <div className="col-span-full max-lg:hidden lg:col-[1/7]">
          <FigWindow seed="Applications Open" fig={1} className={LAB_STICKY} />
        </div>
        <div className="col-span-full lg:col-[8/25]">
          <ConsoleWindow title="Join the crew" bodyClassName="px-4 md:px-6">
            <ol role="list">
              {paths.map((path, index) => (
                <li
                  key={path.title}
                  className="grid gap-4 border-b border-line py-6 last:border-b-0 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-start md:gap-6 md:py-8"
                >
                  <span className="font-mono text-[12px] uppercase leading-[1.6]">[{pad(index + 1)}]</span>
                  <div className="grid gap-3">
                    <h3 className={LAB_TEXT.post}>{path.title}</h3>
                    <p className={cn(LAB_TEXT.sm, "max-w-[46ch] text-fg/80")}>{path.description}</p>
                  </div>
                  <Button asChild variant={path.variant} size="sm" className="justify-self-start">
                    <LabLink href={path.href} className="group">
                      <Cta>{path.cta}</Cta>
                    </LabLink>
                  </Button>
                </li>
              ))}
            </ol>
          </ConsoleWindow>
          <p className="mt-4 font-mono text-[11px] uppercase leading-[1.4] text-fg/70">
            We review contributor and fork applications weekly • Expected response time: 7 days
          </p>
        </div>
      </LabGrid>

      {/* member benefits as a feed (sticky Fig. 2 beside it) */}
      <LabGrid
        as="section"
        id="why-join"
        data-cinematic-section=""
        data-cinematic-title="Why Join"
        data-surface="paper"
        aria-labelledby="why-join-title"
        className={SECTION}
      >
        <TableHeader label="Why Join" className="col-span-full" />
        <LabCell>
          <LabTitle id="why-join-title" count={benefits.length} className={WRAP}>
            What you&apos;ll get as a member
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>Being part of bits&amp;bytes™ is more than a Discord invite.</p>
        </LabCell>
        <LabFeed
          labels={["No.", "Benefit"]}
          aside={<FigWindow seed="What you'll get as a member" fig={2} className={cn(LAB_STICKY, "max-lg:hidden")} />}
        >
          {benefits.map((benefit, index) => (
            <LabRow key={benefit.title} label={`B.${pad(index + 1)}`} title={benefit.title} defaultOpen>
              <p>{benefit.description}</p>
            </LabRow>
          ))}
        </LabFeed>
      </LabGrid>

      <LabGrid
        as="section"
        id="expectations"
        data-cinematic-section=""
        data-cinematic-title="What we look for"
        data-surface="paper"
        aria-labelledby="expectations-title"
        className={SECTION}
      >
        <TableHeader label="Expectations" className="col-span-full" />
        <LabCell>
          <LabTitle id="expectations-title" count={expectations.length}>
            What we look for
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>We want to make sure bits&amp;bytes™ is the right fit for you.</p>
        </LabCell>
        <LabFeed labels={["No.", "Expectation"]}>
          {expectations.map((expectation, index) => (
            <LabIndexRow key={expectation} label={`E.${pad(index + 1)}`}>
              {expectation}
            </LabIndexRow>
          ))}
        </LabFeed>
      </LabGrid>

      <LabGrid
        as="section"
        id="join-faq"
        data-cinematic-section=""
        data-cinematic-title="Common questions"
        data-surface="paper"
        aria-labelledby="join-faq-title"
        className={SECTION}
      >
        <TableHeader label="FAQ" className="col-span-full" />
        <LabCell>
          <LabTitle id="join-faq-title" count={faqs.length}>
            Common questions
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>Things people ask before applying.</p>
        </LabCell>
        <LabFeed labels={["No.", "Question"]}>
          {faqs.map((faq, index) => (
            <LabRow key={faq.question} label={`Q.${pad(index + 1)}`} title={faq.question}>
              <p>{faq.answer}</p>
            </LabRow>
          ))}
        </LabFeed>
      </LabGrid>

      {/* stripe.dev footer rows (auto / 164 / auto / 164 / auto) + the outlined closing word */}
      <section
        id="start-building"
        data-cinematic-section=""
        data-cinematic-title="Ready to start building?"
        data-surface="paper"
        aria-labelledby="start-building-title"
        className="pt-24 min-[760px]:pt-[160px]"
      >
        <LabGrid>
          <LabFooterRows>
            <>
              <LabCell span="1/19">
                <LabTitle id="start-building-title" className={WRAP}>
                  Ready to start building?
                </LabTitle>
              </LabCell>
              <LabCell span="21/-1" className="justify-self-end self-start max-[759px]:hidden">
                <LabGlobe />
              </LabCell>
            </>
            <>
              <LabCell span="1/9">
                <p className={LAB_TEXT.lg}>Join 1400+ teen builders who ship real projects.</p>
              </LabCell>
              <LabCell span="11/-1" className="flex flex-col gap-4 sm:flex-row sm:flex-wrap min-[760px]:justify-end">
                <Button asChild variant="outline">
                  <LabLink href={DISCORD_INVITE_URL} className="group">
                    <Cta>Join Discord</Cta>
                  </LabLink>
                </Button>
                <Button asChild variant="burgundy">
                  <LabLink href={NOTION_JOIN_FORM_URL} className="group">
                    <Cta>Become a Contributor</Cta>
                  </LabLink>
                </Button>
                <Button asChild variant="outline">
                  <LabLink href="/fork" className="group">
                    <Cta>Launch a Fork</Cta>
                  </LabLink>
                </Button>
              </LabCell>
            </>
            <LabCell>
              <p className="font-mono text-[12px] uppercase leading-[1.4]">
                Questions? Reach us at{" "}
                <LabLink
                  href="mailto:hello@gobitsnbytes.org"
                  className={cn("normal-case underline decoration-1 underline-offset-4", LAB_HOVER)}
                >
                  hello@gobitsnbytes.org
                </LabLink>
              </p>
            </LabCell>
          </LabFooterRows>
        </LabGrid>
        <HollowWord text="Join the crew" />
      </section>
    </>
  );
}

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
  LabLink,
  LabTitle,
  TableHeader,
} from "@/components/lab";
import { Button, TornEdge } from "@/components/riot";
import { Character } from "@/components/character/character";
import { JoinBillboard } from "@/components/join/billboard";
import { FORK_CITIES } from "@/lib/forks";
import { cn } from "@/lib/utils";

const NOTION_JOIN_FORM_URL =
  "https://perfect-dinghy-781.notion.site/33949ed2fc338035bd3bef46155035f5?pvs=105";
const DISCORD_INVITE_URL = "https://discord.gg/rjqPfwKKTE";

const pad = (n: number) => String(n).padStart(2, "0");

const paths = [
  {
    title: "Join the community",
    description:
      "Get on our Discord. Talk to teen builders from across India, find people to team up with, and sit in on online study sessions.",
    cta: "Join Discord",
    href: DISCORD_INVITE_URL,
    variant: "outline",
  },
  {
    title: "Become a contributor",
    description:
      "Apply to work on our open-source projects, run developer cohorts, or help with outreach.",
    cta: "Apply now",
    href: NOTION_JOIN_FORM_URL,
    variant: "burgundy",
  },
  {
    title: "Launch a fork",
    description:
      "Bring bits&bytes™ to your city. It works like a fork on GitHub: take the playbook from upstream, run your own room, ship back.",
    cta: "Explore forks",
    href: "/fork",
    variant: "outline",
  },
] as const;

const benefits = [
  {
    title: "A small crew that builds",
    description: "You work next to teen builders from across India who are in the middle of making something.",
  },
  {
    title: "Ship real projects",
    description: "Take a project from idea to deployment, with a mentor checking in at every step.",
  },
  {
    title: "First access to our events",
    description:
      "Priority access to our hackathons and the workshops that run inside them, with people who work in the industry.",
  },
  {
    title: "Get better faster",
    description: "Pair programming, code reviews, and study groups. You learn quicker when the work is shared.",
  },
];

const expectations = [
  "You're a student aged 13–19 who cares about tech",
  "You can give 2–4 hours a week",
  "You're on our Discord and you show up in the conversations",
  "You take part in at least one project or event each quarter",
  "You look out for the people around you, and you're not a jerk",
];

const faqs = [
  {
    question: "Do I need coding experience to join?",
    answer:
      "No. Beginners are welcome, and we pair them with mentors. What we care about is whether you want to build.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "We suggest 2–4 hours a week, and it bends. Some weeks you're at a hackathon. Other weeks you chip away at a project async.",
  },
  {
    question: "Is there a membership fee?",
    answer: "No. bits&bytes™ is free. Learning to build shouldn't cost money.",
  },
  {
    question: "Do I need to live in a particular city?",
    answer: `No. We're pan-India, with forks in ${FORK_CITIES}. Most of what we do happens online, on Discord.`,
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
      {/* Netflix title page for Episode 1; its film ends on black and morphs into this hero. */}
      <JoinBillboard applyHref={NOTION_JOIN_FORM_URL} discordHref={DISCORD_INVITE_URL} />
      <TornEdge from="ink" to="paper" />

      {/* the three ways in, inside console chrome, beside the seeded Fig. 1 */}
      <LabGrid
        as="section"
        id="applications"
        data-cinematic-section=""
        data-cinematic-title="Applications open"
        data-surface="paper"
        aria-labelledby="applications-title"
        className={SECTION}
      >
        <LabCell>
          <LabTitle id="applications-title" count={paths.length}>
            Applications open
          </LabTitle>
        </LabCell>
        <div className="col-span-full max-lg:hidden lg:col-[1/7]">
          <div className={LAB_STICKY}>
            <FigWindow seed="Applications Open" fig={1} />
            <Character
              pose="door"
              sizes="(min-width: 1024px) 140px, 0px"
              className="mx-auto mt-8 w-[clamp(96px,9vw,140px)] [@media(max-height:760px)]:w-24"
            />
          </div>
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
            We read contributor and fork applications every week • Expect a reply within 7 days
          </p>
        </div>
      </LabGrid>

      {/* member benefits as a feed (sticky Fig. 2 beside it) */}
      <LabGrid
        as="section"
        id="why-join"
        data-cinematic-section=""
        data-cinematic-title="Why join"
        data-surface="paper"
        aria-labelledby="why-join-title"
        className={SECTION}
      >
        <TableHeader label="Why join" className="col-span-full" />
        <LabCell>
          <LabTitle id="why-join-title" count={benefits.length} className={WRAP}>
            What you get when you join
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>The Discord invite is where it starts. This is what comes after.</p>
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
          <p className={LAB_TEXT.lg}>Read this before you apply. It saves both of us time.</p>
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
          <p className={LAB_TEXT.lg}>What people usually ask before they apply.</p>
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
                <p className={LAB_TEXT.lg}>Come ship real projects with teen builders from across India.</p>
              </LabCell>
              <LabCell span="11/-1" className="flex flex-col gap-4 sm:flex-row sm:flex-wrap min-[760px]:justify-end">
                <Button asChild variant="outline">
                  <LabLink href={DISCORD_INVITE_URL} className="group">
                    <Cta>Join Discord</Cta>
                  </LabLink>
                </Button>
                <Button asChild variant="burgundy">
                  <LabLink href={NOTION_JOIN_FORM_URL} className="group">
                    <Cta>Become a contributor</Cta>
                  </LabLink>
                </Button>
                <Button asChild variant="outline">
                  <LabLink href="/fork" className="group">
                    <Cta>Launch a fork</Cta>
                  </LabLink>
                </Button>
              </LabCell>
            </>
            <LabCell>
              <p className="font-mono text-[12px] uppercase leading-[1.4]">
                Questions? Write to us at{" "}
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

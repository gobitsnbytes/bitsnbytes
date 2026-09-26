import type { ComponentProps, ReactNode } from "react";
import Image, { getImageProps } from "next/image";
import { ExternalLink } from "lucide-react";

import { pad } from "@/components/edition/shared";
import { Button, Tag, VideoFrame } from "@/components/riot";
import {
  communityPartnerEvents,
  githubDevDayEvent as copilot,
  hack4goodEvent as h4g,
  lucknowBuildGuildEvent as guild,
  regionalSeriesEvent as regional,
} from "@/lib/events-data";
import { cn } from "@/lib/utils";

import { ArchiveIndex, type ArchiveEvent } from "./archive-index";
import { SectionHead } from "./shared";

// Optimised poster URL (the source JPEGs are multi-MB) for <video poster>.
const poster = (src: string) => getImageProps({ src, alt: "", width: 960, height: 540 }).props.src;

function Block({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-t-2 border-line pt-5", className)}>
      <h4 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-signal">{title}</h4>
      {children}
    </div>
  );
}

const PROSE = "space-y-4 font-serif text-[17px] leading-relaxed text-fg/85 [&_strong]:font-bold [&_strong]:text-fg";
const LIST = "list-[square] space-y-1.5 pl-5 font-serif text-[17px] leading-relaxed text-fg/85 marker:text-signal [&_strong]:font-bold [&_strong]:text-fg";
const LINK = "font-bold text-signal underline decoration-2 underline-offset-4 hover:decoration-4";

/** Receipt-style stat list: mono label … value. */
function Receipt({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="border-3 border-line bg-card font-mono text-xs text-card-foreground shadow-[6px_6px_0_0_var(--shadow-color)]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-3 border-b-2 border-dashed border-line/25 px-4 py-2.5 last:border-0">
          <dt className="shrink-0 font-bold uppercase tracking-[0.1em] opacity-70">{label}</dt>
          <span aria-hidden className="min-w-4 flex-1 border-b-2 border-dotted border-line/30" />
          <dd className="text-right font-bold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Out({ href, children, variant = "orange", className, ...props }: ComponentProps<"a"> & { variant?: "orange" | "outline" }) {
  return (
    <Button asChild variant={variant} className={cn("w-full", className)}>
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <ExternalLink aria-hidden className="size-4" />
      </a>
    </Button>
  );
}

function Banner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[21/9] border-3 border-line bg-surface-2 sm:aspect-[3/1]">
      <Image src={src} alt={alt} fill sizes="(min-width: 1280px) 70vw, 100vw" className="object-cover" />
    </div>
  );
}

function Detail({
  badge,
  banner,
  tagline,
  tags,
  aside,
  footer,
  children,
}: {
  badge: string;
  banner: ReactNode;
  tagline: ReactNode;
  tags: string[];
  aside: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="max-w-[1180px] space-y-8 pt-2">
      {banner}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(16rem,1fr)]">
        <div className="space-y-6">
          <p className="font-serif text-xl italic leading-snug md:text-2xl">{tagline}</p>
          <ul className="flex flex-wrap gap-2.5">
            <li>
              <Tag tone="ink">{badge}</Tag>
            </li>
            {tags.map((tag) => (
              <li key={tag}>
                <Tag tone="cream">{tag}</Tag>
              </li>
            ))}
          </ul>
          {children}
        </div>
        <aside className="space-y-6">{aside}</aside>
      </div>
      {footer}
    </div>
  );
}

const H4G_THEMES = [
  {
    t: "The Architect",
    d: "Tools for builders: agents that fix bugs, refactor legacy code or automate deployments. Example: an agent that catches runtime errors and pushes the hotfix.",
  },
  {
    t: "The Investigator",
    d: "Information at scale: agents that scrape messy websites, read unstructured data and turn it into something you can act on. Example: tracking crypto sentiment across 50+ subreddits.",
  },
  {
    t: "The Artist",
    d: "Automated art: agents that edit video, generate assets and tell stories on their own. Example: a news anchor that runs itself from RSS feeds.",
  },
  {
    t: "The Liaison",
    d: "Glue for the apps people already use, so they work as one flow. Example: a calendar that reorders itself by email priority.",
  },
];

const H4G_PRIZES = [
  { place: "First Place", amount: "₹ 20,000", tone: "bg-orange text-ink" },
  { place: "Second Place", amount: "₹ 10,000", tone: "bg-cream text-ink" },
  { place: "Third Place", amount: "₹ 5,000", tone: "bg-card text-card-foreground" },
];

const H4G_PARTNERS = [
  { name: "GitHub", src: "/partners/github.jpg", level: "Platinum" },
  { name: "Notion", src: "/partners/notion.png", level: "Gold" },
  { name: "Pure Buttons", src: "/partners/pure_buttons.png" },
];

const H4G_SCHEDULE = [
  { title: "Registration", sub: "02 Apr – 28 Apr 2026 (Online)" },
  { title: "Team Formation", sub: "02 Apr – 28 Apr 2026 (Online)" },
  { title: "Idea Submission", sub: "07 Apr – 28 Apr 2026 (Elimination)" },
  { title: "Coding Round", sub: "02 May (12:00 PM) – 03 May (11:00 AM) (Offline · 24H)" },
];

const hack4good = (
  <Detail
    badge="Archived · Apr 2 – May 3, 2026"
    banner={<Banner src="/event_pictures/h4g/h4gbanner.jpg" alt="Hack4Good v0 Banner" />}
    tagline="Architect Your Autonomy. Lucknow's first agentic AI hackathon."
    tags={["Archived Event", "Community Partner: bits&bytes™", "Agentic AI"]}
    aside={
      <>
        <Receipt
          rows={[
            ["Date", h4g.dateLabel],
            ["Venue", h4g.venueLabel],
            ["Team Size", h4g.teamSizeLabel],
            ["Total Prizes", h4g.prizePoolLabel],
            ["Impressions", h4g.impressionsLabel],
            ["Registrations", h4g.registrationsLabel],
            ["On Ground", `${h4g.onGroundLabel} people`],
            ["Status", h4g.statusLabel],
          ]}
        />
        <Block title="Schedule">
          <ol className="space-y-0">
            {H4G_SCHEDULE.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3">
                <span className="flex flex-col items-center">
                  <span className="grid size-7 place-items-center border-2 border-line bg-orange font-mono text-[11px] font-bold text-ink">
                    {pad(i + 1)}
                  </span>
                  {i < H4G_SCHEDULE.length - 1 ? <span aria-hidden className="w-0.5 flex-1 bg-line" /> : null}
                </span>
                <span className="pb-4">
                  <span className="block font-mono text-xs font-bold uppercase">{step.title}</span>
                  <span className="mt-1 block font-mono text-[11px] opacity-75">{step.sub}</span>
                </span>
              </li>
            ))}
          </ol>
        </Block>
        <Block title="Contacts">
          <dl className="space-y-3 font-mono text-xs">
            <div>
              <dt className="font-bold">Event Org</dt>
              <dd>
                <a href="mailto:hack4good.cc@gmail.com" className={LINK}>
                  hack4good.cc@gmail.com
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-bold">Nitya Pandey (Lead)</dt>
              <dd>
                <a href="mailto:nityaaaawwww@gmail.com" className={LINK}>
                  nityaaaawwww@gmail.com
                </a>
              </dd>
            </div>
          </dl>
        </Block>
      </>
    }
    footer={
      <Block title="Event Aftermovie">
        <VideoFrame
          src="/event_pictures/h4g/h4g.mp4"
          poster={poster("/event_pictures/h4g/h4g.jpg")}
          title="Hack4Good v0"
          captionsNote="Highlights and on-floor moments from Hack4Good v0 in Lucknow."
          className="max-w-[960px]"
        />
      </Block>
    }
  >
    <Block title="Event Summary">
      <div className={PROSE}>
        <p>
          Hack4Good v0 was a 24-hour agentic AI hackathon, set up to get a real hackathon and builder culture going in
          Lucknow. The brief went past ordinary coding: build AI agents that can plan a workflow, find their way through
          other systems and finish tasks on their own.
        </p>
        <p>
          It put student developers, beginners and curious builders in one room. Teams tried things with their hands and
          picked real problems, from automation tools to creative systems, while working out how to design for agents.
        </p>
        <p>
          The longer aim is a hackathon scene in Lucknow that outlasts one event: somewhere students build, meet each other
          and come back for the next one.
        </p>
      </div>
    </Block>
    <Block title="Themes">
      <ul className="grid gap-4 sm:grid-cols-2">
        {H4G_THEMES.map((theme, i) => (
          <li key={theme.t} className="border-2 border-line p-4">
            <p className="font-mono text-xs font-bold uppercase text-signal">
              [T.{pad(i + 1)}] {theme.t}
            </p>
            <p className="mt-2 font-serif text-[15px] leading-relaxed text-fg/85">{theme.d}</p>
          </li>
        ))}
      </ul>
    </Block>
    <Block title="Prizes">
      <p className="mb-4 font-mono text-xs opacity-80">
        The prize pool was ₹35,000. Everyone who finished got a participation certificate.
      </p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {H4G_PRIZES.map((prize) => (
          <li key={prize.place} className={cn("border-3 border-line p-4 shadow-[3px_3px_0_0_var(--shadow-color)]", prize.tone)}>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">{prize.place}</p>
            <p className="mt-1 font-display text-4xl leading-none">{prize.amount}</p>
          </li>
        ))}
      </ul>
    </Block>
    <Block title="Partners & Sponsors">
      <ul className="grid gap-4 sm:grid-cols-3">
        {H4G_PARTNERS.map((partner) => (
          <li key={partner.name} className="flex min-h-[140px] flex-col items-center justify-center gap-2 border-2 border-line bg-white p-4 text-ink">
            <span className="relative block h-10 w-full">
              <Image src={partner.src} alt={partner.name} fill sizes="120px" className="object-contain" />
            </span>
            <span className="font-mono text-xs font-bold">{partner.name}</span>
            {partner.level ? (
              <span className="border-2 border-burgundy bg-cream px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-burgundy">
                {partner.level}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Block>
  </Detail>
);

const buildGuild = (
  <Detail
    badge="Archived · Apr 19, 2026"
    banner={<Banner src="/images/lko-build-guild.jpg" alt="Lucknow Build Guild" />}
    tagline="Free hardware workshop and meetup in Lucknow."
    tags={["Archived Event", "Sponsored* by bits&bytes™"]}
    aside={
      <>
        <Receipt
          rows={[
            ["Date", guild.dateLabel],
            ["Venue", guild.venueLabel],
            ["Format", guild.formatLabel],
            ["Status", guild.statusLabel],
          ]}
        />
        <Out href={guild.eventSite}>Visit Website</Out>
      </>
    }
  >
    <Block title="Event Summary">
      <div className={PROSE}>
        <p>
          Lucknow Build Guild was a free hardware workshop and meetup on 19 April at SureStay by Best Western. People came
          to build hardware, meet other builders and learn from each other.
        </p>
      </div>
    </Block>
    <Block title="What we worked on">
      <ul className={LIST}>
        <li>Building hardware by hand, with practical workflows.</li>
        <li>Meeting the people building tech in Lucknow.</li>
        <li>Learning from each other in a room full of student builders.</li>
      </ul>
    </Block>
    <Block title="Host">
      <p className="font-mono text-xs leading-relaxed">
        Event host: <strong>{guild.hostName}</strong>. Explore:{" "}
        <a href={guild.hostLinktree} target="_blank" rel="noopener noreferrer" className={LINK}>
          Linktree
        </a>{" "}
        and{" "}
        <a href={guild.hostGithub} target="_blank" rel="noopener noreferrer" className={LINK}>
          GitHub
        </a>
        .
      </p>
    </Block>
  </Detail>
);

const copilotDevDays = (
  <Detail
    badge="Archived · Apr 19"
    banner={<Banner src="/images/copilot-dev-day.png" alt="GitHub Copilot Dev Days | Lucknow" />}
    tagline="A community developer event on AI-assisted coding with GitHub Copilot."
    tags={["Archived Event", "Hosted by bits&bytes™"]}
    aside={
      <>
        <Receipt
          rows={[
            ["Date", copilot.dateLabel],
            ["Venue", copilot.venueLabel],
            ["Format", copilot.formatLabel],
            ["Status", copilot.statusLabel],
          ]}
        />
        <div className="space-y-4">
          <Button asChild variant="orange" className="luma-checkout--button w-full">
            <a
              href={copilot.lumaCheckoutUrl}
              data-luma-action="checkout"
              data-luma-event-id={copilot.lumaEventId}
              target="_blank"
              rel="noopener noreferrer"
            >
              Register for Event
            </a>
          </Button>
          <Out href={copilot.archiveLink} variant="outline">
            View Archive
          </Out>
        </div>
      </>
    }
  >
    <Block title="Event Summary">
      <div className={PROSE}>
        <p>
          Students and developers in Lucknow looked at how AI-assisted development works once it is inside a real
          project.
        </p>
      </div>
    </Block>
    <Block title="What we covered">
      <ul className={LIST}>
        <li>How GitHub Copilot works inside modern dev environments.</li>
        <li>Fitting AI-assisted coding into real production work.</li>
        <li>Prompting for better, more accurate code suggestions.</li>
        <li>Using AI responsibly in day-to-day development.</li>
      </ul>
    </Block>
    <Block title="Partners & Details">
      <p className="font-mono text-xs leading-relaxed">
        We hosted it, with Coding Connoisseurs, Aryan Singh and Notion Lucknow as community partners. Everyone followed
        the official{" "}
        <a
          href="https://www.microsoft.com/en-us/events/code-of-conduct"
          target="_blank"
          rel="noopener noreferrer"
          className={LINK}
        >
          GitHub Event Code of Conduct
        </a>
        .
      </p>
    </Block>
  </Detail>
);

const indiaInnovates = (
  <Detail
    badge="Archived · Mar 28, 2026"
    banner={<Banner src="/images/banner.jpeg" alt="India Innovates 2026, Bharat Mandapam, New Delhi" />}
    tagline="Billed as the world's largest civic tech hackathon."
    tags={["Archived Event", "Official Executive Partner: bits&bytes™"]}
    aside={
      <>
        <Receipt
          rows={[
            ["Date", "Mar 28, 2026"],
            ["Venue", "Bharat Mandapam, New Delhi"],
            ["Scale", "1.26 crore+ applicants"],
            ["Status", "Concluded"],
          ]}
        />
        <Out href="https://indiainnovates.org">Visit Website</Out>
      </>
    }
    footer={
      <Block title="Event Video">
        <VideoFrame
          src="/event_pictures/india-innovates-2026-stage-address.mp4"
          poster={poster("/event_pictures/HEe923ub0AE-92F.jpg")}
          title="India Innovates 2026"
          captionsNote="Stage highlights and on-floor moments from the finale."
          className="max-w-[960px]"
        />
      </Block>
    }
  >
    <p className="font-serif text-lg font-bold">
      We were the official executive partner for the India Innovates 2026 finale.
    </p>
    <Block title="Event Summary">
      <div className={PROSE}>
        <p>
          India Innovates 2026 was billed as the world&apos;s largest civic tech hackathon. The finale ran on March 28, 2026
          at Bharat Mandapam, Pragati Maidan, New Delhi, from 9 AM to 7 PM. HN Group and MCD organised it, with partner
          institutions including IIT Kharagpur, NSUT, GGSIPU and DDU.
        </p>
      </div>
    </Block>
    <Block title="Scale">
      <ul className={LIST}>
        <li>
          <strong>1.26 crore+</strong> total applicants nationwide.
        </li>
        <li>
          <strong>28,000+ to 5,000+ to 15 teams</strong> across three elimination rounds.
        </li>
        <li>
          <strong>₹10 lakh+</strong> prize pool, including ₹1L, ₹75K, ₹50K, and ₹25K per domain.
        </li>
        <li>
          Domains: <strong>Urban Solutions, Digital Democracy, and Open Innovation</strong>.
        </li>
      </ul>
    </Block>
    <Block title="Finale Format">
      <div className={PROSE}>
        <p>
          Nobody built on site. Teams built beforehand, and the final day was live product demos in front of investors,
          officials, diplomats and founders.
        </p>
      </div>
    </Block>
    <Block title="Dignitaries and Finalists">
      <div className={PROSE}>
        <p>
          Confirmed attendees included <strong>Delhi CM Rekha Gupta</strong>, the <strong>Bihar Assembly Speaker</strong>,
          and <strong>MP Manoj Tiwari (North East Delhi)</strong>.
        </p>
        <p>
          <strong>Team Dupahar</strong> from the University of Jammu reached the Top 15 and was reported as the only finalist
          team from J&K.
        </p>
      </div>
    </Block>
  </Detail>
);

const execron = (
  <Detail
    badge="Archived · Mar 19-22, 2026"
    banner={
      <div className="relative grid aspect-[21/9] place-items-center overflow-hidden border-3 border-line bg-cream p-6 text-center text-ink sm:aspect-[3/1]">
        <span aria-hidden className="halftone-fade absolute inset-0 opacity-25" />
        <div className="relative">
          <p className="font-display text-[clamp(44px,7vw,96px)] uppercase leading-[0.85]">Execron 1.0</p>
          <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.2em]">
            Build. Break. Repeat. Ship Something Real.
          </p>
        </div>
      </div>
    }
    tagline="An AI hackathon and workshop for teens at IIT Kanpur."
    tags={["Archived Event", "TechKriti '26 Collaboration", "IIT Kanpur"]}
    aside={
      <>
        <Receipt
          rows={[
            ["Date", "Mar 19–22, 2026"],
            ["Venue", "IIT Kanpur"],
            ["Team Size", "1–4 members"],
            ["Partners", "ByteForge, bits&bytes™"],
          ]}
        />
        <Out href="https://byteforge.paxus.in/">Visit Website</Out>
      </>
    }
  >
    <Block title="Event Summary">
      <div className={PROSE}>
        <p>
          An AI hackathon and workshop for students in classes 9–12, run with TechKriti &apos;26 at IIT Kanpur: a 4-hour
          workshop first, then a 24-hour hackathon sprint.
        </p>
      </div>
    </Block>
    <Block title="What happened">
      <ul className={LIST}>
        <li>A 4-hour hands-on workshop.</li>
        <li>A 24-hour hackathon sprint with direct mentor support.</li>
        <li>Mentorship from IIT Kanpur alumni and industry experts.</li>
        <li>Full access to TechKriti &apos;26: mega hackathons, pro shows, and the robotics expo.</li>
      </ul>
    </Block>
    <Block title="Topics Covered">
      <ul className="flex flex-wrap gap-2.5">
        {["AI & ML", "Web Dev", "App Dev", "Cybersecurity", "Cloud Computing"].map((topic) => (
          <li key={topic}>
            <Tag tone="cream">{topic}</Tag>
          </li>
        ))}
      </ul>
    </Block>
  </Detail>
);

// Newest first (by end date). Every label comes from the event data. Community partnerships are list-only rows
// that link out to the host's page.
const EVENTS: ArchiveEvent[] = [
  {
    id: regional.id,
    name: regional.title,
    date: regional.finaleDateLabel,
    venue: regional.finaleVenueLabel,
    status: regional.statusLabel,
    href: `#${regional.id}`,
  },
  ...communityPartnerEvents.map((ev) => ({
    id: ev.id,
    name: ev.name,
    format: ev.format && `${ev.format} by ${ev.host}`,
    date: ev.dateLabel ?? "",
    venue: ev.venue,
    status: "Community Partner",
    href: ev.url,
    external: true,
  })),
  {
    id: "hack4good-v0",
    name: "Hack4Good v0",
    format: h4g.formatLabel,
    date: "2026.04.02 → 05.03",
    venue: h4g.venueLabel,
    status: h4g.statusLabel,
    detail: hack4good,
  },
  {
    id: "lucknow-build-guild",
    name: "Lucknow Build Guild",
    format: guild.formatLabel,
    date: "2026.04.19",
    venue: guild.venueLabel,
    status: guild.statusLabel,
    detail: buildGuild,
  },
  {
    id: "github-copilot-dev-days",
    name: "GitHub Copilot Dev Days | Lucknow",
    format: copilot.formatLabel,
    date: "2026.04.19",
    venue: copilot.venueLabel,
    status: copilot.statusLabel,
    detail: copilotDevDays,
  },
  {
    id: "india-innovates-2026",
    name: "India Innovates 2026",
    format: "World's Largest Civic Tech Hackathon",
    date: "2026.03.28",
    venue: "Bharat Mandapam, New Delhi",
    status: "Concluded",
    detail: indiaInnovates,
  },
  {
    id: "execron-1-0",
    name: "Execron 1.0",
    format: "AI Hackathon & Workshop for Teens",
    date: "2026.03.19 → 22",
    venue: "IIT Kanpur",
    status: "Archived",
    detail: execron,
  },
];

/**
 * /events [S.02]: inkfish /work index as a list. Giant "EVENTS [N]" + barcode stripe-wipe rows. Every
 * archived event expands in place into its full file (all existing details, real footage included);
 * the series row links to [S.01].
 */
export function EventArchive() {
  return (
    <section
      id="archive"
      data-cinematic-section=""
      data-cinematic-title="The event archive"
      data-chapter-number="02"
      data-surface="paper"
      className="tone-paper relative overflow-x-clip px-4 pb-24 pt-20 md:px-5 md:pb-32 md:pt-28"
    >
      <SectionHead label={<p>The event archive</p>} section={2} className="mb-10" />
      <ArchiveIndex events={EVENTS} />
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import logoSvg from "@public/logo.svg";
import { Breadcrumbs } from "@/components/breadcrumb";
import { WIDE } from "@/components/chrome/wordmark";
import { EditionOpener, EDITION_GUTTER, SerifStatement } from "@/components/edition";
import { Palette, type PaletteRow } from "@/components/press/palette";
import { Button, Chapter, ChapterHead, TornEdge, Window } from "@/components/riot";
import { TEAM_MEMBERS } from "@/lib/team-data";
import { cn } from "@/lib/utils";

const colorPaletteRows: PaletteRow[] = [
  {
    title: "Burgundy",
    description: "The core. Serious. Doesn't beg for attention.",
    colors: [
      { step: "Base", hex: "#97192C" },
      { step: "20%", hex: "#791423" },
      { step: "40%", hex: "#5B0F1A" },
      { step: "60%", hex: "#3C0A12" },
      { step: "80%", hex: "#1E0509" },
    ],
  },
  {
    title: "Neutrals",
    description: "So everything else doesn't look like a mess.",
    colors: [
      { step: "Base", hex: "#120F0A" },
      { step: "20%", hex: "#413F3B" },
      { step: "40%", hex: "#716F6C" },
      { step: "60%", hex: "#A09F9D" },
      { step: "80%", hex: "#D0CFCE" },
    ],
  },
  {
    title: "Orange",
    description: "Chaos, but controlled. Where things pop.",
    colors: [
      { step: "Base", hex: "#FC920D" },
      { step: "20%", hex: "#FDA83D" },
      { step: "40%", hex: "#FDBE6E" },
      { step: "60%", hex: "#FED39E" },
      { step: "80%", hex: "#FEE9CF" },
    ],
  },
  {
    title: "Gradients / Warm Accents",
    description: "Movement. Nothing here is static.",
    colors: [
      { step: "Base", hex: "#C94218" },
      { step: "20%", hex: "#D46846" },
      { step: "40%", hex: "#DF8E74" },
      { step: "60%", hex: "#E9B3A3" },
      { step: "80%", hex: "#F4D9D1" },
    ],
  },
];

const executiveLeadership = TEAM_MEMBERS.filter((member) => member.role.startsWith("Chief"));
const departmentLeads = TEAM_MEMBERS.filter((member) => member.role.startsWith("Head"));

const logos = [
  {
    title: "Vector SVG Logo",
    note: "Best for web layouts and high-resolution scaling.",
    src: logoSvg,
    alt: "bits&bytes logo SVG",
    href: "/logo.svg",
    download: "bitsnbytes-logo.svg",
    cta: "Download SVG",
    plate: "bg-ink",
    variant: "orange",
  },
  {
    title: "Raster PNG Logo",
    note: "Raster image file with transparent background.",
    src: "/logo.png",
    alt: "bits&bytes logo PNG",
    href: "/logo.png",
    download: "bitsnbytes-logo.png",
    cta: "Download PNG",
    plate: "bg-burgundy",
    variant: "outline",
  },
] as const;

const stats = [
  { value: "1400+", label: "Active Builders" },
  { value: "5+ Forks", label: "Chapters", href: "/fork" },
  { value: "4+", label: "Events" },
  { value: "16.5 Yrs", label: "Mean Age" },
];

const publicFacts = [
  { key: "Public Brand", value: "bits&bytes™" },
  { key: "Operator", value: "GOBITSNBYTES FOUNDATION" },
  { key: "Structure", value: "Section 8 non-profit company in India" },
  { key: "Use This Name", value: "bits&bytes™ in public copy, bitsnbytes where symbols are restricted." },
];

const usageRules = [
  "Do not distort, recolor, rotate, or add effects to the logo.",
  "Do not use bits&bytes™ branding for fundraising without approval.",
  "Do not publish participant data, private chats, or minor photos without consent.",
  "Use the Code of Conduct and Privacy Policy for safety-sensitive questions.",
];

const chapters = [
  { id: "official-logos", title: "Official Logos" },
  { id: "color-palettes", title: "Color Palettes" },
  { id: "typography", title: "Typography Specimens" },
  { id: "about", title: "About bits&bytes™" },
  { id: "usage-rules", title: "Usage Rules" },
  { id: "media-contact", title: "Media Contact" },
  { id: "citations", title: "Citations & Digital PR Guidelines" },
];

const GUTTER = cn("px-4 md:px-8", EDITION_GUTTER);
const INDEX = "font-mono text-xs font-bold tracking-[0.1em] text-signal";
const CODE = "select-all overflow-x-auto border-2 border-line bg-surface p-3 font-mono text-[11px] leading-relaxed text-fg md:text-xs";

const pad = (n: number) => String(n).padStart(2, "0");

function PeopleTable({ title, people }: { title: string; people: typeof TEAM_MEMBERS }) {
  return (
    <div>
      <h3 className="border-b-3 border-line pb-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-signal">
        {title} <span aria-hidden>[{pad(people.length)}]</span>
      </h3>
      <ul>
        {people.map((member) => (
          <li
            key={member.name}
            className="grid gap-1 border-b-2 border-line py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-6"
          >
            <span className={cn(WIDE, "text-[clamp(20px,2vw,28px)] uppercase leading-[0.95]")}>{member.name}</span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] opacity-75">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PressKit() {
  return (
    <>
      <div data-tour="page-hero">
        <EditionOpener
          variant="static"
          title="Press kit & brand assets"
          kicker="Brand Guidelines · GOBITSNBYTES FOUNDATION"
          chapters={chapters}
          art={{
            src: "/event_pictures/bd2.jpg",
            alt: "Two builders holding a Blueprint Build Guild Lucknow participation certificate",
          }}
        />
      </div>
      <TornEdge from="ink" to="paper" />

      {/* §01: logo downloads as specimen plates (white mark on ink / burgundy, as the brand kit asks) */}
      <Chapter id="official-logos" title="Official Logos" number={1} className="md:pt-20">
        <div className={GUTTER}>
          <Breadcrumbs items={[{ name: "Press & Media Kit", href: "/press" }]} />
        </div>
        <SerifStatement className="py-0 pb-14 md:py-0 md:pb-20">
          <span data-speakable="true" data-citation="true">
            Official logos, color palettes, typography specs, public facts, and media contact paths for bits&amp;bytes™.
          </span>
        </SerifStatement>
        <div className={GUTTER}>
          <ChapterHead
            number={1}
            label="Brand Guidelines"
            title="Official Logos"
            description="Download the official bits&bytes™ cube monogram and wordmark assets."
          />
          <ul className="grid gap-8 md:grid-cols-2">
            {logos.map((logo, index) => (
              <li key={logo.href} className="border-3 border-line bg-card text-card-foreground shadow-[6px_6px_0_0_var(--shadow-color)]">
                <div className={cn("relative grid aspect-[4/3] place-items-center border-b-3 border-line", logo.plate)}>
                  <span aria-hidden className="halftone absolute inset-0 opacity-10" />
                  <span className="absolute left-3 top-3 font-mono text-[11px] font-bold tracking-[0.1em] text-cream">
                    [{pad(index + 1)}]
                  </span>
                  <div className="relative size-[42%]">
                    <Image src={logo.src} alt={logo.alt} fill sizes="(min-width: 768px) 20vw, 40vw" className="object-contain" />
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6">
                  <div>
                    <h3 className={cn(WIDE, "text-[clamp(22px,2vw,30px)] uppercase leading-[0.95]")}>{logo.title}</h3>
                    <p className="mt-2 font-serif text-sm opacity-80">{logo.note}</p>
                  </div>
                  <Button asChild variant={logo.variant} size="sm" className="shrink-0">
                    <a href={logo.href} download={logo.download} data-cursor-label="DOWNLOAD">
                      {logo.cta} <span aria-hidden>↓</span>
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>

      {/* §02: palette table */}
      <Chapter id="color-palettes" title="Color Palettes" number={2} tone="cream">
        <div className={GUTTER}>
          <ChapterHead
            number={2}
            label="Brand Guidelines"
            title="Color Palettes"
            description="Click any color swatch to copy its HEX value. We default to Burgundy and Plum tones."
          />
          <Palette rows={colorPaletteRows} />
        </div>
      </Chapter>

      {/* §03: type specimens */}
      <Chapter id="typography" title="Typography Specimens" number={3}>
        <div className={GUTTER}>
          <ChapterHead
            number={3}
            label="Brand Guidelines"
            title="Typography Specimens"
            description="Our identity uses robust Helvetica Now headings combined with traditional Georgia Pro body elements."
          />
          <div className="grid border-3 border-line md:grid-cols-2">
            <div className="flex flex-col gap-6 border-b-3 border-line p-6 md:border-b-0 md:border-r-3 md:p-10">
              <div className="flex justify-between gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] opacity-75">
                <span>PRIMARY / DISPLAY FONT</span>
                <span>HELVETICA NOW</span>
              </div>
              <p className={cn(WIDE, "text-[clamp(40px,5vw,84px)] uppercase leading-[0.88]")}>HEADING DISPLAY SPECIMEN</p>
              <p className="mt-auto font-sans text-sm font-medium leading-relaxed opacity-80">
                Use heavier Helvetica Now weights for headings, events banner titles, and action items. Bold, striking, and
                confident.
              </p>
            </div>
            <div className="flex flex-col gap-6 bg-surface-2 p-6 md:p-10">
              <div className="flex justify-between gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.12em] opacity-75">
                <span>SECONDARY / BODY FONT</span>
                <span>GEORGIA PRO</span>
              </div>
              <p className="font-serif text-[clamp(22px,2.2vw,32px)] italic leading-snug">
                &quot;This is a specimen of Georgia Pro. We use it for long-form reading, paragraphs, team profiles, and
                descriptive documentation.&quot;
              </p>
              <p className="mt-auto font-serif text-sm leading-relaxed opacity-80">
                Traditional, highly readable, and grounds the visual design in narrative clarity.
              </p>
            </div>
          </div>
        </div>
      </Chapter>

      <TornEdge from="paper" to="ink" />

      {/* §04: about + numbers + public facts */}
      <Chapter id="about" title="About bits&bytes™" number={4} tone="ink">
        <div className={GUTTER}>
          <ChapterHead number={4} label="Public Facts" title="About bits&bytes™" />
          <p className="max-w-[62ch] font-serif text-lg leading-relaxed md:text-xl">
            bits&bytes™ is an independent, youth-led builder network that runs hackathons, developer meetups, open-source
            squads, and cohort-based programs. Founded in November 2025 after a major partner hackathon was cancelled, the
            team built a durable student-led alternative where teenagers ship real software, learn in public, and organize
            with serious safety standards.
          </p>

          {/* 2px rules = the line colour showing through the grid gaps */}
          <ul className="mt-12 grid grid-cols-2 gap-[2px] border-y-3 border-line bg-line lg:grid-cols-4">
            {stats.map((stat) => (
              <li key={stat.label} className="bg-surface px-4 py-6 lg:px-6 lg:py-8">
                <p className="whitespace-nowrap font-display text-[clamp(36px,4.2vw,72px)] uppercase leading-[0.9]">
                  {stat.href ? (
                    <Link href={stat.href} className="underline-offset-[6px] hover:underline hover:decoration-4">
                      {stat.value}
                    </Link>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-signal">{stat.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
            <h3 className={cn(WIDE, "text-[clamp(24px,2.4vw,36px)] uppercase leading-[0.92]")}>Public Facts</h3>
            <dl className="border-t-2 border-line">
              {publicFacts.map((fact) => (
                <div
                  key={fact.key}
                  className="grid gap-1 border-b-2 border-line py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">{fact.key}</dt>
                  <dd className="font-mono text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Chapter>

      {/* §05: usage rules on the campaign surface */}
      <Chapter id="usage-rules" title="Usage Rules" number={5} tone="orange">
        <div className={GUTTER}>
          <ChapterHead
            number={5}
            label="Brand Guidelines"
            title="Usage Rules"
            description="Press and partners may use official assets for accurate coverage of bits&bytes™. Co-branded materials, merch, sponsorship announcements, and anything implying endorsement need written approval."
          />
          <ol className="max-w-5xl">
            {usageRules.map((rule, index) => (
              <li
                key={rule}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b-2 border-line py-5 md:grid-cols-[5rem_minmax(0,1fr)] md:py-6"
              >
                <span className="font-mono text-xs font-bold tracking-[0.1em]">[R.{pad(index + 1)}]</span>
                <span className="font-sans text-[clamp(20px,2.2vw,32px)] font-extrabold uppercase leading-[1.04] tracking-[-0.01em]">
                  {rule}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      {/* §06: people tables + media contact window */}
      <Chapter id="media-contact" title="Media Contact" number={6}>
        <div className={GUTTER}>
          <ChapterHead number={6} label="Press & Media Kit" title="Media Contact" />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
            <div className="grid gap-12">
              <PeopleTable title="Executive Leadership" people={executiveLeadership} />
              <PeopleTable title="Department Leads" people={departmentLeads} />
            </div>
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Window title="Contact" bar="orange" bodyClassName="p-5 md:p-7">
                <p className="font-serif text-base leading-relaxed">
                  For press inquiries, brand permissions, partnership queries, or logo authorization:
                </p>
                <a
                  href="mailto:hello@gobitsnbytes.org"
                  className={cn(
                    WIDE,
                    "mt-4 block break-all text-[clamp(22px,2.4vw,34px)] leading-none text-signal underline-offset-4 hover:underline",
                  )}
                >
                  hello@gobitsnbytes.org
                </a>
                <div className="mt-6 border-t-3 border-line pt-5">
                  <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]">Boilerplate for Journalists</h3>
                  <p className="mt-3 select-all font-serif text-base italic leading-relaxed">
                    &quot;bits&amp;bytes™ is an independent, student-led youth builder network operated by GOBITSNBYTES
                    FOUNDATION (Section 8 non-profit). Founded in Lucknow, India, it connects 1,400+ teenage developers to ship
                    real-world software and run independent hackathons.&quot;
                  </p>
                </div>
              </Window>
            </div>
          </div>
        </div>
      </Chapter>

      <TornEdge from="paper" to="ink" />

      {/* §07: citation + backlink snippets in window chrome */}
      <Chapter id="citations" title="Citations & Digital PR Guidelines" number={7} tone="ink">
        <div className={GUTTER}>
          <ChapterHead
            number={7}
            label="Digital PR"
            title="Citations & Digital PR Guidelines"
            description="When citing bits&bytes™ research, event metrics, or brand publications, please use the standard citations below:"
          />
          <div className="grid gap-8 md:grid-cols-2">
            <Window title="APA Citation Format" bar="acid">
              <p className={CODE}>
                GOBITSNBYTES FOUNDATION. (2026). India Youth Tech &amp; Builder Research Metrics. bits&amp;bytes™.
                https://gobitsnbytes.org/impact
              </p>
            </Window>
            <Window title="BibTeX Format" bar="acid">
              <pre className={CODE}>
{`@misc{bitsnbytes2026,
  author = {GOBITSNBYTES FOUNDATION},
  title = {bits&bytes: India's Teen Builder Network},
  year = {2026},
  publisher = {GOBITSNBYTES FOUNDATION},
  url = {https://gobitsnbytes.org}
}`}
              </pre>
            </Window>
          </div>

          <div className="mt-20 md:mt-28">
            <header className="mb-9 flex flex-wrap items-end justify-between gap-4 border-b-3 border-line pb-3.5">
              <h2 className="font-display text-[clamp(36px,5.4vw,84px)] uppercase leading-[0.88]">
                Embed Badges &amp; Link to Us (Backlink Kit)
              </h2>
              <p className="max-w-[42ch] font-serif text-base opacity-80">
                Are you a partner, student builder, event organizer, or tech blogger? Add our official badge to your GitHub
                README or site to link back to bits&amp;bytes™.
              </p>
            </header>
            <div className="grid gap-8 md:grid-cols-2">
              <Window title="Markdown Logo Link (GitHub READMEs)" bar="orange">
                <p className={CODE}>{`[![bits&bytes™ logo](https://gobitsnbytes.org/logo)](https://gobitsnbytes.org)`}</p>
                <p className="mt-3 font-serif text-sm opacity-80">Copy and paste into your project README.md file to link to us.</p>
              </Window>
              <Window title="HTML Logo Badge (Websites & Blogs)" bar="orange">
                <p className={CODE}>
                  {`<a href="https://gobitsnbytes.org" target="_blank" rel="noopener"><img src="https://gobitsnbytes.org/logo" alt="bits&bytes™ - India's Youth Builder Network" height="36" /></a>`}
                </p>
                <p className="mt-3 font-serif text-sm opacity-80">Copy and paste into your website footer or partner section.</p>
              </Window>
            </div>
          </div>
        </div>
      </Chapter>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Brand",
            "name": "bits&bytes™",
            "alternateName": ["bits&bytes", "bitsnbytes", "GOBITSNBYTES FOUNDATION"],
            "url": "https://gobitsnbytes.org",
            "logo": "https://gobitsnbytes.org/logo.svg",
            "description": "Official brand assets, logos, public facts, and press guidelines for bits&bytes™ (GOBITSNBYTES FOUNDATION).",
            "owner": {
              "@type": "Organization",
              "name": "GOBITSNBYTES FOUNDATION",
              "url": "https://gobitsnbytes.org",
            },
          }),
        }}
      />
    </>
  );
}

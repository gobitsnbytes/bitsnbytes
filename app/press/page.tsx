import Image from "next/image";
import type { ReactNode } from "react";

import logoSvg from "@public/logo.svg";
import { Breadcrumbs } from "@/components/breadcrumb";
import { WIDE } from "@/components/chrome/wordmark";
import { ConsoleWindow } from "@/components/contact/console-window";
import { LabIndexRow } from "@/components/faq/lab-row";
import {
  HollowWord,
  LAB_MARKER,
  LAB_STICKY,
  LAB_TEXT,
  LabCell,
  LabFeed,
  LabGlobe,
  LabGrid,
  LabHero,
  LabLink,
  LabTag,
  LabTitle,
  PixelGlyph,
  TableHeader,
} from "@/components/lab";
import { Palette, type PaletteRow } from "@/components/press/palette";
import { Button } from "@/components/riot";
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
] as const;

const SECTION = "gap-y-10 pt-24 min-[760px]:pt-[136px]";
const WRAP = "min-[760px]:whitespace-normal";
const CODE =
  "select-all overflow-x-auto border border-line bg-surface-2 p-3 font-mono text-[11px] leading-relaxed text-fg md:text-xs";
/** A 12-column half (stripe.dev "Featured post / video"). */
const HALF = "relative col-span-full grid grid-cols-subgrid content-start gap-y-6 min-[760px]:col-span-12";
/** Dashed vertical rule on the second half (24px above → 70px below). */
const DIVIDER =
  "min-[760px]:before:absolute min-[760px]:before:-bottom-[70px] min-[760px]:before:-top-6 min-[760px]:before:left-[calc(var(--lab-gap)/-2)] min-[760px]:before:border-l min-[760px]:before:border-dashed min-[760px]:before:border-line";

const pad = (n: number) => String(n).padStart(2, "0");

/** Chapter section: a LabGrid carrying the data-* the nav and chapter list read. */
function PressSection({ index, children }: { index: number; children: ReactNode }) {
  const chapter = chapters[index];
  return (
    <LabGrid
      as="section"
      id={chapter.id}
      data-cinematic-section=""
      data-cinematic-title={chapter.title}
      data-surface="paper"
      aria-labelledby={`${chapter.id}-title`}
      className={SECTION}
    >
      {children}
    </LabGrid>
  );
}

function PeopleTable({ title, people }: { title: string; people: typeof TEAM_MEMBERS }) {
  return (
    <div>
      <TableHeader as="h3" label={title} count={people.length} />
      <ul role="list">
        {people.map((member) => (
          <li
            key={member.name}
            className="grid gap-1 border-b border-line py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-6"
          >
            <span className={LAB_TEXT.md}>{member.name}</span>
            <span className="font-mono text-[11px] uppercase leading-[1.3] text-fg/75">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PressKit() {
  return (
    <>
      <section
        data-tour="page-hero"
        data-cinematic-section=""
        data-cinematic-title="Press kit & brand assets"
        data-surface="paper"
      >
        <LabHero
          lines={["Press kit & ", "brand assets"]}
          glyph={<PixelGlyph text="PRESS" decorative />}
          aside={<LabGlobe />}
          subtitle={
            <p data-speakable="true" data-citation="true">
              Official logos, color palettes, typography specs, public facts, and media contact paths for bits&amp;bytes™.
            </p>
          }
        >
          <div className="flex flex-col items-start gap-4">
            <Breadcrumbs items={[{ name: "Press & Media Kit", href: "/press" }]} className="mb-0" />
            <LabTag>Brand Guidelines · GOBITSNBYTES FOUNDATION</LabTag>
          </div>
        </LabHero>
      </section>

      {/* §01 logo downloads as the two stripe.dev featured halves (white mark on ink / burgundy plates) */}
      <PressSection index={0}>
        <LabCell>
          <LabTitle id="official-logos-title" count={logos.length}>
            Official Logos
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>Download the official bits&amp;bytes™ cube monogram and wordmark assets.</p>
        </LabCell>
        {logos.map((logo, index) => (
          <article key={logo.href} className={cn(HALF, "gap-y-8", index > 0 && DIVIDER)}>
            <TableHeader
              label={logo.download.split(".").pop() ?? ""}
              right={`[${pad(index + 1)}]`}
              className="col-span-full"
            />
            <figure className="col-span-full bg-fg px-1 pb-1 text-surface min-[760px]:col-[1/7]">
              <figcaption className="flex h-5 items-center gap-2 px-1 font-mono text-[10px] uppercase leading-none">
                <span className="shrink-0">[ Fig. {index + 1} ]</span>
                <span
                  aria-hidden
                  className="h-[7px] flex-1 bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_3px)]"
                />
              </figcaption>
              <div className={cn("relative grid place-items-center", logo.plate)} style={{ aspectRatio: "302 / 252" }}>
                <span aria-hidden className="halftone absolute inset-0 opacity-10" />
                <div className="relative size-[46%]">
                  <Image src={logo.src} alt={logo.alt} fill sizes="(min-width: 760px) 12vw, 40vw" className="object-contain" />
                </div>
              </div>
            </figure>
            <div className="col-span-full flex flex-col items-start gap-4 min-[760px]:col-[7/13]">
              <h3 className={LAB_TEXT.post}>{logo.title}</h3>
              <p className={LAB_TEXT.sm}>{logo.note}</p>
              <LabTag>{logo.download}</LabTag>
              <Button asChild variant={logo.variant} size="sm" className="mt-2">
                <a href={logo.href} download={logo.download} data-cursor-label="DOWNLOAD">
                  {logo.cta} <span aria-hidden>↓</span>
                </a>
              </Button>
            </div>
          </article>
        ))}
      </PressSection>

      {/* §02 palette rows, click a swatch to copy (announced politely) */}
      <PressSection index={1}>
        <LabCell>
          <LabTitle id="color-palettes-title" count={colorPaletteRows.length}>
            Color Palettes
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>
            Click any color swatch to copy its HEX value. We default to Burgundy and Plum tones.
          </p>
        </LabCell>
        <Palette rows={colorPaletteRows} />
      </PressSection>

      {/* §03 type specimens as two halves */}
      <PressSection index={2}>
        <LabCell>
          <LabTitle id="typography-title" className={WRAP}>
            Typography Specimens
          </LabTitle>
        </LabCell>
        <LabCell span="1/15">
          <p className={LAB_TEXT.lg}>
            Our identity uses robust Helvetica Now headings combined with traditional Georgia Pro body elements.
          </p>
        </LabCell>
        <article className={HALF}>
          <TableHeader as="h3" label="PRIMARY / DISPLAY FONT" right="HELVETICA NOW" className="col-span-full" />
          <p className={cn(WIDE, "col-span-full text-[clamp(40px,5vw,84px)] uppercase leading-[0.88]")}>
            HEADING DISPLAY SPECIMEN
          </p>
          <p className={cn(LAB_TEXT.sm, "col-span-full min-[760px]:col-[1/11]")}>
            Use heavier Helvetica Now weights for headings, events banner titles, and action items. Bold, striking, and
            confident.
          </p>
        </article>
        <article className={cn(HALF, DIVIDER)}>
          <TableHeader as="h3" label="SECONDARY / BODY FONT" right="GEORGIA PRO" className="col-span-full" />
          <p className="col-span-full font-serif text-[clamp(22px,2.2vw,32px)] italic leading-snug">
            &quot;This is a specimen of Georgia Pro. We use it for long-form reading, paragraphs, team profiles, and
            descriptive documentation.&quot;
          </p>
          <p className="col-span-full font-serif text-base leading-relaxed min-[760px]:col-[1/11]">
            Traditional, highly readable, and grounds the visual design in narrative clarity.
          </p>
        </article>
      </PressSection>

      {/* §04 about + numbers + public facts */}
      <PressSection index={3}>
        <LabCell>
          <LabTitle id="about-title">About bits&amp;bytes™</LabTitle>
        </LabCell>
        <LabCell span="1/18">
          <p className={LAB_TEXT.md}>
            bits&amp;bytes™ is an independent, youth-led builder network that runs hackathons, developer meetups,
            open-source squads, and cohort-based programs. Founded in November 2025 after a major partner hackathon was
            cancelled, the team built a durable student-led alternative where teenagers ship real software, learn in
            public, and organize with serious safety standards.
          </p>
        </LabCell>
        <ul role="list" className="col-span-full mt-6 grid grid-cols-subgrid gap-y-8">
          {stats.map((stat) => (
            <li key={stat.label} className="col-span-4 grid content-start gap-3 min-[760px]:col-span-6">
              <TableHeader label={stat.label} />
              <p className="whitespace-nowrap font-sans text-[clamp(36px,4.2vw,72px)] font-light leading-[0.9] tracking-[-0.06em]">
                {stat.href ? (
                  <LabLink href={stat.href} className="group/mark">
                    <span className={LAB_MARKER}>{stat.value}</span>
                  </LabLink>
                ) : (
                  stat.value
                )}
              </p>
            </li>
          ))}
        </ul>
        <TableHeader as="h3" label="Public Facts" count={publicFacts.length} className="col-span-full mt-10" />
        <dl className="col-span-full grid grid-cols-subgrid">
          {publicFacts.map((fact) => (
            <div
              key={fact.key}
              className="col-span-full grid grid-cols-subgrid gap-y-1 border-b border-dotted border-line py-3"
            >
              <dt className="col-span-full font-mono text-[11px] uppercase leading-[1.4] min-[760px]:col-[1/7]">
                {fact.key}
              </dt>
              <dd className={cn(LAB_TEXT.sm, "col-span-full min-[760px]:col-[7/-1]")}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </PressSection>

      {/* §05 usage rules as a feed of static rows */}
      <PressSection index={4}>
        <LabCell>
          <LabTitle id="usage-rules-title" count={usageRules.length}>
            Usage Rules
          </LabTitle>
        </LabCell>
        <LabCell span="1/18">
          <p className={LAB_TEXT.md}>
            Press and partners may use official assets for accurate coverage of bits&amp;bytes™. Co-branded materials,
            merch, sponsorship announcements, and anything implying endorsement need written approval.
          </p>
        </LabCell>
        <LabFeed labels={["No.", "Rule"]}>
          {usageRules.map((rule, index) => (
            <LabIndexRow key={rule} label={`R.${pad(index + 1)}`}>
              {rule}
            </LabIndexRow>
          ))}
        </LabFeed>
      </PressSection>

      {/* §06 directory + sticky contact console */}
      <PressSection index={5}>
        <LabCell>
          <LabTitle id="media-contact-title">Media Contact</LabTitle>
        </LabCell>
        <div className="col-span-full grid content-start gap-12 lg:col-[1/15]">
          <PeopleTable title="Executive Leadership" people={executiveLeadership} />
          <PeopleTable title="Department Leads" people={departmentLeads} />
        </div>
        <div className="col-span-full lg:col-[16/25]">
          <ConsoleWindow title="Contact" className={LAB_STICKY} bodyClassName="p-5 md:p-7">
            <p className={LAB_TEXT.sm}>
              For press inquiries, brand permissions, partnership queries, or logo authorization:
            </p>
            <LabLink
              href="mailto:hello@gobitsnbytes.org"
              className={cn(LAB_TEXT.post, "group/mark mt-4 block break-all")}
            >
              <span className={LAB_MARKER}>hello@gobitsnbytes.org</span>
            </LabLink>
            <div className="mt-6">
              <TableHeader as="h3" label="Boilerplate for Journalists" />
              <p className="mt-3 select-all font-serif text-base italic leading-relaxed">
                &quot;bits&amp;bytes™ is an independent, student-led youth builder network operated by GOBITSNBYTES
                FOUNDATION (Section 8 non-profit). Founded in Lucknow, India, it connects 1,400+ teenage developers to ship
                real-world software and run independent hackathons.&quot;
              </p>
            </div>
          </ConsoleWindow>
        </div>
      </PressSection>

      {/* §07 citation + backlink snippets in console chrome, then the outlined closing word */}
      <section
        id={chapters[6].id}
        data-cinematic-section=""
        data-cinematic-title={chapters[6].title}
        data-surface="paper"
        aria-labelledby="citations-title"
        className="pt-24 min-[760px]:pt-[136px]"
      >
        <LabGrid className="gap-y-10">
          <LabCell>
            <LabTitle id="citations-title" className={WRAP}>
              Citations &amp; Digital PR Guidelines
            </LabTitle>
          </LabCell>
          <LabCell span="1/15">
            <p className={LAB_TEXT.lg}>
              When citing bits&amp;bytes™ research, event metrics, or brand publications, please use the standard
              citations below:
            </p>
          </LabCell>
          <LabCell span="1/13">
            <ConsoleWindow title="APA Citation Format" bodyClassName="p-4">
              <p className={CODE}>
                GOBITSNBYTES FOUNDATION. (2026). India Youth Tech &amp; Builder Research Metrics. bits&amp;bytes™.
                https://gobitsnbytes.org/impact
              </p>
            </ConsoleWindow>
          </LabCell>
          <LabCell span="13/-1">
            <ConsoleWindow title="BibTeX Format" bodyClassName="p-4">
              <pre className={CODE}>
{`@misc{bitsnbytes2026,
  author = {GOBITSNBYTES FOUNDATION},
  title = {bits&bytes: India's Teen Builder Network},
  year = {2026},
  publisher = {GOBITSNBYTES FOUNDATION},
  url = {https://gobitsnbytes.org}
}`}
              </pre>
            </ConsoleWindow>
          </LabCell>

          <LabCell className="mt-16 min-[760px]:mt-24">
            <TableHeader label="Digital PR" />
          </LabCell>
          <LabCell span="1/19">
            <h2 className={LAB_TEXT.title}>Embed Badges &amp; Link to Us (Backlink Kit)</h2>
          </LabCell>
          <LabCell span="1/15">
            <p className={LAB_TEXT.sm}>
              Are you a partner, student builder, event organizer, or tech blogger? Add our official badge to your GitHub
              README or site to link back to bits&amp;bytes™.
            </p>
          </LabCell>
          <LabCell span="1/13">
            <ConsoleWindow title="Markdown Logo Link (GitHub READMEs)" bodyClassName="p-4">
              <p className={CODE}>{`[![bits&bytes™ logo](https://gobitsnbytes.org/logo)](https://gobitsnbytes.org)`}</p>
              <p className={cn(LAB_TEXT.xs, "mt-3 text-fg/80")}>
                Copy and paste into your project README.md file to link to us.
              </p>
            </ConsoleWindow>
          </LabCell>
          <LabCell span="13/-1">
            <ConsoleWindow title="HTML Logo Badge (Websites & Blogs)" bodyClassName="p-4">
              <p className={CODE}>
                {`<a href="https://gobitsnbytes.org" target="_blank" rel="noopener"><img src="https://gobitsnbytes.org/logo" alt="bits&bytes™ - India's Youth Builder Network" height="36" /></a>`}
              </p>
              <p className={cn(LAB_TEXT.xs, "mt-3 text-fg/80")}>
                Copy and paste into your website footer or partner section.
              </p>
            </ConsoleWindow>
          </LabCell>
        </LabGrid>
        <HollowWord text="Press kit" />
      </section>

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

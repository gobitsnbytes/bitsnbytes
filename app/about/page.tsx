import { EditionOpener, ChapterHero, SerifStatement, EDITION_GUTTER } from "@/components/edition";
import { Tag, TornEdge } from "@/components/riot";
import { WIDE } from "@/components/chrome/wordmark";
import { aboutContent, coreTeam } from "@/components/about/data";
import { OriginTimeline } from "@/components/about/origin-timeline";
import { Team } from "@/components/about/team";
import { Governance } from "@/components/about/governance";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: "origin", title: aboutContent.sections[0].title },
  { id: "beliefs", title: "Core Beliefs" },
  { id: "team", title: "Meet The Agents" },
  { id: "governance", title: "Governance" },
];

// Principles: the first sentence becomes the serif statement, the rest follows as body (both verbatim).
const principles = aboutContent.sections.slice(1).map(({ title, description }) => {
  const cut = description.indexOf(". ") + 1;
  return { title, statement: description.slice(0, cut), rest: description.slice(cut).trim() };
});

const pad = (n: number) => String(n).padStart(2, "0");

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: coreTeam.map((member, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        image: `https://gobitsnbytes.org${member.image}`,
        worksFor: {
          "@type": "Organization",
          name: "bits&bytes™",
          legalName: "GOBITSNBYTES FOUNDATION",
          url: "https://gobitsnbytes.org",
        },
        sameAs: Object.values(member.socials || {}).filter(Boolean),
      },
    })),
  },
};

export default function About() {
  return (
    <>
      <div data-tour="page-hero">
        <EditionOpener
          variant="static"
          title={aboutContent.title}
          kicker="[S.00] Builder Network"
          chapters={CHAPTERS}
        />
      </div>

      <TornEdge from="ink" to="paper" />
      <div data-surface="paper" className="tone-paper">
        <div className={cn("px-4 py-20 md:px-8 md:py-28", EDITION_GUTTER)}>
          <p
            data-speakable="true"
            data-citation="true"
            className="max-w-[34ch] font-serif text-[clamp(26px,3.2vw,48px)] leading-[1.15] tracking-[-0.01em]"
          >
            {aboutContent.description}
          </p>
          <ul className="mt-10 flex flex-wrap gap-3">
            {aboutContent.highlights.map((highlight) => (
              <li key={highlight}>
                <Tag tone="cream">{highlight}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <OriginTimeline />

      <TornEdge from="paper" to="ink" />
      <ChapterHero
        id="beliefs"
        number={2}
        title="Core Beliefs"
        kicker={`Principles [${pad(principles.length)}]`}
        art={{ src: "/event_pictures/HEe923uagAATqvy.jpg", alt: "Two builders wiring a hardware prototype at a bits&bytes™ hackathon" }}
      />
      <TornEdge from="ink" to="paper" />

      <div data-surface="paper" className="tone-paper pb-12 md:pb-20">
        {principles.map((principle, i) => (
          <article key={principle.title} aria-labelledby={`belief-${i}`} className="pt-16 md:pt-24">
            <header className={cn("px-4 md:px-8", EDITION_GUTTER)}>
              <div className="flex items-baseline gap-4 border-t-3 border-line pt-4">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">[P.{pad(i + 1)}]</span>
                <h3 id={`belief-${i}`} className={cn(WIDE, "text-[clamp(32px,5vw,80px)] uppercase leading-[0.88]")}>
                  {principle.title}
                </h3>
              </div>
            </header>
            <SerifStatement className="py-10 md:py-14">{principle.statement}</SerifStatement>
            {principle.rest ? (
              <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
                <p className="max-w-[52ch] font-serif text-lg leading-relaxed md:ml-[38%] md:text-xl">{principle.rest}</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <Team />

      <TornEdge from="paper" to="ink" />
      <Governance />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
    </>
  );
}

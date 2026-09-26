import Link from "next/link";

import { WIDE } from "@/components/chrome/wordmark";
import { Breadcrumbs } from "@/components/breadcrumb";
import { EDITION_GUTTER, EditionOpener, SerifStatement } from "@/components/edition";
import { CHAPTERS, IMPACT_LEDE, IMPACT_TITLE, exploreLinks } from "@/components/impact/content";
import { CultureChapter } from "@/components/impact/culture-chapter";
import { GlobeChapter } from "@/components/impact/globe-chapter";
import { ImpactRecord } from "@/components/impact/impact-record";
import { SpotlightWall } from "@/components/impact/spotlight-wall";
import { Chapter, TornEdge } from "@/components/riot";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");
const explore = CHAPTERS[4];

export default function Impact() {
  return (
    <>
      <EditionOpener
        title={IMPACT_TITLE}
        kicker="Impact Record · GOBITSNBYTES FOUNDATION"
        chapters={[...CHAPTERS]}
        art={{ src: "/event_pictures/HEe923uagAATqvy.jpg", alt: "India Innovates 2026 archive" }}
      />
      <TornEdge from="ink" to="paper" />
      <div data-surface="paper" className="tone-paper">
        <div className={cn("px-4 pt-10 md:px-8 md:pt-14", EDITION_GUTTER)}>
          <Breadcrumbs items={[{ name: "Our Impact", href: "/impact" }]} className="mb-0" />
        </div>
        <SerifStatement className="pb-10 pt-12 md:pb-16 md:pt-20">
          <span data-speakable="true" data-citation="true">
            {IMPACT_LEDE}
          </span>
        </SerifStatement>
      </div>
      <ImpactRecord />
      <TornEdge from="paper" to="ink" />
      <SpotlightWall />
      <TornEdge from="ink" to="cream" />
      <GlobeChapter />
      <TornEdge from="cream" to="ink" />
      <CultureChapter />
      <TornEdge from="paper" to="orange" />

      <Chapter id={explore.id} title={explore.title} number={5} tone="orange" className="py-20 md:py-32">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <div className="grid gap-6 border-b-3 border-line pb-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">
                §05 — [{pad(exploreLinks.length)}]
              </p>
              <h2 className={cn(WIDE, "mt-2 text-[clamp(40px,6.4vw,104px)] uppercase leading-[0.86] tracking-[-0.03em]")}>
                {explore.title}
              </h2>
            </div>
            <p className="max-w-[40ch] font-serif text-lg md:text-xl">
              Learn about our events, local chapters, and press guidelines.
            </p>
          </div>
          <ul>
            {exploreLinks.map((link) => (
              <li key={link.href} className="border-b-3 border-line">
                <Link
                  href={link.href}
                  className="group relative flex items-center justify-between gap-6 overflow-hidden px-2 py-5 md:px-4 md:py-7"
                >
                  {/* buttermax fill wipe: ink panel drops in from the top on hover / keyboard focus */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-top scale-y-0 bg-ink transition-transform duration-[450ms] ease-[cubic-bezier(.215,.61,.355,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
                  />
                  <span className="relative font-display text-[clamp(44px,8vw,128px)] uppercase leading-[0.9] group-hover:text-orange group-focus-visible:text-orange">
                    {`${link.label} →`}
                  </span>
                  <span className="relative font-mono text-xs font-bold uppercase tracking-[0.2em] group-hover:text-cream group-focus-visible:text-cream">
                    {link.href}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>
    </>
  );
}

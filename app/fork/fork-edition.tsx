import { CubeMark, WIDE } from "@/components/chrome/wordmark";
import {
  ChapterHero,
  DuotoneImage,
  EDITION_GUTTER,
  EditionOpener,
  FeedList,
  FeedRow,
  IndentStatement,
  SerifStatement,
} from "@/components/edition";
import { Button, Chapter, ChapterHead, TornEdge } from "@/components/riot";
import { Character } from "@/components/character/character";
import { FORKS } from "@/lib/forks";
import { cn } from "@/lib/utils";

// Real photos of the crew and community building together, never generic art. One list: [0] opener, [1] "own the
// room" hero, the rest print as the strip under the git one-liner.
const PHOTOS = [
  { src: "/event_pictures/h4g/h4g3.jpg", alt: "The crew huddled around a laptop at Hack4Good v0" },
  { src: "/event_pictures/h4g/h7g.jpeg", alt: "The room building together at Hack4Good v0" },
  { src: "/event_pictures/HEe923uagAATqvy.jpg", alt: "Two builders wiring a hardware prototype at India Innovates 2026" },
  { src: "/event_pictures/byteforge4.webp", alt: "Three participants working at one laptop in front of a chalkboard, Execron 1.0" },
  { src: "/event_pictures/byteforge5.webp", alt: "Execron 1.0 participants posing for a group photo in a classroom" },
];

const HOW_IT_WORKS = [
  ["01", "one city", "One fork per city."],
  ["02", "student-led", "Students run it, always."],
  ["03", "local identity", "Your city's name, the same mission."],
  ["04", "ship publicly", "Something public within 90 days."],
  ["05", "core support", "Help from upstream, no hand-holding."],
];

const BENEFITS = [
  "brand resources",
  "fork playbook",
  "website structure",
  "council support",
  "launch kit",
  "templates + assets",
];

const COVENANT = [
  {
    title: "1. Upstream Governance",
    body: "Forks are operational subunits recognized by the Board. GOBITSNBYTES FOUNDATION is the upstream steward. Forks have no independent legal personality.",
    span: "lg:col-span-7",
  },
  {
    title: "2. Centralized Financial Routing",
    body: "All funds must route upstream to GOBITSNBYTES FOUNDATION. Local bank accounts, personal UPI IDs, or cash collections are strictly prohibited.",
    span: "lg:col-span-6",
  },
  {
    title: "3. No Unapproved Representation",
    body: "Fork Leads and Maintainers are local facilitators and do not hold statutory authority, directorship, or the power to bind the Foundation legally.",
    span: "lg:col-span-6",
  },
];

const CHAPTERS = [
  { id: "fork", title: "bits&bytes™ forks" },
  { id: "how-it-works", title: "how it works" },
  { id: "forks", title: "own the room." },
  { id: "what-forks-get", title: "what forks get" },
  { id: "apply", title: "lead your city's fork." },
];

const pad = (n: number) => String(n).padStart(2, "0");
const RULE = "pointer-events-none absolute bg-cream/35";

/** Top + left hairline of a construction-grid cell (the grid closes its own right + bottom). */
function Rules() {
  return (
    <>
      <span aria-hidden className={cn(RULE, "left-0 top-0 h-px w-full")} />
      <span aria-hidden className={cn(RULE, "left-0 top-0 h-full w-px")} />
    </>
  );
}

/** /fork as an Edition: static opening frame, then five chapters on the /about rhythm. */
export function ForkEdition({ applyUrl }: { applyUrl: string }) {
  return (
    <>
      {/* Long title: smaller than the kit default so it keeps 3-4 lines inside the frame on 650px-tall screens. */}
      <EditionOpener
        variant="static"
        title="no student tech scene in your city? fork one."
        kicker="[S.00] Fork Network"
        chapters={CHAPTERS}
        h1Props={{ style: { fontSize: "min(56px, 9.5cqi, 6svh)" } }}
        art={PHOTOS[0]}
      />

      <TornEdge from="ink" to="paper" />
      <div data-surface="paper" className="tone-paper">
        <p
          className={cn(
            "px-4 pt-20 font-serif text-[clamp(26px,3.2vw,48px)] leading-[1.15] tracking-[-0.01em] md:px-8 md:pt-28",
            EDITION_GUTTER,
          )}
        >
          Build with people.
          <br />
          Ship publicly.
        </p>
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <div className="relative">
          <p className="mt-8 max-w-[52ch] font-serif text-lg leading-relaxed md:text-xl">
            On GitHub, a fork is your own copy of an upstream repo: you change it, run it your way, and it stays linked
            to the original so work flows back. A bits&amp;bytes™ fork is the same thing for a city or school. You take
            the playbook and brand from upstream, run your own room, and ship the work back.
          </p>
            <Character
              pose="fork"
              sizes="(min-width: 1024px) 170px, 0px"
              className="absolute bottom-0 right-0 hidden w-[clamp(120px,11vw,170px)] lg:block"
            />
          </div>
          <ul className="mt-12 grid gap-2 sm:grid-cols-3">
            {PHOTOS.slice(2).map((photo) => (
              <li key={photo.src}>
                <DuotoneImage {...photo} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/3]" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <IndentStatement id={CHAPTERS[0].id} number={1} label={CHAPTERS[0].title} className="pt-12 md:pt-20">
        Not a franchise. Not a branch office. A fork: your copy of upstream, and the work flows back.
      </IndentStatement>

      <Chapter id={CHAPTERS[1].id} title={CHAPTERS[1].title} number={2} tone="paper" className="pt-0 md:pt-0">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <ChapterHead number={2} label={`[${pad(HOW_IT_WORKS.length)}]`} title={CHAPTERS[1].title} />
          <ol>
            {HOW_IT_WORKS.map(([number, title, line]) => (
              <li
                key={number}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 border-b-2 border-line py-5 md:grid-cols-[6rem_minmax(0,1.2fr)_minmax(0,1fr)] md:py-6"
              >
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-signal">[{number}]</span>
                <h3 className="font-display text-[clamp(36px,min(6vw,10svh),96px)] uppercase leading-[0.9]">{title}</h3>
                <p className="col-start-2 font-serif text-xl italic md:col-start-auto md:text-[clamp(20px,2vw,30px)]">
                  {line}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      <TornEdge from="paper" to="ink" />
      <ChapterHero
        id={CHAPTERS[2].id}
        number={3}
        title={CHAPTERS[2].title}
        kicker="Forks [live]"
        art={PHOTOS[1]}
      />
      <TornEdge from="ink" to="paper" />

      <div data-surface="paper" className="tone-paper pb-20 md:pb-28">
        <SerifStatement>
          A fork gives your city a reason to gather, and a public record of the people who built something there.
        </SerifStatement>
        {/* The old fork-manifest editor, printed as a spec sheet: one row per manifest. */}
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <p className="flex justify-between gap-4 pb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
            <span className="text-signal">fork-manifest</span>
            {/* Forks are named, never counted. */}
            <span>json [live]</span>
          </p>
          <FeedList>
            {FORKS.map((fork) => {
              const node = fork.city.toLowerCase();
              return (
                <FeedRow
                  key={node}
                  date={<span className="normal-case">{`${node}.json`}</span>}
                  title={fork.city}
                  meta={
                    <span className="normal-case">
                      {`"node": "bitsnbytes/${node}"${fork.lead ? `, "lead": "${fork.lead}"` : ""}`}
                    </span>
                  }
                />
              );
            })}
          </FeedList>
        </div>
      </div>

      <TornEdge from="paper" to="orange" />
      <Chapter id={CHAPTERS[3].id} title={CHAPTERS[3].title} number={4} tone="orange">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <ChapterHead number={4} label={`[${pad(BENEFITS.length)}]`} title={CHAPTERS[3].title} />
          <ul className="grid border-l-2 border-t-2 border-line sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((item, i) => (
              <li
                key={item}
                className="flex min-h-[clamp(120px,22svh,200px)] flex-col justify-between gap-6 border-b-2 border-r-2 border-line p-5 md:p-6"
              >
                <span aria-hidden className="font-mono text-[11px] font-bold tracking-[0.2em]">
                  [{pad(i + 1)}]
                </span>
                <span className="font-display text-[clamp(32px,min(4vw,7svh),60px)] uppercase leading-[0.9]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>

      <TornEdge from="orange" to="ink" />
      <Chapter id={CHAPTERS[4].id} title={CHAPTERS[4].title} number={5} tone="ink" className="pb-24 md:pb-32">
        <div className={cn("px-4 md:px-8", EDITION_GUTTER)}>
          <ChapterHead
            number={5}
            label="Apply"
            title={CHAPTERS[4].title}
            description="Apply if you can get people into one room and ship something in public."
          />

          {/* The covenant as a construction grid (the /about governance grid, static hairlines). */}
          <div className="relative grid lg:grid-cols-12">
            <div className="relative flex min-h-48 flex-col justify-between gap-8 p-6 lg:col-span-5 lg:p-8">
              <Rules />
              <svg
                aria-hidden
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 size-full stroke-cream/35"
              >
                <line x1="0" y1="100" x2="100" y2="0" vectorEffect="non-scaling-stroke" strokeWidth={1} />
              </svg>
              <h3 className="relative font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-orange">
                The Fork Covenant / Rules
              </h3>
              <CubeMark className="relative size-16 text-cream md:size-20" />
            </div>

            {COVENANT.map((rule) => (
              <div key={rule.title} className={cn("relative p-6 lg:p-10", rule.span)}>
                <Rules />
                <h4 className={cn(WIDE, "text-[clamp(22px,min(2.6vw,5svh),40px)] uppercase leading-[0.95] text-cream")}>
                  {rule.title}
                </h4>
                <p className="mt-4 max-w-[60ch] font-serif text-base leading-relaxed text-paper/85 md:text-lg">{rule.body}</p>
              </div>
            ))}

            <div className="relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between lg:col-span-12 lg:p-10">
              <Rules />
              <p className={cn(WIDE, "text-[clamp(28px,min(4vw,7svh),56px)] leading-none text-cream")}>bits&amp;bytes™ forks</p>
              <Button asChild variant="orange" size="lg">
                <a href={applyUrl}>apply now</a>
              </Button>
            </div>

            {/* closing right + bottom rules */}
            <span aria-hidden className={cn(RULE, "bottom-0 left-0 h-px w-full")} />
            <span aria-hidden className={cn(RULE, "right-0 top-0 h-full w-px")} />
          </div>
        </div>
      </Chapter>
    </>
  );
}

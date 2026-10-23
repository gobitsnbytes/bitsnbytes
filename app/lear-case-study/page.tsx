import type { Metadata } from "next";
import Image from "next/image";

import { RunStrip } from "./run-strip";

// Standalone case study. Not linked anywhere, noindex, disallowed in robots, kept out of the sitemap,
// rendered without the site chrome (see components/site-chrome.tsx). runs.json is `gh run list` on
// gobitsnbytes/motherboard: [date, failed, title] for every completed CI/CD run.
export const metadata: Metadata = {
  title: "Lear on motherboard · a bits&bytes™ case study",
  description: "What happened when we handed motherboard's CI failures and production recoveries to Lear for a month.",
  robots: { index: false, follow: false },
};

// own palette vars: globals.css repaints hex utility classes under .dark
const PALETTE = {
  "--ink": "#120f0a", "--ink-2": "#413f3b", "--mute": "#716f6c", "--paper": "#faf8f5", "--paper-2": "#eae8e4",
  "--cream": "#fee9cf", "--orange": "#fc920d", "--burgundy": "#97192c", "--burgundy-dk": "#791423",
  "--warm": "#c94218", "--slime": "#12e29b",
} as React.CSSProperties;

const anton = "font-[family-name:var(--font-accent-sans)] uppercase";
const wide = "font-[family-name:var(--font-archivo)] font-black [font-stretch:125%]";
const mono = "font-mono text-[11px] font-bold uppercase tracking-[.16em] sm:text-xs";

const FACTS = [
  ["client", "bits&bytes™ (GoBitsnBytes Foundation)"],
  ["system", "motherboard, our internal operations platform"],
  ["stack", "Next.js 15 on Vercel, FastAPI and Postgres 16 on one VPS, Redis, a Discord bot"],
  ["people on it", "about 100 users, 15–20 sign in on a normal day, 20 city forks"],
  ["pilot", "one month, on production"],
  ["what Lear did", "CI/CD investigation and production recovery, end to end"],
];

const STATS = [
  { n: "2–3 h", l: "of an engineer's day saved on every incident" },
  { n: "80", l: "failed CI/CD runs on record, out of 212" },
];

const BEFORE = [
  "a user or a city lead tells us something is broken",
  "we check it isn't a user-side problem",
  "someone opens Sentry and pulls the trace",
  "it goes to whoever is free, often an intern",
  "reproduce, patch, push, wait for CI and the deploy",
  "Akshat reviews the change",
];

type Incident = { era: string; title: string; log: string; broke: string; fix: string };

const INCIDENTS: Incident[] = [
  {
    era: "discord bot",
    title: "the bot that died on boot",
    log: "fix: remove duplicate code block in commands/merge.js causing syntax crash",
    broke: "A copy-paste left the same block twice in one command file. The Discord bot is how most of our people reach motherboard, and it would not start.",
    fix: "Lear read the crash, found the duplicated block, removed it and restarted the bot.",
  },
  {
    era: "discord bot",
    title: "meetings that never ended",
    log: "fix(recovery): resolve infinite stale meeting recovery loop",
    broke: "The bot records and transcribes our calls. A dropped voice connection crashed it on teardown, and the recovery job kept reviving the same stale meeting forever.",
    fix: "Lear guarded the connection teardown, made the recovery job use the real database meeting ID so a finished meeting stays finished, and stretched the transcription timeouts for long calls.",
  },
  {
    era: "first deploy",
    title: "eleven red runs in one afternoon",
    log: "fix(deploy): update database url template to use ssl=require instead of sslmode",
    broke: "The day the automated VPS deploy went in, it failed eleven times: SSH clone keys, uv missing from PATH, sudo blocked, an asyncpg-incompatible database URL, pytest running from the wrong folder, a deploy script that wasn't executable.",
    fix: "Lear worked through them one at a time against the actual runner output until the pipeline went green, and wrote the VPS workarounds down so nobody rediscovers them.",
  },
  {
    era: "database",
    title: "we ran out of database",
    log: "asyncpg.exceptions.InternalServerError: Your account or project has exceeded the compute time quota.",
    broke: "Our hosted Postgres plan hit its compute quota. Deploys failed mid-migration and the bot's frequent meeting queries were burning through what was left.",
    fix: "Lear put a local SQLite mirror cache in front of the bot's reads, and the database moved onto our own VPS as a Postgres 16 container. Meanwhile the deploy's automatic rollback kept the previous version serving.",
  },
  {
    era: "community PR",
    title: "a conflict marker in production code",
    log: ">>>>>>> origin/prod    SyntaxError: invalid syntax (app/db/models.py, line 1618)",
    broke: "A large contributor PR merged with an unresolved conflict marker in the models file. Nothing could even import. Fixing it exposed the next layer: tests sharing state, two Alembic heads, a date format that only worked on Linux. 21 red runs in one day.",
    fix: "Lear peeled them off in order: the marker, per-test database isolation, one linear migration chain, a cross-platform date format.",
  },
  {
    era: "migrations",
    title: "the schema and the models disagreed",
    log: 'relation "ca_contracts" already exists · column "created_at" of relation "memberships" does not exist',
    broke: "The app quietly created missing tables on startup, so Alembic would later find tables it expected to create, or miss columns the code assumed. Deploys failed at the migration step.",
    fix: "Lear took table creation out of startup so Alembic is the only thing that changes the schema, and added `alembic check` to CI so drift fails the build instead of the deploy.",
  },
  {
    era: "deploys",
    title: "an import that never reached users",
    log: "ImportError: cannot import name 'OptionalUserDep' · Health check failed after 15 attempts.",
    broke: "A fix referenced a dependency that didn't exist yet. The new worker crashed before it could serve a request.",
    fix: "The blue/green deploy rolled back on its own and the old worker kept serving. Lear found the missing symbol, shipped it, and watched the next candidate pass health checks before cutover.",
  },
  {
    era: "VPS",
    title: "permission denied, twice",
    log: "error: cannot open .git/FETCH_HEAD: Permission denied",
    broke: "The deploy user and the service users kept fighting over who owned what. First git couldn't write the checkout, later the bot couldn't write its own SQLite database.",
    fix: "Lear backed up the database, repaired ownership narrowly, verified a write with rollback, and changed the deploy to hand files back to the real systemd runtime user after every checkout.",
  },
  {
    era: "VPS",
    title: "a reboot pointed nginx at nothing",
    log: "MOTHERBOARD-BACKEND-8 · GET /api/openapi.json 500",
    broke: "Blue/green switched ports but left the old unit enabled, so a VPS reboot could bring nginx back pointing at a port with no API behind it. Separately, one plugin broke the OpenAPI schema for everyone.",
    fix: "Lear made cutover enable the live unit and disable the old one, fixed the plugin, and added the OpenAPI schema to candidate validation, so a broken schema rolls back before it takes traffic.",
  },
  {
    era: "tests",
    title: "tests racing each other",
    log: "sqlite3.OperationalError: table routing_pool_members already exists",
    broke: "Once the suite ran in parallel, workers shared one SQLite file and tripped over each other's setup. Failures were random.",
    fix: "Lear gave every pytest worker its own database file.",
  },
  {
    era: "integrations",
    title: "the review button that returned 500",
    log: "[CLOUD_AUTH] Error posting to Discord: module 'httpx' has no attribute 'json'",
    broke: "Cloud access requests post an interactive review message to Discord. One wrong call turned every request into a 500.",
    fix: "Lear switched to the right serializer, moved the message to the Bot API so the buttons actually render, and kept the regression test.",
  },
  {
    era: "now",
    title: "the quiet ones Sentry catches",
    log: "MOTHERBOARD-BACKEND-A · CancelledError in legal inbox polling",
    broke: "Scheduled jobs reported errors every time a deploy shut them down. Redis pub/sub dropped and never noticed. A public health check timed out once on a healthy release.",
    fix: "Lear taught the jobs that shutdown is normal, made the event bus probe its own socket and resubscribe, and added one retry before a rollback.",
  },
];

function Chapter({ n, label, title, children, className = "" }: { n: string; label: string; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section aria-labelledby={`ch-${n}`} className={`border-t-[3px] border-[var(--ink)] py-16 sm:py-24 ${className}`}>
      <div className={`${mono} text-[var(--burgundy)]`}>§{n} · {label}</div>
      <h2 id={`ch-${n}`} className={`${anton} mt-3 text-[clamp(40px,7vw,104px)] leading-[.92]`}>{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Quote({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return (
    <figure className="max-w-4xl">
      <blockquote className={`font-serif italic leading-[1.12] ${small ? "text-[clamp(22px,2.6vw,34px)]" : "text-[clamp(28px,4.4vw,64px)]"}`}>
        {children}
      </blockquote>
      <figcaption className={`${mono} mt-6`}>Akshat Kushwaha · CTO, bits&amp;bytes™</figcaption>
    </figure>
  );
}

export default function LearCaseStudy() {
  return (
    <div className="lcs min-h-screen bg-[var(--paper)] text-[var(--ink)] [color-scheme:light]" style={PALETTE}>
      <style>{CSS}</style>

      {/* opening frame */}
      <header className="relative overflow-hidden bg-[linear-gradient(160deg,#1e0509_0%,#3c0a12_30%,#97192c_62%,#c94218_86%,#fc920d_100%)] text-[var(--cream)]">
        <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(circle,rgba(254,233,207,.12)_1.1px,transparent_1.5px)] [background-size:9px_9px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-center justify-between gap-4 border-b-2 border-[var(--cream)]/40 py-4">
            <a href="/" className="flex items-center gap-3" aria-label="bits&bytes™ home">
              <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" priority />
              <span className={mono}>bits&amp;bytes™</span>
            </a>
            <span className={`${mono} text-right opacity-80`}>case study<span className="hidden sm:inline"> · approved for sharing</span></span>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 pb-8 pt-8 sm:pt-12 lg:grid-cols-[1fr_minmax(0,42rem)] lg:items-end lg:gap-14">
            <div className="lg:col-span-2">
              <p className={`${mono} inline bg-[var(--ink)] px-2 py-1 [box-decoration-break:clone] leading-[2]`}>bits&amp;bytes™ × Lear · one-month pilot</p>
              <h1 className={`${wide} mt-6 text-[clamp(28px,8.6vw,124px)] uppercase [overflow-wrap:anywhere] leading-[.86] tracking-[-.035em] [text-shadow:5px_5px_0_#120f0a]`}>
                we stopped babysitting production
              </h1>
            </div>
            <p className="max-w-xl font-serif text-lg leading-relaxed sm:text-xl lg:col-start-2">
              Motherboard runs our outreach, signatures, onboarding and most of the internal work across the bits&amp;bytes™
              network. It used to break in ways that cost one of us an afternoon. For a month we let Lear, an autonomous SRE,
              own every failure end to end. This is what happened, including the parts that still need work.
            </p>
          </div>
        </div>

        <div className="relative bg-[var(--ink)] px-5 pb-6 pt-8 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <RunStrip />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* fact sheet + numbers */}
        <section aria-label="at a glance" className="grid gap-10 py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <dl className="border-[3px] border-[var(--ink)] bg-[var(--cream)] shadow-[6px_6px_0_var(--ink)]">
            {FACTS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b-2 border-[var(--ink)] px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_1fr]">
                <dt className={`${mono} pt-[3px] text-[var(--burgundy)]`}>{k}</dt>
                <dd className="font-serif text-[15px] leading-snug sm:text-base">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {STATS.map((s) => (
              <li key={s.n} className="border-t-[3px] border-[var(--ink)] py-5">
                <div className={`${anton} text-[clamp(52px,6vw,84px)] leading-[.9] text-[var(--burgundy)] [font-variant-numeric:tabular-nums]`}>{s.n}</div>
                <p className="mt-2 max-w-[28ch] font-serif text-base leading-snug text-[var(--ink-2)]">{s.l}</p>
              </li>
            ))}
          </ul>
        </section>

        <Chapter n="01" label="the system" title="what motherboard carries">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <p className="max-w-[60ch] font-serif text-lg leading-relaxed">
              bits&amp;bytes™ is a teen-led builder network with forks in cities across India. Motherboard is the software
              that holds it together: the outreach engine our teams use for inbound and outbound, the signature authority
              that sends and verifies agreements, the onboarding flow with guardian consent for minors, access control
              scoped to each city, a finance ledger, our mail, and the Discord bot most people reach all of it through.
            </p>
            <p className="max-w-[60ch] font-serif text-lg leading-relaxed">
              It is small by most standards. About a hundred people use it and fifteen or twenty sign in on a normal day.
              But a lot of what it does faces the public: a sponsor waiting on a contract, a parent signing a consent form,
              a city lead booking a call. When motherboard goes down, those stop, and nobody outside sees the reason.
              Until Lear, the engineering team was essentially one person and whoever had time that week.
            </p>
          </div>
        </Chapter>

        <Chapter n="02" label="before" title={<>the two-to-three<br className="hidden sm:block" /> hour loop</>}>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BEFORE.map((step, i) => (
              <li key={step} className="flex gap-4 border-[3px] border-[var(--ink)] bg-[var(--paper)] p-4 shadow-[3px_3px_0_var(--ink)]">
                <span className={`${anton} text-4xl leading-none text-[var(--burgundy)]`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[17px] leading-snug">{step}</span>
              </li>
            ))}
            <li className="flex items-center gap-4 border-[3px] border-[var(--ink)] bg-[var(--orange)] p-4 shadow-[3px_3px_0_var(--ink)] sm:col-span-2 lg:col-span-3">
              <span className={`${anton} text-4xl leading-none`}>07</span>
              <span className="font-serif text-[17px] font-bold leading-snug">it breaks again in a new way. back to step 05.</span>
            </li>
          </ol>
          <p className="mt-12 max-w-4xl font-serif text-[clamp(24px,3.2vw,44px)] italic leading-[1.15]">
            Sentry told us where it hurt. Someone still had to sit down, run the code, test it, deploy it, wait, and do it
            again. That was two to three hours an issue, and most of it was waiting.
          </p>
        </Chapter>

        <Chapter n="03" label="how it started" title="a message on linkedin">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <p className="max-w-[60ch] font-serif text-lg leading-relaxed">
              Aradhya from Lear messaged Akshat, our CTO, on LinkedIn. The pitch was simple: Lear watches your
              infrastructure, works out what broke with evidence it can cite, proposes one fix, ships it once a human
              approves that exact plan, checks the signals that raised the alarm, and rolls back if they don&apos;t clear.
              The team&apos;s answer was roughly &quot;let&apos;s use it and see how it goes.&quot;
            </p>
            <div className="border-l-[3px] border-[var(--burgundy)] pl-6">
              <div className={`${mono} text-[var(--burgundy)]`}>what we actually used</div>
              <ul className="mt-4 space-y-4 font-serif text-lg leading-snug">
                <li><b className="font-sans font-extrabold">CI/CD investigation.</b> Every red run: read the logs, find the cause, push the fix, wait for green.</li>
                <li><b className="font-sans font-extrabold">Recovery.</b> When production was down, get the whole thing back up and confirm it from outside.</li>
              </ul>
            </div>
          </div>
        </Chapter>

        <Chapter n="04" label="the record" title="twelve of the hardest">
          <p className="max-w-[62ch] font-serif text-lg leading-relaxed">
            During the pilot Lear took on the failures on motherboard&apos;s record, from the Discord bot&apos;s first crashes to
            the latest deploys. These are the twelve that hurt most. Each one names the real commit or log line it came from,
            and Lear owned all of them: diagnosis, the fix, the deploy and the check afterwards.
          </p>
          <ol className="mt-12 grid gap-8 md:grid-cols-2">
            {INCIDENTS.map((inc, i) => (
              <li key={inc.title} className="lcs-card flex min-w-0 flex-col border-[3px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]">
                <div className={`${mono} flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[var(--ink)] px-4 py-2 text-[var(--cream)]`}>
                  <span>inc-{String(i + 1).padStart(2, "0")} · {inc.era}</span>
                  <span className="flex items-center gap-2"><span aria-hidden className="h-2 w-2 bg-[var(--slime)]" />fixed by Lear</span>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className={`${anton} text-[clamp(26px,3vw,40px)] leading-[.95] [overflow-wrap:anywhere]`}>{inc.title}</h3>
                  <code className="mt-4 block break-words border-2 border-[var(--ink)] bg-[var(--cream)] px-3 py-2 font-mono text-[12.5px] leading-relaxed text-[var(--burgundy-dk)]">
                    {inc.log}
                  </code>
                  <div className="mt-5 grid gap-4 font-serif text-[16px] leading-relaxed">
                    <p><span className={`${mono} mr-2 text-[var(--mute)]`}>broke</span>{inc.broke}</p>
                    <p><span className={`${mono} mr-2 text-[var(--burgundy)]`}>lear</span>{inc.fix.split("`").map((s, j) => (j % 2 ? <code key={j} className="font-mono text-[14px]">{s}</code> : s))}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Chapter>
      </main>

      {/* ink poster: after */}
      <section aria-labelledby="ch-05" className="bg-[var(--ink)] text-[var(--cream)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className={`${mono} text-[var(--orange)]`}>§05 · after</div>
          <h2 id="ch-05" className={`${anton} mt-3 text-[clamp(40px,7vw,104px)] leading-[.92]`}>how we work now</h2>
          <div className="mt-12 grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <Quote>
              <span className="lcs-swash">M</span>ost of what I do now is write code without thinking about whether it&apos;ll
              break in prod. If something breaks, Lear will catch it and fix it. I get to spend my time on the logic and the product.
            </Quote>
            <div className="space-y-6 font-serif text-lg leading-relaxed text-[var(--cream)]/90">
              <p>
                On day one Lear felt like a coding agent with connectors bolted on. A month later it goes to the right places on
                its own: it probes the servers and the services, reads through the connectors, and gets to the cause.
              </p>
              <p>
                The biggest change isn&apos;t a number. When someone in a city fork says motherboard looks broken, we already
                know Lear is on it. It might take one try or several. Early on it sometimes missed things; that has become rare.
              </p>
            </div>
          </div>
          <div className="mt-20 border-t-2 border-[var(--cream)]/30 pt-14">
            <Quote small>
              The most valuable outcome has been faster diagnosis, and the peace of mind that I don&apos;t have to fix the
              production server myself anymore.
            </Quote>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter n="06" label="honestly" title="what isn't there yet" className="border-t-0">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="space-y-6 font-serif text-lg leading-relaxed">
              <p>
                The gap we feel most is context. Lear fixes what&apos;s in front of it well, but a senior SRE also carries
                what the organisation has learned: why a service is set up the way it is, which fixes we&apos;ve already
                tried, what not to touch on a Friday. Lear recently added organisation-level memory, which is meant to close
                exactly that gap. We haven&apos;t switched it on yet, and it&apos;s the thing we&apos;re most looking forward to
                trying.
              </p>
              <p>
                The other is stability. Lear changes every few days, and now and then a release that&apos;s great one day is a
                step back the next. At this stage, while the product is still being built and defined, that&apos;s fair, and
                it&apos;s why this is still a trial for us: a system used by about a hundred people, not ten thousand.
              </p>
              <p>
                We&apos;re happy to keep giving the Drufiy team our feedback and whatever else they need to build this. It&apos;s a
                very cool product, and they&apos;re doing great work on it.
              </p>
            </div>
            <div className="self-start border-[3px] border-[var(--ink)] bg-[var(--paper-2)] p-6 shadow-[6px_6px_0_var(--burgundy)]">
              <div className={`${mono} text-[var(--burgundy)]`}>what would make it permanent</div>
              <ul className="mt-5 space-y-5 font-serif text-lg leading-snug">
                <li><b className="font-sans font-extrabold">Organisation-level memory.</b> Lear remembering how we run things, so its calls start to look like a senior engineer&apos;s.</li>
                <li><b className="font-sans font-extrabold">A steadier release line.</b> Improvements that land without breaking what worked yesterday.</li>
                <li><b className="font-sans font-extrabold">Pay per fix.</b> We like Lear getting paid when it fixes a problem, not for attempts. If a fix takes ten tries, we pay for the fix.</li>
              </ul>
            </div>
          </div>
        </Chapter>

        <Chapter n="07" label="the fallback" title="if lear went away">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <p className="max-w-[60ch] font-serif text-lg leading-relaxed">
              If Lear were unavailable tomorrow we wouldn&apos;t panic. We can bring it back up quickly, and we keep a local
              copy of the agent that runs on our own infrastructure, so even if the hosted Lear goes down we can run our own.
            </p>
            <p className="max-w-[60ch] font-serif text-lg leading-relaxed">
              We&apos;d still miss it. Without it we&apos;d have to design our own workflow for this, then run it and maintain
              it, and that&apos;s exactly the work we stopped doing.
            </p>
          </div>
        </Chapter>
      </div>

      <footer className="bg-[var(--burgundy)] text-[var(--cream)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className={`${wide} text-[clamp(28px,4vw,52px)] uppercase leading-[.9] tracking-[-.03em]`}>written by bits&amp;bytes™</p>
            <p className="mt-3 max-w-xl font-serif text-base">
              Approved for sharing by Akshat Kushwaha, CTO. CI figures come from motherboard&apos;s public GitHub Actions
              history.
            </p>
          </div>
          <div className={`${mono} space-y-1 sm:text-right`}>
            <div>GOBITSNBYTES FOUNDATION</div>
            <a href="/" className="underline decoration-2 underline-offset-4">gobitsnbytes.org</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.lcs a:focus-visible, .lcs [tabindex]:focus-visible { outline: 3px solid #2b39ff; outline-offset: 3px; }
.lcs-bar { height: 34%; background: rgba(254,233,207,.38); transform-origin: bottom; }
.lcs-bar[data-failed] { height: 100%; background: #fc920d; }
.lcs-bar[data-active] { background: #faf8f5; }
.lcs-swash { font-family: var(--font-yellowtail); font-style: normal; color: #fc920d; font-size: 1.5em; line-height: 0; margin-right: .04em; }
@media (prefers-reduced-motion: no-preference) {
  .lcs-bar { animation: lcs-rise .7s cubic-bezier(.23,1,.32,1) both; animation-delay: calc(var(--i) * 6ms + 150ms); }
  .lcs-card { transition: transform .2s cubic-bezier(.23,1,.32,1), box-shadow .2s cubic-bezier(.23,1,.32,1); }
  .lcs-card:hover { transform: translate(-2px,-2px); box-shadow: 10px 10px 0 #120f0a; }
}
@keyframes lcs-rise { from { transform: scaleY(0); } }
`;

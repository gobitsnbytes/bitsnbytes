import type { Metadata } from "next";
import Image from "next/image";

import assets from "@/public/overclock-assets/manifest.json";

// Hidden brand kit for designers. Not linked anywhere, noindex, disallowed in robots.
// Every PNG and manifest.json come from `python scripts/overclock-assets.py`.
export const metadata: Metadata = {
  title: "overclock · brand kit",
  robots: { index: false, follow: false },
};

type Asset = (typeof assets)[number] & { group?: string; hex?: string };

const SECTIONS = [
  { id: "name", n: "01", title: "the name" },
  { id: "colour", n: "02", title: "colour" },
  { id: "type", n: "03", title: "type" },
  { id: "motif", n: "04", title: "the motif" },
  { id: "elements", n: "05", title: "elements" },
  { id: "layouts", n: "06", title: "layouts" },
  { id: "rules", n: "07", title: "usage rules" },
  { id: "ai", n: "08", title: "ai prompts" },
];

// Paste STYLE first, then one of the prompts. Image models mangle type, so generate art only and
// lay the wordmark, tagline and logos on top from the PNGs above.
const STYLE = `style: print-riot poster graphic. warm off-white paper (#FAF8F5) with thick near-black ink outlines (#120F0A) and hard offset drop shadows, no blur. core colour deep burgundy (#97192C, shading to #3C0A12 and #1E0509), pops of bright orange (#FC920D, #FDA83D) and cream (#FEE9CF), one glowing red accent (#FF2B2B) used sparingly. burgundy-to-orange gradients, subtle halftone dot texture, small four-pointed sparkle stars. theme: overclocking a computer chip, running it past its rated clock: clock-speed dials in GHz with a red redline zone, tuning sliders, hardware-monitor graphs with a dashed red limit line, CPU dies and heatsinks. bold, flat, graphic, high contrast.
avoid: car tachometers, cars, speedometers, racing, dashboards, flames, generic neon cyberpunk, glossy 3D chrome, stock-photo people, any logos, any text or letters (leave clean space for type).`;

const PROMPTS = [
  { title: "hero key visual", tools: "ChatGPT, Nano Banana, Claude + image gen", text: "a wide 16:9 hero image: a huge glowing CPU clock dial on a burgundy-to-orange gradient, needle pushed past the red redline zone, halftone dots across the background, hard ink shadow under the dial. empty space on the left third for the title." },
  { title: "square social post", tools: "ChatGPT, Nano Banana", text: "a 1:1 social post background: a chip die seen from above with its pins, sitting on cream paper, a thick burgundy frame, one red glowing bar across the lower third, orange sparkle stars in the corners. keep the centre calm for a headline." },
  { title: "story / reel cover", tools: "ChatGPT, Nano Banana, Higgsfield", text: "a 9:16 vertical cover: a tall burgundy rail with a halftone texture, a monitor graph line climbing from bottom left and crossing a dashed red limit line near the top, orange glow where it crosses. room at the top and bottom for type." },
  { title: "motion loop", tools: "Higgsfield, Veo, Kling", text: "a 5-second seamless loop, flat 2D print-riot animation: a clock dial needle sweeps slowly from 4 GHz up past the red redline zone and holds there trembling, the red arc glows brighter, halftone dots drift gently. locked-off camera, no cuts, no text." },
  { title: "sticker sheet", tools: "ChatGPT, Nano Banana, Claude + image gen", text: "a sticker sheet on transparent background: a mini clock dial in the red, a tuning slider knob, a heatsink, a chip, a four-pointed star, a power-button icon. each with a thick white die-cut border and a hard ink shadow." },
  { title: "edit an existing asset", tools: "Nano Banana, ChatGPT image edit", text: "attach one of the PNGs from this page, then: keep this exact element, colours and line weight. place it on a burgundy-to-orange gradient with halftone dots, add a hard ink offset shadow, and extend the canvas to 4:5. do not add any text or logos." },
];

const RULES = [
  <>the brand is <b>bits&amp;bytes™</b>. where &amp; can&apos;t go (urls, handles, files), write <b>bitsnbytes</b>. never &quot;bits &amp; bytes&quot;, &quot;B&amp;B&quot; or &quot;gobitsnbytes&quot;.</>,
  <><b>overclock</b> is always lower-case in running copy. uppercase only where the type style does it (Anton display, labels).</>,
  <>the tagline is <b>past the redline.</b>, lower-case, with the full stop, in script.</>,
  <>never name qualifier cities. say &quot;16 city qualifiers&quot; and &quot;overclock at IIT Bombay&quot;.</>,
  <>no logos besides the bits&amp;bytes™ cube and Techfest, and Techfest only in the &quot;part of Techfest, IIT Bombay&quot; lockup.</>,
  <>the motif is a chip-tuning tool (clock dials, sliders, monitors). never a car tachometer, and no car words.</>,
  <>the cube and Techfest marks are white: dark, burgundy or orange grounds only. don&apos;t distort, rotate or recolour them.</>,
  <>burgundy is the voice, orange is the pop, red is the redline. use red sparingly and only for limits and glow.</>,
  <>no aggregate numbers (members, forks, events). per-event facts stay with the event.</>,
];

const shadow = "shadow-[4px_4px_0_#120f0a]";
const anton = "font-[family-name:var(--font-accent-sans)] uppercase";

function Tile({ a, wide }: { a: Asset; wide?: boolean }) {
  const ground =
    a.tile === "dark"
      ? "bg-[#120f0a]"
      : "bg-[#f1eee9] [background-image:radial-gradient(circle,rgba(18,15,10,.1)_1px,transparent_1.4px)] [background-size:7px_7px]";
  return (
    <figure className={`flex flex-col border-2 border-[#120f0a] bg-[#faf8f5] ${shadow} ${wide ? "sm:col-span-2" : ""}`}>
      <div className={`flex flex-1 items-center justify-center border-b-2 border-[#120f0a] p-4 ${ground}`}>
        <Image
          src={`/overclock-assets/${a.slug}.png`}
          alt={a.title}
          width={a.w}
          height={a.h}
          className="h-auto max-h-[420px] w-auto max-w-full"
        />
      </div>
      <figcaption className="flex items-end justify-between gap-3 p-3">
        <div className="min-w-0">
          <div className={`${anton} text-lg leading-none`}>{a.title}</div>
          {a.hex && <div className="mt-1 font-mono text-xs font-bold text-[#97192c]">{a.hex}</div>}
          {a.note && <p className="mt-1 font-serif text-xs text-[#413f3b]">{a.note}</p>}
        </div>
        <a
          href={`/overclock-assets/${a.slug}.png`}
          download
          className="shrink-0 border-2 border-[#120f0a] bg-[#fc920d] px-2 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#120f0a] hover:bg-[#120f0a] hover:text-[#fee9cf]"
        >
          download .png
        </a>
      </figcaption>
    </figure>
  );
}

function Grid({ items, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { items: Asset[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${cols}`}>
      {items.map((a) => (
        <Tile key={a.slug} a={a} wide={a.w > 700 && !a.slug.startsWith("layout")} />
      ))}
    </div>
  );
}

function Section({ id, children, lede }: { id: string; children: React.ReactNode; lede?: React.ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <section id={id} className="scroll-mt-6 border-t-2 border-[#120f0a] py-10">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-sm font-bold tracking-widest text-[#c94218]">{s.n}</span>
        <h2 className={`${anton} text-4xl leading-none sm:text-5xl`}>{s.title}</h2>
      </div>
      {lede && <p className="mb-6 max-w-3xl font-serif text-lg leading-relaxed">{lede}</p>}
      {children}
    </section>
  );
}

export default function OverclockAssets() {
  const all = assets as Asset[];
  const of = (section: string) => all.filter((a) => a.section === section);
  const colourGroups = [...new Set(of("colour").map((a) => a.group ?? ""))];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#120f0a]">
      <header className="relative overflow-hidden bg-[linear-gradient(118deg,#1e0509_0%,#3c0a12_18%,#97192c_48%,#c94218_78%,#fc920d_100%)] text-[#fee9cf]">
        <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(254,233,207,.13)_1.1px,transparent_1.5px)] [background-size:9px_9px]" />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="font-mono text-xs font-bold uppercase tracking-[.16em]">bits&amp;bytes™ · for designers · not public</div>
          <h1 className={`${anton} mt-4 text-7xl leading-[.84] [text-shadow:6px_6px_0_#120f0a] sm:text-9xl`}>overclock</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-[3px] w-24 bg-[#ff2b2b] shadow-[0_0_10px_rgba(255,43,43,.8)]" />
            <span className="font-[family-name:var(--font-yellowtail)] text-4xl">past the redline.</span>
          </div>
          <p className="mt-5 max-w-2xl font-serif text-lg">
            the brand kit. every colour, font and element from the A–Z event document, each as a 3x PNG.
          </p>
          <a
            href="/overclock-assets/overclock-brandkit.zip"
            download
            className="mt-6 inline-block border-2 border-[#120f0a] bg-[#fee9cf] px-4 py-2 font-mono text-sm font-bold uppercase tracking-widest text-[#120f0a] shadow-[4px_4px_0_#120f0a] hover:bg-[#fc920d]"
          >
            download everything (.zip)
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <nav className="grid grid-cols-2 gap-2 py-8 sm:grid-cols-4 lg:grid-cols-8">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`border-2 border-[#120f0a] bg-[#faf8f5] px-3 py-2 ${shadow} hover:bg-[#fee9cf]`}>
              <span className="block font-mono text-[11px] font-bold text-[#c94218]">{s.n}</span>
              <span className={`${anton} text-lg leading-none`}>{s.title}</span>
            </a>
          ))}
        </nav>

        <Section id="name" lede={<>&quot;overclock&quot; in Anton with the ink shadow, &quot;past the redline.&quot; in script on the red glowing bar, the bits&amp;bytes™ lockup, and the Techfest lockup.</>}>
          <Grid items={of("name")} />
        </Section>

        <Section id="colour" lede="burgundy is the core voice, orange the pop, red the redline. hex values come straight from the doc's style.css.">
          {colourGroups.map((g) => (
            <div key={g} className="mb-10">
              <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-[.16em] text-[#c94218]">{g}</h3>
              <Grid items={of("colour").filter((a) => a.group === g)} cols="sm:grid-cols-2 lg:grid-cols-4" />
            </div>
          ))}
        </Section>

        <Section id="type" lede="Anton for display and headings, Georgia for reading, Space Mono Bold for labels and data, Yellowtail for the tagline only, Archivo Black for the bits&bytes™ wordmark. Font files live in scripts/fonts.">
          <Grid items={of("type")} cols="sm:grid-cols-2" />
        </Section>

        <Section id="motif" lede={<>overclocking is running a chip past the clock it was rated for. <b>you bring the push, we bring the cooling.</b> everything visual comes from chip-tuning tools: clock dials, sliders, hardware monitors. never a car tachometer.</>}>
          <Grid items={of("motif")} cols="sm:grid-cols-1" />
        </Section>

        <Section id="elements" lede="the building blocks, lifted from the doc. dials, wordmarks and chips export with a transparent background.">
          <Grid items={of("elements")} />
        </Section>

        <Section id="layouts" lede="three real pages of the A–Z doc at 2x: the cover, the contents, and a chapter page with its rail and meter.">
          <Grid items={of("layouts")} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </Section>

        <Section id="rules">
          <ul className="max-w-3xl space-y-3 font-serif text-lg">
            {RULES.map((r, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rotate-45 border border-[#120f0a] bg-[#fc920d]" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-xs font-bold uppercase tracking-widest text-[#716f6c]">
            the rest of the brand rules live in AGENTS.md
          </p>
        </Section>

        <Section id="ai" lede={<>for ChatGPT, Higgsfield, Claude, Nano Banana and friends. paste the <b>style block</b> first, then one prompt. never let the model draw words or logos: generate the art, then put the wordmark, tagline and lockups on top from the PNGs above. check every output against the usage rules before it ships.</>}>
          <div className={`border-2 border-[#120f0a] bg-[#120f0a] p-5 text-[#fee9cf] ${shadow}`}>
            <div className="font-mono text-xs font-bold uppercase tracking-[.16em] text-[#ff2b2b]">style block · paste this first</div>
            <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-relaxed">{STYLE}</pre>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PROMPTS.map((p) => (
              <div key={p.title} className={`border-2 border-[#120f0a] bg-[#faf8f5] p-5 ${shadow}`}>
                <div className={`${anton} text-xl leading-none`}>{p.title}</div>
                <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#c94218]">{p.tools}</div>
                <pre className="mt-3 whitespace-pre-wrap font-serif text-sm leading-relaxed">{p.text}</pre>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}

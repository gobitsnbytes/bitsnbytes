/*
 * Share cards (Open Graph + Twitter), 1200×630, in the homepage hero's look: the burgundy → warm → orange ramp with
 * riso dots, the white cube mark and nav chips, the cream bits&bytes™ wordmark, an ink CTA with a hard offset shadow,
 * and the character as a pre-baked sticker (public/og/*.png: Satori can't do CSS filters or decode WebP).
 * Fonts and images are read once at module scope; every card is static, generated at build time.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#120f0a";
const CREAM = "#fee9cf";
const BURGUNDY = "#97192c";

const read = (...p: string[]) => readFile(join(process.cwd(), ...p));
const dataUri = async (mime: string, ...p: string[]) => `data:${mime};base64,${(await read(...p)).toString("base64")}`;

const FONTS = Promise.all([
  read("scripts/fonts/ArchivoBlack-Regular.ttf"),
  read("scripts/fonts/Anton-Regular.ttf"),
  read("scripts/fonts/SpaceMono-Bold.ttf"),
  read("scripts/fonts/Yellowtail-Regular.ttf"),
]).then(([archivo, anton, mono, script]) => [
  { name: "Archivo", data: archivo, weight: 400 as const, style: "normal" as const },
  { name: "Anton", data: anton, weight: 400 as const, style: "normal" as const },
  { name: "Mono", data: mono, weight: 700 as const, style: "normal" as const },
  { name: "Script", data: script, weight: 400 as const, style: "normal" as const },
]);
const LOGO = dataUri("image/svg+xml", "public/logo.svg");

/** Sticker sizes (px) as baked by the PIL step: full-body poses are 574 tall, busts 474. */
const POSES = {
  wave: [270, 574],
  clapper: [276, 574],
  fork: [329, 574],
  door: [338, 574],
  megaphone: [311, 574],
  idle: [263, 574],
  "point-down": [250, 574],
  typing: [450, 574],
  thinking: [429, 474],
  headset: [479, 474],
} as const;
export type OgPose = keyof typeof POSES;

type Card = {
  pose: OgPose;
  /** Route cards: mono kicker + Anton headline. Omit both for the home card (giant wordmark). */
  kicker?: string;
  title?: string;
};

const mono = { fontFamily: "Mono", fontWeight: 700, textTransform: "uppercase" as const };

function Chips() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {["[E] Events", "[A] About", "[J] Join"].map((chip) => (
        <div
          key={chip}
          style={{ ...mono, display: "flex", border: `3px solid ${CREAM}`, color: CREAM, fontSize: 17, letterSpacing: 3, padding: "8px 14px" }}
        >
          {chip}
        </div>
      ))}
    </div>
  );
}

function Wordmark({ scale }: { scale: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", color: CREAM }}>
      <div style={{ display: "flex", fontFamily: "Archivo", fontSize: 250 * scale, lineHeight: 0.82, letterSpacing: -10 * scale }}>
        bits
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Script",
          fontSize: 200 * scale,
          lineHeight: 1,
          marginLeft: -28 * scale,
          marginTop: 38 * scale,
        }}
      >
        &bytes
      </div>
      <div style={{ display: "flex", fontFamily: "Archivo", fontSize: 30 * scale, marginLeft: 6 * scale, marginTop: 4 * scale }}>
        ™
      </div>
    </div>
  );
}

export async function ogCard({ pose, kicker, title }: Card) {
  const [fonts, logo, sticker] = await Promise.all([FONTS, LOGO, dataUri("image/png", "public/og", `${pose}.png`)]);
  // Full-body poses stand below the chip row; busts sit on the bottom edge.
  const [bw, bh] = POSES[pose];
  const bust = bh < 500;
  const h = bust ? 340 : 470;
  const w = Math.round((bw * h) / bh);
  const home = !title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundImage: `linear-gradient(180deg, ${BURGUNDY} 0%, ${BURGUNDY} 30%, #c94218 68%, #fc920d 100%)`,
        }}
      >
        {/* Riso dots over the ramp. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle, rgba(254,233,207,0.13) 1.3px, transparent 1.7px)",
            backgroundSize: "11px 11px",
          }}
        />

        <div style={{ position: "absolute", top: 40, left: 56, right: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={58} height={58} alt="" />
            {home ? null : <Wordmark scale={0.2} />}
          </div>
          <Chips />
        </div>

        {home ? (
          <div style={{ position: "absolute", top: 128, left: 48, display: "flex", flexDirection: "column" }}>
            <Wordmark scale={1} />
            <div style={{ ...mono, display: "flex", color: CREAM, fontSize: 21, letterSpacing: 3, marginTop: 34, marginLeft: 10 }}>
              A teen-led builder network across India.
            </div>
          </div>
        ) : (
          <div style={{ position: "absolute", top: 150, left: 56, width: 1200 - 56 - w - 70, display: "flex", flexDirection: "column" }}>
            <div style={{ ...mono, display: "flex", color: CREAM, fontSize: 20, letterSpacing: 3 }}>{kicker}</div>
            <div
              style={{
                display: "flex",
                fontFamily: "Anton",
                textTransform: "uppercase",
                color: CREAM,
                fontSize: title.length > 24 ? 84 : 100,
                lineHeight: 0.92,
                letterSpacing: -1,
                marginTop: 18,
              }}
            >
              {title}
            </div>
          </div>
        )}

        {/* Bottom rail on the orange band: tagline + coordinates, and the ink CTA with a hard offset shadow. */}
        <div style={{ position: "absolute", left: 56, bottom: 44, display: "flex", alignItems: "flex-end", gap: 28 }}>
          <div
            style={{
              ...mono,
              display: "flex",
              background: BURGUNDY,
              color: CREAM,
              fontSize: 20,
              letterSpacing: 2,
              padding: "14px 20px",
              border: `3px solid ${INK}`,
              boxShadow: `7px 7px 0 ${INK}`,
            }}
          >
            gobitsnbytes.org ↗
          </div>
          <div style={{ ...mono, display: "flex", flexDirection: "column", color: INK, fontSize: 16, letterSpacing: 2, gap: 6 }}>
            <div style={{ display: "flex" }}>No uncs in the room.</div>
            <div style={{ display: "flex" }}>Pan-India · 20.5937° N, 78.9629° E</div>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sticker} width={w} height={h} alt="" style={{ position: "absolute", right: 48, bottom: bust ? 0 : 18 }} />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

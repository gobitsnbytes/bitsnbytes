"use client";

import { useSyncExternalStore } from "react";

/**
 * The bits&bytes sonic identity, synthesised. No audio files, ever: every cue is built at runtime from oscillators,
 * code-filled buffers (noise, Karplus-Strong), biquads, a waveshaper and a convolver whose impulse response is
 * generated in code. Off by default and free while off: the AudioContext only exists after `unlock()`, which the
 * provider calls from a trusted gesture once sound is on.
 *
 * One musical world, D major pentatonic (note()), so it is memorable because it is consistent: every control sings
 * its own degree (the provider hashes its label), sections walk up the scale as you scroll, and the sonic logo
 * ("sting", the ta-dum before a film) is a low D then an A under a D maj9 bloom; "ready" is its small echo.
 *
 *   voice → fader (level ±1.5 dB) → StereoPanner ─┬→ bus.dry ──────────────────┐
 *                                                 └→ send → bus.wet → reverb ──┴→ mix → glue (tanh) → limiter → master → out
 *
 * Two buses: "ui" (ducks to -12 dB under a playing film) and "cinema" (never ducked). The reverb is shared: UI cues
 * send a little ("room"), cinematic ones a lot ("hall"). Peak dBFS at volume 1, measured through this exact chain in
 * dev with window.__bnbSound.render(name) (tmp/netflix/sound/levels.txt):
 *   hover -38 · focus, key -34 · release, toggles -30 · press -26 · open, close, nav, copy, error -28 · success -24
 *   section -32 · scroll air -44 · ready -22 · sting -12 · impact -14 · riser, resolve -18 · land, whoosh -22
 *   shimmer -24 · scramble -30
 */

// ---------- preference (localStorage["bnb-sound"], mirrored to html[data-sound]) ----------

const STORAGE_KEY = "bnb-sound";
const CHANGE_EVENT = "bnb:sound";
let enabled: boolean | null = null;

const readEnabled = () => {
  if (enabled === null) {
    try {
      enabled = window.localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      enabled = false;
    }
  }
  return enabled;
};

const subscribe = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    enabled = null;
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const useSoundEnabled = () => useSyncExternalStore(subscribe, readEnabled, () => false);
export const isSoundEnabled = () => typeof window !== "undefined" && readEnabled();

export function setSoundEnabled(next: boolean) {
  if (!next) play("toggleOff"); // the last thing heard before silence
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // storage blocked: the choice still holds for this tab
  }
  document.documentElement.dataset.sound = next ? "on" : "off";
  window.dispatchEvent(new Event(CHANGE_EVENT));
  if (next) {
    unlock(); // toggling is itself a user gesture
    play("ready"); // sound arrives with the small sonic logo
  } else {
    stopAir();
    window.setTimeout(() => {
      if (!isSoundEnabled()) void ctx?.suspend();
    }, 600);
  }
}

// ---------- tuning: D major pentatonic (D E F# A B) ----------

const PENTA = [0, 2, 4, 7, 9];
/** Scale degree → Hz. Degree 0 is D4; every 5 degrees is an octave. */
export const note = (degree: number) => {
  const octave = Math.floor(degree / 5);
  const step = PENTA[((degree % 5) + 5) % 5];
  return 440 * 2 ** ((62 + 12 * octave + step - 69) / 12);
};
/** An element's degree (the provider passes 0..6) folded into range. */
const deg = (x: number, range = 7) => ((Math.round(x) % range) + range) % range;

// ---------- building blocks ----------

type Ctx = BaseAudioContext;
/** Schedules one cue into `out` from time `t`; returns seconds until it is silent. Pure: nodes only. */
type Recipe = (ctx: Ctx, out: AudioNode, t: number, x: number) => number;

// Humanisation for the recipe being rendered, set by `voice()` just before it runs (recipes are synchronous).
let tune = 1; // ±6 cents
let variant = 0; // round-robin 0..3

/** Linear attack from true zero (>= 2 ms), exponential decay to -60 dB, a 15 ms fade to zero: never clicks. */
function env(ctx: Ctx, out: AudioNode, t: number, peak: number, attack: number, decay: number) {
  const g = ctx.createGain();
  const top = t + Math.max(0.002, attack);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, top);
  g.gain.exponentialRampToValueAtTime(peak / 1000, top + decay);
  g.gain.linearRampToValueAtTime(0, top + decay + 0.015);
  g.connect(out);
  return g;
}

function tone(ctx: Ctx, type: OscillatorType, hz: number, out: AudioNode, t: number, end: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(hz * tune, t);
  o.connect(out);
  o.start(t);
  o.stop(end);
  return o;
}
const glide = (o: OscillatorNode, hz: number, at: number) => o.frequency.exponentialRampToValueAtTime(hz * tune, at);

function filter(ctx: Ctx, type: BiquadFilterType, hz: number, q: number, out: AudioNode, t = 0) {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(hz, t);
  f.Q.value = q;
  f.connect(out);
  return f;
}

/** Code-filled buffers, made once per sample rate (AudioBuffers are shareable across contexts). */
const buffers = new Map<string, AudioBuffer>();
function cached(ctx: Ctx, id: string, seconds: number, channels: number, fill: (data: Float32Array, sr: number) => void) {
  const key = `${id}@${ctx.sampleRate}`;
  let buf = buffers.get(key);
  if (!buf) {
    buf = ctx.createBuffer(channels, Math.ceil(seconds * ctx.sampleRate), ctx.sampleRate);
    for (let c = 0; c < channels; c++) fill(buf.getChannelData(c), ctx.sampleRate);
    buffers.set(key, buf);
  }
  return buf;
}

const white = (ctx: Ctx) =>
  cached(ctx, "noise", 2, 1, (d) => {
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  });

function noise(ctx: Ctx, out: AudioNode, t: number, end: number) {
  const src = ctx.createBufferSource();
  src.buffer = white(ctx);
  src.loop = true;
  src.connect(out);
  src.start(t, Math.random() * 1.5);
  src.stop(end);
  return src;
}

/** Seeded noise (mulberry32): the hall is the same on every load, so levels measured through it hold for everyone. */
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
};

/**
 * The hall: decorrelated noise per channel, 16 ms predelay, -60 dB at 2.6 s, run through a one-pole lowpass that
 * closes as it decays (bright early reflections, dark tail). Energy-normalised, so send amounts read as levels.
 */
const impulse = (ctx: Ctx) => {
  const rand = seeded(0xb175);
  return cached(ctx, "hall", 2.8, 2, (d, sr) => {
    const pre = Math.round(sr * 0.016);
    let lp = 0;
    let energy = 0;
    for (let i = pre; i < d.length; i++) {
      const s = (i - pre) / sr;
      const a = 0.8 * Math.exp(-s * 1.8) + 0.06; // one-pole coefficient: ~9 kHz early → ~500 Hz late
      lp += a * (rand() * 2 - 1 - lp);
      d[i] = (lp / Math.sqrt(a / (2 - a))) * Math.exp((-6.9 * s) / 2.6) * Math.min(1, s / 0.004);
      energy += d[i] * d[i];
    }
    const k = 1 / Math.sqrt(energy);
    for (let i = pre; i < d.length; i++) d[i] *= k;
  });
};

/** Felt mallet on a marimba bar: fundamental + the bar's ~3.9x overtone, under a lowpass that closes as it rings. */
function mallet(ctx: Ctx, out: AudioNode, t: number, hz: number, peak: number, decay: number, ratio = 3.93, bright = 2400) {
  const end = t + decay + 0.05;
  const lp = filter(ctx, "lowpass", bright, 0.5, out, t);
  lp.frequency.exponentialRampToValueAtTime(Math.max(hz * 1.5, 220), t + decay);
  tone(ctx, "sine", hz, env(ctx, lp, t, peak, 0.003, decay), t, end);
  tone(ctx, "sine", hz * ratio, env(ctx, lp, t, peak * 0.3, 0.002, decay * 0.22), t, end);
  return end - t;
}

/** Small glass pluck: a sine with two inharmonic partials that die first. */
function glass(ctx: Ctx, out: AudioNode, t: number, hz: number, peak: number, decay = 0.22) {
  const end = t + decay + 0.05;
  tone(ctx, "sine", hz, env(ctx, out, t, peak, 0.002, decay), t, end);
  tone(ctx, "sine", hz * 2.76, env(ctx, out, t, peak * 0.22, 0.002, decay * 0.3), t, end);
  tone(ctx, "sine", hz * 5.4, env(ctx, out, t, peak * 0.08, 0.002, decay * 0.1), t, end);
  return end - t;
}

/** FM bell: sine carrier, a modulator whose index falls away, so it strikes bright and rings pure. */
function bell(ctx: Ctx, out: AudioNode, t: number, hz: number, peak: number, decay: number, ratio = 2, index = 0.8) {
  const end = t + decay + 0.05;
  const carrier = tone(ctx, "sine", hz, env(ctx, out, t, peak, 0.004, decay), t, end);
  const depth = ctx.createGain();
  depth.gain.setValueAtTime(hz * index, t);
  depth.gain.exponentialRampToValueAtTime(Math.max(1, hz * index * 0.01), t + decay * 0.6);
  depth.connect(carrier.frequency);
  tone(ctx, "sine", hz * ratio, depth, t, end);
  tone(ctx, "sine", hz * 2.01, env(ctx, out, t, peak * 0.15, 0.004, decay * 0.5), t, end);
  return end - t;
}

/** Karplus-Strong string (zero-mean noise through a decaying averaging delay line), one buffer per pitch. */
function string(ctx: Ctx, out: AudioNode, t: number, hz: number, peak: number) {
  const buf = cached(ctx, `ks${hz.toFixed(2)}`, 0.6, 1, (d, sr) => {
    const period = Math.max(2, Math.round(sr / hz));
    const line = Float32Array.from({ length: period }, () => Math.random() * 2 - 1);
    const mean = line.reduce((a, b) => a + b, 0) / period; // no DC
    for (let j = 0; j < period; j++) line[j] -= mean;
    for (let i = 0; i < d.length; i++) {
      const j = i % period;
      d[i] = line[j];
      line[j] = 0.497 * (line[j] + line[(j + 1) % period]);
    }
  });
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = tune;
  src.connect(env(ctx, out, t, peak, 0.002, 0.5));
  src.start(t);
  src.stop(t + 0.56);
  return 0.56;
}

/** Air moving: band-passed noise sweeping `from` → `to` Hz, swelling to `peak` at `rise`, panning across. */
function gust(ctx: Ctx, out: AudioNode, t: number, from: number, to: number, len: number, rise: number, peak: number, pan = [0, 0]) {
  const end = t + len + 0.05;
  const p = ctx.createStereoPanner();
  p.pan.setValueAtTime(pan[0], t);
  p.pan.linearRampToValueAtTime(pan[1], t + len);
  p.connect(out);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + Math.max(0.002, rise));
  g.gain.exponentialRampToValueAtTime(peak / 1000, t + len);
  g.gain.linearRampToValueAtTime(0, t + len + 0.015);
  g.connect(p);
  const bp = filter(ctx, "bandpass", from, 1, g, t);
  bp.frequency.exponentialRampToValueAtTime(to, t + len);
  noise(ctx, bp, t, end);
  return { gain: g, seconds: end - t };
}

/** A deep felt/timpani hit: body with a pitch drop, octave, felt partial, a sub and a soft noise transient. */
function hit(ctx: Ctx, out: AudioNode, t: number, hz: number, peak: number, decay: number) {
  const end = t + decay + 0.05;
  glide(tone(ctx, "sine", hz * 1.5, env(ctx, out, t, peak, 0.003, decay), t, end), hz, t + 0.07);
  tone(ctx, "triangle", hz * 2, env(ctx, filter(ctx, "lowpass", 900, 0.6, out), t, peak * 0.35, 0.003, decay * 0.4), t, end);
  tone(ctx, "sine", hz * 3.01, env(ctx, out, t, peak * 0.14, 0.002, decay * 0.12), t, end);
  tone(ctx, "sine", hz / 2, env(ctx, out, t, peak * 0.35, 0.008, decay * 0.7), t, end);
  noise(ctx, env(ctx, filter(ctx, "lowpass", 1400, 0.7, out), t, peak * 0.3, 0.002, 0.03), t, t + 0.08);
  return end - t;
}

/** D maj9-ish (D A C# E F# A): detuned saws + triangles under a lowpass that opens 400 Hz → 3 kHz as it swells. */
const BLOOM = [note(-5), note(-2), 440 * 2 ** (-8 / 12), note(1), note(2), note(3)];
function bloom(ctx: Ctx, out: AudioNode, t: number, peak: number, swell: number, hold: number, release: number) {
  const end = t + swell + hold + release + 0.05;
  const lp = filter(ctx, "lowpass", 400, 0.7, out, t);
  lp.frequency.exponentialRampToValueAtTime(3000, t + swell);
  lp.frequency.exponentialRampToValueAtTime(700, end);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + swell);
  g.gain.setValueAtTime(peak, t + swell + hold);
  g.gain.exponentialRampToValueAtTime(peak / 1000, end - 0.02);
  g.gain.linearRampToValueAtTime(0, end);
  g.connect(lp);
  const saws = ctx.createGain();
  saws.gain.value = 0.3;
  saws.connect(g);
  for (const hz of BLOOM) {
    tone(ctx, "sawtooth", hz * 2 ** (7 / 1200), saws, t, end);
    tone(ctx, "sawtooth", hz * 2 ** (-7 / 1200), saws, t, end);
    tone(ctx, "triangle", hz, g, t, end);
  }
  return end - t;
}

// ---------- cues ----------

/** Felt/marimba tap at the element's degree (D5..E6); four round-robin timbres so repetition never grates. */
const hover: Recipe = (ctx, out, t, x) =>
  mallet(ctx, out, t, note(5 + deg(x)), 1, 0.09 + (variant % 2) * 0.03, [3.93, 4.02, 3.87, 4.1][variant], [2200, 1900, 2500, 2100][variant]);

/** Warm woody knock, body 147–220 Hz (the element's own), soft band-passed transient. */
const press: Recipe = (ctx, out, t, x) => {
  const hz = note(-5 + deg(x, 4));
  const end = t + 0.16;
  glide(tone(ctx, "sine", hz * 1.3, env(ctx, out, t, 1, 0.003, 0.1), t, end), hz, t + 0.045);
  tone(ctx, "triangle", hz * 2.72, env(ctx, filter(ctx, "lowpass", 1600, 0.7, out), t, 0.25, 0.002, 0.035), t, end);
  noise(ctx, env(ctx, filter(ctx, "bandpass", 1300, 1.1, out), t, 0.35, 0.002, 0.014), t, end);
  return end - t;
};

/** Small glassy pluck an octave above the element's hover note, into the room. */
const release: Recipe = (ctx, out, t, x) => glass(ctx, out, t, note(10 + deg(x, 5)), 1);

/** Keyboard focus: a soft sine that leans up into its note. */
const focus: Recipe = (ctx, out, t, x) => {
  const hz = note(10 + deg(x, 5));
  const end = t + 0.12;
  glide(tone(ctx, "sine", hz * 0.97, env(ctx, out, t, 1, 0.004, 0.07), t, end), hz, t + 0.02);
  return end - t;
};

/** Soft typewriter: four round-robin variants (band, body) so a sentence doesn't machine-gun one sample. */
const KEYS = [
  [2600, 320],
  [3300, 380],
  [2200, 290],
  [3800, 420],
];
const key: Recipe = (ctx, out, t) => {
  const [band, body] = KEYS[variant];
  const end = t + 0.06;
  noise(ctx, env(ctx, filter(ctx, "bandpass", band, 1.4, out), t, 1, 0.002, 0.016), t, end);
  tone(ctx, "sine", body, env(ctx, out, t, 0.3, 0.002, 0.028), t, end);
  return end - t;
};

/** Two-note marimba: D5 → A5 on, A5 → D5 off. */
const toggle =
  (on: boolean): Recipe =>
  (ctx, out, t) => {
    const [a, b] = on ? [note(5), note(8)] : [note(8), note(5)];
    mallet(ctx, out, t, a, 0.8, 0.12);
    return 0.075 + mallet(ctx, out, t + 0.075, b, 1, 0.2);
  };

/** Open breathes in (noise swell rising, a quiet D4 → D5 glide); close exhales (falling, D5 → D4). */
const swell =
  (open: boolean): Recipe =>
  (ctx, out, t) => {
    const [lo, hi] = [note(0), note(5)];
    const { gain, seconds } = gust(ctx, out, t, open ? 500 : 2600, open ? 2600 : 500, 0.34, open ? 0.22 : 0.05, 1);
    const level = ctx.createGain();
    level.gain.value = 0.35;
    level.connect(gain);
    glide(tone(ctx, "sine", open ? lo : hi, level, t, t + seconds), open ? hi : lo, t + 0.34);
    return seconds;
  };

/** Bright double pluck: F#6 then D7. */
const copy: Recipe = (ctx, out, t) => {
  glass(ctx, out, t, note(12), 0.8, 0.16);
  return 0.07 + glass(ctx, out, t + 0.07, note(15), 1, 0.3);
};

/** Warm D major arpeggio (D F# A D) on felt, crowned by a bell, into the hall. */
const success: Recipe = (ctx, out, t) => {
  [0, 2, 3, 5].forEach((d, i) => mallet(ctx, out, t + i * 0.07, note(d), 0.7, 0.6, 3.93, 1800));
  return 0.26 + bell(ctx, out, t + 0.26, note(10), 0.55, 1.6);
};

/** A soft low "uh-uh": two muffled minor-second dyads, E3 then D3. Never harsh, never square. */
function bump(ctx: Ctx, out: AudioNode, t: number, hz: number, peak: number) {
  const lp = filter(ctx, "lowpass", 700, 0.5, out);
  const e = env(ctx, lp, t, peak, 0.006, 0.16);
  const end = t + 0.22;
  for (const f of [hz, hz * 2 ** (1 / 12)]) glide(tone(ctx, "sine", f * 1.06, e, t, end), f, t + 0.06);
  tone(ctx, "triangle", hz * 2, env(ctx, lp, t, peak * 0.2, 0.004, 0.06), t, end);
  return end - t;
}
const error: Recipe = (ctx, out, t) => {
  bump(ctx, out, t, note(-4), 0.8);
  return 0.13 + bump(ctx, out, t + 0.13, note(-5), 1);
};

/** Route change: a short gust that settles onto a soft D (felt, octave doubled). */
const nav: Recipe = (ctx, out, t) => {
  gust(ctx, out, t, 1800, 420, 0.3, 0.05, 0.8, [0.3, -0.2]);
  mallet(ctx, out, t + 0.2, note(5), 0.7, 0.5, 3.93, 1600);
  return 0.2 + mallet(ctx, out, t + 0.2, note(0), 0.5, 0.7, 3.93, 1400);
};

/** Section bell: soft FM bell with a long hall tail; x = section index walks up the scale (A4 .. D6, then wraps). */
const section: Recipe = (ctx, out, t, x) => bell(ctx, out, t, note(3 + deg(x, 8)), 1, 1.8, 2, 0.5);

/** The sting's two hits (seconds after the call): components/cinema/ident.ts IDENT_HITS lands its plates on these. */
const STING_HITS = [0.3, 0.62] as const;

/** The sonic logo, "ta-dum": a breath drawn in under the outline, low D and A hits, a D maj9 bloom into the hall. */
const sting: Recipe = (ctx, out, t) => {
  const [h1, h2] = STING_HITS;
  const lp = filter(ctx, "lowpass", 300, 0.8, out, t);
  lp.frequency.exponentialRampToValueAtTime(1800, t + h1);
  const breath = ctx.createGain();
  breath.gain.setValueAtTime(0, t);
  breath.gain.linearRampToValueAtTime(0.004, t + 0.03);
  breath.gain.exponentialRampToValueAtTime(0.12, t + h1 - 0.012);
  breath.gain.linearRampToValueAtTime(0, t + h1 + 0.004); // sucked into the first hit
  breath.connect(lp);
  noise(ctx, breath, t, t + h1 + 0.02);
  hit(ctx, out, t + h1, note(-10), 1, 1.4);
  hit(ctx, out, t + h2, note(-7), 1.1, 1.6);
  return h2 + bloom(ctx, out, t + h2, 0.35, 0.9, 0.15, 1.8);
};

/** Loader done / sound switched on: the sonic logo, small (D3 and A3, a short bloom). */
const ready: Recipe = (ctx, out, t) => {
  hit(ctx, out, t, note(-5), 0.6, 0.6);
  hit(ctx, out, t + 0.16, note(-2), 0.7, 0.7);
  return 0.16 + bloom(ctx, out, t + 0.16, 0.3, 0.35, 0.05, 0.9);
};

/** x = seconds to peak (default 1.2): noise and a D3 → D5 saw rising together, peaking exactly at x, then gone. */
const riser: Recipe = (ctx, out, t, x) => {
  const len = x > 0 ? x : 1.2;
  const peak = t + len;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.01, t + Math.min(0.05, len / 4));
  g.gain.exponentialRampToValueAtTime(1, peak);
  g.gain.linearRampToValueAtTime(0, peak + 0.02);
  g.connect(out);
  const bp = filter(ctx, "bandpass", 300, 1.2, g, t);
  bp.frequency.exponentialRampToValueAtTime(5000, peak);
  noise(ctx, bp, t, peak + 0.04);
  const lp = filter(ctx, "lowpass", 600, 1, g, t);
  lp.frequency.exponentialRampToValueAtTime(4000, peak);
  const level = ctx.createGain();
  level.gain.value = 0.35;
  level.connect(lp);
  glide(tone(ctx, "sawtooth", note(-5), level, t, peak + 0.04), note(5), peak);
  return len + 0.05;
};

/** Sub drop (55 → 35 Hz), a body thump and a noise crack, into the hall. */
const impact: Recipe = (ctx, out, t) => {
  const end = t + 1.25;
  glide(tone(ctx, "sine", 55, env(ctx, out, t, 1, 0.003, 1.1), t, end), 35, t + 0.5);
  glide(tone(ctx, "sine", 110, env(ctx, out, t, 0.5, 0.002, 0.25), t, end), 55, t + 0.08);
  noise(ctx, env(ctx, filter(ctx, "bandpass", 2200, 0.8, out), t, 0.6, 0.002, 0.06), t, t + 0.12);
  noise(ctx, env(ctx, filter(ctx, "highpass", 5000, 0.7, out), t, 0.2, 0.002, 0.02), t, t + 0.06);
  return end - t;
};

/** x < 0.5 "in" (rising sweep arriving from the left), x >= 0.5 "out" (falling, leaving right). */
const whoosh: Recipe = (ctx, out, t, x) =>
  (x >= 0.5
    ? gust(ctx, out, t, 2600, 350, 0.45, 0.03, 1, [0.2, 0.8])
    : gust(ctx, out, t, 350, 2600, 0.42, 0.36, 1, [-0.8, -0.1])
  ).seconds;

/** A high cluster of small FM bells, scattered in time and space, into the hall. */
const shimmer: Recipe = (ctx, out, t) => {
  let end = 0;
  [15, 17, 18, 20, 22, 23].forEach((d, i) => {
    const p = ctx.createStereoPanner();
    p.pan.value = ((i % 2 ? 1 : -1) * (i + 1)) / 8;
    p.connect(out);
    const at = i * 0.045 + Math.random() * 0.03;
    end = Math.max(end, at + bell(ctx, p, t + at, note(d), 0.25, 0.9, 3.5, 1.2));
  });
  return end;
};

/** x = seconds (default 0.7): quiet digital chatter, 16 ms filtered blips every 32 ms, fading as it resolves. */
const scramble: Recipe = (ctx, out, t, x) => {
  const len = x > 0 ? x : 0.7;
  const fade = ctx.createGain();
  fade.gain.setValueAtTime(0, t);
  fade.gain.linearRampToValueAtTime(1, t + 0.01);
  fade.gain.linearRampToValueAtTime(0.15, t + len);
  fade.gain.linearRampToValueAtTime(0, t + len + 0.02);
  fade.connect(out);
  const gate = ctx.createGain();
  gate.gain.setValueAtTime(0, t);
  gate.connect(filter(ctx, "bandpass", 2400, 3, fade));
  const o = tone(ctx, "triangle", note(12), gate, t, t + len + 0.03);
  for (let at = t; at < t + len; at += 0.032) {
    o.frequency.setValueAtTime(note(12 + Math.floor(Math.random() * 10)) * tune, at);
    gate.gain.setValueAtTime(0, at);
    gate.gain.linearRampToValueAtTime(1, at + 0.002);
    gate.gain.linearRampToValueAtTime(0, at + 0.018);
  }
  return len + 0.03;
};

/** Something clicking home: a soft thud and a plucked string at the degree (D5 by default). */
const land: Recipe = (ctx, out, t, x) => {
  const end = t + 0.2;
  glide(tone(ctx, "sine", 120, env(ctx, out, t, 1, 0.003, 0.14), t, end), 70, t + 0.06);
  return Math.max(end - t, 0.01 + string(ctx, out, t + 0.01, note(5 + deg(x)), 0.5));
};

/** A warm open end: D add9 (D3 A3 D4 E4 F#4 A4), rolled, on triangles and sines, into the hall. */
const resolve: Recipe = (ctx, out, t) => {
  const lp = filter(ctx, "lowpass", 2400, 0.5, out);
  let end = 0;
  [-5, -2, 0, 1, 2, 3].forEach((d, i) => {
    const at = i * 0.025;
    const e = env(ctx, lp, t + at, 0.5, 0.06, 2.2);
    tone(ctx, "triangle", note(d), e, t + at, t + at + 2.35);
    tone(ctx, "sine", note(d) * 1.002, e, t + at, t + at + 2.35);
    end = at + 2.35;
  });
  return end;
};

/** Legacy "rustle": x = intensity 0..1. */
const rustle: Recipe = (ctx, out, t, x) => gust(ctx, out, t, 2500, 3500, 0.12, 0.02, Math.max(0.01, Math.min(1, x))).seconds;

type Cue = {
  render: Recipe;
  /** Fader gain that lands the cue on its target peak (measured, see the header). */
  level: number;
  /** Routed to the cinema bus: never ducked, never humanised (the film cues are timed to the frame). */
  cinema?: true;
  /** Reverb send: ~0.1 room for UI, 0.3–0.6 hall for cinematic cues. */
  send?: number;
  /** Minimum ms between two plays of this cue, so nothing machine-guns. */
  gap?: number;
};

const CUES = {
  hover: { render: hover, level: 0.04169, send: 0.1, gap: 60 },
  press: { render: press, level: 0.2138, send: 0.08, gap: 35 },
  release: { render: release, level: 0.1109, send: 0.25, gap: 35 },
  focus: { render: focus, level: 0.08035, send: 0.12, gap: 50 },
  key: { render: key, level: 0.1084, send: 0.05, gap: 25 },
  toggleOn: { render: toggle(true), level: 0.03199, send: 0.15, gap: 80 },
  toggleOff: { render: toggle(false), level: 0.03126, send: 0.15, gap: 80 },
  open: { render: swell(true), level: 0.04898, send: 0.2, gap: 120 },
  close: { render: swell(false), level: 0.06839, send: 0.2, gap: 120 },
  section: { render: section, level: 0.0266, send: 0.6, gap: 700 },
  copy: { render: copy, level: 0.04074, send: 0.25, gap: 150 },
  success: { render: success, level: 0.0537, send: 0.45, gap: 400 },
  error: { render: error, level: 0.0209, send: 0.12, gap: 400 },
  nav: { render: nav, level: 0.01927, send: 0.3, gap: 300 },
  ready: { render: ready, level: 0.06456, send: 0.45, gap: 1000 },
  sting: { render: sting, level: 0.1334, cinema: true, send: 0.5, gap: 400 },
  riser: { render: riser, level: 0.1259, cinema: true, send: 0.3, gap: 100 },
  impact: { render: impact, level: 0.3126, cinema: true, send: 0.35, gap: 100 },
  whoosh: { render: whoosh, level: 0.1135, cinema: true, send: 0.25, gap: 80 },
  shimmer: { render: shimmer, level: 0.08912, cinema: true, send: 0.6, gap: 150 },
  scramble: { render: scramble, level: 0.05188, cinema: true, send: 0.1, gap: 100 },
  land: { render: land, level: 0.2723, cinema: true, send: 0.2, gap: 80 },
  resolve: { render: resolve, level: 0.03507, cinema: true, send: 0.5, gap: 400 },
  // legacy names, re-voiced onto the vocabulary above
  tick: { render: focus, level: 0.08035, send: 0.12, gap: 40 },
  thock: { render: press, level: 0.2113, send: 0.08, gap: 35 },
  pluck: { render: (ctx, out, t, x) => string(ctx, out, t, note(5 + x), 1), level: 0.1603, send: 0.2, gap: 60 },
  bell: { render: section, level: 0.0266, send: 0.6, gap: 200 },
  sweepUp: { render: swell(true), level: 0.05129, send: 0.2, gap: 120 },
  sweepDown: { render: swell(false), level: 0.06998, send: 0.2, gap: 120 },
  rustle: { render: rustle, level: 0.04074, send: 0.05, gap: 90 },
  glitch: { render: (ctx, out, t) => scramble(ctx, out, t, 0.15), level: 0.1288, send: 0.1, gap: 100 },
  chord: { render: success, level: 0.0537, send: 0.45, gap: 400 },
} satisfies Record<string, Cue>;

/** Every cue by name (data-sound="<name>" swaps an element's press cue for one of these). */
export const RECIPES: Record<SoundName, Cue> = CUES;
export type SoundName = keyof typeof CUES;
export type PlayOptions = { pan?: number; gain?: number };

// ---------- engine ----------

type Bus = { dry: GainNode; wet: GainNode };
type Chain = { ctx: Ctx; ui: Bus; cinema: Bus; master: GainNode };
type Voice = { name: SoundName; fader: GainNode; end: number; cinema: boolean };

const MAX_VOICES = 14;
const IDLE_MS = 30_000;
/** -12 dB: UI cues under a playing film. */
const DUCK = 0.25;
/** Scroll air at full speed (≈ -44 dBFS peak). */
const AIR_MAX = 0.0047;

let ctx: AudioContext | null = null;
let chain: Chain | null = null;
let voices: Voice[] = [];
let idle: ReturnType<typeof setTimeout> | undefined;
const rr: Partial<Record<SoundName, number>> = {};
const last: Partial<Record<SoundName, number>> = {};

/**
 * voices → buses → shared hall → glue → limiter → master. Built identically for the live and offline contexts, except
 * that live, the hall fills after the unlocking gesture has painted: generating the IR and the convolver's FFT prep
 * cost ~10 ms on a desktop and ~50 ms on a phone, which would otherwise land on that first tap's INP. The first cue
 * (a press, with almost no send) just plays dry.
 */
function build(c: Ctx, volume: number, live = false): Chain {
  const master = c.createGain();
  master.gain.value = volume;
  const limiter = c.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.knee.value = 3;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.2;
  const glue = c.createWaveShaper();
  const curve = new Float32Array(2049); // odd length: 0 in → 0 out, no DC
  for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(1.5 * ((i / (curve.length - 1)) * 2 - 1)) / 1.5;
  glue.curve = curve;
  glue.oversample = "2x";
  const mix = c.createGain();
  mix.connect(glue).connect(limiter).connect(master).connect(c.destination);
  const reverb = c.createConvolver();
  reverb.normalize = false;
  const hall = () => void (reverb.buffer = impulse(c));
  if (live) requestAnimationFrame(() => setTimeout(hall));
  else hall();
  reverb.connect(mix);
  const bus = (): Bus => {
    const dry = c.createGain();
    const wet = c.createGain();
    dry.connect(mix);
    wet.connect(reverb);
    return { dry, wet };
  };
  return { ctx: c, ui: bus(), cinema: bus(), master };
}

function voice(ch: Chain, name: SoundName, x: number, opts: PlayOptions, human: boolean): Voice {
  const c = ch.ctx;
  const cue: Cue = CUES[name];
  const cinema = Boolean(cue.cinema);
  const jitter = human && !cinema;
  tune = jitter ? 2 ** ((Math.random() * 12 - 6) / 1200) : 1;
  variant = rr[name] = ((rr[name] ?? -1) + 1) % 4;
  const t = c.currentTime + 0.005 + (jitter ? Math.random() * 0.004 : 0);
  const fader = c.createGain();
  fader.gain.value = cue.level * (opts.gain ?? 1) * (jitter ? 10 ** ((Math.random() * 3 - 1.5) / 20) : 1);
  const panner = c.createStereoPanner();
  panner.pan.value = Math.max(-1, Math.min(1, opts.pan ?? 0));
  const bus = cinema ? ch.cinema : ch.ui;
  fader.connect(panner).connect(bus.dry);
  if (cue.send) {
    const send = c.createGain();
    send.gain.value = cue.send;
    panner.connect(send).connect(bus.wet);
  }
  return { name, fader, end: t + cue.render(c, fader, t, x), cinema };
}

/** Fade a voice out (30 ms when stolen: never a click), then let it go. The hall keeps its tail. */
function steal(v: Voice, now: number, fade = 0.03) {
  const g = v.fader.gain;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(0, now + fade);
  setTimeout(() => v.fader.disconnect(), fade * 1000 + 50);
}

/**
 * Fade out every playing voice of `name`, e.g. the sting when its ident is skipped or killed (Esc, a route change),
 * so its hits don't land on a film that has already started, or on a page the visitor has left.
 */
export function hush(name: SoundName, fade = 0.15) {
  if (!ctx) return;
  const now = ctx.currentTime;
  voices = voices.filter((v) => (v.name === name && v.end > now ? (steal(v, now, fade), false) : true));
}

/**
 * Resume a context the idle timer or a hidden tab suspended (iOS may also leave it "interrupted"). Allowed without a
 * gesture once one unlocked it; where a browser still refuses, the next gesture's unlock() resumes it.
 */
function wake() {
  if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
}

/** Suspend after 30 s of quiet, but never under a film (its end cues must land on the frame, not after a resume). */
function keepAwake() {
  clearTimeout(idle);
  idle = setTimeout(() => {
    if (!air && !ducked) void ctx?.suspend();
  }, IDLE_MS);
}

const VOLUME_KEY = "bnb-sound-volume";
/** Master level 0..1, persisted in localStorage["bnb-sound-volume"] (default 0.6). */
export function getVolume() {
  let v = 0.6;
  try {
    v = Number(window.localStorage.getItem(VOLUME_KEY) ?? "0.6");
  } catch {}
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.6;
}
export function setVolume(v: number) {
  const next = Math.min(1, Math.max(0, v));
  try {
    window.localStorage.setItem(VOLUME_KEY, String(next));
  } catch {}
  if (chain) chain.master.gain.setTargetAtTime(next, chain.ctx.currentTime, 0.03);
}

let ducked = false;
/** While a film plays with sound, UI cues glide down to -12 dB (300 ms) and back (800 ms). Cinema cues never duck. */
export function duck(on: boolean) {
  ducked = on;
  if (!chain) return;
  const now = chain.ctx.currentTime;
  for (const p of [chain.ui.dry.gain, chain.ui.wet.gain]) {
    p.cancelScheduledValues(now);
    p.setValueAtTime(p.value, now);
    p.linearRampToValueAtTime(on ? DUCK : 1, now + (on ? 0.3 : 0.8));
  }
}

/** Create (or resume) the context. Call only from a trusted user gesture, and only while sound is on. */
export function unlock() {
  if (!isSoundEnabled()) return;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const live = new Ctor({ latencyHint: "interactive" });
    ctx = live;
    chain = build(live, getVolume(), true);
    if (ducked) for (const p of [chain.ui.dry.gain, chain.ui.wet.gain]) p.value = DUCK;
    // Silent while hidden; awake again on return, so the next cue (an ident's sting, a film's end) isn't late by a
    // resume. The idle timer puts it back to sleep if nothing plays.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) void live.suspend();
      else if (isSoundEnabled()) {
        wake();
        keepAwake();
      }
    });
  }
  wake();
}

/**
 * Play a cue if sound is on and a gesture has already unlocked the context; otherwise a no-op.
 * x is cue-specific (a scale degree for UI cues; seconds for riser/scramble; 0 in / 1 out for whoosh).
 * opts.pan -1..1 places it; opts.gain scales it (e.g. streaming text at 0.35).
 */
export function play(name: SoundName, x = 0, opts: PlayOptions = {}) {
  if (!ctx || !chain || !isSoundEnabled() || document.hidden) return;
  const cue: Cue | undefined = CUES[name];
  if (!cue) return;
  const ms = performance.now();
  if (ms - (last[name] ?? -Infinity) < (cue.gap ?? 40)) return;
  last[name] = ms;
  wake();
  const now = ctx.currentTime;
  voices = voices.filter((v) => {
    if (v.end > now) return true;
    v.fader.disconnect();
    return false;
  });
  if (voices.length >= MAX_VOICES) {
    const oldestUi = voices.findIndex((v) => !v.cinema);
    steal(voices.splice(Math.max(0, oldestUi), 1)[0], now);
  }
  voices.push(voice(chain, name, x, opts, true));
  if (process.env.NODE_ENV !== "production") heard.push(name);
  keepAwake();
}

// ---------- scroll air: one continuous texture, not a stream of cues ----------

function airVoice(c: Ctx, out: AudioNode) {
  const gain = c.createGain();
  gain.gain.value = 0;
  gain.connect(out);
  const bp = filter(c, "bandpass", 400, 0.7, gain);
  const src = c.createBufferSource();
  src.buffer = white(c);
  src.loop = true;
  src.connect(bp);
  src.start();
  return { src, bp, gain };
}

let air: (ReturnType<typeof airVoice> & { idle: number }) | null = null;

/**
 * Scroll texture: v = scroll speed 0..1. Looping noise through a bandpass whose level and centre follow v (smoothed
 * by setTargetAtTime), easing back to silence ~100 ms after the last call. Started lazily, stopped after 1.5 s still.
 */
export function scrollAir(v: number) {
  if (!ctx || !chain || !isSoundEnabled() || document.hidden) return;
  const speed = Math.min(1, Math.max(0, v));
  if (!air) {
    if (speed < 0.03) return;
    air = { ...airVoice(ctx, chain.ui.dry), idle: 0 };
    if (process.env.NODE_ENV !== "production") heard.push("air");
  }
  wake(); // after 30 s idle the context sleeps: scrolling alone must wake it, or the texture plays into silence
  const now = ctx.currentTime;
  const { gain, bp } = air;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setTargetAtTime(AIR_MAX * speed ** 1.5, now, 0.08);
  gain.gain.setTargetAtTime(0, now + 0.1, 0.25);
  bp.frequency.cancelScheduledValues(now);
  bp.frequency.setTargetAtTime(350 + 2400 * speed, now, 0.15);
  window.clearTimeout(air.idle);
  air.idle = window.setTimeout(stopAir, 1500);
  keepAwake();
}

function stopAir() {
  if (!air || !ctx) return;
  const { src, gain, idle: timer } = air;
  air = null;
  window.clearTimeout(timer);
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setTargetAtTime(0, now, 0.05);
  src.stop(now + 0.3);
  setTimeout(() => gain.disconnect(), 400);
}

/** Stereo position of an element's centre, -0.6..0.6 (cues sit where they happen, gently). */
export const panOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return panAt(r.left + r.width / 2);
};
export const panAt = (clientX: number) => (Math.min(1, Math.max(0, clientX / window.innerWidth)) * 2 - 1) * 0.6;

// ---------- dev: measure every cue through the real chain (window.__bnbSound.render) ----------

/** Dev only: every cue actually voiced, in order (window.__bnbSound.log). */
const heard: string[] = [];

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  const db = (v: number) => Math.round(20 * Math.log10(Math.max(v, 1e-9)) * 10) / 10;
  (window as unknown as { __bnbSound: unknown }).__bnbSound = {
    names: Object.keys(CUES),
    log: heard,
    play,
    duck,
    hush,
    state: () => ({ context: ctx?.state ?? null, voices: voices.length, air: Boolean(air), ui: chain?.ui.dry.gain.value }),
    /** Renders one cue (or several at once, or "air" at speed x) at volume 1, 48 kHz, offline. */
    async render(name: SoundName | SoundName[] | "air", x = 0) {
      const sr = 48000;
      const off = new OfflineAudioContext(2, sr * 7, sr);
      const ch = build(off, 1);
      let seconds = 0;
      for (const n of Array.isArray(name) ? name : [name]) {
        if (n === "air") {
          const a = airVoice(off, ch.ui.dry);
          a.gain.gain.setValueAtTime(0, 0);
          a.gain.gain.linearRampToValueAtTime(AIR_MAX * (x || 1) ** 1.5, 0.1);
          a.bp.frequency.value = 350 + 2400 * (x || 1);
          a.src.stop(1.5);
          seconds = 1.5;
        } else seconds = Math.max(seconds, voice(ch, n, x, {}, false).end);
      }
      const out = await off.startRendering();
      const chans = [out.getChannelData(0), out.getChannelData(1)];
      let peak = 0;
      let peakAt = 0;
      let sum = 0;
      let dc = 0;
      let onset = -1;
      const active = Math.min(out.length, Math.ceil(seconds * sr));
      for (const d of chans) {
        for (let i = 0; i < d.length; i++) {
          const a = Math.abs(d[i]);
          if (a > peak) [peak, peakAt] = [a, i / sr];
          if (onset < 0 && a > 1e-5) onset = i;
          if (i < active) sum += d[i] * d[i];
          dc += d[i];
        }
      }
      // loudest sample in the first 1 ms after onset, relative to the peak: a >= 2 ms ramp keeps this well below 0
      let attack = 0;
      for (const d of chans) for (let i = Math.max(0, onset); i < onset + sr / 1000; i++) attack = Math.max(attack, Math.abs(d[i]));
      // hits: 5 ms windows of the first difference (transients, not ringing bodies) jumping 6 dB over the previous
      // 20 ms. The voice starts at +5 ms, so a hit scheduled at +0.30 s reads 0.305.
      const win = sr / 200;
      const flux = Array.from({ length: Math.floor(out.length / win) }, (_, w) => {
        let m = 0;
        for (const d of chans) for (let i = Math.max(1, w * win); i < (w + 1) * win; i++) m = Math.max(m, Math.abs(d[i] - d[i - 1]));
        return m;
      });
      const top = Math.max(...flux);
      const onsets = flux.flatMap((m, w) =>
        w > 4 && m > top * 0.02 && m > 2 * Math.max(...flux.slice(w - 4, w)) ? [Math.round(w * win) / sr] : [],
      );
      let tail = 0;
      for (const d of chans) for (let i = d.length - sr / 50; i < d.length; i++) tail = Math.max(tail, Math.abs(d[i]));
      return {
        peakDb: db(peak),
        rmsDb: db(Math.sqrt(sum / (2 * active))),
        seconds: Math.round(seconds * 1000) / 1000,
        attackDb: db(attack / peak),
        dcDb: db(Math.abs(dc / (2 * out.length))),
        tailDb: db(tail),
        onsets,
        peakAt: Math.round(peakAt * 1000) / 1000,
      };
    },
  };
}

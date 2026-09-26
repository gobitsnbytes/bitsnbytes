"use client";

import { useSyncExternalStore } from "react";

/**
 * Synthesised UI sound. No audio files, ever: every cue is built at runtime from oscillators, filters and
 * code-filled buffers. Off by default and free while off: the AudioContext is only created by `unlock()`,
 * which the provider calls from a trusted user gesture once sound is on.
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
    play("bell");
  } else void ctx?.suspend();
}

// ---------- tuning: D major pentatonic (D E F# A B) ----------

const PENTA = [0, 2, 4, 7, 9];
/** Scale degree → Hz. Degree 0 is D4; every 5 degrees is an octave. */
export const note = (degree: number) => {
  const octave = Math.floor(degree / 5);
  const step = PENTA[((degree % 5) + 5) % 5];
  return 440 * 2 ** ((62 + 12 * octave + step - 69) / 12);
};

// ---------- recipes: pure (ctx, dest, t, x) → duration in seconds; every one < 400 ms ----------

type Recipe = (ctx: AudioContext, dest: AudioNode, t: number, x: number) => number;

const env = (ctx: AudioContext, dest: AudioNode, t: number, peak: number, attack: number, decay: number) => {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(dest);
  return g;
};

const osc = (ctx: AudioContext, type: OscillatorType, freq: number, out: AudioNode, t: number, dur: number) => {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.connect(out);
  o.start(t);
  o.stop(t + dur + 0.02);
  return o;
};

const noiseBuffers = new WeakMap<AudioContext, AudioBuffer>();
const noise = (ctx: AudioContext) => {
  let buf = noiseBuffers.get(ctx);
  if (!buf) {
    buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.4), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffers.set(ctx, buf);
  }
  return buf;
};

const noiseBurst = (ctx: AudioContext, out: AudioNode, t: number, dur: number) => {
  const src = ctx.createBufferSource();
  src.buffer = noise(ctx);
  src.connect(out);
  src.start(t, Math.random() * 0.2);
  src.stop(t + dur + 0.02);
};

const filter = (ctx: AudioContext, type: BiquadFilterType, freq: number, q: number, out: AudioNode) => {
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  f.connect(out);
  return f;
};

/** Short high blip. x = scale degree offset (hover/release/focus pick different ones). */
const tick: Recipe = (ctx, dest, t, x) => {
  const out = env(ctx, dest, t, 0.05, 0.002, 0.03);
  osc(ctx, "triangle", note(15 + x), out, t, 0.04);
  return 0.04;
};

/** Mechanical key click: band-passed noise with random detune. */
const key: Recipe = (ctx, dest, t) => {
  const out = env(ctx, dest, t, 0.12, 0.001, 0.025);
  noiseBurst(ctx, filter(ctx, "bandpass", 3200 + Math.random() * 1600, 4, out), t, 0.03);
  return 0.03;
};

/** Low press: a falling sine body with a dull noise transient. */
const thock: Recipe = (ctx, dest, t) => {
  const out = env(ctx, dest, t, 0.22, 0.002, 0.08);
  const o = osc(ctx, "sine", note(-5) * 1.0, out, t, 0.09);
  o.frequency.exponentialRampToValueAtTime(note(-10), t + 0.08);
  const click = env(ctx, dest, t, 0.06, 0.001, 0.015);
  noiseBurst(ctx, filter(ctx, "lowpass", 1200, 0.7, click), t, 0.02);
  return 0.09;
};

/** Karplus-Strong string: a noise burst run through a decaying averaging delay line, rendered to a buffer. */
const pluckBuffers = new Map<string, AudioBuffer>();
const pluck: Recipe = (ctx, dest, t, x) => {
  const freq = note(5 + x);
  const id = `${ctx.sampleRate}:${freq.toFixed(2)}`;
  let buf = pluckBuffers.get(id);
  if (!buf) {
    buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.35), ctx.sampleRate);
    const data = buf.getChannelData(0);
    const period = Math.max(2, Math.round(ctx.sampleRate / freq));
    const line = Float32Array.from({ length: period }, () => Math.random() * 2 - 1);
    for (let i = 0; i < data.length; i++) {
      const j = i % period;
      const next = line[(j + 1) % period];
      data[i] = line[j];
      line[j] = 0.497 * (line[j] + next);
    }
    pluckBuffers.set(id, buf);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(env(ctx, dest, t, 0.18, 0.002, 0.33));
  src.start(t);
  return 0.35;
};

/** FM bell: sine carrier, inharmonic modulator whose index decays. */
const bell: Recipe = (ctx, dest, t, x) => {
  const f = note(10 + x);
  const out = env(ctx, dest, t, 0.09, 0.003, 0.35);
  const carrier = osc(ctx, "sine", f, out, t, 0.36);
  const index = ctx.createGain();
  index.gain.setValueAtTime(f * 2, t);
  index.gain.exponentialRampToValueAtTime(1, t + 0.3);
  index.connect(carrier.frequency);
  osc(ctx, "sine", f * 3.5, index, t, 0.36);
  return 0.36;
};

const sweep = (up: boolean): Recipe => (ctx, dest, t) => {
  const out = env(ctx, dest, t, 0.16, 0.02, 0.16);
  const bp = filter(ctx, "bandpass", 900, 1.5, out);
  const [a, b] = up ? [note(0), note(10)] : [note(10), note(0)];
  const o = osc(ctx, "triangle", a, bp, t, 0.18);
  o.frequency.exponentialRampToValueAtTime(b, t + 0.16);
  bp.frequency.setValueAtTime(up ? 600 : 2400, t);
  bp.frequency.exponentialRampToValueAtTime(up ? 2400 : 600, t + 0.16);
  return 0.18;
};

/** Paper rustle: band-passed noise. x = intensity 0..1. */
const rustle: Recipe = (ctx, dest, t, x) => {
  const peak = Math.max(0.0002, 0.05 * Math.min(1, x));
  const out = env(ctx, dest, t, peak, 0.02, 0.1);
  noiseBurst(ctx, filter(ctx, "bandpass", 2500 + Math.random() * 1500, 0.8, out), t, 0.12);
  return 0.12;
};

/** Stepped square stutter. */
const glitch: Recipe = (ctx, dest, t) => {
  const out = env(ctx, dest, t, 0.04, 0.002, 0.12);
  const o = osc(ctx, "square", note(10), filter(ctx, "lowpass", 3000, 1, out), t, 0.13);
  for (let i = 1; i < 6; i++) o.frequency.setValueAtTime(note(8 + Math.floor(Math.random() * 8)), t + i * 0.02);
  return 0.13;
};

/** D major: D F# A, strummed. */
const chord: Recipe = (ctx, dest, t) => {
  [0, 2, 3, 5].forEach((d, i) => {
    const out = env(ctx, dest, t + i * 0.04, 0.05, 0.005, 0.3);
    osc(ctx, "triangle", note(5 + d), out, t + i * 0.04, 0.31);
  });
  return 0.4;
};

export const RECIPES = {
  tick,
  key,
  thock,
  pluck,
  bell,
  sweepUp: sweep(true),
  sweepDown: sweep(false),
  rustle,
  glitch,
  chord,
} satisfies Record<string, Recipe>;
export type SoundName = keyof typeof RECIPES;

// ---------- engine ----------

const MAX_VOICES = 8;
const IDLE_MS = 30_000;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let voices = 0;
let idle: ReturnType<typeof setTimeout> | undefined;

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
  if (master) master.gain.value = next;
}

/** Create (or resume) the context. Call only from a trusted user gesture, and only while sound is on. */
export function unlock() {
  if (!isSoundEnabled()) return;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = getVolume();
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh(1.5 * ((i / (curve.length - 1)) * 2 - 1));
    shaper.curve = curve;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -6;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.1;
    master.connect(shaper).connect(limiter).connect(ctx.destination);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) void ctx?.suspend();
    });
  }
  if (ctx.state === "suspended") void ctx.resume();
}

/** Play a cue if sound is on and a gesture has already unlocked the context; otherwise a no-op. */
export function play(name: SoundName, x = 0) {
  if (!ctx || !master || !isSoundEnabled() || document.hidden) return;
  // ponytail: drops new voices at the cap instead of stealing the oldest; every cue is < 400 ms so it rarely matters
  if (voices >= MAX_VOICES) return;
  if (ctx.state === "suspended") void ctx.resume();
  const dur = RECIPES[name](ctx, master, ctx.currentTime + 0.005, x);
  voices++;
  setTimeout(() => voices--, dur * 1000 + 30);
  clearTimeout(idle);
  idle = setTimeout(() => void ctx?.suspend(), IDLE_MS);
}

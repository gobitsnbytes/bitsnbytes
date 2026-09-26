"use client";

/**
 * /minecraft live pieces: the server stats (one SWR hook per endpoint; /api/players is shared by
 * the stats and the connect console, so SWR dedupes it into one poll), the framed server reel and
 * the copy-address control. Missing readings render "—", never a stand-in number.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import useSWR from "swr";
import { useMotionEnabled } from "@/components/experience-provider";
import { LAB_TEXT } from "@/components/lab";
import { Button } from "@/components/riot";
import { cn } from "@/lib/utils";

type Data = Record<string, unknown>;

const fetcher = async (url: string): Promise<Data> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Offline");
  return response.json() as Promise<Data>;
};

const num = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : null);
const DASH = "—";

function usePlayers() {
  const { data } = useSWR<Data>("/api/players", fetcher, { refreshInterval: 15_000 });
  return { online: num(data?.online), max: num(data?.max) };
}

function useServerStats() {
  const { data: tpsData } = useSWR<Data>("/api/tps", fetcher, { refreshInterval: 15_000 });
  const { data: worldData } = useSWR<Data>("/api/world", fetcher, { refreshInterval: 30_000 });
  const tps = Array.isArray(tpsData?.tps) ? num(tpsData.tps[0]) : num(tpsData?.tps);
  const ageDays = num(worldData?.ageDays);
  const worldAge =
    ageDays !== null ? `${ageDays}d` : typeof worldData?.worldAge === "string" ? worldData.worldAge : null;
  return { tps, mspt: num(tpsData?.mspt), worldAge };
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="border-b border-line py-1.5 font-mono text-[11px] uppercase leading-none">
        <span aria-hidden>/ </span>
        {label}
      </dt>
      <dd className={cn(LAB_TEXT.title, "pt-4 tabular-nums")}>{children}</dd>
    </div>
  );
}

/** Players / TPS / MSPT / world age, 2×2. */
export function LiveStats({ className }: { className?: string }) {
  const { online, max } = usePlayers();
  const { tps, mspt, worldAge } = useServerStats();

  return (
    <dl className={cn("grid grid-cols-2 gap-x-3 gap-y-10", className)}>
      <Stat label="Players">
        {online ?? DASH}
        {online !== null && max !== null ? (
          <span className="ml-2 font-mono text-[0.3em] tracking-normal">/ {max}</span>
        ) : null}
      </Stat>
      <Stat label="TPS">{tps !== null ? tps.toFixed(2) : DASH}</Stat>
      <Stat label="MSPT">{mspt !== null ? mspt.toFixed(1) : DASH}</Stat>
      <Stat label="World age">{worldAge ?? DASH}</Stat>
    </dl>
  );
}

/**
 * The server flythrough in a Fig-window frame: muted, inline, looping only while in view with
 * motion on (reduced motion / toggle off keep the first frame; #t=0.1 makes iOS paint it).
 */
export function ServerReel({ className }: { className?: string }) {
  const motion = useMotionEnabled();
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (!motion || paused) {
      el.pause();
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {});
      else el.pause();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [motion, paused]);

  return (
    <figure className={cn("bg-fg px-1 pb-1 text-surface", className)}>
      <figcaption className="flex h-6 items-center gap-2 px-1 font-mono text-[10px] uppercase leading-none">
        <span aria-hidden className="shrink-0">
          [ Fig. 1 ]
        </span>
        <span
          aria-hidden
          className="h-[7px] flex-1 bg-[repeating-linear-gradient(to_bottom,currentColor_0_1px,transparent_1px_3px)] opacity-60"
        />
        {motion ? (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Play video" : "Pause video"}
            className="shrink-0 px-1 py-0.5 uppercase pointer-fine:hover:bg-[var(--lab-hi,var(--marker))] pointer-fine:hover:text-ink"
          >
            [ {paused ? "Play" : "Pause"} ]
          </button>
        ) : null}
      </figcaption>
      <div className="aspect-video bg-ink">
        <video
          ref={video}
          src="/movie/mc-server-bg.mp4#t=0.1"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
          className="block size-full object-cover"
        />
      </div>
    </figure>
  );
}

/** Live player line + the address with a Copy button and a polite confirmation. */
export function ConnectAddress({ serverIp }: { serverIp: string }) {
  const { online } = usePlayers();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <div className="grid gap-4">
      {online !== null ? (
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase leading-none">
          <span aria-hidden className="size-2 shrink-0 bg-signal" />
          {`${online} active now`}
        </p>
      ) : null}
      <p className={cn(LAB_TEXT.lg, "break-all")}>{serverIp}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={copy} aria-label={`Copy server address ${serverIp}`}>
          Copy
        </Button>
        <span aria-live="polite" className="font-mono text-[11px] uppercase leading-none">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </div>
    </div>
  );
}

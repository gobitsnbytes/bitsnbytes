// Route Suspense fallback: a small mono status, not a full-screen takeover (the tile wipe covers route changes).
export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <p
        role="status"
        className="inline-flex items-center gap-2 bg-fg py-1.5 pl-2.5 pr-3 font-mono text-[11px] font-bold uppercase leading-none tracking-[0.3em] text-surface"
      >
        <span aria-hidden className="size-2 animate-riot-pulse bg-orange motion-reduce:animate-none motion-off:animate-none" />
        Loading
      </p>
    </div>
  );
}

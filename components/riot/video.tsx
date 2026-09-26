"use client";

import { useRef, useState, type ReactNode } from "react";
import { Window } from "./window";

type VideoProps = {
  src: string;
  title: string;
  /** Mono note under the player, e.g. caption availability. */
  captionsNote?: ReactNode;
};

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-8 fill-current">
      <path d="M6 4l14 8-14 8z" />
    </svg>
  );
}

export type VideoFrameProps = VideoProps & { poster: string; className?: string };

/**
 * Window-chrome video: poster + big play button, nothing downloaded until clicked (preload="none").
 * Click plays with sound, then hands over to native controls and moves focus to the player.
 */
export function VideoFrame({ src, poster, title, captionsNote, className }: VideoFrameProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    const video = ref.current;
    if (!video) return;
    video.controls = true;
    video.muted = false;
    // Blocked play (rare after a click) just leaves native controls visible.
    video.play().catch(() => {});
    video.focus();
    setStarted(true);
  };

  return (
    <Window title={title} bar="orange" bodyClassName="p-0" className={className}>
      <div className="relative aspect-video bg-ink">
        <video
          ref={ref}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          controls={started}
          tabIndex={-1}
          className="block size-full object-cover"
        />
        {!started && (
          <button
            type="button"
            onClick={play}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 grid cursor-pointer place-items-center"
          >
            <span className="grid size-20 place-items-center border-3 border-ink bg-orange text-ink shadow-[6px_6px_0_0_var(--ink)] transition-[transform,box-shadow] duration-100 ease-riot group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[8px_8px_0_0_var(--ink)] group-active:translate-x-[3px] group-active:translate-y-[3px] group-active:shadow-none motion-reduce:transition-none">
              <PlayGlyph />
            </span>
          </button>
        )}
      </div>
      {captionsNote ? (
        <p className="border-t-3 border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em]">{captionsNote}</p>
      ) : null}
    </Window>
  );
}

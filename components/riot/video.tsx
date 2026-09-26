"use client";

import { useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
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

export type VideoModalProps = VideoProps & {
  poster?: string;
  /** Trigger element (rendered via asChild), e.g. <Button variant="orange">Watch film</Button>. */
  children: ReactNode;
};

/**
 * "Watch film" modal: Radix Dialog (focus trap, Esc closes, focus returns to the trigger).
 * Plays with sound on open; the video only loads once the dialog opens.
 */
export function VideoModal({ src, poster, title, captionsNote, children }: VideoModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-ink/85 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content
          data-lenis-prevent
          {...(captionsNote ? {} : { "aria-describedby": undefined })}
          className="fixed left-1/2 top-1/2 z-[201] w-[min(92vw,1100px)] -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200 data-[state=open]:ease-riot motion-reduce:animate-none"
        >
          <div className="mb-3 flex justify-end">
            <Dialog.Close className="cursor-pointer border-3 border-ink bg-paper px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-[3px_3px_0_0_var(--orange)] transition-[transform,box-shadow] duration-100 ease-riot hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--orange)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
              Close ✕
            </Dialog.Close>
          </div>
          <Window
            bar="orange"
            bodyClassName="p-0"
            title={
              <Dialog.Title asChild>
                <span>{title}</span>
              </Dialog.Title>
            }
          >
            <video
              src={src}
              poster={poster}
              autoPlay
              controls
              playsInline
              preload="metadata"
              className="block aspect-video w-full bg-ink"
            />
            {captionsNote ? (
              <Dialog.Description className="border-t-3 border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                {captionsNote}
              </Dialog.Description>
            ) : null}
          </Window>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

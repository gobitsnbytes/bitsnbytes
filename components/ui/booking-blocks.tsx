"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────── */
export interface BookingHost {
  booking_link: string;
  username: string;
  title?: string;
  avatar?: string;
  discord_id: string;
  description?: string;
}

export interface BookingSlotBlock {
  date: string; // YYYY-MM-DD
  host_name: string;
  booking_link: string;
  discord_id: string;
  duration: number;
  slots: string[]; // ISO datetime strings
}

export interface BookingConfirmBlock {
  host: string;
  date_label: string; // e.g. "Monday, July 20"
  time_label: string; // e.g. "10:30 AM IST"
  duration: number;
  meeting_id?: string;
}

export interface MeetingItem {
  id: string;
  title: string;
  scheduled_time: number; // epoch ms
  end_time?: number;
  status: string;
  host_name?: string;
}

/*
 * Booking blocks the assistant renders inside its console (a tone-ink scope), so colours come from
 * the tone tokens: fg / line / signal / surface-2. Every action is a prompt sent back to the chat.
 */
const CARD = "whitespace-normal border-2 border-line bg-surface-2 font-sans text-fg shadow-[3px_3px_0_0_var(--shadow-color)]";
const LABEL = "font-mono text-[10px] font-bold uppercase tracking-[0.14em]";
const btnBase =
  "cursor-pointer border-2 border-line font-mono text-[10px] font-bold uppercase tracking-[0.12em] shadow-[2px_2px_0_0_var(--shadow-color)] transition-[transform,box-shadow,background-color,color] duration-100 ease-riot hover:-translate-x-px hover:-translate-y-px hover:shadow-[3px_3px_0_0_var(--shadow-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none motion-reduce:transition-none";

/** Sends a prompt to whichever assistant console is mounted (it fills the input and focuses it). */
export function dispatchPrompt(text: string) {
  window.dispatchEvent(new CustomEvent("bb:qna-prompt", { detail: text }));
}

function ActionPair({ id, className }: { id: string; className?: string }) {
  return (
    <div className={cn("flex gap-2", className)}>
      <button
        type="button"
        onClick={() => dispatchPrompt(`I want to reschedule meeting ${id}`)}
        className={cn(btnBase, "flex-1 py-1.5 hover:bg-cream hover:text-ink")}
      >
        <span aria-hidden>↺ </span>Reschedule
      </button>
      <button
        type="button"
        onClick={() => dispatchPrompt(`I want to cancel meeting ${id}`)}
        className={cn(btnBase, "flex-1 py-1.5 text-signal hover:bg-warm hover:text-paper")}
      >
        <span aria-hidden>✕ </span>Cancel
      </button>
    </div>
  );
}

/* ─── Host Grid ──────────────────────────────────────────── */
export function BookingHostGrid({ hosts }: { hosts: BookingHost[] }) {
  if (!hosts.length) {
    return <p className={cn(CARD, "p-3 font-mono text-xs")}>No team members have opened their calendar yet.</p>;
  }
  return (
    <div className="my-1 flex flex-col gap-2">
      {hosts.map((h) => (
        <div key={h.booking_link} className={cn(CARD, "flex items-center gap-3 p-3")}>
          <div className="relative size-9 shrink-0 overflow-hidden border-2 border-line bg-paper-2">
            {h.avatar ? (
              <Image
                src={
                  h.avatar.startsWith("http") || h.avatar.startsWith("/")
                    ? h.avatar
                    : `https://cdn.discordapp.com/avatars/${h.discord_id}/${h.avatar}.webp?size=64`
                }
                alt={h.title ?? h.username}
                fill
                className="object-cover"
                sizes="36px"
                unoptimized
              />
            ) : (
              <span aria-hidden className="halftone block size-full" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-black uppercase">{h.title ?? h.username}</p>
            {h.title && <p className="truncate font-mono text-[10px] opacity-75">@{h.username}</p>}
          </div>
          <button
            type="button"
            onClick={() => dispatchPrompt(`Book a call with ${h.title ?? h.username}`)}
            className={cn(btnBase, "bg-orange px-3 py-1.5 text-ink")}
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Slot Picker ────────────────────────────────────────── */
function formatSlot(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
}

export function SlotPicker({ data }: { data: BookingSlotBlock }) {
  const [picked, setPicked] = useState<string | null>(null);

  function handlePick(slot: string) {
    setPicked(slot);
    dispatchPrompt(`I'd like the ${formatSlot(slot)} IST slot`);
  }

  return (
    <div className={cn(CARD, "my-1")}>
      <p className={cn(LABEL, "border-b-2 border-line px-3 py-2 text-signal")}>
        {data.host_name} ·{" "}
        {new Date(data.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}{" "}
        · {data.duration} min
      </p>
      <div className="grid grid-cols-3 gap-2 p-3">
        {data.slots.length === 0 && (
          <p className="col-span-3 font-mono text-xs opacity-80">No slots available on this date.</p>
        )}
        {data.slots.map((slot) => (
          <button
            key={slot}
            type="button"
            aria-pressed={picked === slot}
            onClick={() => handlePick(slot)}
            className={cn(btnBase, "py-1.5", picked === slot ? "bg-orange text-ink" : "hover:bg-cream hover:text-ink")}
          >
            {formatSlot(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Booking Confirmation Card ──────────────────────────── */
export function BookingConfirmCard({ data }: { data: BookingConfirmBlock }) {
  const rows = [
    ["Host", data.host],
    ["Date", data.date_label],
    ["Time", data.time_label],
    ["Duration", `${data.duration} minutes`],
  ];
  return (
    <div className={cn(CARD, "my-1")}>
      <p className={cn(LABEL, "flex items-center gap-2 border-b-2 border-line bg-slime px-3 py-2 text-ink")}>
        <span aria-hidden>✓</span> Session Confirmed
      </p>
      <dl className="space-y-1.5 p-3">
        {rows.map(([term, value]) => (
          <div key={term} className="flex justify-between gap-3 text-xs">
            <dt className="font-mono opacity-75">{term}</dt>
            <dd className="text-right font-black">{value}</dd>
          </div>
        ))}
      </dl>
      {data.meeting_id && <ActionPair id={data.meeting_id} className="border-t-2 border-line px-3 py-2" />}
    </div>
  );
}

/* ─── Meeting List ───────────────────────────────────────── */
function fmtTime(ms: number) {
  return new Date(ms).toLocaleString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
}

export function MeetingList({ meetings }: { meetings: MeetingItem[] }) {
  if (!meetings.length) {
    return <p className={cn(CARD, "p-3 font-mono text-xs")}>No upcoming meetings found.</p>;
  }

  return (
    <div className="my-1 flex flex-col gap-2">
      {meetings.map((m) => (
        <div key={m.id} className={CARD}>
          <div className="border-b border-line/30 px-3 py-2">
            <p className="truncate text-xs font-black">{m.title}</p>
            <p className="font-mono text-[10px] opacity-75">{fmtTime(m.scheduled_time)}</p>
          </div>
          <ActionPair id={m.id} className="px-3 py-2" />
        </div>
      ))}
    </div>
  );
}

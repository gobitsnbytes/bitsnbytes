"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Calendar, Clock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

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
  date: string;           // YYYY-MM-DD
  host_name: string;
  booking_link: string;
  discord_id: string;
  duration: number;
  slots: string[];        // ISO datetime strings
}

export interface BookingConfirmBlock {
  host: string;
  date_label: string;     // e.g. "Monday, July 20"
  time_label: string;     // e.g. "10:30 AM IST"
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

/* ─── Shared button style ────────────────────────────────── */
const btnBase =
  "border-2 border-[#120f0a] font-black uppercase text-[10px] tracking-wider transition-all shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

function dispatchPrompt(text: string) {
  window.dispatchEvent(new CustomEvent("bb:qna-prompt", { detail: text }));
}

/* ─── Host Grid ──────────────────────────────────────────── */
export function BookingHostGrid({ hosts }: { hosts: BookingHost[] }) {
  if (!hosts.length) {
    return (
      <p className="text-xs font-mono text-[#716f6c] bg-[#f4d9d1] border-2 border-[#97192c] p-3">
        No team members have opened their calendar yet.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2 my-1">
      {hosts.map((h) => (
        <div
          key={h.booking_link}
          className="flex items-center gap-3 bg-white border-2 border-[#120f0a] p-3 shadow-[3px_3px_0px_0px_#120f0a]"
        >
          <div className="relative w-9 h-9 rounded-full border-2 border-[#120f0a] overflow-hidden bg-neutral-100 shrink-0">
            {h.avatar ? (
              <Image src={h.avatar} alt={h.username} fill className="object-cover" sizes="36px" />
            ) : (
              <User className="w-full h-full p-2 text-[#a09f9d]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-xs text-[#120f0a] truncate">{h.username}</p>
            {h.title && <p className="text-[10px] font-mono text-[#716f6c] truncate">{h.title}</p>}
          </div>
          <button
            onClick={() => dispatchPrompt(`Book a call with ${h.username}`)}
            className={`${btnBase} px-3 py-1.5 bg-[#97192c] text-white text-[9px] hover:bg-[#791423]`}
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Slot Picker ────────────────────────────────────────── */
export function SlotPicker({ data }: { data: BookingSlotBlock }) {
  const [picked, setPicked] = useState<string | null>(null);

  function formatSlot(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  }

  function handlePick(slot: string) {
    setPicked(slot);
    const label = formatSlot(slot);
    dispatchPrompt(`I'd like the ${label} IST slot`);
  }

  return (
    <div className="my-1 bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]">
      <div className="flex items-center gap-2 border-b-2 border-[#120f0a] px-3 py-2 bg-[#eae8e4]">
        <Calendar className="w-3.5 h-3.5 text-[#97192c]" />
        <span className="text-[10px] font-black uppercase tracking-wider text-[#120f0a]">
          {data.host_name} · {new Date(data.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} · {data.duration} min
        </span>
      </div>
      <div className="p-3 grid grid-cols-3 gap-2">
        {data.slots.length === 0 && (
          <p className="col-span-3 text-xs font-mono text-[#716f6c]">No slots available on this date.</p>
        )}
        {data.slots.map((slot) => (
          <button
            key={slot}
            onClick={() => handlePick(slot)}
            className={`${btnBase} py-1.5 text-[10px] ${
              picked === slot
                ? "bg-[#fc920d] border-[#fc920d] text-[#120f0a]"
                : "bg-white text-[#413f3b] hover:bg-[#fee9cf]"
            }`}
          >
            <Clock className="w-2.5 h-2.5 inline mr-1" />
            {formatSlot(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Booking Confirmation Card ──────────────────────────── */
export function BookingConfirmCard({ data }: { data: BookingConfirmBlock }) {
  return (
    <div className="my-1 bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]">
      <div className="flex items-center gap-2 border-b-2 border-[#120f0a] px-3 py-2 bg-[#97192c]">
        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        <span className="text-[10px] font-black uppercase tracking-wider text-white">Session Confirmed</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-mono text-[#716f6c]">Host</span>
          <span className="font-black text-[#120f0a]">{data.host}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-mono text-[#716f6c]">Date</span>
          <span className="font-black text-[#120f0a]">{data.date_label}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-mono text-[#716f6c]">Time</span>
          <span className="font-black text-[#120f0a]">{data.time_label}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-mono text-[#716f6c]">Duration</span>
          <span className="font-black text-[#120f0a]">{data.duration} minutes</span>
        </div>
      </div>
      {data.meeting_id && (
        <div className="border-t-2 border-[#120f0a] px-3 py-2 flex gap-2">
          <button
            onClick={() => dispatchPrompt(`I want to reschedule meeting ${data.meeting_id}`)}
            className={`${btnBase} flex-1 py-1.5 bg-[#eae8e4] text-[#120f0a] text-[9px] flex items-center justify-center gap-1`}
          >
            <RotateCcw className="w-2.5 h-2.5" /> Reschedule
          </button>
          <button
            onClick={() => dispatchPrompt(`I want to cancel meeting ${data.meeting_id}`)}
            className={`${btnBase} flex-1 py-1.5 bg-white text-[#97192c] text-[9px] flex items-center justify-center gap-1`}
          >
            <XCircle className="w-2.5 h-2.5" /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Meeting List ───────────────────────────────────────── */
export function MeetingList({ meetings }: { meetings: MeetingItem[] }) {
  if (!meetings.length) {
    return (
      <p className="text-xs font-mono text-[#716f6c] bg-[#eae8e4] border-2 border-[#120f0a] p-3">
        No upcoming meetings found.
      </p>
    );
  }

  function fmtTime(ms: number) {
    return new Date(ms).toLocaleString("en-IN", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Kolkata", hour12: true,
    });
  }

  return (
    <div className="flex flex-col gap-2 my-1">
      {meetings.map((m) => (
        <div
          key={m.id}
          className="bg-white border-2 border-[#120f0a] shadow-[3px_3px_0px_0px_#120f0a]"
        >
          <div className="px-3 py-2 border-b border-[#120f0a]/20">
            <p className="font-black text-xs text-[#120f0a] truncate">{m.title}</p>
            <p className="text-[10px] font-mono text-[#716f6c]">{fmtTime(m.scheduled_time)}</p>
          </div>
          <div className="flex gap-2 px-3 py-2">
            <button
              onClick={() => dispatchPrompt(`I want to reschedule meeting ${m.id}`)}
              className={`${btnBase} flex-1 py-1 bg-[#eae8e4] text-[#120f0a] text-[9px] flex items-center justify-center gap-1`}
            >
              <RotateCcw className="w-2.5 h-2.5" /> Reschedule
            </button>
            <button
              onClick={() => dispatchPrompt(`I want to cancel meeting ${m.id}`)}
              className={`${btnBase} flex-1 py-1 bg-white text-[#97192c] text-[9px] flex items-center justify-center gap-1`}
            >
              <XCircle className="w-2.5 h-2.5" /> Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

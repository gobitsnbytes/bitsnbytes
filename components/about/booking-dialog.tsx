"use client";

// Team call booking (Motherboard hosts), moved from the old app/about/page.tsx. Same steps, API
// calls, validation and states; only the chrome follows the Print Riot tokens.

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Loader2, User, X } from "lucide-react";

import type { MotherboardHost } from "./data";

type BookingStep = "date" | "slots" | "form" | "confirm";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const SMALL_BTN =
  "border-2 border-ink bg-white p-1 text-ink shadow-[2px_2px_0_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
const FIELD =
  "w-full border-2 border-ink bg-white p-2.5 font-mono text-sm text-ink shadow-[2px_2px_0_0_var(--ink)] placeholder:text-[#716f6c] focus:border-burgundy";
const LABEL = "block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy";

function formatSlot(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    hour12: true,
  });
}

function formatDateHeader(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function CalendarGrid({
  year,
  month,
  selected,
  onSelect,
}: {
  year: number;
  month: number;
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="w-full">
      <div className="mb-1 grid grid-cols-7">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-center font-mono text-[10px] font-bold uppercase text-[#716f6c]">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dateObj = new Date(year, month, day);
          const isPast = dateObj < today;
          const isSelected = selected === dateStr;

          return (
            <button
              key={idx}
              type="button"
              disabled={isPast}
              aria-pressed={isSelected}
              onClick={() => onSelect(dateStr)}
              className={`flex aspect-square items-center justify-center border-2 font-sans text-sm font-bold transition-colors ${
                isPast
                  ? "cursor-not-allowed border-transparent text-[#a09f9d]"
                  : "cursor-pointer border-transparent text-ink hover:border-ink hover:bg-cream"
              } ${isSelected ? "!border-ink !bg-orange text-ink shadow-[2px_2px_0_0_var(--ink)]" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BookingDialog({
  host,
  open,
  onClose,
}: {
  host: MotherboardHost;
  open: boolean;
  onClose: () => void;
}) {
  const today = new Date();
  const [step, setStep] = useState<BookingStep>("date");
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<15 | 30 | 45 | 60>(30);

  // Form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const resetAll = useCallback(() => {
    const now = new Date();
    setStep("date");
    setSelectedDate(null);
    setSlots([]);
    setSlotsError(null);
    setSelectedSlot(null);
    setDuration(30);
    setGuestName("");
    setGuestEmail("");
    setMessage("");
    setFormError(null);
    setCalYear(now.getFullYear());
    setCalMonth(now.getMonth());
  }, []);

  // Fetch slots when a date is picked
  useEffect(() => {
    if (!selectedDate || !host.booking_link) return;
    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);

    fetch(`/api/team/schedule/slots?bookingLink=${encodeURIComponent(host.booking_link)}&date=${selectedDate}&duration=${duration}`)
      .then((r) => r.json())
      .then((data: string[] | { error: string }) => {
        if (Array.isArray(data)) {
          setSlots(data);
          setStep("slots");
        } else {
          setSlotsError("Could not load availability for this date.");
        }
      })
      .catch(() => setSlotsError("Network error fetching slots."))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, host.booking_link, duration]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!guestName.trim()) { setFormError("Your name is required."); return; }
    if (!guestEmail.trim() || !guestEmail.includes("@")) { setFormError("A valid email is required."); return; }
    if (!selectedSlot) { setFormError("No time slot selected."); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/team/schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingLink: host.booking_link,
          hostDiscordId: host.discord_id,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          message: message.trim() || undefined,
          slotISO: selectedSlot,
          duration,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(
          typeof data.error === "string"
            ? data.error
            : "Failed to book the call. Please try again or email us directly."
        );
        return;
      }

      setStep("confirm");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  const hostName = host.title ?? host.username ?? host.booking_link;
  const hostTitle = host.title ?? "bits&bytes™ Team";
  const stepMotion = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] as const },
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { resetAll(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="halftone fixed inset-0 z-50 bg-ink/70" />
        <Dialog.Content
          data-lenis-prevent
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-24px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto border-4 border-ink bg-paper-2 text-ink shadow-[8px_8px_0_0_var(--ink)] focus:outline-none"
          aria-describedby="booking-dialog-desc"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b-4 border-ink bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative size-10 shrink-0 overflow-hidden border-2 border-ink bg-paper-2 shadow-[2px_2px_0_0_var(--ink)]">
                {host.avatar ? (
                  <Image
                    src={
                      host.avatar.startsWith("http") || host.avatar.startsWith("/")
                        ? host.avatar
                        : `https://cdn.discordapp.com/avatars/${host.discord_id}/${host.avatar}.webp?size=128`
                    }
                    alt={hostName}
                    fill
                    className="object-cover"
                    sizes="40px"
                    unoptimized
                  />
                ) : (
                  <User aria-hidden className="size-full p-2 text-[#716f6c]" />
                )}
              </div>
              <div>
                <Dialog.Title className="font-sans text-sm font-black uppercase tracking-tight text-ink">
                  Book with {hostName}
                </Dialog.Title>
                <p id="booking-dialog-desc" className="font-mono text-[10px] text-[#716f6c]">
                  {hostTitle} · {duration} min · Discord VC
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button type="button" className={`${SMALL_BTN} p-1.5`} aria-label="Close">
                <X aria-hidden className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Step Indicator */}
          {step !== "confirm" && (
            <div className="flex gap-1 border-b-2 border-ink/10 bg-white px-4 pb-3 pt-2">
              {(["date", "slots", "form"] as BookingStep[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                      step === s
                        ? "text-burgundy"
                        : ["slots", "form"].indexOf(step) > ["slots", "form"].indexOf(s)
                          ? "text-ink"
                          : "text-[#716f6c]"
                    }`}
                  >
                    <span
                      className={`flex size-4 items-center justify-center border-2 text-[8px] ${
                        step === s ? "border-burgundy bg-burgundy text-paper" : "border-[#716f6c] text-[#716f6c]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="hidden sm:inline">{s === "date" ? "Pick Date" : s === "slots" ? "Pick Time" : "Your Details"}</span>
                  </div>
                  {i < 2 && <div className="mx-1 flex-1 self-center border-t-2 border-ink/10" />}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="p-5">
            <AnimatePresence mode="wait">
              {/* ── Step: date ── */}
              {step === "date" && (
                <motion.div key="date" {...stepMotion}>
                  <div className="mb-4 flex items-center justify-between">
                    <button type="button" onClick={prevMonth} className={SMALL_BTN} aria-label="Previous month">
                      <ChevronLeft aria-hidden className="size-4" />
                    </button>
                    <h3 className="font-sans text-sm font-black uppercase tracking-wide">
                      {MONTHS[calMonth]} {calYear}
                    </h3>
                    <button type="button" onClick={nextMonth} className={SMALL_BTN} aria-label="Next month">
                      <ChevronRight aria-hidden className="size-4" />
                    </button>
                  </div>
                  {/* Duration picker */}
                  <div className="mb-5">
                    <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#716f6c]">Session duration</p>
                    <div className="flex gap-2">
                      {([15, 30, 45, 60] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={duration === d}
                          onClick={() => { setDuration(d); setSelectedDate(null); setSlots([]); }}
                          className={`flex-1 border-2 border-ink py-1.5 font-mono text-xs font-bold shadow-[2px_2px_0_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_var(--ink)] active:shadow-none ${
                            duration === d ? "bg-orange text-ink" : "bg-white text-[#413f3b] hover:bg-cream"
                          }`}
                        >
                          {d}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <CalendarGrid year={calYear} month={calMonth} selected={selectedDate} onSelect={handleDateSelect} />

                  {slotsLoading && (
                    <div role="status" className="mt-4 flex items-center gap-2 font-mono text-sm text-[#716f6c]">
                      <Loader2 aria-hidden className="size-4 animate-spin" />
                      Loading availability…
                    </div>
                  )}
                  {slotsError && (
                    <p role="alert" className="mt-4 border-2 border-burgundy bg-[#f4d9d1] p-2 text-xs font-bold text-burgundy">
                      {slotsError}
                    </p>
                  )}

                  <p className="mt-4 font-mono text-[10px] text-[#716f6c]">All times shown in IST (Asia/Kolkata).</p>
                </motion.div>
              )}

              {/* ── Step: slots ── */}
              {step === "slots" && (
                <motion.div key="slots" {...stepMotion}>
                  <div className="mb-4 flex items-center gap-2">
                    <button type="button" onClick={() => setStep("date")} className={SMALL_BTN} aria-label="Back">
                      <ChevronLeft aria-hidden className="size-4" />
                    </button>
                    <h3 className="font-sans text-xs font-black uppercase tracking-wide text-[#413f3b]">
                      {selectedDate ? formatDateHeader(selectedDate + "T00:00:00+05:30") : ""}
                    </h3>
                  </div>

                  {slots.length === 0 ? (
                    <div className="border-4 border-ink bg-white p-6 text-center shadow-[4px_4px_0_0_var(--ink)]">
                      <Calendar aria-hidden className="mx-auto mb-2 size-8 text-[#716f6c]" />
                      <p className="font-sans text-sm font-black uppercase text-[#413f3b]">No open slots</p>
                      <p className="mt-1 font-mono text-xs text-[#716f6c]">Try a different date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={`border-2 border-ink py-2 font-mono text-xs font-bold shadow-[2px_2px_0_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_0_var(--ink)] active:shadow-none ${
                            selectedSlot === slot ? "bg-orange text-ink" : "bg-white hover:bg-cream"
                          }`}
                        >
                          {formatSlot(slot)}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 font-mono text-[10px] text-[#716f6c]">
                    Each session is {duration} minutes via Discord voice channel.
                  </p>
                </motion.div>
              )}

              {/* ── Step: form ── */}
              {step === "form" && (
                <motion.div key="form" {...stepMotion}>
                  <div className="mb-4 flex items-center gap-2">
                    <button type="button" onClick={() => setStep("slots")} className={SMALL_BTN} aria-label="Back">
                      <ChevronLeft aria-hidden className="size-4" />
                    </button>
                    <div>
                      <p className="font-mono text-[10px] text-[#716f6c]">Selected time</p>
                      <p className="font-sans text-sm font-black text-ink">
                        {selectedSlot ? formatSlot(selectedSlot) : ""} · {selectedDate ? formatDateHeader(selectedDate + "T00:00:00+05:30") : ""}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="booking-name" className={LABEL}>Your Name</label>
                      <input
                        id="booking-name"
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Full name"
                        className={FIELD}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="booking-email" className={LABEL}>Email Address</label>
                      <input
                        id="booking-email"
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={FIELD}
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="booking-message" className={LABEL}>
                        What do you want to talk about? <span className="normal-case text-[#716f6c]">(optional)</span>
                      </label>
                      <textarea
                        id="booking-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Brief context — partnership, collaboration, advice, etc."
                        rows={3}
                        maxLength={500}
                        className={`${FIELD} resize-none`}
                      />
                      <p className="text-right font-mono text-[9px] text-[#716f6c]">{message.length}/500</p>
                    </div>

                    <div className="flex items-start gap-2 border-2 border-ink bg-white p-2.5">
                      <input
                        type="checkbox"
                        id="booking-consent"
                        required
                        className="mt-0.5 size-3.5 shrink-0 cursor-pointer border-2 border-ink accent-burgundy"
                      />
                      <label htmlFor="booking-consent" className="cursor-pointer select-none font-sans text-[11px] leading-tight text-[#413f3b]">
                        I agree to the <Link href="/terms" target="_blank" className="font-bold text-burgundy underline">Terms</Link> and <Link href="/privacy" target="_blank" className="font-bold text-burgundy underline">Privacy Policy</Link>, and consent to processing my contact details for this calendar booking.
                      </label>
                    </div>

                    {formError && (
                      <p role="alert" className="border-2 border-burgundy bg-[#f4d9d1] p-2 text-xs font-bold text-burgundy">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-ink bg-orange py-3 font-sans text-sm font-black uppercase tracking-wide text-ink shadow-[4px_4px_0_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <><Loader2 aria-hidden className="size-4 animate-spin" /> Booking…</>
                      ) : (
                        <>Confirm Booking</>
                      )}
                    </button>

                    <p className="text-center font-mono text-[9px] text-[#716f6c]">
                      A confirmation email will be sent to your address. The Discord VC link will be included.
                    </p>
                  </form>
                </motion.div>
              )}

              {/* ── Step: confirm ── */}
              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="py-6 text-center"
                >
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center border-4 border-ink bg-orange shadow-[4px_4px_0_0_var(--ink)]">
                    <CheckCircle aria-hidden className="size-8 text-ink" />
                  </div>
                  <h3 className="mb-2 font-sans text-2xl font-black uppercase text-ink">You&apos;re booked!</h3>
                  <p className="mx-auto mb-1 max-w-xs font-serif text-sm leading-relaxed text-[#413f3b]">
                    Your call with <strong>{hostName}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedSlot ? formatSlot(selectedSlot) : ""} IST</strong> is confirmed.
                  </p>
                  <p className="mb-6 mt-2 font-mono text-xs text-[#716f6c]">
                    Check your inbox for the calendar invite with the Discord VC link.
                  </p>
                  <button
                    type="button"
                    onClick={() => { resetAll(); onClose(); }}
                    className="border-2 border-ink bg-white px-6 py-2.5 font-sans text-sm font-black uppercase shadow-[3px_3px_0_0_var(--ink)] transition-[transform,box-shadow] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_0_var(--ink)] active:shadow-none"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

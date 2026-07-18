"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Globe,
  Users,
  Sparkles,
  Heart,
  ShieldAlert,
  MapPin,
  ArrowUp,
  User,
  Instagram,
  Mail,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  X,
  ExternalLink,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";

// Starburst component for branding/retro aesthetics
const Starburst = ({ className = "text-[#97192c]", size = 32 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M50 0 L58 28 L85 15 L70 39 L97 50 L70 61 L85 85 L58 72 L50 100 L42 72 L15 85 L30 61 L3 50 L30 39 L15 15 L42 28 Z" />
  </svg>
);

// Sparkle star icon
const SparkleStar = ({ className = "text-[#fc920d]", size = 16 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
  </svg>
);

const aboutContent = {
  title: "About bits&bytes™",
  description:
    "We are a youth-led builder network building the alternative to rigid, beginner-locked tech events. Run entirely by teenagers, built from scratch.",
  sections: [
    {
      title: "The Origin Story",
      color: "bg-[#fee9cf]",
      icon: Sparkles,
      description:
        "In July 2025, our team was organizing a major regional student hackathon under an external partner organization. When they cancelled the event at the last minute, we refused to quit. To build something independent and reliable, we founded bits&bytes™ in November 2025. Originally planning a single cope hackathon, we quickly grew into a sustainable nationwide teen builder network.",
    },
    {
      title: "High Agency Only",
      color: "bg-[#f4d9d1]",
      icon: ShieldAlert,
      description:
        "We don't do hand-holding or rigid formats. bits&bytes™ is run entirely by and for teenagers. You'll be surrounded by people who want to write code and launch real projects, not just sit through lectures and collect certificates.",
    },
    {
      title: "Distributed Forks",
      color: "bg-[#df8e74]",
      icon: MapPin,
      description:
        "Forks are a distributed model where local builders run their own nodes without waiting for permission. They are active in Jaipur, Hyderabad, Bangalore, Kolkata, and Noida, where local teams run their own events and dev squads.",
    },
    {
      title: "Ship Real Products",
      color: "bg-[#fee9cf]",
      icon: Heart,
      description:
        "Our meetups and hack nights have to end with something launched, not just something learned. We don't build throwaway demos that only exist for a presentation slide. We build actual software that people use.",
    },
  ],
};

// ─── Email helper ────────────────────────────────────────────────────────────
// Derives team member email from their display name: "Aadrika Maurya" → "aadrika@gobitsnbytes.org"
function getTeamEmail(name: string): string {
  const first = name.trim().split(/\s+/)[0].toLowerCase();
  return `${first}@gobitsnbytes.org`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface CoreTeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image: string;
  linkedin?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
  isFounder?: boolean;
  isFeatured?: boolean;
}

interface Volunteer {
  id: number;
  name: string;
  image: string;
  linkedin?: string;
  section: "Creative" | "Tech" | "Outreach" | "Operations";
  role?: string;
}

interface MotherboardHost {
  discord_id: string;
  booking_link: string;
  timezone: string;
  weekly_hours: string | null;
  is_active: boolean;
  // Extended fields from the availability endpoint
  username?: string;
  title?: string;
  description?: string;
  avatar?: string;
}

// ─── Core team data ───────────────────────────────────────────────────────────

const coreTeam: CoreTeamMember[] = [
  {
    id: 1,
    name: "Yash Singh",
    role: "Chief Executive Officer (CEO)",
    image: "/team/yash.jpeg",
    bio: "Math qualifier (IOQM) & AI prototyping dev. Created Codiva (5-star VS Code extension with thousands of users) and lead community hardware sessions.",
    socials: {
      linkedin: "https://www.linkedin.com/in/yashvardhansinghbnb/",
      github: "https://github.com/yashclouded",
      website: "https://yashvibe.codes/",
    },
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika Maurya",
    role: "Chief Creative Officer & COO",
    image: "/team/aadrika.png",
    bio: "RSI India Alumni who conducted neuroscience research on EEG signals and attention modeling. Leads brand visual voice and creative strategies.",
    socials: {
      linkedin: "https://www.linkedin.com/in/aadrika-maurya/",
      github: "https://github.com/Aadrika08",
      website: "https://aadrikasportfolio.framer.website/",
    },
    isFounder: true,
    isFeatured: true,
  },
  {
    id: 3,
    name: "Akshat Kushwaha",
    role: "Chief Technology Officer (CTO)",
    image: "/team/akshat.jpg",
    bio: "Primary systems architect. Ex Jr. Research Engineer at jhana.ai. Builds high-performance retrieval pipelines and production infra.",
    socials: {
      linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
      github: "https://github.com/a3ro-dev",
      website: "https://a3ro.dev",
    },
    isFounder: true,
  },
  {
    id: 4,
    name: "Devaansh Pathak",
    role: "Chief Financial Officer (CFO)",
    image: "/team/devansh.jpeg",
    bio: "Co-architected high-performance backend layers and manages partner accounts, sponsors, and budget logistics.",
    socials: {
      linkedin: "https://www.linkedin.com/in/devaanshpa/",
    },
  },
  {
    id: 5,
    name: "Drishti Arora",
    role: "Chief Growth Officer (CGO)",
    image: "/team/drishti.jpg",
    bio: "Leads audience campaigns, community growth, brand strategy, and coordination across regional cohorts.",
    socials: {
      linkedin: "https://www.linkedin.com/in/drish-arora",
    },
  },
  {
    id: 6,
    name: "Raghwender Vasisth",
    role: "Head of Operations",
    image: "/team/raghav.png",
    bio: "Manages process automation, resource planning, logistical support, and team operations at scale.",
    socials: {
      linkedin: "https://www.linkedin.com/in/raghwender-vasisth/",
    },
  },
  {
    id: 7,
    name: "Maryam Fatima",
    role: "Head of Brand & Media",
    image: "/team/maryam.jpeg",
    bio: "Oversees media assets, visual content, graphic identity, and social media campaigns.",
    socials: {
      linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
    },
  },
  {
    id: 8,
    name: "Srishti Singh",
    role: "Head of Partnerships",
    image: "/team/srishti.jpeg",
    bio: "Coordinates institutional relations, sponsor liaisons, and communications across regional chapters.",
    socials: {
      linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
    },
  },
  {
    id: 9,
    name: "Angel",
    role: "Head of Research & Strategy",
    image: "/team/angel.jpg",
    bio: "Leads strategic research initiatives, community analysis, and organizational growth frameworks.",
    socials: {
      linkedin: "https://www.linkedin.com/in/angelp-online/",
      instagram: "https://www.instagram.com/rightangeled/",
    },
  },
];

// Contributors
const volunteers: Volunteer[] = [
  // Operations Track
  {
    id: 21,
    name: "Shantanu Joshi",
    role: "Ground Operations",
    image: "/team/shantanu.jpeg",
    linkedin: "https://www.linkedin.com/in/theshantanujoshi/",
    section: "Operations",
  },
  {
    id: 8,
    name: "Atharva",
    role: "Fork Ops Support",
    image: "/team/atharva.jpg",
    linkedin: "https://www.linkedin.com/in/atharvaupadhyay/",
    section: "Operations",
  },
  // Outreach Track
  {
    id: 14,
    name: "Adithya",
    role: "Sponsor Outreach",
    image: "/team/adhitya.png",
    linkedin: "https://www.linkedin.com/in/adithya---k/",
    section: "Outreach",
  },
  {
    id: 17,
    name: "Aanjaneya",
    role: "Community Outreach",
    image: "/team/aanjaneya.jpg",
    linkedin: "https://www.linkedin.com/in/aanjaneya-tripathi-0700a4346/",
    section: "Outreach",
  },
  // Creative Track
  {
    id: 11,
    name: "Jaagruti",
    role: "Graphic & Video",
    image: "/team/jaagruti.jpeg",
    section: "Creative",
  },
  {
    id: 16,
    name: "Vareesha",
    role: "Graphic & Video",
    image: "/team/vareesha.jpg",
    linkedin: "https://www.linkedin.com/in/vareesha-mehdi-a669203ab/",
    section: "Creative",
  },
  {
    id: 13,
    name: "Aishwary",
    role: "Video Editing",
    image: "/team/aishwary.jpeg",
    linkedin: "https://www.linkedin.com/in/ashlovesnoodle",
    section: "Creative",
  },
  {
    id: 22,
    name: "Swastika",
    role: "Video Editing",
    image: "/team/swastika.jpg",
    section: "Creative",
  },
  {
    id: 23,
    name: "Diaa",
    role: "Email & Reel Editor",
    image: "/team/diaa.jpg",
    section: "Creative",
  },
  // Tech Track
  {
    id: 5,
    name: "Hridyansh",
    role: "Platform Engineer",
    image: "/team/hirdyansh.jpeg",
    linkedin: "https://www.linkedin.com/in/hridyansh-bhardwaj-739470406/",
    section: "Tech",
  },
  {
    id: 15,
    name: "Prakhar",
    role: "Fork Software Systems",
    image: "/team/prakhar.png",
    linkedin: "https://www.linkedin.com/in/prakharrdev/",
    section: "Tech",
  },
  {
    id: 7,
    name: "Areeb",
    role: "Dev and Project Manager",
    image: "/team/areeb.png",
    linkedin: "https://www.linkedin.com/in/areeb-ahmad-066547315/",
    section: "Tech",
  },
];

// ─── Booking Dialog ───────────────────────────────────────────────────────────

type BookingStep = "date" | "slots" | "form" | "confirm";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-black uppercase text-[#716f6c] py-1">
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
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-sm font-bold border-2 transition-all
                ${isPast ? "text-[#d0cfce] border-transparent cursor-not-allowed" : "cursor-pointer border-transparent hover:border-[#120f0a] hover:bg-[#fee9cf]"}
                ${isSelected ? "!bg-[#fc920d] !border-[#120f0a] text-[#120f0a] shadow-[2px_2px_0px_0px_#120f0a]" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingDialog({
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
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
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
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const hostName = host.username ?? host.booking_link;
  const hostTitle = host.title ?? "bits&bytes™ Team";

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { resetAll(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#eae8e4] border-4 border-[#120f0a] shadow-[8px_8px_0px_0px_#120f0a] focus:outline-none"
          aria-describedby="booking-dialog-desc"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-4 border-[#120f0a] p-4 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-[#120f0a] overflow-hidden bg-neutral-100 shrink-0 shadow-[2px_2px_0px_0px_#120f0a]">
                {host.avatar ? (
                  <Image src={host.avatar} alt={hostName} fill className="object-cover" sizes="40px" />
                ) : (
                  <User className="w-full h-full p-2 text-[#a09f9d]" />
                )}
              </div>
              <div>
                <Dialog.Title className="font-black uppercase text-sm tracking-tight font-sans text-[#120f0a]">
                  Book with {hostName}
                </Dialog.Title>
                <p id="booking-dialog-desc" className="text-[10px] font-mono text-[#716f6c]">
                  {hostTitle} · {duration} min · Discord VC
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="border-2 border-[#120f0a] p-1.5 bg-white shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-[#120f0a]" />
              </button>
            </Dialog.Close>
          </div>

          {/* Step Indicator */}
          {step !== "confirm" && (
            <div className="flex border-b-2 border-[#120f0a]/10 bg-white px-4 pb-3 pt-2 gap-1">
              {(["date", "slots", "form"] as BookingStep[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider font-mono ${step === s ? "text-[#97192c]" : (["slots", "form"].indexOf(step) > ["slots", "form"].indexOf(s)) ? "text-[#120f0a]" : "text-[#a09f9d]"}`}>
                    <span className={`w-4 h-4 border-2 flex items-center justify-center text-[8px] ${step === s ? "border-[#97192c] bg-[#97192c] text-white" : "border-[#a09f9d] text-[#a09f9d]"}`}>{i + 1}</span>
                    <span className="hidden sm:inline">{s === "date" ? "Pick Date" : s === "slots" ? "Pick Time" : "Your Details"}</span>
                  </div>
                  {i < 2 && <div className="flex-1 border-t-2 border-[#120f0a]/10 self-center mx-1" />}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="p-5">
            <AnimatePresence mode="wait">
              {/* ── Step: date ── */}
              {step === "date" && (
                <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="border-2 border-[#120f0a] p-1 bg-white shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-black uppercase font-sans text-sm tracking-wide">
                      {MONTHS[calMonth]} {calYear}
                    </h3>
                    <button onClick={nextMonth} className="border-2 border-[#120f0a] p-1 bg-white shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Duration picker */}
                  <div className="mb-5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#716f6c] mb-2">Session duration</p>
                    <div className="flex gap-2">
                      {([15, 30, 45, 60] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => { setDuration(d); setSelectedDate(null); setSlots([]); }}
                          className={`flex-1 border-2 border-[#120f0a] py-1.5 text-xs font-black font-mono transition-all shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:shadow-none ${
                            duration === d ? "bg-[#fc920d] text-[#120f0a]" : "bg-white text-[#413f3b] hover:bg-[#fee9cf]"
                          }`}
                        >
                          {d}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <CalendarGrid
                    year={calYear}
                    month={calMonth}
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                  />

                  {slotsLoading && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-mono text-[#716f6c]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading availability…
                    </div>
                  )}
                  {slotsError && (
                    <p className="mt-4 text-xs font-bold text-[#97192c] bg-[#f4d9d1] border-2 border-[#97192c] p-2">
                      {slotsError}
                    </p>
                  )}

                  <p className="mt-4 text-[10px] font-mono text-[#716f6c]">
                    All times shown in IST (Asia/Kolkata).
                  </p>
                </motion.div>
              )}

              {/* ── Step: slots ── */}
              {step === "slots" && (
                <motion.div key="slots" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setStep("date")} className="border-2 border-[#120f0a] p-1 bg-white shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:shadow-none transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="font-black uppercase font-sans text-xs tracking-wide text-[#413f3b]">
                      {selectedDate ? formatDateHeader(selectedDate + "T00:00:00+05:30") : ""}
                    </h3>
                  </div>

                  {slots.length === 0 ? (
                    <div className="bg-white border-4 border-[#120f0a] p-6 text-center shadow-[4px_4px_0px_0px_#120f0a]">
                      <Calendar className="w-8 h-8 text-[#a09f9d] mx-auto mb-2" />
                      <p className="font-black uppercase text-sm text-[#413f3b]">No open slots</p>
                      <p className="text-xs font-mono text-[#716f6c] mt-1">Try a different date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleSlotSelect(slot)}
                          className={`border-2 border-[#120f0a] py-2 text-xs font-black font-mono transition-all shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:shadow-none ${selectedSlot === slot ? "bg-[#fc920d] text-[#120f0a]" : "bg-white hover:bg-[#fee9cf]"}`}
                        >
                          {formatSlot(slot)}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-[10px] font-mono text-[#716f6c]">
                    Each session is {duration} minutes via Discord voice channel.
                  </p>
                </motion.div>
              )}

              {/* ── Step: form ── */}
              {step === "form" && (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.18 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setStep("slots")} className="border-2 border-[#120f0a] p-1 bg-white shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#120f0a] active:shadow-none transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <p className="text-[10px] font-mono text-[#716f6c]">Selected time</p>
                      <p className="font-black text-sm text-[#120f0a]">
                        {selectedSlot ? formatSlot(selectedSlot) : ""} · {selectedDate ? formatDateHeader(selectedDate + "T00:00:00+05:30") : ""}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#97192c]">Your Name</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Full name"
                        className="w-full border-2 border-[#120f0a] bg-white p-2.5 text-sm font-mono text-[#120f0a] placeholder:text-[#a09f9d] focus:outline-none focus:border-[#97192c] shadow-[2px_2px_0px_0px_#120f0a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#97192c]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border-2 border-[#120f0a] bg-white p-2.5 text-sm font-mono text-[#120f0a] placeholder:text-[#a09f9d] focus:outline-none focus:border-[#97192c] shadow-[2px_2px_0px_0px_#120f0a]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#97192c]">
                        What do you want to talk about? <span className="text-[#a09f9d] normal-case">(optional)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Brief context — partnership, collaboration, advice, etc."
                        rows={3}
                        maxLength={500}
                        className="w-full border-2 border-[#120f0a] bg-white p-2.5 text-sm font-mono text-[#120f0a] placeholder:text-[#a09f9d] focus:outline-none focus:border-[#97192c] shadow-[2px_2px_0px_0px_#120f0a] resize-none"
                      />
                      <p className="text-[9px] font-mono text-right text-[#a09f9d]">{message.length}/500</p>
                    </div>

                    {formError && (
                      <p className="text-xs font-bold text-[#97192c] bg-[#f4d9d1] border-2 border-[#97192c] p-2">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 border-2 border-[#120f0a] bg-[#fc920d] text-[#120f0a] font-black uppercase text-sm tracking-wide py-3 shadow-[4px_4px_0px_0px_#120f0a] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Booking…</>
                      ) : (
                        <>Confirm Booking</>
                      )}
                    </button>

                    <p className="text-[9px] font-mono text-[#716f6c] text-center">
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
                  transition={{ duration: 0.25 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-[#fc920d] border-4 border-[#120f0a] flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_#120f0a]">
                    <CheckCircle className="w-8 h-8 text-[#120f0a]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase font-sans text-[#120f0a] mb-2">You're booked!</h3>
                  <p className="text-sm font-serif-brand text-[#413f3b] leading-relaxed max-w-xs mx-auto mb-1">
                    Your call with <strong>{hostName}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedSlot ? formatSlot(selectedSlot) : ""} IST</strong> is confirmed.
                  </p>
                  <p className="text-xs font-mono text-[#716f6c] mt-2 mb-6">
                    Check your inbox for the calendar invite with the Discord VC link.
                  </p>
                  <button
                    onClick={() => { resetAll(); onClose(); }}
                    className="border-2 border-[#120f0a] bg-white px-6 py-2.5 font-black uppercase text-sm shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#120f0a] active:shadow-none transition-all"
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

// ─── Booking Section ──────────────────────────────────────────────────────────

function BookingSection() {
  const [hosts, setHosts] = useState<MotherboardHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHost, setActiveHost] = useState<MotherboardHost | null>(null);

  useEffect(() => {
    fetch("/api/team/schedule/hosts")
      .then((r) => r.json())
      .then((data: MotherboardHost[] | { error: string }) => {
        if (Array.isArray(data)) {
          setHosts(data.filter((h) => h.is_active));
        } else {
          setError("Could not load team availability.");
        }
      })
      .catch(() => setError("Could not load team availability."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-16" id="book-a-call">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#120f0a]/15 pb-4 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-[#97192c] text-white border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a]">
              <Phone className="w-3 h-3" />
              Book a Call
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-sans">
            Talk to Us
          </h2>
          <p className="text-sm font-serif-brand text-[#716f6c] mt-1 max-w-[50ch]">
            Pick a team member, find an open slot, and book a 30-minute session directly on their calendar.
          </p>
        </div>
        <a
          href="https://cal.gobitsnbytes.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-2 border-[#120f0a] bg-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#120f0a] active:shadow-none transition-all shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open cal.gobitsnbytes.org
        </a>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border-4 border-[#120f0a]/20 p-4 shadow-[4px_4px_0px_0px_#120f0a]/20 animate-pulse h-44" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-[#f4d9d1] border-4 border-[#97192c] p-5 shadow-[4px_4px_0px_0px_#97192c]">
          <p className="font-black uppercase text-sm text-[#97192c]">{error}</p>
          <p className="text-xs font-mono text-[#413f3b] mt-1">
            You can still reach us directly at{" "}
            <a href="https://cal.gobitsnbytes.org" className="underline font-bold">cal.gobitsnbytes.org</a>.
          </p>
        </div>
      )}

      {!loading && !error && hosts.length === 0 && (
        <div className="bg-white border-4 border-[#120f0a] p-8 text-center shadow-[6px_6px_0px_0px_#120f0a]">
          <Calendar className="w-10 h-10 text-[#a09f9d] mx-auto mb-3" />
          <p className="font-black uppercase text-sm text-[#413f3b]">No team members have opened their calendar yet.</p>
          <p className="text-xs font-mono text-[#716f6c] mt-2">
            Try reaching us directly at{" "}
            <a href="https://cal.gobitsnbytes.org" className="underline text-[#97192c] font-bold">cal.gobitsnbytes.org</a>.
          </p>
        </div>
      )}

      {!loading && !error && hosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hosts.map((host) => {
            const displayName = host.username ?? host.booking_link;
            const displayTitle = host.title ?? "bits&bytes™ Team";
            const displayDesc = host.description ?? "Available for a 30-minute call.";

            return (
              <motion.div
                key={host.discord_id}
                className="bg-white border-4 border-[#120f0a] p-4 flex flex-col shadow-[6px_6px_0px_0px_#120f0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#120f0a]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full border-2 border-[#120f0a] overflow-hidden bg-neutral-100 shrink-0 shadow-[2px_2px_0px_0px_#120f0a]">
                    {host.avatar ? (
                      <Image src={host.avatar} alt={displayName} fill className="object-cover" sizes="48px" />
                    ) : (
                      <User className="w-full h-full p-2.5 text-[#a09f9d]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black uppercase text-sm tracking-tight font-sans text-[#120f0a] truncate">{displayName}</h3>
                    <span className="text-[10px] font-bold text-[#97192c] uppercase tracking-wider truncate block">{displayTitle}</span>
                  </div>
                </div>

                <p className="text-xs font-serif-brand text-[#413f3b] leading-relaxed mb-4 flex-1 line-clamp-3">
                  {displayDesc}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#716f6c] mb-3">
                  <Clock className="w-3 h-3 shrink-0" />
                  30 min · Discord VC · IST
                </div>

                <button
                  onClick={() => setActiveHost(host)}
                  className="w-full border-2 border-[#120f0a] bg-[#fc920d] text-[#120f0a] font-black uppercase text-xs tracking-wider py-2.5 shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#120f0a] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
                >
                  Book with {displayName.split(" ")[0]}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Booking Dialog */}
      {activeHost && (
        <BookingDialog
          host={activeHost}
          open={!!activeHost}
          onClose={() => setActiveHost(null)}
        />
      )}
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function About() {
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "founders" | "leadership" | "volunteers">("all");

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const founders = coreTeam.filter(m => m.isFounder);
  const leadership = coreTeam.filter(m => !m.isFounder);

  return (
    <div className="w-full min-h-screen bg-[#eae8e4] text-[#120f0a] pt-28 pb-20 relative z-10 font-sans selection:bg-[#fc920d] selection:text-[#120f0a]">
      {/* Background stipple texture */}
      <div className="absolute inset-0 bg-noise-texture opacity-[0.06] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Title */}
        <header className="mb-12 border-b-4 border-[#120f0a] pb-10 relative">
          <div className="absolute -right-6 -top-6 hidden md:block animate-spin-slow">
            <Starburst size={90} className="text-[#97192c]" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#97192c] text-white border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#120f0a]">
              <Users className="w-3.5 h-3.5" />
              Builder Network
            </span>
            <span className="text-xs font-mono text-[#716f6c] font-semibold">
              GOBITSNBYTES FOUNDATION
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-[#120f0a] leading-none mb-6">
            About <span className="bg-[#fc920d] px-2 py-0.5 border-[3px] border-[#120f0a] inline-block shadow-[4px_4px_0px_0px_#120f0a] -rotate-1">bits&bytes™</span>
          </h1>

          <p className="font-serif-brand text-lg md:text-xl text-[#413f3b] max-w-[70ch] leading-relaxed">
            {aboutContent.description}
          </p>

          <div className="flex flex-wrap gap-2.5 mt-6">
            {["100% Teen-Led", "High-Agency Builder Squads", "Permissionless Distributed Nodes"].map((hl, idx) => (
              <span key={idx} className="bg-white border-2 border-[#120f0a] px-3 py-1 text-xs font-mono font-bold shadow-[2px_2px_0px_0px_#120f0a] flex items-center gap-1">
                <SparkleStar size={10} className="text-[#97192c]" />
                {hl}
              </span>
            ))}
          </div>
        </header>

        {/* 2x2 Grid of Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-8 font-sans border-b-2 border-[#120f0a]/15 pb-2">
            Core Beliefs
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {aboutContent.sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white border-4 border-[#120f0a] p-6 shadow-[6px_6px_0px_0px_#120f0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#120f0a]"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`p-2 border-2 border-[#120f0a] ${section.color} shadow-[2px_2px_0px_0px_#120f0a]`}>
                      <Icon className="w-5 h-5 text-[#120f0a]" />
                    </span>
                    <h3 className="text-xl font-black uppercase font-sans tracking-tight text-[#120f0a]">{section.title}</h3>
                  </div>
                  <p className="font-serif-brand text-sm leading-relaxed text-[#413f3b]">
                    {section.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#120f0a]/15 pb-4 mb-8 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-sans">
                Meet The Agents
              </h2>
              <p className="text-sm font-serif-brand text-[#716f6c] mt-1">
                Designers, systems engineers, logistics managers, and contributors shipping this platform.
              </p>
            </div>
            
            {/* Filtering Tabs */}
            <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
              {[
                { id: "all", label: "All Squads" },
                { id: "founders", label: "Founders" },
                { id: "leadership", label: "Leads" },
                { id: "volunteers", label: "Contributors" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`border-2 border-[#120f0a] px-3 py-1.5 transition-all shadow-[2px_2px_0px_0px_#120f0a] ${
                    activeTab === tab.id
                      ? "bg-[#fc920d] text-[#120f0a] translate-x-[1.5px] translate-y-[1.5px] shadow-[0.5px_0.5px_0px_0px_#120f0a]"
                      : "bg-white text-[#716f6c] hover:text-[#120f0a] hover:bg-neutral-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Founders Subsection */}
          {(activeTab === "all" || activeTab === "founders") && (
            <div className="mb-12">
              <div className="bg-[#fc920d] text-[#120f0a] border-[3px] border-[#120f0a] px-4 py-1 shadow-[3px_3px_0px_0px_#120f0a] font-sans text-xs uppercase font-black tracking-wider w-max mb-6">
                Co-Founders
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {founders.map((member) => (
                  <TeamCard member={member} key={member.id} isFounder />
                ))}
              </div>
            </div>
          )}

          {/* Leadership Leads Subsection */}
          {(activeTab === "all" || activeTab === "leadership") && (
            <div className="mb-12">
              <div className="bg-[#97192c] text-white border-[3px] border-[#120f0a] px-4 py-1 shadow-[3px_3px_0px_0px_#120f0a] font-sans text-xs uppercase font-black tracking-wider w-max mb-6">
                Executive & Track Leads
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {leadership.map((member) => (
                  <TeamCard member={member} key={member.id} />
                ))}
              </div>
            </div>
          )}

          {/* Volunteers / Contributors Track */}
          {(activeTab === "all" || activeTab === "volunteers") && (
            <div>
              <div className="bg-[#120f0a] text-white border-[3px] border-[#120f0a] px-4 py-1 shadow-[3px_3px_0px_0px_#120f0a] font-sans text-xs uppercase font-black tracking-wider w-max mb-6">
                Contributors
              </div>
              
              {/* Grouped by Section */}
              <div className="grid gap-6 md:grid-cols-2">
                {["Operations", "Outreach", "Creative", "Tech"].map((trackName) => {
                  const trackVolunteers = volunteers.filter(v => v.section === trackName);
                  if (trackVolunteers.length === 0) return null;

                  return (
                    <div key={trackName} className="bg-white border-3 border-[#120f0a] p-5 shadow-[4px_4px_0px_0px_#120f0a]">
                      <h4 className="text-sm font-sans font-black uppercase tracking-wider text-[#97192c] border-b-2 border-[#120f0a]/10 pb-2 mb-4">
                        {trackName} Track
                      </h4>
                      <div className="flex flex-wrap gap-x-8 gap-y-6 justify-center sm:justify-start">
                        {trackVolunteers.map(v => (
                          <div key={v.id} className="flex flex-col items-center text-center group w-[110px] sm:w-[120px] shrink-0">
                            <div className="relative w-16 h-16 rounded-full border-2 border-[#120f0a] overflow-hidden bg-neutral-100 mb-2 shadow-[2px_2px_0px_0px_#120f0a] group-hover:scale-105 transition-transform duration-150">
                              {v.image ? (
                                <Image
                                  src={v.image}
                                  alt={v.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              ) : (
                                <User className="w-full h-full p-2 text-[#a09f9d]" />
                              )}
                            </div>
                            <h5 className="font-sans text-xs font-black uppercase tracking-tight truncate w-full text-[#120f0a]">{v.name}</h5>
                            <span className="text-[10px] font-bold text-[#716f6c] truncate w-full leading-tight">{v.role || "Contributor"}</span>
                            {v.linkedin && (
                              <a 
                                href={v.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 text-[#97192c] hover:text-[#fc920d] text-[10px] font-black uppercase tracking-wider"
                              >
                                LinkedIn
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Early Contributors Note */}
          <div className="mt-16 bg-[#fee9cf] border-4 border-[#120f0a] p-6 shadow-[6px_6px_0px_0px_#120f0a] max-w-2xl mx-auto text-center relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-15">
              <Starburst size={90} className="text-[#97192c]" />
            </div>
            <h4 className="font-mono text-xs font-black uppercase tracking-widest text-[#97192c] mb-2">
              Early Contributors
            </h4>
            <p className="font-serif-brand text-sm text-[#413f3b] leading-relaxed">
              We are grateful to our early team members and contributors who helped build and shape the network during its initial sprints before moving on to new chapters: <strong className="text-[#120f0a]">Saksham, Kaustubh, Oviya</strong>.
            </p>
          </div>

          <p className="mt-8 text-center text-xs font-mono text-[#716f6c]">
            *Roles stay flexible as our team and network grow.
          </p>
        </section>

        {/* Book a Call Section */}
        <BookingSection />

      </div>

      {/* Floating Scroll Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-[#fc920d] text-[#120f0a] border-[3px] border-[#120f0a] p-3 shadow-[3px_3px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[2px_2px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Neobrutalist Core Team Card ──────────────────────────────────────────────

function TeamCard({ member, isFounder = false }: { member: CoreTeamMember; isFounder?: boolean }) {
  const email = getTeamEmail(member.name);

  const socialLinks = [
    member.socials?.linkedin && {
      href: member.socials.linkedin,
      icon: Linkedin,
      label: "LinkedIn"
    },
    member.socials?.github && {
      href: member.socials.github,
      icon: Github,
      label: "GitHub"
    },
    member.socials?.website && {
      href: member.socials.website,
      icon: Globe,
      label: "Web"
    },
    member.socials?.instagram && {
      href: member.socials.instagram,
      icon: Instagram,
      label: "Instagram"
    },
    // Email is always present for core team
    {
      href: `mailto:${email}`,
      icon: Mail,
      label: "Email"
    },
  ].filter(Boolean) as Array<{ href: string; icon: any; label: string }>;

  return (
    <div className="bg-white border-4 border-[#120f0a] p-4 flex flex-col justify-between shadow-[6px_6px_0px_0px_#120f0a] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#120f0a]">
      <div>
        {/* Profile Image container */}
        <div className="border-[3px] border-[#120f0a] overflow-hidden aspect-[4/5] relative w-full mb-3.5 shadow-[2px_2px_0px_0px_#120f0a] bg-neutral-100">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover"
              priority={isFounder}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <User className="w-12 h-12 text-[#a09f9d]" />
            </div>
          )}
          
          {isFounder && (
            <span className="absolute bottom-2 left-2 bg-[#fc920d] text-[#120f0a] border border-[#120f0a] font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 shadow-[1px_1px_0px_0px_#120f0a]">
              Founder
            </span>
          )}
        </div>

        {/* Name & Role */}
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#97192c]">
            {member.role}
          </span>
          <h3 className="text-xl font-black uppercase tracking-tight font-sans text-[#120f0a] leading-none">
            {member.name}
          </h3>
          {member.bio && (
            <p className="text-xs font-serif-brand text-[#413f3b] leading-relaxed mt-2 pt-2 border-t border-[#120f0a]/10">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      {/* Email address display */}
      <a
        href={`mailto:${email}`}
        className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-[#716f6c] hover:text-[#97192c] transition-colors group"
        title={`Email ${member.name}`}
      >
        <Mail className="w-3 h-3 shrink-0 text-[#a09f9d] group-hover:text-[#97192c] transition-colors" />
        <span className="truncate">{email}</span>
      </a>

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[#120f0a]/10">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="w-7 h-7 flex items-center justify-center border-2 border-[#120f0a] bg-white shadow-[2px_2px_0px_0px_#120f0a] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_#120f0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                title={`${member.name}'s ${link.label}`}
              >
                <Icon className="w-3.5 h-3.5 text-[#120f0a]" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

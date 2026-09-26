"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { useMotionEnabled } from "@/components/experience-provider";
import { Button, Window } from "@/components/riot";
import { cn } from "@/lib/utils";

const CHECKS = [
  {
    id: "age",
    danger: false,
    text: "I confirm I am an Indian resident/national aged between 13 and 19 years old.",
  },
  {
    id: "policies",
    danger: false,
    text: "I have read and agree to Sparkden's Conduct, Terms of Service, Privacy Policy, and Acceptable Use Policy. I acknowledge that Sparkden's legal terms govern on their infrastructure.",
  },
  {
    id: "abuse",
    danger: true,
    text: "I acknowledge the zero-tolerance anti-abuse warning and understand that misrepresenting eligibility or abusing cloud resources will result in immediate legal notices and formal prosecution.",
  },
] as const;

const FIELDS = [
  { id: "cloud-fullname", key: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Yash Singh", autoComplete: "name" },
  { id: "cloud-email", key: "email", label: "Email Address", type: "email", placeholder: "yourname@gmail.com", autoComplete: "email" },
  { id: "cloud-github", key: "github", label: "GitHub Profile URL", type: "url", placeholder: "https://github.com/yourusername", autoComplete: "url" },
  { id: "cloud-linkedin", key: "linkedin", label: "LinkedIn Profile URL", type: "url", placeholder: "https://linkedin.com/in/yourusername", autoComplete: "url" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

const LABEL = "font-mono text-[11px] font-bold uppercase tracking-[0.16em]";
const INPUT =
  "h-12 w-full border-3 border-line bg-card px-3 font-mono text-sm text-card-foreground shadow-[3px_3px_0_0_var(--shadow-color)] placeholder:text-fg/55 focus:border-signal focus:outline-none";
const CHECKBOX = "mt-0.5 size-5 shrink-0 cursor-pointer rounded-none accent-burgundy";

/**
 * SparkCloud gate + verification form: three policy checkboxes unlock the form, which posts
 * multipart data (name, email, github, linkedin, id_file) to /api/cloud/apply.
 */
export function CloudApply() {
  const motionOn = useMotionEnabled();
  const [checked, setChecked] = useState({ age: false, policies: false, abuse: false });
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<Record<FieldKey, string>>({ fullName: "", email: "", github: "", linkedin: "" });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [consentedKyc, setConsentedKyc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isUnlocked = checked.age && checked.policies && checked.abuse;
  const done = Object.values(checked).filter(Boolean).length;
  const enter = motionOn
    ? { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as const } }
    : { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit. Please upload a smaller image or PDF.");
      return;
    }
    setErrorMessage("");
    setIdFile(file);
  };

  const handleSubmitApplication = async (e: FormEvent) => {
    e.preventDefault();
    const { fullName, email, github, linkedin } = values;
    if (!fullName || !email || !github || !linkedin || !idFile) {
      setErrorMessage("Please fill out all fields and attach your Student ID / School ID.");
      return;
    }
    if (!consentedKyc) {
      setErrorMessage("Please consent to the identity verification and Privacy Policy to proceed.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("github", github);
      formData.append("linkedin", linkedin);
      formData.append("id_file", idFile);

      const res = await fetch("/api/cloud/apply", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application.");
      setSubmitted(true);
    } catch (err) {
      setErrorMessage((err as Error | undefined)?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <fieldset className="mt-10">
        <legend className={cn(LABEL, "flex w-full justify-end border-b-3 border-line pb-2 text-signal")}>
          <span className="sr-only">Policy Agreement &amp; Verification</span>
          <span aria-hidden>
            [{done}/{CHECKS.length}]
          </span>
        </legend>
        <ol>
          {CHECKS.map(({ id, danger, text }, index) => (
            <li key={id} className="border-b border-line/40">
              <label
                className={cn(
                  "grid cursor-pointer grid-cols-[3rem_auto_minmax(0,1fr)] items-start gap-3 py-4 transition-colors hover:bg-cream hover:text-ink has-[:focus-visible]:bg-cream has-[:focus-visible]:text-ink",
                )}
              >
                <span aria-hidden className={cn(LABEL, "pl-1 pt-1 text-signal")}>
                  [{index + 1}/{CHECKS.length}]
                </span>
                <input
                  type="checkbox"
                  checked={checked[id]}
                  onChange={(e) => setChecked((prev) => ({ ...prev, [id]: e.target.checked }))}
                  className={CHECKBOX}
                />
                <span className={cn("pr-2 font-serif text-base leading-relaxed", danger && "font-bold text-signal")}>
                  {text}
                </span>
              </label>
            </li>
          ))}
        </ol>
      </fieldset>

      <div className="mt-10 flex flex-col items-start gap-3" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {isUnlocked ? (
            !showForm && !submitted ? (
              <motion.div key="unlocked" {...enter} className="flex flex-col items-start gap-3">
                <Button variant="orange" size="lg" onClick={() => setShowForm(true)} className="h-auto min-h-14 w-full whitespace-normal py-3 font-mono sm:w-auto">
                  Proceed to Verification Form <span aria-hidden>→</span>
                </Button>
                <p className={cn(LABEL, "text-signal")}>
                  ✓ Policies accepted. Complete the verification form to receive your access link.
                </p>
              </motion.div>
            ) : null
          ) : (
            <motion.div key="locked" {...enter} className="flex flex-col items-start gap-3">
              <Button variant="outline" size="lg" disabled className="h-auto min-h-14 w-full whitespace-normal py-3 font-mono sm:w-auto">
                <span aria-hidden>▢</span> Complete All 3 Steps to Unlock
              </Button>
              <p className={LABEL}>Check all three boxes above to proceed.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div key="form" {...enter} className="mt-14">
            {submitted ? (
              <Window title="Status: Pending Manual Review" bar="marker" bodyClassName="p-6 md:p-10">
                <h3 className="font-[family-name:var(--font-archivo)] text-[clamp(28px,4vw,52px)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                  Application Submitted ✓
                </h3>
                <p className="mt-5 max-w-[60ch] font-serif text-lg leading-relaxed">
                  Our team will review your ID document and profiles. Once verified, your official SparkCloud join link will be
                  emailed to <strong>{values.email}</strong>.
                </p>
              </Window>
            ) : (
              <Window
                title={<h3 className="inline">Verification Details</h3>}
                bar="orange"
                bodyClassName="p-5 md:p-8"
              >
                <form onSubmit={handleSubmitApplication} className="space-y-8">
                  <p className="max-w-[62ch] font-serif text-base leading-relaxed">
                    To prevent multi-accounting and abuse, provide your builder profile links and a valid government or
                    school-issued ID document.
                  </p>

                  {errorMessage && (
                    <p role="alert" className="border-3 border-warm bg-warm/10 px-4 py-3 font-mono text-xs font-bold">
                      {errorMessage}
                    </p>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {FIELDS.map((field, index) => (
                      <div key={field.id} className="space-y-2">
                        <label htmlFor={field.id} className={cn(LABEL, "block")}>
                          {field.label} <span className="text-signal">*</span>
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          required
                          autoFocus={index === 0}
                          autoComplete={field.autoComplete}
                          placeholder={field.placeholder}
                          value={values[field.key]}
                          onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                          className={INPUT}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="cloud-id-file" className={cn(LABEL, "block")}>
                      ID Document <span className="text-signal">*</span>
                    </label>

                    <div className="border-3 border-line bg-surface-2 p-4 font-mono text-[12px] leading-relaxed">
                      <p className={cn(LABEL, "text-signal")}>✓ Accepted documents:</p>
                      <ul className="mt-2 list-[square] space-y-1 pl-5 marker:text-signal">
                        <li>School / College ID card (with your name and photo)</li>
                        <li>
                          <strong>Masked Aadhaar card</strong> (first 8 digits masked; your name and photo are enough)
                        </li>
                        <li>Passport (bio-data page only)</li>
                        <li>Any other government or institution-issued photo ID</li>
                      </ul>
                      <p className="mt-3 border-t-2 border-line/40 pt-3 font-bold uppercase tracking-[0.04em] text-signal">
                        <span aria-hidden>▲ </span>Do NOT upload photos of pets, screenshots, blank images, or unmasked Aadhaar
                        numbers. Fraudulent uploads result in immediate disqualification and permanent blacklisting.
                      </p>
                    </div>

                    <div className="relative cursor-pointer border-3 border-dashed border-line bg-card p-6 text-center text-card-foreground transition-colors hover:border-solid hover:border-signal has-[:focus-visible]:border-solid has-[:focus-visible]:border-signal">
                      <input
                        id="cloud-id-file"
                        type="file"
                        accept="image/*,.pdf"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <div className="pointer-events-none space-y-1.5 font-mono text-xs">
                        <span aria-hidden className="block text-2xl leading-none text-signal">
                          ⇪
                        </span>
                        {idFile ? (
                          <p className="font-bold text-signal">
                            ✓ {idFile.name} ({(idFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        ) : (
                          <>
                            <p className="font-bold">Click or drop your ID document here</p>
                            <p className="opacity-80">JPG · PNG · WEBP · PDF · max 10 MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DPDP Act 2023 Verification Consent */}
                  <div className="flex items-start gap-3 border-3 border-line bg-surface-2 p-4">
                    <input
                      type="checkbox"
                      id="cloud-consent"
                      checked={consentedKyc}
                      onChange={(e) => setConsentedKyc(e.target.checked)}
                      required
                      className={CHECKBOX}
                    />
                    <label htmlFor="cloud-consent" className="cursor-pointer font-serif text-sm leading-relaxed">
                      I consent to GOBITSNBYTES FOUNDATION processing my ID document solely for identity verification and
                      anti-abuse protection on SparkCloud, in accordance with the{" "}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="font-bold text-signal underline decoration-2 underline-offset-4"
                      >
                        Privacy Policy
                      </Link>
                      . If under 18, I confirm I have obtained parental or guardian consent.
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="orange" size="lg" disabled={submitting} className="h-auto min-h-14 w-full whitespace-normal py-3 font-mono sm:w-auto">
                      {submitting ? "Submitting…" : "Submit Verification Request"}
                    </Button>
                  </div>
                </form>
              </Window>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

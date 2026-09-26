"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Check, Loader2 } from "lucide-react";

import { useMotionEnabled } from "@/components/experience-provider";
import { LAB_TEXT } from "@/components/lab";
import { Button } from "@/components/riot";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const EMAIL = "hello@gobitsnbytes.org";
const STATUS_ID = "contact-form-status";
const EASE = [0.23, 1, 0.32, 1] as const;

/** "Copy Link" for the direct email row. Same clipboard behaviour as before, label swaps for 2s. */
export function CopyEmailButton({ className }: { className?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email to clipboard", err);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopyEmail} className={className}>
      <span aria-live="polite">{isCopied ? "Copied!" : "Copy Link"}</span>
    </Button>
  );
}

/**
 * The /contact form: name, email, subject, message, hCaptcha, DPDP consent, POST /api/contact.
 * Validation, payload and states are unchanged; only the presentation moved to Print Riot fields.
 */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [mounted, setMounted] = useState(false);
  const captchaRef = useRef<HCaptcha>(null);
  const motionOn = useMotionEnabled();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const subject = (formData.get("subject") as string) || "";
    const message = (formData.get("message") as string) || "";

    if (!hasConsented) {
      setStatus({
        type: "error",
        message: "Please agree to the Terms of Service & Privacy Policy to send your message.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!captchaToken) {
      setStatus({ type: "error", message: "Please complete the CAPTCHA." });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          source: "website-contact",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to send message.");
      }

      setIsSuccess(true);
      setStatus({
        type: "success",
        message: "Message sent successfully. We'll get back to you soon.",
      });
      form.reset();
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (err: unknown) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          (err instanceof Error && err.message) ||
          "Something went wrong while sending your message. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setStatus(null);
  };

  const transition = { duration: motionOn ? 0.2 : 0, ease: EASE };
  const error = status?.type === "error" ? status.message : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!isSuccess ? (
        <motion.div
          key="contact-form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition}
        >
          <h2 className={LAB_TEXT.title}>Send Message</h2>

          <form
            onSubmit={handleSubmit}
            id="contact-us-form"
            aria-describedby={error ? STATUS_ID : undefined}
            className="mt-6 grid gap-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" autoComplete="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@email.com" autoComplete="email" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="Reason for reaching out" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell us what's on your mind..."
                className="min-h-[130px]"
                required
              />
            </div>

            {/* fixed-height slot so the widget never shifts the layout */}
            <div className="flex min-h-[82px] items-center overflow-hidden">
              <div className="origin-left scale-[0.88] sm:scale-100">
                {mounted && (
                  <HCaptcha
                    ref={captchaRef}
                    sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                    reCaptchaCompat={false}
                    theme="light"
                    onVerify={setCaptchaToken}
                  />
                )}
              </div>
            </div>

            {/* DPDP Act 2023 consent */}
            <div className="flex items-start gap-3 border-2 border-line bg-surface-2 p-4">
              <input
                type="checkbox"
                id="contact-consent"
                name="consent"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                required
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-burgundy"
              />
              <label htmlFor="contact-consent" className="cursor-pointer font-serif text-sm leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="font-bold text-signal underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="font-bold text-signal underline underline-offset-2">
                  Privacy Policy
                </Link>
                , and consent to GOBITSNBYTES FOUNDATION processing my details to respond to this inquiry. If under 18, I
                confirm I have obtained parent or guardian consent.
              </label>
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="group w-full">
              {isSubmitting ? (
                <>
                  <Loader2 aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <span
                    aria-hidden
                    className="transition-transform duration-200 ease-riot group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </>
              )}
            </Button>

            <p
              id={STATUS_ID}
              role="alert"
              aria-live="polite"
              className={cn(
                "border-3 border-line bg-warm p-3.5 text-center font-mono text-xs font-bold uppercase tracking-[0.08em] text-white",
                !error && "sr-only",
              )}
            >
              {error}
            </p>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="success-state"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition}
          className="flex flex-col items-start gap-6 py-6 md:py-10"
        >
          <span
            aria-hidden
            className="grid size-16 place-items-center border-3 border-line bg-cream text-ink shadow-[4px_4px_0_0_var(--shadow-color)]"
          >
            <Check className="size-8" />
          </span>
          <h2
            tabIndex={-1}
            ref={(node) => node?.focus({ preventScroll: true })}
            className={cn(LAB_TEXT.title, "outline-none")}
          >
            Transmission Dispatched
          </h2>
          <p className="max-w-[44ch] font-serif text-lg leading-relaxed">
            Your message has been beamed to the bits&amp;bytes™ crew. We&apos;ve logged the request, and we&apos;ll get back
            to you within 24-48 hours.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={handleResetForm}>
            Send another transmission
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

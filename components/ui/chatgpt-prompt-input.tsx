"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PromptBoxRef {
  focus: () => void;
  setValue: (value: string) => void;
}

export interface PromptBoxProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange" | "onSubmit"> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmitMessage?: (val: string) => void;
  /** Shows a mono "0042/2000" counter next to the send control. */
  maxChars?: number;
}

/**
 * Console input (stripe.dev): "›" prompt, plain auto-growing mono textarea, square [ASK ↵] control.
 * Enter sends, Shift+Enter breaks the line (IME composition never sends). Controlled or uncontrolled;
 * the ref exposes focus() and setValue().
 */
export const PromptBox = React.forwardRef<PromptBoxRef, PromptBoxProps>(
  (
    { className, onSubmitMessage, value: externalValue, onChange: externalOnChange, maxChars, placeholder, ...props },
    ref,
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [internalValue, setInternalValue] = React.useState("");
    const value = externalValue !== undefined ? externalValue : internalValue;

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => textareaRef.current?.focus(),
        setValue: (val: string) => {
          if (!externalOnChange) return setInternalValue(val);
          // Controlled: set the native value and fire a real input event so onChange runs.
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
          if (setter && textareaRef.current) {
            setter.call(textareaRef.current, val);
            textareaRef.current.dispatchEvent(new Event("input", { bubbles: true }));
          }
        },
      }),
      [externalOnChange],
    );

    React.useLayoutEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }, [value]);

    const hasValue = value.trim().length > 0;

    const handleSubmit = () => {
      if (!hasValue) return;
      onSubmitMessage?.(value);
      if (externalOnChange === undefined) setInternalValue("");
    };

    return (
      <div className={cn("flex items-end gap-2 border-2 border-line bg-surface-2 p-1.5 focus-within:border-signal", className)}>
        <span aria-hidden className="shrink-0 select-none pb-2.5 pl-1.5 font-mono text-sm font-bold text-signal">
          ›
        </span>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => (externalOnChange ? externalOnChange(e) : setInternalValue(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder ?? "Type your message here..."}
          aria-label="Message"
          className="max-h-32 min-h-10 min-w-0 flex-1 resize-none border-0 bg-transparent py-2 font-mono text-base text-fg placeholder:text-fg/55 focus:outline-none focus-visible:outline-none sm:text-[13px]"
          {...props}
        />
        <div className="flex shrink-0 items-center gap-2">
          {maxChars ? (
            <span aria-hidden className="hidden font-mono text-[10px] font-bold tabular-nums opacity-70 sm:inline">
              {String(value.length).padStart(4, "0")}/{maxChars}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasValue}
            aria-label="Send message"
            className="flex h-10 cursor-pointer items-center gap-1.5 border-2 border-line bg-orange px-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-[transform,background-color] duration-100 ease-riot hover:bg-cream active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"
          >
            Ask <span aria-hidden>↵</span>
          </button>
        </div>
      </div>
    );
  },
);
PromptBox.displayName = "PromptBox";

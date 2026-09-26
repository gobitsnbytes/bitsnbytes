"use client";

import { useSyncExternalStore } from "react";

// stripe.dev bracket hotkeys. Single-key shortcuts must be switchable off (WCAG 2.1.4): the menu's
// settings row writes this preference; default on.
const STORAGE_KEY = "bnb-shortcuts";
const CHANGE_EVENT = "bnb:shortcuts";

let enabled: boolean | null = null;

const read = () => {
  if (enabled === null) {
    try {
      enabled = window.localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
      enabled = true;
    }
  }
  return enabled;
};

const subscribe = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    enabled = null;
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const useShortcutsEnabled = () => useSyncExternalStore(subscribe, read, () => true);

export function setShortcutsEnabled(next: boolean) {
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    // storage blocked: the choice still holds for this tab
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * [C] console: the floating assistant opens (with toggle, closes if already open); /qna focuses its
 * prompt. Nothing happens, and focus stays put, when neither is mounted.
 */
export const openConsole = (toggle = false) =>
  window.dispatchEvent(new CustomEvent("bnb:console-open", { detail: { toggle } }));

const TYPING = "input, textarea, select, [contenteditable]:not([contenteditable='false'])";
/** Radix dialogs (menu, video, booking), the assistant console and native dialogs. Not the cookie banner. */
const OPEN_DIALOG = "[role='dialog'][data-state='open'], [aria-modal='true'], dialog[open]";

/** A bare key press meant for the page: no modifier, not typing, no dialog open. */
export function isShortcut(event: KeyboardEvent) {
  if (event.defaultPrevented || event.repeat || event.isComposing) return false;
  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return false;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || target.closest(TYPING))) return false;
  return !document.querySelector(OPEN_DIALOG);
}

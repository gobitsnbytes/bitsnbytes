import { Wordmark as Lockup, type WordmarkProps as LockupProps } from "@/components/chrome/wordmark";
import { cn } from "@/lib/utils";

export type WordmarkProps = Omit<LockupProps, "split"> & { plate?: boolean };

/**
 * Hero copy of the shared lockup (geometry lives in components/chrome/wordmark.tsx): letters split for the
 * rise-in, always aria-hidden (the caller supplies the accessible name). `plate` = flat colour copy for riso
 * misregistration layers (no knockout). Set --wm-knockout on a parent for the knockout colour.
 */
export function Wordmark({ plate = false, className, ...props }: WordmarkProps) {
  return <Lockup aria-hidden split className={cn(plate && "[--wm-knockout:transparent]", className)} {...props} />;
}

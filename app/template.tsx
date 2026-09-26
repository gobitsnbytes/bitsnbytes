"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { TileWipe, shouldWipe } from "@/components/chrome/tile-wipe";

// Re-mounts on every navigation. No wrapper around children: a transform/filter here would break
// ScrollTrigger pins and position:fixed stages (/fork, /minecraft), so the wipe is a fixed sibling.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [wipe, setWipe] = useState(() => shouldWipe(pathname));
  const done = useCallback(() => setWipe(false), []);

  return (
    <>
      {children}
      {wipe ? <TileWipe onDone={done} /> : null}
    </>
  );
}

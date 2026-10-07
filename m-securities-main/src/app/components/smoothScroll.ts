"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion, setSmoothScroller } from "./home/shared";

// Smooth (Lenis) scrolling for the pages with scroll scenes (home, services), as in the reference:
// pointer devices only, off with reduced motion. In-page jumps go through it (home/shared scrollToY).
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || !matchMedia("(pointer:fine)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    setSmoothScroller(lenis);
    let raf = requestAnimationFrame(function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); });
    return () => {
      cancelAnimationFrame(raf); setSmoothScroller(null);
      // destroy() leaves Lenis' 400ms velocity-reset timer pending; when it fires (e.g. after the
      // route change scrolls to top) it re-adds the `lenis` classes to <html> on the next page.
      clearTimeout((lenis as unknown as { _resetVelocityTimeout?: ReturnType<typeof setTimeout> | null })._resetVelocityTimeout ?? undefined);
      lenis.destroy();
    };
  }, []);
}

import type { CSSProperties } from "react";

// Pick the string for the current language (en is the fallback, as elsewhere on the page)
export const pick = (language: string, mn: string, en: string, zh: string) =>
  language === "mn" ? mn : language === "zh" ? zh : en;

// --i drives the staggered delays in home.module.css
export const vi = (i: number) => ({ "--i": i } as CSSProperties);

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const eOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const ease = (p: number) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
// Same condition as the full-screen layout media query in home.module.css
export const isFullScreenLayout = () => matchMedia("(min-width:961px) and (min-height:640px)").matches;

// Calls `update` at most once per frame while scrolling/resizing; returns a cleanup.
export function onScrollFrame(update: () => void) {
  let raf = 0;
  const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  update();
  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("scroll", schedule);
    removeEventListener("resize", schedule);
  };
}

// Lenis drives smooth scrolling on the home page (pointer devices); programmatic scrolls go through it.
type SmoothScroller = { scrollTo: (y: number, o?: { duration?: number }) => void };
let lenis: SmoothScroller | null = null;
export const setSmoothScroller = (l: SmoothScroller | null) => { lenis = l; };
export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

// Reference goTo(el, off): `off(el)` is added to the element's document top
// (default: room for the fixed navbar).
export function scrollToSection(id: string, off: (el: HTMLElement) => number = () => -76) {
  const el = document.getElementById(id);
  if (el) scrollToY(el.getBoundingClientRect().top + scrollY + off(el));
}

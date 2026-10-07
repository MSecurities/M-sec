"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, eOut, onScrollFrame, prefersReducedMotion } from "./shared";
import s from "./home.module.css";

// Light routes converging on the button (viewBox 1440×800)
const ROUTES = [
  "M-20 760 C 300 700, 560 600, 720 470",
  "M1460 760 C 1140 700, 880 600, 720 470",
  "M200 820 C 420 720, 620 590, 720 470",
  "M1240 820 C 1020 720, 820 590, 720 470",
];

export default function StartCta() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const arcsRef = useRef<SVGSVGElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const sec = sectionRef.current, arcs = arcsRef.current, btn = btnRef.current;
    if (!sec || !arcs || !btn) return;
    if (prefersReducedMotion()) { sec.classList.add(s.live); return; }
    // The horizon rises and the copy follows; routes draw in, then the light flows and the button pulses
    const stop = onScrollFrame(() => {
      const vh = innerHeight;
      const p = clamp((vh - sec.getBoundingClientRect().top) / (vh * .9));
      sec.style.setProperty("--hz", String(1 - eOut(p)));
      arcs.style.setProperty("--ad", String(1 - clamp((p - .5) / .45)));
      sec.classList.toggle(s.live, p >= .97);
    });
    // Magnetic button
    if (!matchMedia("(pointer:fine)").matches) return stop;
    const move = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`;
    };
    const leave = () => { btn.style.transform = ""; };
    btn.addEventListener("pointermove", move);
    btn.addEventListener("pointerleave", leave);
    return () => { stop(); btn.removeEventListener("pointermove", move); btn.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <section ref={sectionRef} className={s.cta3} id="start" aria-labelledby="cta-title">
      <div className={s.orb} aria-hidden="true"></div>
      <svg ref={arcsRef} className={s["cta-arcs"]} viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
        {ROUTES.map(d => <path key={d} className={s.ca} pathLength={1} d={d} />)}
        {ROUTES.map(d => <path key={`c${d}`} className={s.cc} pathLength={1} d={d} />)}
      </svg>
      <div className={s["cta-in"]}>
        <h2 id="cta-title">{t("home.cta.title")}</h2>
        <p>{t("home.cta.description")}</p>
        <a ref={btnRef} href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer" className={`${s.cta} ${s["cta-1"]} ${s["cta-big"]}`}>
          {t("home.cta.button")} <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 10.5 5.5 6.5 8 9l4.5-5M9 4h3.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </section>
  );
}

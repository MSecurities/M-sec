"use client";

import { Fragment, useEffect, useRef } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { Onest } from "next/font/google";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, ease, eOut, onScrollFrame, prefersReducedMotion, scrollToY } from "../home/shared";
import HeroGlobe from "./HeroGlobe";
import { HANGERS } from "./bridgePaths";
import type { GlobeCamera } from "./HeroGlobe";
import s from "./Hero.module.css";

// The reference design is set in Onest; scoped to the hero so the navbar and the
// rest of the page keep Roboto. cyrillic-ext carries Ө / Ү.
const onest = Onest({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-onest",
});

// --i drives the staggered animation delays in Hero.module.css
const vi = (i: number) => ({ "--i": i } as CSSProperties);

export default function Hero() {
  const { t, language } = useLanguage();
  const sceneRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLCanvasElement | null>(null);
  const cam = useRef<GlobeCamera>({ K: 0, covered: false });
  const magneticRef = useRef<HTMLAnchorElement>(null);
  const tr = (mn: string, en: string, zh: string) => (language === "mn" ? mn : language === "zh" ? zh : en);

  // Headline words per line; each word slides up on its own delay
  const headline =
    language === "mn" ? [["Дэлхийгээс", "өгөөж"], ["хүртэх", "гүүр"]]
    : language === "zh" ? [["连接全球"], ["收益的桥梁"]]
    : [["Bridge", "to", "Global"], ["Opportunity"]];
  // Services heading that surfaces over the globe at the end of the dive
  const svcWords =
    language === "mn" ? ["Мэргэжлийн", "хөрөнгө", "оруулалтын", "үйлчилгээ"]
    : language === "zh" ? ["专业投资", "服务"]
    : ["Professional", "Investment", "Services"];
  const words = (line: string[], offset: number) =>
    line.map((w, k) => (
      <Fragment key={`${language}-${offset + k}`}>
        {k > 0 && " "}
        <span className={s.w}><span className={s.wi} style={vi(offset + k)}>{w}</span></span>
      </Fragment>
    ));

  // Cursor spotlight on the background + magnetic primary CTA
  useEffect(() => {
    const hero = heroRef.current, b = magneticRef.current;
    if (!hero || !b) return;
    const spot = (e: PointerEvent) => { hero.style.setProperty("--mx", e.clientX + "px"); hero.style.setProperty("--my", e.clientY + "px"); };
    hero.addEventListener("pointermove", spot);
    const magnetic = !matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(pointer:fine)").matches;
    const pull = (e: PointerEvent) => { const r = b.getBoundingClientRect(); b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .2 + "px," + (e.clientY - r.top - r.height / 2) * .3 + "px)"; };
    const release = () => { b.style.transform = ""; };
    if (magnetic) { b.addEventListener("pointermove", pull); b.addEventListener("pointerleave", release); }
    return () => {
      hero.removeEventListener("pointermove", spot);
      b.removeEventListener("pointermove", pull); b.removeEventListener("pointerleave", release);
    };
  }, []);

  // T1 hero dive (reference frameScroll): the hero is pinned for the scene's extra height while the
  // copy lifts away, the globe camera zooms onto Mongolia and the services heading surfaces over it.
  // Re-run per language so the heading's new word spans are picked up.
  useEffect(() => {
    const scene = sceneRef.current, content = contentRef.current, intro = introRef.current, globe = globeRef.current;
    if (!scene || !content || !intro || !globe || prefersReducedMotion()) return;
    const introWords = [...intro.querySelectorAll<HTMLElement>(`.${s.wi}`)];
    const c0 = cam.current;
    const stop = onScrollFrame(() => {
      const vh = innerHeight, r = scene.getBoundingClientRect(), p = clamp(-r.top / (r.height - vh));
      const a = clamp(p / .32);
      content.style.opacity = String(1 - a);
      content.style.transform = `translate3d(0,${-70 * eOut(a)}px,0) scale(${1 - .04 * a})`;
      content.style.filter = a > 0 ? `blur(${(6 * a).toFixed(2)}px)` : "";
      content.style.visibility = a >= 1 ? "hidden" : "";
      const K = ease(clamp(p / .78)); c0.K = K;
      globe.style.setProperty("--m1", (44 - 44 * K).toFixed(2) + "%"); globe.style.setProperty("--m2", (72 - 52 * K).toFixed(2) + "%");
      globe.style.opacity = String(1 - .6 * clamp((p - .55) / .45));
      const b = clamp((p - .42) / .4);
      intro.style.opacity = String(clamp(b * 3)); intro.style.setProperty("--ei", String(eOut(clamp(b * 2))));
      const c = ease(clamp((p - .68) / .32));
      intro.style.transform = `translateY(calc(-50% + ${(1 - eOut(b)) * 40}px - ${c * 31}vh)) scale(${1 - c * .18})`;
      introWords.forEach((w, k) => w.style.setProperty("--wp", String(eOut(clamp(b * (introWords.length + 1) - k)))));
      c0.covered = r.bottom < 0;
    });
    return () => {
      stop();
      content.style.cssText = ""; intro.style.cssText = "";
      globe.style.removeProperty("opacity"); globe.style.removeProperty("--m1"); globe.style.removeProperty("--m2");
      c0.K = 0; c0.covered = false;
    };
  }, [language]);

  // "Our services" jumps to the end of the dive, where the heading has settled and the cards rise.
  // Without the pin (reduced motion) the heading sits at the bottom of the hero instead.
  const toServices = (e: MouseEvent) => {
    e.preventDefault();
    const scene = sceneRef.current, intro = introRef.current;
    if (!scene || !intro) return;
    scrollToY(prefersReducedMotion()
      ? intro.getBoundingClientRect().top + scrollY - 76
      : scene.getBoundingClientRect().top + scrollY + scene.offsetHeight - innerHeight * .98);
  };

  return (
    <section ref={sceneRef} id="hero-scene" className={`${onest.variable} ${s.scene}`}>
    <div ref={heroRef} className={s.hero}>
      <div className={s.bg} />
      <HeroGlobe cam={cam} canvasRef={globeRef} />
      <div ref={contentRef} className={s.content}>
        <h1 className={s.title} aria-label={[...headline[0], ...headline[1]].join(language === "zh" ? "" : " ")}>
          <span className={s.ln} aria-hidden="true">{words(headline[0], 0)}</span>
          <span className={`${s.ln} ${s.ln2}`} aria-hidden="true">
            <span className={s.bl}>
              {words(headline[1], headline[0].length)}
              <svg className={s.bridge} viewBox="0 0 600 48" aria-hidden="true">
                <g fill="none" strokeLinecap="round">
                  {HANGERS.map((d, i) => <path key={d} className={s.hg} style={vi(i)} pathLength={1} d={d} />)}
                  <path className={s.cb} pathLength={1} d="M3 42Q90 32 150 4" />
                  <path className={`${s.cb} ${s.c2}`} pathLength={1} d="M150 4Q300 64 450 4" />
                  <path className={`${s.cb} ${s.c3}`} pathLength={1} d="M450 4Q510 32 597 42" />
                  <path className={s.tw} pathLength={1} d="M150 45V2" />
                  <path className={`${s.tw} ${s.t2}`} pathLength={1} d="M450 45V2" />
                  <path className={s.dk} pathLength={1} d="M2 44H598" />
                  <path className={s.pulse} pathLength={1} d="M2 44H598" />
                  <path className={`${s.pulse} ${s.p2}`} pathLength={1} d="M150 4Q300 64 450 4" />
                </g>
              </svg>
            </span>
          </span>
        </h1>
        <p className={s.sub}>
          {tr(
            "Монголын болон дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулах хамгийн найдвартай түнш.",
            "Your most trusted partner for investing in Mongolia and global capital markets.",
            "连接蒙古与全球资本市场，您最值得信赖的投资伙伴。",
          )}
        </p>
        <div className={s.ctas}>
          <a ref={magneticRef} href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer" className={`${s.cta} ${s["cta-1"]}`}>
            {t("home.cta.button")} <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 10.5 5.5 6.5 8 9l4.5-5M9 4h3.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer" className={`${s.cta} ${s["cta-2"]}`}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect className={s.b} x="2.5" y="9" width="3" height="6.5" rx="1" fill="currentColor" /><rect className={s.b} x="7.5" y="5" width="3" height="10.5" rx="1" fill="currentColor" /><rect className={s.b} x="12.5" y="2.5" width="3" height="13" rx="1" fill="currentColor" /></svg>
            {tr("Зах зээлийн мэдээлэл", "Market Intelligence", "市场数据")}
          </a>
        </div>
        <a href="#services" className={s.more} onClick={toServices}>
          <span className={s.row}><i></i>{tr("МАНАЙ ҮЙЛЧИЛГЭЭНҮҮД", "OUR SERVICES", "我们的服务")}<i></i></span>
          <span className={s.chev}><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 5.5 7 9l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </a>
      </div>
      <div ref={introRef} className={s.intro}>
        <span className={s.eyebrow}><i></i>{tr("ҮЙЛЧИЛГЭЭ", "SERVICES", "服务")}<i></i></span>
        <h2 id="svc-title" aria-label={svcWords.join(language === "zh" ? "" : " ")}>
          <span aria-hidden="true">
            {svcWords.map((w, i) => (
              <Fragment key={`${language}-${i}`}>
                {i > 0 && language !== "zh" && " "}
                <span className={s.w}><span className={`${s.wi}${i === svcWords.length - 1 ? ` ${s.hl}` : ""}`} style={vi(i)}>{w}</span></span>
              </Fragment>
            ))}
          </span>
        </h2>
      </div>
    </div>
    </section>
  );
}

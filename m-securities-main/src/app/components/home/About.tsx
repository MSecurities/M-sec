"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, eOut, onScrollFrame, pick, prefersReducedMotion } from "./shared";
import s from "./home.module.css";

// Heading split into the two sliding lines: [left line, right line (teal), trailing word (ink)]
const TITLE: Record<string, [string, string, string]> = {
  mn: ["Яагаад биднийг", "сонгох", "вэ"],
  en: ["Why", "Choose", "Us"],
  zh: ["为什么", "选择", "我们"],
};

// Suspension-bridge hangers: [x, top y], each drops to the deck at y=160
const HANGERS = [[140, 122], [180, 111], [220, 99], [260, 86], [300, 71], [340, 56], [380, 39], [420, 40], [460, 58], [500, 74], [540, 88], [580, 100], [620, 110], [660, 118], [700, 124], [740, 128], [780, 130], [820, 130], [860, 128], [900, 124], [940, 118], [980, 110], [1020, 100], [1060, 88], [1100, 74], [1140, 58], [1180, 40], [1220, 39], [1260, 56], [1300, 71], [1340, 86], [1380, 99], [1420, 111]];
const CABLES = ["M0 150Q200 120 400 30", "M400 30Q800 230 1200 30", "M1200 30Q1400 120 1600 150"];

export default function About() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<SVGSVGElement>(null);
  const [l1, l2, l3] = TITLE[language] ?? TITLE.en;

  useEffect(() => {
    const sec = sectionRef.current, head = headRef.current, body = bodyRef.current, br = bridgeRef.current;
    if (!sec || !head || !body || !br) return;
    if (prefersReducedMotion()) { sec.classList.add(s.live); return; }
    return onScrollFrame(() => {
      const vh = innerHeight;
      // heading halves slide in from opposite sides; the copy rises after them
      const p = clamp((vh - head.getBoundingClientRect().top) / (vh * .7));
      sec.style.setProperty("--ap", String(1 - eOut(p)));
      sec.style.setProperty("--abp", String(eOut(clamp((vh * .95 - body.getBoundingClientRect().top) / (vh * .35)))));
      // the bridge is built piece by piece: deck → towers → cables → hangers, then the light runs
      const q = clamp((vh - br.getBoundingClientRect().top) / (vh * .75));
      br.style.setProperty("--bd", String(1 - clamp(q / .35)));
      br.style.setProperty("--bt", String(1 - clamp((q - .3) / .2)));
      br.style.setProperty("--bc", String(1 - clamp((q - .45) / .3)));
      br.style.setProperty("--bh", String(1 - clamp((q - .7) / .3)));
      sec.classList.toggle(s.live, q >= 1);
    });
  }, []);

  return (
    <section ref={sectionRef} className={s.about} id="about" aria-labelledby="about-title">
      <div className={s["about-in"]}>
        <span className={s.kick}><i></i>{pick(language, "Бидний тухай", "About Us", "关于我们")}</span>
        <h2 ref={headRef} id="about-title" aria-label={t("home.about.title")}>
          <span className={`${s.sl} ${s["sl-l"]}`} aria-hidden="true">{l1}</span>
          <span className={`${s.sl} ${s["sl-r"]}`} aria-hidden="true">{l2}{language === "zh" ? "" : " "}<em>{l3}</em></span>
        </h2>
        <div ref={bodyRef} className={s["about-body"]}>
          <p>{t("home.about.description")}</p>
          <Link href="/about" className={`${s.btn} ${s["btn-g"]} ${s["about-btn"]}`}>
            <span>{pick(language, "Дэлгэрэнгүй", "Learn More", "了解更多")}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
      <svg ref={bridgeRef} className={s["ab-bridge"]} viewBox="0 0 1600 180" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <g fill="none" strokeLinecap="round">
          {HANGERS.map(([x, y]) => <path key={x} className={s.hg} pathLength={1} d={`M${x} ${y}V160`} />)}
          {CABLES.map(d => <path key={d} className={s.cb} pathLength={1} d={d} />)}
          <path className={s.tw} pathLength={1} d="M400 168V10" />
          <path className={s.tw} pathLength={1} d="M1200 168V10" />
          <path className={s.dk} pathLength={1} d="M0 160H1600" />
          <path className={s.pulse} pathLength={1} d="M0 160H1600" />
        </g>
      </svg>
    </section>
  );
}

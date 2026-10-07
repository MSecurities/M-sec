"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, eOut, onScrollFrame, pick, prefersReducedMotion, vi } from "./shared";
import s from "./home.module.css";

const MMI_URL = "https://mmi.msecurities.mn";

const Icon = ({ size, children }: { size: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={size > 16 ? 1.5 : 1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const SPARKLE = "M8 2.5 9.3 6.7 13.5 8 9.3 9.3 8 13.5 6.7 9.3 2.5 8 6.7 6.7Z";
const TROPHY = <><path d="M5.5 2.5h7v3a3.5 3.5 0 0 1-7 0Z" /><path d="M5.5 4H3v1a2.5 2.5 0 0 0 2.6 2.5M12.5 4H15v1a2.5 2.5 0 0 1-2.6 2.5M9 9v3.5M6 15.5h6M7 12.5h4v3H7Z" /></>;
const CHAP_ICONS = [
  <><path d={SPARKLE} /><path d="M14 2v3M12.5 3.5h3" /></>,
  <><circle cx="9" cy="9" r="7" /><path d="M2 9h14M9 2c2.2 2.4 2.2 11.6 0 14C6.8 13.6 6.8 4.4 9 2" /></>,
  <path d="M10 1.5 3.5 10H9l-1 6.5L14.5 8H9Z" />,
  TROPHY,
];
const TILE_ICONS = [
  <path d="M2 14.5 6.5 9.5l3 2.5L16 4.5" />,
  <path d="M3 15V9M7.5 15V5M12 15v-4M16 15V3" />,
  <><circle cx="9" cy="9" r="7" /><path d="M9 2v7l5 4" /></>,
  <><rect x="2.5" y="3" width="13" height="12" rx="2" /><path d="M5.5 6.5h7M5.5 9.5h7M5.5 12.5h4" /></>,
];
const TILE_SPARKS = [
  "M2 18 L12 12 L20 15 L30 6 L40 9 L50 2",
  "M4 20V12M14 20V7M24 20V10M34 20V4M44 20V9",
  "M2 14 C 12 4, 20 22, 30 12 S 44 6, 50 10",
  "M2 6H34M2 12H44M2 18H26",
];
const RANKS = [94, 80, 68, 55, 42, 34, 27];
// Statement heading per language; `true` marks the teal words
const TITLE: Record<string, [string, boolean][]> = {
  mn: [["Хөрөнгийн", false], ["зах", false], ["зээлийн", false], ["мэдээлэл", false], ["бүгд", true], ["нэг", true], ["дор", true]],
  en: [["All", false], ["Capital", false], ["Market", false], ["Data", false], ["in", true], ["One", true], ["Place", true]],
  zh: [["一站式", true], ["资本市场", false], ["数据平台", false]],
};

export default function MarketIntel() {
  const { language } = useLanguage();
  const tr = (mn: string, en: string, zh: string) => pick(language, mn, en, zh);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);

  const title = TITLE[language] ?? TITLE.en;
  const chaps = [
    { title: tr("AI шинжилгээ", "AI Analysis", "AI分析"), desc: tr("Ухаалаг шинжилгээ, таамаглал", "Smart insights & predictions", "智能分析与预测") },
    { title: tr("Бүх мэдээлэл нэг дор", "All-in-one Data", "一站式数据"), desc: tr("Хувьцаа, индекс, салбар, мэдээ", "Stocks, indices, sectors, news", "股票、指数、行业、新闻") },
    { title: tr("Шуурхай, үнэн зөв", "Real-time Accurate", "实时准确"), desc: tr("Бодит цаг дахь зах зээлийн мэдээлэл", "Live market data", "实时市场数据") },
    { title: tr("Топ компаниуд", "Top Companies", "优质公司排行"), desc: tr("ROE, ашигт ажиллагааны дүн шинжилгээ", "ROE & profitability analysis", "ROE及盈利能力分析") },
  ];
  const tiles = [tr("Хувьцаа", "Stocks", "股票"), tr("Индекс", "Indices", "指数"), tr("Салбар", "Sectors", "行业"), tr("Мэдээ", "News", "新闻")];
  const ranges = [tr("7 хоног", "7D", "7天"), tr("Сар", "1M", "月"), tr("Жил", "1Y", "年")];

  useEffect(() => {
    const sec = sectionRef.current, h = titleRef.current, lead = leadRef.current;
    const story = storyRef.current, rail = railRef.current, dash = dashRef.current;
    if (!sec || !h || !lead || !story || !rail || !dash) return;
    const chaps = [...story.querySelectorAll<HTMLElement>(`.${s.chap}`)];
    if (prefersReducedMotion()) {
      sec.classList.add(s.in); chaps.forEach(c => c.classList.add(s.on)); dash.dataset.f = "0";
      return;
    }
    let cur = -2;
    return onScrollFrame(() => {
      const vh = innerHeight;
      // T2: the statement lights up word by word as it scrolls in, then the lead rises
      const q = clamp((vh * .88 - h.getBoundingClientRect().top) / (vh * .55));
      const words = h.querySelectorAll<HTMLElement>("[data-lw]");
      words.forEach((w, k) => w.style.setProperty("--lv", String(clamp(q * (words.length + 1.5) - k))));
      lead.style.setProperty("--sl", String(eOut(clamp((q - .75) / .25))));
      // ...then the dashboard pins while the chapters scroll past it. The chapter nearest the
      // reading line is active and drives the dashboard's highlighted part (data-f). In the
      // one-column layout the dashboard pins above the chapters, so the line is the middle of the
      // space below it.
      const vr = dash.getBoundingClientRect();
      if (vr.top < vh * .8) sec.classList.add(s.in);
      const line = matchMedia("(max-width:960px)").matches ? (clamp(vr.bottom, 0, vh) + vh) / 2 : vh / 2;
      let best = -1, bd = 1e9;
      chaps.forEach((c, k) => {
        const cr = c.getBoundingClientRect(), dist = Math.abs(cr.top + cr.height / 2 - line);
        if (cr.top < line + vh * .25 && dist < bd) { bd = dist; best = k; }
      });
      const st = story.getBoundingClientRect();
      rail.style.setProperty("--sf", String(clamp((vh / 2 - st.top - vh * .31) / (st.height - vh * .46))));
      if (best !== cur) {
        cur = best;
        chaps.forEach((c, k) => { c.classList.toggle(s.on, k === best); c.classList.toggle(s.past, best >= 0 && k < best); });
        if (best >= 0) dash.dataset.f = String(best); else delete dash.dataset.f;
      }
    });
  }, []);

  return (
    <section ref={sectionRef} id="mmi" className={s.mmi2} aria-labelledby="mmi-title">
      <div className={s.statement}>
        <a href={MMI_URL} target="_blank" rel="noopener noreferrer" className={s.pill}><i></i>M Market Intelligence</a>
        <h2 ref={titleRef} id="mmi-title" className={s.lit} aria-label={title.map(([w]) => w).join(language === "zh" ? "" : " ")}>
          <span aria-hidden="true">
            {title.map(([w, hl], i) => (
              <span key={i}>{i > 0 && language !== "zh" ? " " : ""}<span data-lw="" className={`${s.lw}${hl ? ` ${s.hl}` : ""}`}>{w}</span></span>
            ))}
          </span>
        </h2>
        <p ref={leadRef} className={`${s.lead} ${s["st-lead"]}`}>
          {tr("Хувьцаа, индекс, салбарын гүйцэтгэл, санхүүгийн мэдээллийг бодит цаг дээр хянаж, илүү ухаалаг хөрөнгө оруулалтын шийдвэр гаргаарай.",
            "Track stocks, indices, sector performance and financial data in real time to make smarter investment decisions.",
            "实时跟踪股票、指数、行业表现和财务数据，做出更明智的投资决策。")}
        </p>
      </div>

      <div className={s.story}>
        {/* chapters scroll past the pinned dashboard; on/past are toggled from the scroll handler */}
        <div ref={storyRef} className={s["story-text"]}>
          <span ref={railRef} className={s.srail} aria-hidden="true"><i></i></span>
          {chaps.map((c, i) => (
            <article key={i} className={s.chap}>
              <span className={s["chap-top"]}><span className={s.fi}><Icon size={19}>{CHAP_ICONS[i]}</Icon></span><span className={s.cn}>{String(i + 1).padStart(2, "0")}</span></span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </article>
          ))}
          <div className={s["chap-end"]}>
            <a href={MMI_URL} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s["btn-p"]}`}>
              {tr("Үзэх", "Visit Platform", "立即查看")} <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 10.5 5.5 6.5 8 9l4.5-5M9 4h3.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>

        {/* Product dashboard; the active chapter highlights its part (data-f) */}
        <div className={s["story-vis"]}>
          <div className={s["sticky-vis"]}>
            <div ref={dashRef} className={s.dash2} aria-hidden="true">
              <div className={s["d-bar"]}>
                <span className={s["d-logo"]}>M</span><span className={s["d-name"]}>Market Intelligence</span>
                <span className={s["d-search"]}><svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="5" /><path d="M12 12l4 4" /></svg><i></i></span>
                <span className={s["d-av"]}></span>
              </div>
              <div className={s["d-grid"]}>
                <div className={`${s["d-chart"]} ${s.z0} ${s.z2}`}>
                  <div className={s["d-head"]}><b>MSE TOP-20</b><span className={s["d-range"]}>{ranges.map((r, i) => <i key={i} className={i === 1 ? s.on : undefined}>{r}</i>)}</span></div>
                  <svg viewBox="0 0 520 200" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="mmi-dA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: "var(--teal)" }} stopOpacity=".28" /><stop offset="1" style={{ stopColor: "var(--teal)" }} stopOpacity="0" /></linearGradient>
                      <linearGradient id="mmi-dS" x1="0" x2="1"><stop offset="0" style={{ stopColor: "var(--gold)" }} stopOpacity="0" /><stop offset=".5" style={{ stopColor: "var(--gold)" }} stopOpacity=".32" /><stop offset="1" style={{ stopColor: "var(--gold)" }} stopOpacity="0" /></linearGradient>
                    </defs>
                    <g className={s.grid}>{[50, 100, 150].map(y => <line key={y} x1="0" x2="520" y1={y} y2={y} />)}</g>
                    <path className={s.area} d="M0,170 L40,156 L80,164 L120,132 L160,142 L200,112 L240,122 L280,96 L320,104 L360,80 L400,88 L400,200 L0,200Z" fill="url(#mmi-dA)" />
                    <polyline className={s.ln} pathLength={1} points="0,170 40,156 80,164 120,132 160,142 200,112 240,122 280,96 320,104 360,80 400,88" />
                    <path className={s.band} d="M400 88 L440 70 L480 58 L520 44 L520 76 L480 86 L440 94 L400 88Z" />
                    <polyline className={s.fc} points="400,88 440,82 480,72 520,60" />
                    <polyline className={s.live} pathLength={1} points="400,88 420,84 440,90 460,76 480,80 500,66 520,70" />
                    <rect className={s.scan} x="0" y="0" width="70" height="200" fill="url(#mmi-dS)" />
                    <g className={s.tip}><circle cx="400" cy="88" r="5" /><circle className={s.ring} cx="400" cy="88" r="5" /></g>
                  </svg>
                  <div className={s["ai-card"]}>
                    <span className={s["ai-ic"]}><Icon size={14}><path d={SPARKLE} /></Icon></span>
                    <div><i style={{ "--w": "86%" } as CSSProperties}></i><i style={{ "--w": "64%" } as CSSProperties}></i><i style={{ "--w": "72%" } as CSSProperties}></i></div>
                  </div>
                  <span className={s.rt}><svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="6.5" /><path d="M9 5.5V9l2.5 1.5" /></svg>{tr("Бодит цаг", "Live", "实时")}</span>
                </div>
                <div className={`${s["d-ranks"]} ${s.z3}`}>
                  <div className={s["d-head"]}><b><Icon size={14}>{TROPHY}</Icon>{chaps[3].title}</b></div>
                  {RANKS.map((w, i) => (
                    <div key={i} className={s["d-rk"]} style={{ ...vi(i), "--w": `${w}%` } as CSSProperties}><em>{i + 1}</em><b></b><span><i></i></span></div>
                  ))}
                </div>
                <div className={`${s["d-tiles"]} ${s.z1}`}>
                  {tiles.map((label, i) => (
                    <div key={i} className={s["d-tile"]} style={vi(i)}>
                      <span className={s.tt}><Icon size={14}>{TILE_ICONS[i]}</Icon>{label}</span>
                      <svg className={s["mini-sp"]} viewBox="0 0 52 22" aria-hidden="true"><path d={TILE_SPARKS[i]} /></svg>
                    </div>
                  ))}
                </div>
              </div>
              <div className={s["d-dots"]}><i></i><i></i><i></i><i></i></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

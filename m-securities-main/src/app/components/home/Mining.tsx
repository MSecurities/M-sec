"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, ease, eOut, isFullScreenLayout, onScrollFrame, pick, prefersReducedMotion, vi } from "./shared";
import { miningArt } from "../shared/miningArt";
import s from "./home.module.css";

const ART = miningArt(s.spark);

const d = (n: number) => ({ "--d": n } as CSSProperties);

export default function Mining() {
  const { language } = useLanguage();
  const tr = (mn: string, en: string, zh: string) => pick(language, mn, en, zh);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mtnRef = useRef<HTMLDivElement>(null);

  const active = tr("Арилжаанд", "Active", "交易中");
  const products = [
    { name: tr("Нүүрс", "Coal", "煤炭"), tag: active },
    { name: tr("Зэсийн баяжмал", "Copper Concentrate", "铜精矿"), tag: active },
    { name: tr("Төмрийн хүдэр", "Iron Ore", "铁矿石"), tag: active },
    { name: tr("Бусад эрдэс", "Other Minerals", "其他矿产"), tag: active },
  ];

  useEffect(() => {
    const sec = sectionRef.current, card = cardRef.current, mtn = mtnRef.current;
    if (!sec || !card || !mtn) return;
    if (prefersReducedMotion()) {
      sec.classList.add(s.in); mtn.style.setProperty("--mp", "0"); mtn.style.setProperty("--vp", "0");
      return;
    }
    return onScrollFrame(() => {
      const vh = innerHeight, r = sec.getBoundingClientRect();
      if (isFullScreenLayout()) {
        // T3 (pinned): a small card with the service-02 motif opens into the full page, then the
        // ridges rise, the copy reveals and the gold vein draws
        const p = clamp(-r.top / (r.height - vh)), pre = clamp((vh - r.top) / vh);
        const open = ease(clamp(p / .42));
        card.style.setProperty("--co", String(1 - open));
        card.style.setProperty("--mo", String(1 - clamp((open - .35) / .35)));
        mtn.style.setProperty("--mp", String(1 - eOut(clamp((p - .22) / .33))));
        mtn.style.setProperty("--vp", String(1 - clamp((p - .45) / .4)));
        sec.classList.toggle(s.in, p > .3);
        card.style.transform = `translateY(${(1 - pre) * 8}vh)`;
        return;
      }
      // Card layout: ridges rise as the mountain band scrolls into view, the vein draws after them,
      // and the copy reveals once a quarter of the card is in view
      card.style.transform = "";
      const m = mtn.getBoundingClientRect(), q = m.height ? clamp((vh - m.top) / m.height) : 0;
      mtn.style.setProperty("--mp", String(1 - eOut(q)));
      mtn.style.setProperty("--vp", String(1 - clamp((q - .35) / .65)));
      if (Math.min(r.bottom, vh) - Math.max(r.top, 0) >= Math.min(r.height, vh) * .25) sec.classList.add(s.in);
    });
  }, []);

  return (
    <section ref={sectionRef} id="mining" className={s["scene-mine"]} aria-labelledby="mine-title">
      <div className={s.mstage}>
      <div ref={cardRef} className={s.mcard}>
        <svg className={s.mini} viewBox="0 0 340 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path style={{ fill: "rgba(var(--dot),.14)" }} d="M-10 150 L60 80 L105 118 L170 46 L235 112 L280 74 L350 140 V200 H-10Z" />
          <path style={{ fill: "rgba(var(--dot),.22)" }} d="M-10 165 L50 120 L120 150 L190 92 L260 146 L310 118 L350 150 V200 H-10Z" />
          <path style={{ fill: "rgba(var(--dot),.34)" }} d="M-10 182 L80 150 L150 170 L230 140 L300 168 L350 160 V200 H-10Z" />
          <path d="M70 178 C 110 150, 120 170, 160 140 S 210 120, 240 150 S 290 140, 300 120" fill="none" style={{ stroke: "var(--gold)" }} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div ref={mtnRef} className={s.mtn} aria-hidden="true">
          <svg viewBox="0 0 1280 300" preserveAspectRatio="none">
            <path className={s.r} style={{ ...vi(0), fill: "rgba(var(--dot),.08)" }} d="M0 220 L160 120 L280 180 L460 70 L620 170 L760 110 L920 190 L1080 90 L1280 170 V300 H0Z" />
            <path className={s.r} style={{ ...vi(1), fill: "rgba(var(--dot),.13)" }} d="M0 250 L140 190 L320 230 L500 150 L700 230 L860 180 L1040 240 L1180 190 L1280 220 V300 H0Z" />
            <path className={s.r} style={{ ...vi(2), fill: "rgba(var(--dot),.2)" }} d="M0 280 L200 240 L380 270 L600 230 L820 270 L1000 245 L1280 275 V300 H0Z" />
            <path className={s.vein} pathLength={1} d="M60 285 C 220 250, 300 280, 460 240 S 700 255, 820 235 S 1060 250, 1240 215" />
          </svg>
        </div>
        <div className={s["panel-in"]}>
          <div>
            <span className={`${s.pill} ${s.rv}`} style={d(0)}><i></i>{tr("Уул уурхайн брокер · МХБ зөвшөөрөлтэй", "Mining Broker · MSE Licensed", "矿业经纪 · 持牌运营")}</span>
            <h2 id="mine-title" className={s.rv} style={d(1)}>{tr("Уул уурхайн цахим арилжаа", "Mining Products Online Trading", "矿产品在线交易平台")}</h2>
            <p className={`${s.lead} ${s.rv}`} style={d(2)}>
              {tr("М Секьюритис ҮЦК нь Монголын Хөрөнгийн Биржээр дамжуулан нүүрс, зэсийн баяжмал болон бусад уул уурхайн бүтээгдэхүүний арилжааг мэргэжлийн түвшинд хэрэгжүүлдэг.",
                "M Securities professionally conducts coal, copper concentrate and other mining product trading through the Mongolian Stock Exchange.",
                "M Securities 通过蒙古证券交易所专业开展煤炭、铜精矿等矿产品交易。")}
            </p>
            <div className={`${s.btns} ${s.rv}`} style={d(3)}>
              <a href="https://mining.msecurities.mn/dashboard/app" target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s["btn-p"]}`}>
                {tr("Арилжааны платформ", "Trading Platform", "交易平台")} <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 10.5 5.5 6.5 8 9l4.5-5M9 4h3.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              <Link href="/services/mining-broker" className={`${s.btn} ${s["btn-g"]}`}>{tr("Дэлгэрэнгүй", "Learn More", "了解更多")}</Link>
            </div>
          </div>
          <div className={s.comms}>
            {products.map((p, i) => (
              <div key={i} className={s.cmd} style={vi(i)}>
                <svg className={s.art} viewBox="0 0 84 64" aria-hidden="true">{ART[i]}</svg>
                <b>{p.name}</b>
                <span className={`${s.st} ${s.on}`}><i></i>{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { clamp, eOut, onScrollFrame, pick, prefersReducedMotion } from "./shared";
import s from "./home.module.css";

// Where the widget's data comes from: TradingView's S&P 500 stock heatmap (same dataset, size and grouping)
const SOURCE_URL = "https://www.tradingview.com/heatmap/stock/#" + encodeURIComponent(JSON.stringify({ dataSource: "SPX500", blockColor: "change", blockSize: "market_cap_basic", grouping: "sector" }));

const LEGEND = ["#B4232F", "#7E1F28", "#3A1E25", "#2B3138", "#163A2C", "#13623F", "#14A05E"];

// 24×12 mosaic tiles (the first 12×12 on narrow screens), each with a fixed random reveal threshold
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const TILES = Array.from({ length: 24 * 12 }, () => rnd());

export default function Heatmap() {
  const { language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const tradingViewRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // TradingView stock heatmap widget, filling the board
  useEffect(() => {
    if (!tradingViewRef.current) return;
    tradingViewRef.current.innerHTML = "";
    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    container.appendChild(widget);
    tradingViewRef.current.appendChild(container);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    const locale = language === "mn" ? "mn" : "en";
    script.innerHTML = `{
      "dataSource": "SPX500",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "grouping": "sector",
      "locale": "${locale}",
      "colorTheme": "${isDarkMode ? "dark" : "light"}",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": false,
      "width": "100%",
      "height": "100%"
    }`;
    container.appendChild(script);
  }, [isDarkMode, language]);

  // The frame tilts up flat as it scrolls in, then the mosaic over the widget dissolves
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || prefersReducedMotion()) return;
    return onScrollFrame(() => {
      const vh = innerHeight, r = frame.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh * .8));
      frame.style.setProperty("--hp", String(1 - eOut(clamp(p / .7))));
      frame.style.setProperty("--m", String(clamp((p - .3) / .6)));
    });
  }, []);

  return (
    <section className={s.heat} id="heatmap" aria-labelledby="heat-title">
      <div className={s["heat-head"]}>
        <div>
          <span className={s.kick}><i></i>{pick(language, "Зах зээл", "Market", "市场")}</span>
          <h2 id="heat-title">Stock Heatmap</h2>
        </div>
        <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className={s["heat-more"]}>
          {pick(language, "Дэлгэрэнгүй", "More", "更多")} <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 10.5 5.5 6.5 8 9l4.5-5M9 4h3.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
      <div ref={frameRef} className={s["heat-frame"]}>
        <div className={s["heat-bar"]}>
          <span className={s.live}><i></i>TradingView</span>
          <span className={s.legend} aria-hidden="true">
            <em>-3%</em>{LEGEND.map(c => <b key={c} style={{ background: c }}></b>)}<em>+3%</em>
          </span>
        </div>
        <div ref={tradingViewRef} className={s["heat-board"]} />
        <div className={s.mosaic} aria-hidden="true">
          {TILES.map((t, i) => <b key={i} style={{ "--t": t } as CSSProperties}></b>)}
        </div>
      </div>
    </section>
  );
}

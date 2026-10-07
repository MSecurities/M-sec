"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Onest } from "next/font/google";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../context/DarkModeContext";
import { translations } from "../translations";
import { clamp, eOut, onScrollFrame, prefersReducedMotion } from "./home/shared";
import s from "./footer.module.css";

// Same face as the home sections; cyrillic-ext carries Ө / Ү.
const onest = Onest({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-onest",
});

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61570245532774",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21z" /></svg>,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/105883976",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.9 8.9H3.6V20h3.3zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.6c0-3-1.6-4.9-4.2-4.9-1.4 0-2.4.8-2.8 1.5V8.9h-3.2V20h3.3v-5.5c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3z" /></svg>,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/msecurities_/",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" /></svg>,
  },
];

const WORDMARK = ["M", " ", ..."securities"];

const Footer = () => {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const widgetRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  // The scrolling price ticker runs on every page except Home
  const showTicker = usePathname() !== "/";

  useEffect(() => {
    if (!showTicker) return;
    let widgetElement: HTMLDivElement | null = null;
    const loadWidget = () => {
      try {
        widgetElement = widgetRef.current;
        if (!widgetElement) return;
        widgetElement.innerHTML = "";
        const container = document.createElement("div");
        container.className = "tradingview-widget-container__widget";
        widgetElement.appendChild(container);
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.innerHTML = JSON.stringify({
          symbols: [
            { description: "GOLD", proName: "OANDA:XAUUSD" },
            { description: "USDMNT", proName: "FX_IDC:USDMNT" },
            { description: "BTC", proName: "BINANCE:BTCUSD" },
            { description: "ETH", proName: "BINANCE:ETHUSD" },
            { description: "SILVER", proName: "OANDA:XAGUSD" },
            { description: "EURUSD", proName: "OANDA:EURUSD" },
            { description: "AAPL", proName: "NASDAQ:AAPL" },
            { description: "MSFT", proName: "NASDAQ:MSFT" },
          ],
          showSymbolLogo: true,
          colorTheme: isDarkMode ? "dark" : "light",
          isTransparent: true,
          displayMode: "adaptive",
          locale: "en",
          backgroundColor: isDarkMode ? "#0a0c10" : "#ffffff",
        });
        widgetElement.appendChild(script);
      } catch (e) { console.error(e); }
    };
    const timer = setTimeout(loadWidget, 100);
    return () => { clearTimeout(timer); if (widgetElement) widgetElement.innerHTML = ""; };
  }, [isDarkMode, showTicker]);

  // The wordmark rises letter by letter as it scrolls into view
  useEffect(() => {
    const wm = wordmarkRef.current;
    if (!wm || prefersReducedMotion()) return;
    return onScrollFrame(() => {
      const vh = innerHeight;
      wm.style.setProperty("--wv", String(1 - eOut(clamp((vh - wm.getBoundingClientRect().top) / (vh * .5)))));
    });
  }, []);

  const address = language === "en"
    ? ["New Horizons Office 401, 1st Khoroo,", "Sukhbaatar District, Ulaanbaatar 14120"]
    : ["Нью Хориязонс Оффис 401, 1-р хороо,", "Сүхбаатар дүүрэг, Улаанбаатар 14120"];

  return (
    <>
      <footer className={`${onest.variable} ${s.ft}${showTicker ? ` ${s.tick}` : ""}`}>
        <div className={s["ft-in"]}>
          <div className={s["ft-brand"]}>
            <Link href="/" className={s["ft-logo"]} aria-label="M Securities">
              <Image src={isDarkMode ? "/logo-dark.png" : "/logo.png"} alt="M Securities" width={160} height={40} />
            </Link>
            <p>{t("footer.tagline")}</p>
            <div className={s.soc}>
              {socialLinks.map(item => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>{item.icon}</a>
              ))}
            </div>
          </div>

          <nav className={s["ft-col"]} aria-label={t("footer.quickLinks")}>
            <h4>{t("footer.quickLinks")}</h4>
            {[
              { href: "/about", label: t("navbar.sections.introduction") },
              { href: "/research/news", label: t("navbar.sections.news") },
              { href: "/services/broker", label: t("navbar.sections.broker") },
              { href: "/faq/common-questions", label: t("navbar.sections.commonQuestions") },
            ].map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>

          <div className={s["ft-col"]}>
            <h4>{t("footer.contactUs.title")}</h4>
            <a href="mailto:info@msecurities.mn" className={s.ci}>
              <span className={s.cic}><svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3.5" width="14" height="11" rx="2.5" /><path d="m2.8 5 6.2 4.6L15.2 5" /></svg></span>
              <span className={s.ct}>info@msecurities.mn</span>
            </a>
            {(translations[language].footer.contactUs.phone.numbers as string[]).map(n => (
              <a key={n} href={`tel:+976${n}`} className={s.ci}>
                <span className={s.cic}><svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.6 2.5H4.3A1.8 1.8 0 0 0 2.5 4.4c.4 6 5.1 10.7 11.1 11.1a1.8 1.8 0 0 0 1.9-1.8v-2.3l-3-1.3-1.6 1.6a8.4 8.4 0 0 1-3.8-3.8L8.7 6.3 7.4 3.3Z" /></svg></span>
                <span className={s.ct}>+976-{n}</span>
              </a>
            ))}
            <address className={s.ci}>
              <span className={s.cic}><svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 16s5.5-4.6 5.5-9A5.5 5.5 0 0 0 3.5 7c0 4.4 5.5 9 5.5 9Z" /><circle cx="9" cy="7" r="2" /></svg></span>
              <span>{address[0]}<br />{address[1]}</span>
            </address>
          </div>

          <div className={s["ft-col"]}>
            <h4>{t("footer.mobileApp.title")}</h4>
            <a href="https://apps.apple.com/mn/app/m-securities-mn/id6745858855" target="_blank" rel="noopener noreferrer" className={s.store}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.3.8c1.4 0 2.2-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4.1zM13.9 5c.7-.9 1.2-2 1-3.2-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.5z" /></svg>
              <span><small>Download on the</small>App Store</span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.istock.msec&hl=en&pli=1" target="_blank" rel="noopener noreferrer" className={s.store}>
              <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true"><path d="M1 1.2 11.4 11 1 20.8c-.3-.2-.5-.6-.5-1V2.2c0-.4.2-.8.5-1z" fill="#2DD4BF" /><path d="M14.6 7.8 11.4 11 1 1.2c.3-.2.8-.2 1.2 0z" fill="#5EEAD4" /><path d="M14.6 14.2 2.2 20.8c-.4.2-.9.2-1.2 0L11.4 11z" fill="#F0B848" /><path d="M18.4 9.8c.8.5.8 1.9 0 2.4l-3.8 2L11.4 11l3.2-3.2z" fill="#E8B44C" /></svg>
              <span><small>Get it on</small>Play Store</span>
            </a>
          </div>
        </div>

        <div ref={wordmarkRef} className={s.wordmark} aria-hidden="true">
          {WORDMARK.map((c, i) => <span key={i} className={i === 0 ? s["wm-m"] : undefined} style={{ "--i": i } as CSSProperties}>{c}</span>)}
        </div>

        <div className={s["ft-bot"]}>
          <span>© {new Date().getFullYear()} M Securities. {t("footer.copyright")}</span>
          <span className={s.tags}><i>СЗХ лицензтэй</i><i>МХБ гишүүн</i></span>
        </div>
      </footer>

      {/* TradingView ticker */}
      {showTicker && (
        <div ref={widgetRef}
          className={`fixed bottom-0 left-0 w-full z-50 transition-colors duration-300
            ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-white'} border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        </div>
      )}
    </>
  );
};

export default Footer;

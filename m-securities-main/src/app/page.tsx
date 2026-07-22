// app/page.tsx
"use client";
import Image from "next/image";
import { useLanguage } from "./context/LanguageContext";
import { useEffect, useRef } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import Link from "next/link";

export default function Home() {
  const { t, language } = useLanguage();
  const tradingViewRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();

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
      "height": "600"
    }`;
    container.appendChild(script);
  }, [isDarkMode, language]);

  const services = [
    {
      badge: language === "mn" ? "Брокер" : language === "zh" ? "经纪" : "Broker",
      icon: "📈",
      href: "/services/broker",
      title: t("navbar.sections.broker"),
      desc: language === "mn"
        ? "МХБ-д бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа хийх боломжтой."
        : language === "zh"
        ? "在蒙古证券交易所买卖股票、债券及其他证券。"
        : "Buy and sell stocks, bonds, and other securities listed on the Mongolian Stock Exchange.",
    },
    {
      badge: language === "mn" ? "Андеррайтер" : language === "zh" ? "承销" : "Underwriter",
      icon: "🏛️",
      href: "/services/underwriter",
      title: t("navbar.sections.underwriter"),
      desc: language === "mn"
        ? "Дотоодын компаниудад хөрөнгө босгоход андеррайтерийн мэргэжлийн үйлчилгээ."
        : language === "zh"
        ? "为国内企业提供专业承销服务，协助融资。"
        : "Professional underwriting services to help domestic companies raise capital.",
    },
    {
      badge: language === "mn" ? "Зөвлөх" : language === "zh" ? "顾问" : "Advisory",
      icon: "💼",
      href: "/services/investment-advisor",
      title: t("navbar.sections.investmentAdvisor"),
      desc: language === "mn"
        ? "Таны хөрөнгө оруулалтын зорилгод нийцсэн мэргэжлийн зөвлөгөө, багцын удирдлага."
        : language === "zh"
        ? "根据您的投资目标提供专业建议和投资组合管理。"
        : "Expert investment advice and portfolio management tailored to your goals.",
    },
    {
      badge: language === "mn" ? "Уул уурхай" : language === "zh" ? "矿业" : "Mining",
      icon: "⛏️",
      href: "/services/mining-broker",
      title: t("navbar.sections.miningBroker"),
      desc: language === "mn"
        ? "Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний цахим арилжаа."
        : language === "zh"
        ? "通过蒙古证券交易所进行矿产品在线交易。"
        : "Electronic trading of mining products through the Mongolian Stock Exchange.",
    },
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-gray-50'}`}>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Blobs */}
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="hero-blob-3" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="msec-badge mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            М Секьюритис ҮЦК · СЗХ лицензтэй
          </div>

          {/* Title */}
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === "mn" ? "Дэлхийгээс өгөөж" : language === "zh" ? "连接全球" : "Bridge to Global"}
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
            <span className="grad-text">
              {language === "mn" ? "хүртэх гүүр" : language === "zh" ? "收益的桥梁" : "Opportunity"}
            </span>
          </h1>

          {/* Sub */}
          <p className={`text-base sm:text-lg mb-4 leading-relaxed max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === "mn"
              ? "Монголын хөрөнгийн зах зээлд болон дэлхийн санхүүгийн зах зээлд"
              : language === "zh"
              ? "连接蒙古资本市场与全球金融市场"
              : "Connecting Mongolia's capital market with global financial markets"}
          </p>
          <p className={`text-base sm:text-lg mb-10 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {language === "mn"
              ? "хөрөнгө оруулах хамгийн найдвартай түнш"
              : language === "zh"
              ? "最值得信赖的投资伙伴"
              : "your most trusted investment partner"}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["🏛️ МХБ бүртгэлтэй", "🔐 СЗХ лицензтэй", "🌏 Дэлхийн зах зээл"].map(b => (
              <span key={b} className="trust-badge">{b}</span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
              className="btn-primary">
              {t("home.cta.button")} ↗
            </a>
            <Link href="/about/introduction" className="btn-secondary">
              {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "了解更多" : "Learn More"}
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid max-w-xl mx-auto">
            {[
              { v: "10+", l: language === "mn" ? "Жилийн\nтуршлага" : language === "zh" ? "年\n经验" : "Years\nExperience" },
              { v: "1000+", l: language === "mn" ? "Харилцагч" : language === "zh" ? "客户" : "Clients" },
              { v: "МХБ", l: language === "mn" ? "Арилжааны\nгишүүн" : language === "zh" ? "交易所\n成员" : "Exchange\nMember" },
              { v: "24/7", l: language === "mn" ? "Онлайн\nплатформ" : language === "zh" ? "在线\n平台" : "Online\nPlatform" },
            ].map(s => (
              <div key={s.v} className="stat-cell">
                <div className="text-xl sm:text-2xl font-bold grad-text">{s.v}</div>
                <div className={`text-xs mt-1 leading-tight whitespace-pre-line ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <div className={`w-px h-8 bg-gradient-to-b from-transparent ${isDarkMode ? 'to-teal-500/40' : 'to-teal-400/50'}`} />
          <div className="w-1 h-1 rounded-full bg-teal-400/50 animate-bounce" />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0d0f14]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="sec-label mb-3">
              {language === "mn" ? "Үйлчилгээ" : language === "zh" ? "服务" : "Services"}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {language === "mn" ? "Мэргэжлийн брокер,\nдилерийн үйлчилгээ"
                : language === "zh" ? "专业经纪\n交易商服务"
                : "Professional Broker &\nDealer Services"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(s => (
              <Link key={s.href} href={s.href} className="msec-card p-6 block group">
                <div className={`inline-flex text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md mb-5
                  ${isDarkMode ? 'bg-teal-500/12 text-teal-400 border border-teal-500/20' : 'bg-teal-50 text-teal-700 border border-teal-100'}`}>
                  {s.badge}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4
                  ${isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50'}`}>
                  {s.icon}
                </div>
                <h3 className={`font-semibold mb-2.5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{s.desc}</p>
                <span className={`text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all
                  ${isDarkMode ? 'text-teal-400' : 'text-teal-600'}`}>
                  {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "了解更多" : "Learn more"} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEATMAP ── */}
      <section className={`py-12 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="sec-label mb-2">Live</p>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stock Heatmap</h2>
          </div>
          <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? 'border-white/6' : 'border-gray-200 shadow-sm'}`}
            style={{ height: 600 }}>
            <div ref={tradingViewRef} className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0d0f14]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="sec-label mb-3">{language === "mn" ? "Бидний тухай" : language === "zh" ? "关于我们" : "About Us"}</p>
          <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t("home.about.title")}
          </h2>
          <p className={`text-base leading-relaxed max-w-2xl mx-auto mb-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t("home.about.description")}
          </p>
          <Link href="/about/introduction" className="btn-primary inline-flex">
            {language === "mn" ? "Дэлгэрэнгүй унших" : language === "zh" ? "了解更多" : "Read More"} →
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{t("home.cta.title")}</h2>
          <p className="text-white/80 mb-8 text-lg">{t("home.cta.description")}</p>
          <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold
              bg-white text-teal-600 hover:bg-gray-50 shadow-lg transition-all hover:-translate-y-0.5">
            {t("home.cta.button")} ↗
          </a>
        </div>
      </section>
    </div>
  );
}

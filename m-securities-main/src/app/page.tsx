// app/page.tsx
"use client";

import { useLanguage } from "./context/LanguageContext";
import { useEffect, useRef } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import Link from "next/link";

export default function Home() {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const tradingViewRef = useRef<HTMLDivElement>(null);

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

  const bg = isDarkMode ? "bg-[#080a0d]" : "bg-[#f8f9fb]";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const cardBg = isDarkMode ? "bg-[#111318]" : "bg-white";
  const cardBorder = isDarkMode ? "border-white/6" : "border-gray-200";
  const sectionAlt = isDarkMode ? "bg-[#0d0f14]" : "bg-white";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>

      {/* ── HERO ── */}
      <section className={`relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-20 ${isDarkMode ? "bg-[#080a0d]" : "bg-[#f8f9fb]"}`}>

        {/* Subtle background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-10 ${isDarkMode ? "bg-teal-400" : "bg-teal-300"}`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-12 border
            ${isDarkMode ? "bg-white/4 border-white/10 text-gray-300" : "bg-white border-gray-200 text-gray-500 shadow-sm"}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            {language === "mn" ? "СЗХ-ны тусгай зөвшөөрөлтэй" : language === "zh" ? "持有金融监管委员会牌照" : "Licensed by the Financial Regulatory Commission"}
          </div>

          {/* Main title */}
          <h1 className={`text-6xl sm:text-7xl md:text-8xl font-bold leading-[1.02] tracking-tight mb-8 ${textPrimary}`}>
            {language === "mn" ? (
              <>
                Дэлхийгээс өгөөж<br />
                <span className="text-teal-400">хүртэх гүүр</span>
              </>
            ) : language === "zh" ? (
              <>
                连接全球<br />
                <span className="text-teal-400">收益的桥梁</span>
              </>
            ) : (
              <>
                Bridge to Global<br />
                <span className="text-teal-400">Opportunity</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className={`text-lg sm:text-xl mb-14 max-w-xl mx-auto leading-relaxed ${textSecondary}`}>
            {language === "mn"
              ? "Монголын болон дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулах хамгийн найдвартай түнш."
              : language === "zh"
              ? "连接蒙古与全球资本市场，您最值得信赖的投资伙伴。"
              : "Your most trusted partner for investing in Mongolia and global capital markets."}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white
                bg-teal-500 hover:bg-teal-400 transition-all duration-200 hover:-translate-y-0.5
                shadow-lg shadow-teal-500/20">
              {t("home.cta.button")} ↗
            </a>
            <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 border
                ${isDarkMode ? "bg-white/6 text-white border-white/10 hover:bg-white/10" : "bg-white text-gray-800 border-gray-200 hover:border-teal-300 shadow-sm"}`}>
              📈 {language === "mn" ? "Зах зээлийн мэдээлэл" : language === "zh" ? "市场数据" : "Market Intelligence"}
            </a>
          </div>

          {/* Divider label */}
          <div className={`flex items-center justify-center gap-4 text-xs font-semibold tracking-widest uppercase ${textSecondary}`}>
            <div className={`h-px w-16 ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`} />
            {language === "mn" ? "Манай үйлчилгээнүүд" : language === "zh" ? "我们的服务" : "Our Services"}
            <div className={`h-px w-16 ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className={`w-px h-10 bg-gradient-to-b from-transparent ${isDarkMode ? "to-white/20" : "to-gray-300"}`} />
          <div className={`w-1 h-1 rounded-full animate-bounce ${isDarkMode ? "bg-white/20" : "bg-gray-300"}`} />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={`py-24 px-6 ${sectionAlt}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                badge: language === "mn" ? "Брокер" : language === "zh" ? "经纪" : "Broker",
                icon: "📈",
                href: "/services/broker",
                title: t("navbar.sections.broker"),
                desc: language === "mn" ? "МХБ-д бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа хийх боломжтой." : language === "zh" ? "在蒙古证券交易所买卖股票、债券及其他证券。" : "Buy and sell stocks, bonds, and securities listed on the Mongolian Stock Exchange.",
              },
              {
                badge: language === "mn" ? "Андеррайтер" : language === "zh" ? "承销" : "Underwriter",
                icon: "🏛️",
                href: "/services/underwriter",
                title: t("navbar.sections.underwriter"),
                desc: language === "mn" ? "Дотоодын компаниудад хөрөнгө босгоход андеррайтерийн мэргэжлийн үйлчилгээ." : language === "zh" ? "为国内企业提供专业承销服务，协助融资。" : "Professional underwriting services to help domestic companies raise capital.",
              },
              {
                badge: language === "mn" ? "Зөвлөх" : language === "zh" ? "顾问" : "Advisory",
                icon: "💼",
                href: "/services/investment-advisor",
                title: t("navbar.sections.investmentAdvisor"),
                desc: language === "mn" ? "Таны хөрөнгө оруулалтын зорилгод нийцсэн мэргэжлийн зөвлөгөө, багцын удирдлага." : language === "zh" ? "根据您的投资目标提供专业建议和投资组合管理。" : "Expert investment advice and portfolio management tailored to your goals.",
              },
              {
                badge: language === "mn" ? "Уул уурхай" : language === "zh" ? "矿业" : "Mining",
                icon: "⛏️",
                href: "/services/mining-broker",
                title: t("navbar.sections.miningBroker"),
                desc: language === "mn" ? "Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний цахим арилжаа." : language === "zh" ? "通过蒙古证券交易所进行矿产品在线交易。" : "Electronic trading of mining products through the Mongolian Stock Exchange.",
              },
            ].map(s => (
              <Link key={s.href} href={s.href}
                className={`group rounded-2xl border p-6 block transition-all duration-300 hover:-translate-y-1
                  ${cardBg} ${cardBorder}
                  ${isDarkMode ? "hover:bg-[#151820] hover:border-teal-500/20 hover:shadow-lg hover:shadow-teal-500/5" : "hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/8"}`}>
                <div className={`inline-flex text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md mb-5
                  ${isDarkMode ? "bg-teal-500/10 text-teal-400 border border-teal-500/15" : "bg-teal-50 text-teal-700 border border-teal-100"}`}>
                  {s.badge}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4
                  ${isDarkMode ? "bg-white/4" : "bg-gray-50"}`}>
                  {s.icon}
                </div>
                <h3 className={`font-semibold mb-2.5 ${textPrimary}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${textSecondary}`}>{s.desc}</p>
                <span className={`text-sm font-medium flex items-center gap-1 group-hover:gap-2.5 transition-all
                  ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
                  {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "了解更多" : "Learn more"} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MMI SECTION ── */}
      <section className={`py-24 px-6 ${bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-3xl border p-10 sm:p-14 relative overflow-hidden ${cardBg} ${cardBorder}`}>
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 bg-teal-400 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border
                  ${isDarkMode ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-teal-50 text-teal-700 border-teal-200"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  M Market Intelligence
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold mb-5 leading-tight ${textPrimary}`}>
                  {language === "mn" ? "Хөрөнгийн зах зээлийн\nмэдээлэл бүгд нэг дор"
                    : language === "zh" ? "一站式\n资本市场数据平台"
                    : "All Capital Market\nData in One Place"}
                </h2>
                <p className={`text-base leading-relaxed mb-8 ${textSecondary}`}>
                  {language === "mn"
                    ? "Хувьцаа, индекс, салбарын гүйцэтгэл, санхүүгийн мэдээллийг бодит цаг дээр хянаж, илүү ухаалаг хөрөнгө оруулалтын шийдвэр гаргаарай."
                    : language === "zh"
                    ? "实时跟踪股票、指数、行业表现和财务数据，做出更明智的投资决策。"
                    : "Track stocks, indices, sector performance and financial data in real time to make smarter investment decisions."}
                </p>
                <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white
                    bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
                  {language === "mn" ? "Үзэх" : language === "zh" ? "立即查看" : "Visit Platform"} ↗
                </a>
              </div>

              {/* Feature list */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: "🤖", title: language === "mn" ? "AI-д суурилсан шинжилгээ" : language === "zh" ? "AI驱动分析" : "AI-powered Analysis", desc: language === "mn" ? "Ухаалаг шинжилгээ, таамаглал" : language === "zh" ? "智能分析与预测" : "Smart insights & predictions" },
                  { icon: "📊", title: language === "mn" ? "Бүх мэдээлэл нэг дор" : language === "zh" ? "一站式数据" : "All-in-one Data", desc: language === "mn" ? "Хувьцаа, индекс, салбар, мэдээ" : language === "zh" ? "股票、指数、行业、新闻" : "Stocks, indices, sectors, news" },
                  { icon: "⚡", title: language === "mn" ? "Шуурхай, үнэн зөв" : language === "zh" ? "实时准确" : "Real-time Accurate", desc: language === "mn" ? "Бодит цаг дахь зах зээлийн мэдээлэл" : language === "zh" ? "实时市场数据" : "Live market data" },
                  { icon: "🏆", title: language === "mn" ? "Топ компаниуд" : language === "zh" ? "优质公司排行" : "Top Companies", desc: language === "mn" ? "ROE, ашигт ажиллагааны дүн шинжилгээ" : language === "zh" ? "ROE及盈利能力分析" : "ROE & profitability analysis" },
                ].map(f => (
                  <div key={f.title} className={`flex items-start gap-4 p-4 rounded-xl border transition-all
                    ${isDarkMode ? "bg-white/3 border-white/5 hover:bg-white/5" : "bg-gray-50 border-gray-100 hover:bg-teal-50/50 hover:border-teal-100"}`}>
                    <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <div className={`text-sm font-semibold mb-0.5 ${textPrimary}`}>{f.title}</div>
                      <div className={`text-xs ${textSecondary}`}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HEATMAP ── */}
      <section className={`py-16 px-6 ${sectionAlt}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-1">Live</p>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Stock Heatmap</h2>
            </div>
            <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors ${isDarkMode ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
              {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "更多" : "More"} ↗
            </a>
          </div>
          <div className={`rounded-2xl overflow-hidden border ${cardBorder}`} style={{ height: 600 }}>
            <div ref={tradingViewRef} className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={`py-24 px-6 ${bg}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-4">
            {language === "mn" ? "Бидний тухай" : language === "zh" ? "关于我们" : "About Us"}
          </p>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${textPrimary}`}>
            {t("home.about.title")}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed mb-10 ${textSecondary}`}>
            {t("home.about.description")}
          </p>
          <Link href="/about/introduction"
            className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all hover:-translate-y-0.5
              ${isDarkMode ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-white text-gray-800 border-gray-200 shadow-sm hover:border-teal-300"}`}>
            {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "了解更多" : "Learn More"} →
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-24 px-6 ${sectionAlt}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 leading-tight ${textPrimary}`}>
            {t("home.cta.title")}
          </h2>
          <p className={`text-lg mb-10 ${textSecondary}`}>
            {t("home.cta.description")}
          </p>
          <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold text-white
              bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5
              shadow-xl shadow-teal-500/20">
            {t("home.cta.button")} ↗
          </a>
        </div>
      </section>

    </div>
  );
}

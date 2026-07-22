// app/page.tsx
"use client";

import { useLanguage } from "./context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "./context/DarkModeContext";
import Link from "next/link";
import Image from "next/image";

const STOCKS = [
  { ticker: "MSH", name: "Монгол шилтгээн ХК", price: "250.00", change: "+14.42%" },
  { ticker: "MGLA", name: "Эм Жи Эл Акуа ХК", price: "260.00", change: "+13.79%" },
  { ticker: "HRL", name: "Хэрлэн Хивс ХК", price: "90.00", change: "+12.49%" },
  { ticker: "KHAN", name: "Хаан банк ХК", price: "1,464.00", change: "+0.21%" },
  { ticker: "MSE", name: "Монголын хөрөнгийн бирж ХК", price: "370.00", change: "+0.22%" },
];

export default function Home() {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const tradingViewRef = useRef<HTMLDivElement>(null);
  const [activeStock, setActiveStock] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStock(p => (p + 1) % STOCKS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const bg = isDarkMode ? "bg-[#0d0f14]" : "bg-gray-50";
  const cardBg = isDarkMode ? "bg-[#151820]" : "bg-white";
  const cardBorder = isDarkMode ? "border-white/6" : "border-gray-200";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bg}`}>

      {/* ── HERO ── */}
      <section className={`relative min-h-screen flex items-center overflow-hidden pt-20 ${isDarkMode ? "bg-[#0a0c10]" : "bg-gray-50"}`}>
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 ${isDarkMode ? "bg-teal-500" : "bg-teal-300"}`} />
          <div className={`absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 ${isDarkMode ? "bg-cyan-400" : "bg-cyan-200"}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — текст */}
            <div>
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border
                ${isDarkMode ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-teal-50 text-teal-700 border-teal-200"}`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3z" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 14l3-3 3 3 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                M Market Intelligence
              </div>

              <h1 className={`text-5xl sm:text-6xl font-bold leading-tight mb-6 ${textPrimary}`}>
                {language === "mn" ? (
                  <>Дэлхийгээс өгөөж<br />
                    <span className="text-teal-400">хүртэх гүүр</span>
                  </>
                ) : language === "zh" ? (
                  <>连接全球<br />
                    <span className="text-teal-400">收益的桥梁</span>
                  </>
                ) : (
                  <>Bridge to Global<br />
                    <span className="text-teal-400">Opportunity</span>
                  </>
                )}
              </h1>

              <p className={`text-base sm:text-lg leading-relaxed mb-10 max-w-lg ${textSecondary}`}>
                {language === "mn"
                  ? "Хувьцаа, индекс, салбарын гүйцэтгэл, санхүүгийн мэдээллийг бодит цаг дээр хянаж, илүү ухаалаг хөрөнгө оруулалтын шийдвэр гаргаарай"
                  : language === "zh"
                  ? "实时跟踪股票、指数、行业表现和财务数据，做出更明智的投资决策"
                  : "Track stocks, indices, sector performance and financial data in real time to make smarter investment decisions"}
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: "🤖", label: language === "mn" ? "AI шинжилгээ" : language === "zh" ? "AI分析" : "AI Analysis" },
                  { icon: "📊", label: language === "mn" ? "Бүх мэдээлэл нэг дор" : language === "zh" ? "一站式数据" : "All-in-one Data" },
                  { icon: "⚡", label: language === "mn" ? "Шуурхай, үнэн зөв" : language === "zh" ? "实时准确" : "Real-time Accurate" },
                ].map(f => (
                  <span key={f.label} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border ${isDarkMode ? "bg-white/4 border-white/8 text-gray-300" : "bg-white border-gray-200 text-gray-600 shadow-sm"}`}>
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white
                    bg-gradient-to-r from-teal-500 to-cyan-500
                    shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40
                    transition-all hover:-translate-y-0.5">
                  {t("home.cta.button")} ↗
                </a>
                <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:-translate-y-0.5
                    ${isDarkMode ? "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10" : "bg-white text-gray-700 border-gray-200 shadow-sm hover:border-teal-300"}`}>
                  📈 {language === "mn" ? "Зах зээлийн мэдээлэл" : language === "zh" ? "市场数据" : "Market Intelligence"}
                </a>
              </div>
            </div>

            {/* Right — Live хувьцааны жагсаалт */}
            <div className={`rounded-2xl border overflow-hidden ${cardBg} ${cardBorder} shadow-xl`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b ${cardBorder}`}>
                <div>
                  <div className={`text-sm font-semibold ${textPrimary}`}>
                    {language === "mn" ? "Өсөлттэй · Идэвхтэй хувьцаанууд" : language === "zh" ? "涨幅榜 · 活跃股票" : "Top Gainers · Active Stocks"}
                  </div>
                  <div className={`text-xs mt-0.5 ${textSecondary}`}>
                    {language === "mn" ? "Өнөөдрийн өсөлт ба их арилжаалагдсан" : language === "zh" ? "今日涨幅和成交量" : "Today's gains and volume"}
                  </div>
                </div>
                <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors px-3 py-1.5 rounded-lg bg-teal-500/10">
                  {language === "mn" ? "Шууд" : language === "zh" ? "实时" : "Live"}
                </a>
              </div>

              {/* Stock list */}
              <div className="divide-y divide-white/4">
                {STOCKS.map((stock, i) => (
                  <div key={stock.ticker}
                    className={`flex items-center justify-between px-5 py-3.5 transition-colors
                      ${activeStock === i
                        ? isDarkMode ? "bg-teal-500/8" : "bg-teal-50"
                        : isDarkMode ? "hover:bg-white/3" : "hover:bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
                        ${isDarkMode ? "bg-white/8 text-teal-400" : "bg-teal-50 text-teal-700"}`}>
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${textPrimary}`}>{stock.ticker}</div>
                        <div className={`text-xs ${textSecondary}`}>{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${textPrimary}`}>{stock.price}</div>
                      <div className="text-xs font-medium text-teal-400">{stock.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className={`px-5 py-3 border-t ${cardBorder}`}>
                <a href="https://mmi.msecurities.mn/stocks" target="_blank" rel="noopener noreferrer"
                  className={`text-xs font-medium flex items-center justify-center gap-1 transition-colors
                    ${isDarkMode ? "text-gray-500 hover:text-teal-400" : "text-gray-400 hover:text-teal-600"}`}>
                  {language === "mn" ? "Бүх хувьцаа харах" : language === "zh" ? "查看全部股票" : "View all stocks"} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRIC CARDS ── */}
      <section className={`py-8 px-6 border-y ${isDarkMode ? "bg-[#0d0f14] border-white/5" : "bg-white border-gray-100"}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: language === "mn" ? "Арилжаалагдсан хувьцаа" : language === "zh" ? "交易股票数" : "Traded Stocks", value: "187", icon: "📈", href: "https://mmi.msecurities.mn/stocks" },
            { label: language === "mn" ? "Нийт арилжааны үнийн дүн" : language === "zh" ? "总交易额" : "Total Trade Value", value: "368M", icon: "💰", href: "https://mmi.msecurities.mn" },
            { label: language === "mn" ? "Нийт арилжааны хэмжээ" : language === "zh" ? "总交易量" : "Total Volume", value: "738.1K", icon: "📊", href: "https://mmi.msecurities.mn" },
            { label: language === "mn" ? "Зах зээлийн дундаж өгөөж" : language === "zh" ? "市场平均收益" : "Market Avg Return", value: "+0.26%", icon: "📉", href: "https://mmi.msecurities.mn/indices" },
          ].map(m => (
            <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer"
              className={`rounded-2xl border p-5 transition-all hover:-translate-y-0.5 cursor-pointer
                ${cardBg} ${cardBorder} hover:border-teal-500/30`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs ${textSecondary}`}>{m.label}</span>
                <span className="text-lg">{m.icon}</span>
              </div>
              <div className={`text-2xl font-bold ${m.value.startsWith("+") ? "text-teal-400" : textPrimary}`}>{m.value}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={`py-20 px-6 ${isDarkMode ? "bg-[#0a0c10]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === "mn" ? "Үйлчилгээ" : language === "zh" ? "服务" : "Services"}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
              {language === "mn" ? "Мэргэжлийн брокер,\nдилерийн үйлчилгээ"
                : language === "zh" ? "专业经纪\n交易商服务"
                : "Professional Broker &\nDealer Services"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { badge: language === "mn" ? "Брокер" : language === "zh" ? "经纪" : "Broker", icon: "📈", href: "/services/broker", title: t("navbar.sections.broker"), desc: language === "mn" ? "МХБ-д бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа хийх боломжтой." : language === "zh" ? "在蒙古证券交易所买卖股票、债券及其他证券。" : "Buy and sell stocks, bonds, and other securities listed on the Mongolian Stock Exchange." },
              { badge: language === "mn" ? "Андеррайтер" : language === "zh" ? "承销" : "Underwriter", icon: "🏛️", href: "/services/underwriter", title: t("navbar.sections.underwriter"), desc: language === "mn" ? "Дотоодын компаниудад хөрөнгө босгоход андеррайтерийн мэргэжлийн үйлчилгээ." : language === "zh" ? "为国内企业提供专业承销服务，协助融资。" : "Professional underwriting services to help domestic companies raise capital." },
              { badge: language === "mn" ? "Зөвлөх" : language === "zh" ? "顾问" : "Advisory", icon: "💼", href: "/services/investment-advisor", title: t("navbar.sections.investmentAdvisor"), desc: language === "mn" ? "Таны хөрөнгө оруулалтын зорилгод нийцсэн мэргэжлийн зөвлөгөө, багцын удирдлага." : language === "zh" ? "根据您的投资目标提供专业建议和投资组合管理。" : "Expert investment advice and portfolio management tailored to your goals." },
              { badge: language === "mn" ? "Уул уурхай" : language === "zh" ? "矿业" : "Mining", icon: "⛏️", href: "/services/mining-broker", title: t("navbar.sections.miningBroker"), desc: language === "mn" ? "Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний цахим арилжаа." : language === "zh" ? "通过蒙古证券交易所进行矿产品在线交易。" : "Electronic trading of mining products through the Mongolian Stock Exchange." },
            ].map(s => (
              <Link key={s.href} href={s.href}
                className={`rounded-2xl border p-6 block group transition-all hover:-translate-y-1
                  ${cardBg} ${cardBorder} hover:border-teal-500/30
                  ${isDarkMode ? "hover:bg-white/3 hover:shadow-teal-500/10" : "hover:shadow-md"}`}>
                <div className={`inline-flex text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md mb-5
                  ${isDarkMode ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-teal-50 text-teal-700 border border-teal-100"}`}>
                  {s.badge}
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4
                  ${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}>
                  {s.icon}
                </div>
                <h3 className={`font-semibold mb-2.5 ${textPrimary}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${textSecondary}`}>{s.desc}</p>
                <span className={`text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all
                  ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
                  {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "了解更多" : "Learn more"} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HEATMAP ── */}
      <section className={`py-16 px-6 ${isDarkMode ? "bg-[#0d0f14]" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-1">Live</p>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Stock Heatmap</h2>
            </div>
            <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
              className={`text-sm font-medium flex items-center gap-1 transition-colors
                ${isDarkMode ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"}`}>
              {language === "mn" ? "Дэлгэрэнгүй" : language === "zh" ? "更多" : "More"} ↗
            </a>
          </div>
          <div className={`rounded-2xl overflow-hidden border ${cardBorder}`} style={{ height: 600 }}>
            <div ref={tradingViewRef} className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={`py-20 px-6 ${isDarkMode ? "bg-[#0a0c10]" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
            {language === "mn" ? "Бидний тухай" : language === "zh" ? "关于我们" : "About Us"}
          </p>
          <h2 className={`text-3xl font-bold mb-6 ${textPrimary}`}>{t("home.about.title")}</h2>
          <p className={`text-base leading-relaxed max-w-2xl mx-auto mb-10 ${textSecondary}`}>
            {t("home.about.description")}
          </p>
          <Link href="/about/introduction"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:-translate-y-0.5
              ${isDarkMode ? "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10" : "bg-white text-gray-700 border-gray-200 shadow-sm"}`}>
            {language === "mn" ? "Дэлгэрэнгүй уншах" : language === "zh" ? "了解更多" : "Read More"} →
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

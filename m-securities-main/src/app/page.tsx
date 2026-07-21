// app/page.tsx

"use client";
import Image from "next/image";
import Carousel from "./components/carousel";
import { useLanguage } from "./context/LanguageContext";
import { useEffect, useRef } from "react";
import { useDarkMode } from "./context/DarkModeContext";

export default function Home() {
  const { t, language } = useLanguage();

  const carouselImages = [
    {
      url: "/images/slide1.jpg",
      alt: "Investment Portfolio",
    },
    {
      url: "/images/slide2.jpg",
      alt: "Trading Platform",
    },
    {
      url: "/images/slide3.jpg",
      alt: "Market Analysis",
    },
  ];

  // Ref for TradingView widget container
  const tradingViewRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!tradingViewRef.current) return;
    tradingViewRef.current.innerHTML = "";
    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetContainer.appendChild(widgetDiv);
    const copyrightDiv = document.createElement("div");
    copyrightDiv.className = "tradingview-widget-copyright";
    copyrightDiv.innerHTML = `<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>`;
    widgetContainer.appendChild(copyrightDiv);
    tradingViewRef.current.appendChild(widgetContainer);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    // Automatic locale switching
    const locale = language === "mn" ? "mn" : "en";
    script.innerHTML = `{
      "dataSource": "SPX500",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "grouping": "sector",
      "locale": "${locale}",
      "symbolUrl": "",
      "colorTheme": "${isDarkMode ? "dark" : "light"}",
      "exchanges": [],
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "isMonoSize": false,
      "width": "100%",
      "height": "600"
    }`;
    widgetContainer.appendChild(script);
  }, [isDarkMode, language]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen">
        <Carousel images={carouselImages} autoPlayInterval={6000} />
      </section>

      {/* Stock Heatmap Section */}
      <section
        className={`py-8 px-4 flex flex-col items-center transition-colors duration-200 ${
          isDarkMode ? "bg-[#26282c]" : "bg-gray-50"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-4 text-center ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Stock Heatmap
        </h2>
        <p
          className={`text-lg mb-6 text-center max-w-2xl ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          This widget shows off a macro view on global stocks. Perfect for
          segmenting by sector, country or market cap.
        </p>
        <div
          className={`w-full max-w-6xl rounded-xl shadow-lg ${
            isDarkMode ? "" : "border"
          }`}
          style={{
            height: "600px",
            background: isDarkMode ? "#26282c" : "#fff",
            borderColor: isDarkMode ? undefined : "#e5e7eb",
            transition: "background 0.3s",
          }}
        >
          {/* TradingView Widget BEGIN */}
          <div ref={tradingViewRef}></div>
          {/* TradingView Widget END */}
        </div>
      </section>

      {/* About Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white dark:bg-[#26282c] transition-colors duration-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
            {t("home.about.title")}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 max-w-3xl mx-auto">
            {t("home.about.description")}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-gray-50 dark:bg-[#1e2023] transition-colors duration-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-12 text-gray-800 dark:text-gray-100">
            {t("home.services.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Trading Card */}
            <div
              className="bg-white dark:bg-[#26282c] p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700
                          transition-all duration-200 hover:shadow-lg"
            >
              <Image
                src="/icons/trading.svg"
                alt="Trading"
                width={48}
                height={48}
                className="mx-auto mb-4 dark:invert"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {t("home.services.trading.title")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t("home.services.trading.description")}
              </p>
            </div>

            {/* Portfolio Management Card */}
            <div
              className="bg-white dark:bg-[#26282c] p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700
                          transition-all duration-200 hover:shadow-lg"
            >
              <Image
                src="/icons/portfolio.svg"
                alt="Portfolio Management"
                width={48}
                height={48}
                className="mx-auto mb-4 dark:invert"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {t("home.services.portfolioManagement.title")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t("home.services.portfolioManagement.description")}
              </p>
            </div>

            {/* Risk Management Card */}
            <div
              className="bg-white dark:bg-[#26282c] p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700
                          transition-all duration-200 hover:shadow-lg"
            >
              <Image
                src="/icons/risk.svg"
                alt="Risk Management"
                width={48}
                height={48}
                className="mx-auto mb-4 dark:invert"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {t("home.services.riskManagement.title")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t("home.services.riskManagement.description")}
              </p>
            </div>

            {/* Market Analysis Card */}
            <div
              className="bg-white dark:bg-[#26282c] p-4 sm:p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700
                          transition-all duration-200 hover:shadow-lg"
            >
              <Image
                src="/icons/analysis.svg"
                alt="Market Analysis"
                width={48}
                height={48}
                className="mx-auto mb-4 dark:invert"
              />
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {t("home.services.marketAnalysis.title")}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {t("home.services.marketAnalysis.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-teal-500 dark:bg-teal-600 text-white text-center transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
            {t("home.cta.title")}
          </h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 text-white/90">
            {t("home.cta.description")}
          </p>
          <a
            href="https://trader.msecurities.mn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-teal-500 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-md font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl"
          >
            {t("home.cta.button")}
          </a>
        </div>
      </section>
    </div>
  );
}

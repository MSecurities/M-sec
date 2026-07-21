"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../context/DarkModeContext";
import { translations } from "../translations";

type IconProps = React.SVGProps<SVGSVGElement>;

const Footer = () => {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetElement: HTMLDivElement | null = null;

    const loadTradingViewWidget = () => {
      try {
        widgetElement = widgetRef.current;
        if (!widgetElement) return;

        // Clear previous content
        widgetElement.innerHTML = "";

        // Create widget container
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        widgetElement.appendChild(widgetContainer);

        // Create script element
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

        // Configure widget
        const config = {
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
          backgroundColor: isDarkMode ? "#26282c" : "#ffffff",
        };

        script.innerHTML = JSON.stringify(config);
        widgetElement.appendChild(script);
      } catch (error) {
        console.error("Error loading TradingView widget:", error);
      }
    };

    const timer = setTimeout(loadTradingViewWidget, 100);

    return () => {
      clearTimeout(timer);
      if (widgetElement) {
        widgetElement.innerHTML = "";
      }
    };
  }, [isDarkMode]);

  const socialLinks = [
    {
      name: "facebook",
      href: "https://www.facebook.com/msecurities.mn",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/company/105883976",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "instagram",
      href: "https://www.instagram.com/msecurities.mn",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <footer className="bg-white dark:bg-[#26282c] shadow-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {/* Logo and Tagline */}
            <div className="flex flex-col space-y-4">
              <Link href="/" className="flex">
                <Image
                  src={isDarkMode ? "/logo-dark.png" : "/logo.png"}
                  alt="Logo"
                  width={180}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("footer.tagline")}
              </p>
              <div className="flex space-x-4 pt-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-base font-medium text-gray-800 dark:text-gray-100">
                {t("footer.quickLinks")}
              </h4>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/about/introduction"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  {t("navbar.sections.introduction")}
                </Link>
                <Link
                  href="/research/news"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  {t("navbar.sections.news")}
                </Link>
                <Link
                  href="/services/broker"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  {t("navbar.sections.broker")}
                </Link>
                <Link
                  href="/faq/common-questions"
                  className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
                >
                  {t("navbar.sections.commonQuestions")}
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-base font-medium text-gray-800 dark:text-gray-100">
                {t("footer.contactUs.title")}
              </h4>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-3">
                  <Link
                    href="mailto:info@msecurities.mn"
                    className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors block"
                  >
                    info@msecurities.mn
                  </Link>
                  {(
                    translations[language].footer.contactUs.phone
                      .numbers as string[]
                  ).map((number) => (
                    <Link
                      key={number}
                      href={`tel:${number}`}
                      className="text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 transition-colors block before:content-['+'] before:mr-1"
                    >
                      976-{number}
                    </Link>
                  ))}
                </div>

                <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                  {language === "en" ? (
                    <>
                      <p>New Horizons Office 401,</p>
                      <p>1st Khoroo, Sukhbaatar District,</p>
                      <p>Ulaanbaatar 14120,</p>
                      <p>Mongolia</p>
                    </>
                  ) : (
                    <>
                      <p>Нью Хориязонс Оффис 401,</p>
                      <p>1-р хороо, Сүхбаатар дүүрэг,</p>
                      <p>Улаанбаатар 14120,</p>
                      <p>Монгол Улс</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile App */}
            <div className="flex flex-col space-y-4">
              <h4 className="text-base font-medium text-gray-800 dark:text-gray-100">
                {t("footer.mobileApp.title")}
              </h4>
              <div className="flex flex-col space-y-4">
                <a
                  href="https://apps.apple.com/mn/app/m-securities-mn/id6745858855"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <div className="w-8 h-8">
                    <Image
                      src="/apple-logo.svg"
                      alt="Apple Logo"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                  </div>
                  <span>App Store</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.istock.msec&hl=en&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400"
                >
                  <div className="w-8 h-8">
                    <Image
                      src="/google-play-2022.svg.png"
                      alt="Get it on Google Play"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span>Play Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} M Securities.{" "}
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>

      {/* TradingView Widget - Fixed at bottom */}
      <div
        ref={widgetRef}
        className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#26282c] transition-colors duration-200 z-50"
      ></div>
    </>
  );
};

export default Footer;

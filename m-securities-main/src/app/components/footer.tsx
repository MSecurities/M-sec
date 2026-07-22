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
  }, [isDarkMode]);

  const socialLinks = [
    {
      name: "facebook",
      href: "https://www.facebook.com/msecurities.mn",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "linkedin",
      href: "https://www.linkedin.com/company/105883976",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: "instagram",
      href: "https://www.instagram.com/msecurities.mn",
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <footer className={`transition-colors duration-300 ${isDarkMode ? 'bg-[#0d0f14]' : 'bg-gray-50'} border-t ${isDarkMode ? 'border-white/6' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Logo & tagline */}
            <div className="space-y-5">
              <Link href="/">
                <Image
                  src={isDarkMode ? "/logo-dark.png" : "/logo.png"}
                  alt="M Securities"
                  width={160}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("footer.tagline")}
              </p>
              <div className="flex gap-3 pt-1">
                {socialLinks.map((item) => (
                  <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                      ${isDarkMode
                        ? 'bg-white/5 text-gray-400 hover:bg-teal-500/20 hover:text-teal-400 border border-white/8'
                        : 'bg-white text-gray-500 hover:bg-teal-50 hover:text-teal-500 border border-gray-200 shadow-sm'}`}>
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("footer.quickLinks")}
              </h4>
              <div className="space-y-2.5">
                {[
                  { href: "/about/introduction", label: t("navbar.sections.introduction") },
                  { href: "/research/news", label: t("navbar.sections.news") },
                  { href: "/services/broker", label: t("navbar.sections.broker") },
                  { href: "/faq/common-questions", label: t("navbar.sections.commonQuestions") },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    className={`block text-sm transition-colors duration-200
                      ${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-500 hover:text-teal-600'}`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("footer.contactUs.title")}
              </h4>
              <div className="space-y-2.5">
                <Link href="mailto:info@msecurities.mn"
                  className={`block text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-500 hover:text-teal-600'}`}>
                  info@msecurities.mn
                </Link>
                {(translations[language].footer.contactUs.phone.numbers as string[]).map((n) => (
                  <Link key={n} href={`tel:${n}`}
                    className={`block text-sm transition-colors ${isDarkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-500 hover:text-teal-600'}`}>
                    +976-{n}
                  </Link>
                ))}
                <p className={`text-sm pt-1 leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {language === "en" ? "New Horizons Office 401, 1st Khoroo, Sukhbaatar District, Ulaanbaatar 14120" : "Нью Хориязонс Оффис 401, 1-р хороо, Сүхбаатар дүүрэг, Улаанбаатар 14120"}
                </p>
              </div>
            </div>

            {/* Mobile app */}
            <div className="space-y-4">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t("footer.mobileApp.title")}
              </h4>
              <div className="space-y-3">
                <a href="https://apps.apple.com/mn/app/m-securities-mn/id6745858855"
                  target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                    ${isDarkMode
                      ? 'bg-white/4 border-white/8 text-gray-300 hover:border-teal-500/40 hover:text-teal-400'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600 shadow-sm'}`}>
                  <Image src="/apple-logo.svg" alt="App Store" width={20} height={20} className="w-5 h-5" />
                  <div>
                    <div className="text-xs opacity-70">Download on the</div>
                    <div className="text-sm font-medium">App Store</div>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.istock.msec&hl=en&pli=1"
                  target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                    ${isDarkMode
                      ? 'bg-white/4 border-white/8 text-gray-300 hover:border-teal-500/40 hover:text-teal-400'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-600 shadow-sm'}`}>
                  <Image src="/google-play-2022.svg.png" alt="Google Play" width={20} height={20} className="w-5 h-5 object-contain" />
                  <div>
                    <div className="text-xs opacity-70">Get it on</div>
                    <div className="text-sm font-medium">Play Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4
            ${isDarkMode ? 'border-white/6' : 'border-gray-200'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              © {new Date().getFullYear()} M Securities. {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                СЗХ лицензтэй
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                МХБ гишүүн
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* TradingView ticker */}
      <div ref={widgetRef}
        className={`fixed bottom-0 left-0 w-full z-50 transition-colors duration-300
          ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-white'} border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
      </div>
    </>
  );
};

export default Footer;

'use client';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import Image from 'next/image';
import Link from 'next/link';

const ForeignTradingPage = () => {
  const { language } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const bg = isDarkMode ? 'bg-[#080a0d]' : 'bg-gradient-to-b from-teal-50/60 via-white to-teal-50/30';
  const cardBg = isDarkMode ? 'bg-[#111318]' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-white/6' : 'border-gray-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const sectionAlt = isDarkMode ? 'bg-[#0d0f14]' : 'bg-white';
  const iconBg = isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50';

  const features = [
    {
      icon: (
        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: language === 'mn' ? 'Дэлхийн тэргүүлэх биржүүд' : language === 'zh' ? '全球领先交易所' : 'Global Leading Exchanges',
      desc: language === 'mn' ? 'NYSE, NASDAQ, LSE болон бусад дэлхийн тэргүүлэх хөрөнгийн биржүүд дээр хөрөнгө оруулах боломж.' : language === 'zh' ? '可在NYSE、纳斯达克、伦交所等全球主要交易所投资。' : 'Access NYSE, NASDAQ, LSE and other leading global stock exchanges.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: language === 'mn' ? 'Хувьцаа, бонд, ETF' : language === 'zh' ? '股票、债券、ETF' : 'Stocks, Bonds, ETFs',
      desc: language === 'mn' ? 'Олон улсын хувьцаа, бонд, ETF болон бусад санхүүгийн хэрэглүүрт хөрөнгө оруулах боломж.' : language === 'zh' ? '可投资国际股票、债券、ETF及其他金融工具。' : 'Invest in international stocks, bonds, ETFs and other financial instruments.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      ),
      title: language === 'mn' ? 'Аппликейшнаар арилжаа' : language === 'zh' ? '手机APP交易' : 'Mobile App Trading',
      desc: language === 'mn' ? 'М Секьюритисийн аппликейшнаар хаанаас ч гадаад зах зээлд хялбараар нэвтрэх боломж.' : language === 'zh' ? '通过M Securities应用随时随地轻松进入国际市场。' : 'Access foreign markets easily from anywhere via the M Securities app.',
    },
    {
      icon: (
        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: language === 'mn' ? 'Найдвартай, аюулгүй' : language === 'zh' ? '安全可靠' : 'Safe & Secure',
      desc: language === 'mn' ? 'СЗХ-ны хяналт дор мэргэжлийн брокерийн үйлчилгээ.' : language === 'zh' ? '在金融监管委员会监管下提供专业经纪服务。' : 'Professional brokerage service under FRC supervision.',
    },
  ];

  const markets = [
    { name: 'NYSE', desc: language === 'mn' ? 'Нью Йоркийн хөрөнгийн бирж' : language === 'zh' ? '纽约证券交易所' : 'New York Stock Exchange' },
    { name: 'NASDAQ', desc: language === 'mn' ? 'Технологийн тэргүүлэх бирж' : language === 'zh' ? '科技领先交易所' : 'Technology leading exchange' },
    { name: 'LSE', desc: language === 'mn' ? 'Лондонгийн хөрөнгийн бирж' : language === 'zh' ? '伦敦证券交易所' : 'London Stock Exchange' },
    { name: 'TSE', desc: language === 'mn' ? 'Токиогийн хөрөнгийн бирж' : language === 'zh' ? '东京证券交易所' : 'Tokyo Stock Exchange' },
    { name: 'HKEX', desc: language === 'mn' ? 'Хонконгийн хөрөнгийн бирж' : language === 'zh' ? '香港交易所' : 'Hong Kong Stock Exchange' },
    { name: 'SSE', desc: language === 'mn' ? 'Шанхайн хөрөнгийн бирж' : language === 'zh' ? '上海证券交易所' : 'Shanghai Stock Exchange' },
  ];

  const steps = [
    { num: '01', title: language === 'mn' ? 'Данс нээх' : language === 'zh' ? '开立账户' : 'Open Account', desc: language === 'mn' ? 'М Секьюритисийн аппликейшн татаж аваад данс нээнэ.' : language === 'zh' ? '下载M Securities应用并开立账户。' : 'Download the M Securities app and open an account.' },
    { num: '02', title: language === 'mn' ? 'Мөнгө байршуулах' : language === 'zh' ? '存入资金' : 'Fund Account', desc: language === 'mn' ? 'Дансандаа мөнгө байршуулж гадаад арилжааны эрх нээнэ.' : language === 'zh' ? '向账户存入资金并开通境外交易权限。' : 'Deposit funds and activate foreign trading access.' },
    { num: '03', title: language === 'mn' ? 'Хөрөнгө оруулах' : language === 'zh' ? '开始投资' : 'Start Investing', desc: language === 'mn' ? 'Дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулж эхэлнэ.' : language === 'zh' ? '开始在全球资本市场投资。' : 'Start investing in global capital markets.' },
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${bg}`}>

      {/* ── BANNER ── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: '2/1', maxHeight: '560px' }}>
          <Image
            src="/foreign-trading-banner.png"
            alt={language === 'mn' ? 'Гадаад арилжаа нэвтэрлээ' : language === 'zh' ? '境外交易上线' : 'Foreign Trading Launched'}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-14">
            <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all">
              {language === 'mn' ? 'Одоо эхлэх' : language === 'zh' ? '立即开始' : 'Get Started'} →
            </a>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className={`py-20 px-6 ${sectionAlt}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border
            ${isDarkMode ? 'bg-white/4 border-white/10 text-gray-300' : 'bg-white/80 border-teal-200 text-teal-700 shadow-sm'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            {language === 'mn' ? 'Гадаад арилжаа · шинэ үйлчилгээ' : language === 'zh' ? '境外交易 · 全新服务' : 'Foreign Trading · New Service'}
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold leading-tight mb-6 ${textPrimary}`}>
            {language === 'mn' ? (<>Дэлхийн хөрөнгийн<br /><span className="text-teal-400">зах зээлд нэвтрэ</span></>) :
             language === 'zh' ? (<>进入全球<br /><span className="text-teal-400">资本市场</span></>) :
             (<>Enter Global<br /><span className="text-teal-400">Capital Markets</span></>)}
          </h1>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto mb-10 ${textSecondary}`}>
            {language === 'mn' ? 'М Секьюритис ҮЦК нь одоо гадаад хөрөнгийн зах зээлд нэвтрэх боломжийг танд олгож байна. NYSE, NASDAQ болон дэлхийн тэргүүлэх биржүүд дээр хөрөнгө оруулаарай.'
              : language === 'zh' ? 'M Securities 现在为您提供进入境外证券市场的机会。在纽交所、纳斯达克及全球主要交易所进行投资。'
              : "M Securities now gives you access to foreign capital markets. Invest on NYSE, NASDAQ and the world's leading exchanges."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white
                bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
              {language === 'mn' ? 'Арилжаа эхлэх' : language === 'zh' ? '开始交易' : 'Start Trading'} →
            </a>
            <a href="https://apps.apple.com/mn/app/m-securities-mn/id6745858855" target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border transition-all hover:-translate-y-0.5
                ${isDarkMode ? 'bg-white/6 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-800 border-gray-200 shadow-sm hover:border-teal-300'}`}>
              <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
              {language === 'mn' ? 'Апп татах' : language === 'zh' ? '下载应用' : 'Download App'}
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Давуу тал' : language === 'zh' ? '优势' : 'Advantages'}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
              {language === 'mn' ? 'Яагаад гадаад арилжаа?' : language === 'zh' ? '为什么选择境外交易？' : 'Why Foreign Trading?'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className={`rounded-2xl border p-6 transition-all hover:-translate-y-1
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-md'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                  {f.icon}
                </div>
                <h3 className={`font-semibold mb-2 ${textPrimary}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${textSecondary}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARKETS ── */}
      <section className={`py-20 px-6 ${sectionAlt}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Зах зээлүүд' : language === 'zh' ? '市场' : 'Markets'}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
              {language === 'mn' ? 'Дэлхийн тэргүүлэх биржүүд' : language === 'zh' ? '全球领先交易所' : "World's Leading Exchanges"}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {markets.map(m => (
              <div key={m.name} className={`rounded-2xl border p-6 flex items-center gap-4 transition-all hover:-translate-y-0.5
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-teal-500 ${iconBg}`}>
                  {m.name.slice(0, 2)}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${textPrimary}`}>{m.name}</div>
                  <div className={`text-xs mt-0.5 ${textSecondary}`}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className={`py-20 px-6 ${bg}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">
              {language === 'mn' ? 'Эхлэх алхмууд' : language === 'zh' ? '开始步骤' : 'How to Start'}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-bold ${textPrimary}`}>
              {language === 'mn' ? '3 алхамаар эхэлнэ' : language === 'zh' ? '3步开始' : 'Start in 3 Steps'}
            </h2>
          </div>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.num} className={`flex items-start gap-6 p-6 rounded-2xl border transition-all
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-sm'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg text-teal-400 ${iconBg}`}>
                  {s.num}
                </div>
                <div className="pt-1">
                  <h3 className={`font-semibold text-lg mb-1.5 ${textPrimary}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold text-white
                bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20">
              {language === 'mn' ? 'Одоо эхлэх' : language === 'zh' ? '立即开始' : 'Start Now'} →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-24 px-6 ${sectionAlt}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 leading-tight ${textPrimary}`}>
            {language === 'mn' ? (<>Дэлхийгээс өгөөж<br /><span className="text-teal-400">хүртэх гүүр</span></>) :
             language === 'zh' ? (<>连接全球<br /><span className="text-teal-400">收益的桥梁</span></>) :
             (<>Bridge to Global<br /><span className="text-teal-400">Opportunity</span></>)}
          </h2>
          <p className={`text-lg mb-10 ${textSecondary}`}>
            {language === 'mn' ? 'М Секьюритис ҮЦК-тай хамтран дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулаарай.'
              : language === 'zh' ? '与M Securities合作，在全球资本市场投资。'
              : 'Invest in global capital markets with M Securities.'}
          </p>
          <a href="https://trader.msecurities.mn/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base font-semibold text-white
              bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/20">
            {language === 'mn' ? 'Арилжаа эхлэх' : language === 'zh' ? '开始交易' : 'Start Trading'} →
          </a>
        </div>
      </section>

    </div>
  );
};

export default ForeignTradingPage;

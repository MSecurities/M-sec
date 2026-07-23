'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { useDarkMode } from '../../context/DarkModeContext';
import {
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function ForeignTradingPage() {
  const { language } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const bg = isDarkMode ? 'bg-[#080a0d]' : 'bg-gradient-to-b from-teal-50/60 via-white to-teal-50/30';
  const cardBg = isDarkMode ? 'bg-[#111318]' : 'bg-white';
  const cardBorder = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const sectionAlt = isDarkMode ? 'bg-[#0d0f14]' : 'bg-white';
  const iconBg = isDarkMode ? 'bg-teal-500/10' : 'bg-teal-50';

  const features = [
    {
      Icon: GlobeAltIcon,
      title: language === 'mn' ? 'Дэлхийн тэргүүлэх биржүүд' : language === 'zh' ? '全球领先交易所' : 'Global Leading Exchanges',
      desc: language === 'mn' ? 'NYSE, NASDAQ, LSE болон бусад дэлхийн тэргүүлэх хөрөнгийн биржүүд дээр хөрөнгө оруулах боломж.' : language === 'zh' ? '可在NYSE、纳斯达克、伦交所等全球主要交易所投资。' : 'Access NYSE, NASDAQ, LSE and other leading global stock exchanges.'
    },
    {
      Icon: ChartBarIcon,
      title: language === 'mn' ? 'Хувьцаа, бонд, ETF' : language === 'zh' ? '股票、债券、ETF' : 'Stocks, Bonds, ETFs',
      desc: language === 'mn' ? 'Олон улсын хувьцаа, бонд, ETF болон бусад санхүүгийн хэрэглүүрт хөрөнгө оруулах боломж.' : language === 'zh' ? '可投资国际股票、债券、ETF及其他金融工具。' : 'Invest in international stocks, bonds, ETFs and other financial instruments.'
    },
    {
      Icon: DevicePhoneMobileIcon,
      title: language === 'mn' ? 'Аппликейшнаар арилжаа' : language === 'zh' ? '手机APP交易' : 'Mobile App Trading',
      desc: language === 'mn' ? 'М Секьюритисийн аппликейшнаар хаанаас ч гадаад зах зээлд хялбараар нэвтрэх боломж.' : language === 'zh' ? '通过M Securities应用随时随地轻松进入国际市场。' : 'Access foreign markets easily from anywhere via the M Securities app.'
    },
    {
      Icon: ShieldCheckIcon,
      title: language === 'mn' ? 'Найдвартай, аюулгүй' : language === 'zh' ? '安全可靠' : 'Safe & Secure',
      desc: language === 'mn' ? 'СЗХ-ны хяналт дор мэргэжлийн брокерийн үйлчилгээ.' : language === 'zh' ? '在金融监管委员会监管下提供专业经纪服务。' : 'Professional brokerage service under FRC supervision.'
    },
  ];

  const steps = [
    { num: '01', title: language === 'mn' ? 'Данс нээх' : language === 'zh' ? '开立账户' : 'Open Account', desc: language === 'mn' ? 'М Секьюритисийн аппликейшн татаж аваад данс нээнэ.' : language === 'zh' ? '下载M Securities应用并开立账户。' : 'Download the M Securities app and open an account.' },
    { num: '02', title: language === 'mn' ? 'Мөнгө байршуулах' : language === 'zh' ? '存入资金' : 'Fund Account', desc: language === 'mn' ? 'Дансандаа мөнгө байршуулж гадаад арилжааны эрх нээнэ.' : language === 'zh' ? '向账户存入资金并开通境外交易权限。' : 'Deposit funds and activate foreign trading access.' },
    { num: '03', title: language === 'mn' ? 'Хөрөнгө оруулах' : language === 'zh' ? '开始投资' : 'Start Investing', desc: language === 'mn' ? 'Дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулж эхэлнэ.' : language === 'zh' ? '开始在全球资本市场投资。' : 'Start investing in global capital markets.' },
  ];

  const markets = [
    { name: 'NYSE', desc: language === 'mn' ? 'Нью Йоркийн хөрөнгийн бирж' : language === 'zh' ? '纽约证券交易所' : 'New York Stock Exchange' },
    { name: 'NASDAQ', desc: language === 'mn' ? 'Технологийн тэргүүлэх бирж' : language === 'zh' ? '科技领先交易所' : 'Technology leading exchange' },
    { name: 'LSE', desc: language === 'mn' ? 'Лондонгийн хөрөнгийн бирж' : language === 'zh' ? '伦敦证券交易所' : 'London Stock Exchange' },
    { name: 'TSE', desc: language === 'mn' ? 'Токиогийн хөрөнгийн бирж' : language === 'zh' ? '东京证券交易所' : 'Tokyo Stock Exchange' },
    { name: 'HKEX', desc: language === 'mn' ? 'Хонконгийн хөрөнгийн бирж' : language === 'zh' ? '香港交易所' : 'Hong Kong Stock Exchange' },
    { name: 'SSE', desc: language === 'mn' ? 'Шанхайн хөрөнгийн бирж' : language === 'zh' ? '上海证券交易所' : 'Shanghai Stock Exchange' },
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${bg}`}>
      {/* ── BANNER ── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ aspectRatio: '1500/750', maxHeight: '560px' }}>
          <Image
            src="/images/foreign-trading-banner.png"
            alt={language === 'mn' ? 'Гадаад арилжаа нэвтэрлээ' : language === 'zh' ? '境外交易上线' : 'Foreign Trading Launched'}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12">
            <a
              href="https://trader.msecurities.mn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white border border-white/40 hover:bg-white/10 backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              {language === 'mn' ? 'Одоо эхлэх' : language === 'zh' ? '立即开始' : 'Get Started'} →
            </a>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className={`py-20 px-6 ${sectionAlt}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 border
            ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white/80 border-teal-200 text-teal-700 shadow-sm'}`}>
            <GlobeAltIcon className="w-3.5 h-3.5" />
            {language === 'mn' ? 'Гадаад арилжаа · шинэ үйлчилгээ' : language === 'zh' ? '境外交易 · 全新服务' : 'Foreign Trading · New Service'}
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold leading-tight mb-6 ${textPrimary}`}>
            {language === 'mn' ? (<>Дэлхийн хөрөнгийн<br /><span className="text-teal-400">зах зээлд нэвтрэ</span></>) :
             language === 'zh' ? (<>进入全球<br /><span className="text-teal-400">资本市场</span></>) :
             (<>Enter Global<br /><span className="text-teal-400">Capital Markets</span></>)}
          </h1>
          <p className={`text-lg leading-relaxed max-w-2xl mx-auto mb-10 ${textSecondary}`}>
            {language === 'mn'
              ? 'М Секьюритис ҮЦК нь одоо гадаад хөрөнгийн зах зээлд нэвтрэх боломжийг танд олгож байна. NYSE, NASDAQ болон дэлхийн тэргүүлэх биржүүд дээр хөрөнгө оруулаарай.'
              : language === 'zh'
              ? 'M Securities 现在为您提供进入境外证券市场的机会。在纽交所、纳斯达克及全球主要交易所进行投资。'
              : 'M Securities now gives you access to foreign capital markets. Invest on NYSE, NASDAQ and the world\'s leading exchanges.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://trader.msecurities.mn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20"
            >
              {language === 'mn' ? 'Арилжаа эхлэх' : language === 'zh' ? '开始交易' : 'Start Trading'}
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </a>
            <a
              href="https://apps.apple.com/mn/app/m-securities-mn/id6745858855"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border transition-all hover:-translate-y-0.5
                ${isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-800 border-gray-200 shadow-sm hover:border-teal-300'}`}
            >
              <DevicePhoneMobileIcon className="w-4 h-4 text-teal-500" />
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
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl border p-6 transition-all hover:-translate-y-1
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-md'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                  <f.Icon className="w-5 h-5 text-teal-500" />
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
              {language === 'mn' ? 'Дэлхийн тэргүүлэх биржүүд' : language === 'zh' ? '全球领先交易所' : 'World\'s Leading Exchanges'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {markets.map((m) => (
              <div key={m.name} className={`rounded-2xl border p-6 flex items-center gap-4 transition-all hover:-translate-y-0.5
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm text-teal-500 ${iconBg}`}>
                  {m.name}
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
            {steps.map((s, i) => (
              <div key={s.num} className={`flex items-start gap-6 p-6 rounded-2xl border transition-all
                ${cardBg} ${cardBorder} ${isDarkMode ? 'hover:border-teal-500/20' : 'hover:border-teal-200 hover:shadow-sm'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-lg text-teal-400 ${iconBg}`}>
                  {s.num}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className={`font-semibold text-lg mb-1.5 ${textPrimary}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ArrowRightIcon className={`w-5 h-5 flex-shrink-0 mt-4 ${textSecondary} hidden sm:block`} />
                )}
                {i === steps.length - 1 && (
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-4 text-teal-400 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://trader.msecurities.mn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-lg shadow-teal-500/20"
            >
              {language === 'mn' ? 'Одоо эхлэх' : language === 'zh' ? '立即开始' : 'Start Now'}
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`py-24 px-6 ${sectionAlt}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-6 leading-tight whitespace-pre-line ${textPrimary}`}>
            {language === 'mn' ? 'Дэлхийгээс өгөөж\nхүртэх гүүр' : language === 'zh' ? '连接全球\n收益的桥梁' : 'Bridge to Global\nOpportunity'}
          </h2>
          <p className={`text-lg mb-10 ${textSecondary}`}>
            {language === 'mn' ? 'М Секьюритис ҮЦК-тай хамтран дэлхийн хөрөнгийн зах зээлд хөрөнгө оруулаарай.'
              : language === 'zh' ? '与M Securities合作，在全球资本市场投资。'
              : 'Invest in global capital markets with M Securities.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://trader.msecurities.mn/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base font-semibold text-white bg-teal-500 hover:bg-teal-400 transition-all hover:-translate-y-0.5 shadow-xl shadow-teal-500/20"
            >
              {language === 'mn' ? 'Арилжаа эхлэх' : language === 'zh' ? '开始交易' : 'Start Trading'}
              <ArrowTrendingUpIcon className="w-5 h-5" />
            </a>
            <a
              href="https://apps.apple.com/mn/app/m-securities-mn/id6745858855"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border transition-all hover:-translate-y-0.5
                ${isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-800 border-gray-200 shadow-sm'}`}
            >
              <DevicePhoneMobileIcon className="w-4 h-4 text-teal-500" />
              {language === 'mn' ? 'Апп татах' : language === 'zh' ? '下载应用' : 'Download App'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

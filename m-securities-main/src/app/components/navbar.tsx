'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import LanguageSwitcher from './language-switcher';
import { TRADE_URL } from '../../lib/links';
import DarkModeToggle from './dark-mode-toggle';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import Image from 'next/image';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  // Home and the service pages open on a full-bleed hero, so the bar starts fully transparent there
  const overHero = pathname === '/' || pathname.startsWith('/services/') || pathname.startsWith('/faq/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      navRef.current?.style.setProperty('--nav-progress', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  // Once scrolled, the bar separates from the page: near-opaque fill, soft shadow, slimmer height
  const navBg = scrolled
    ? isDarkMode ? 'bg-[#0a0c10]/[.92] backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.35)]' : 'bg-white/[.92] backdrop-blur-md shadow-[0_4px_12px_rgba(15,27,45,0.08)]'
    : overHero ? 'bg-transparent'
    : isDarkMode ? 'bg-[#0a0c10]/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm';
  const ease = 'duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none';

  const renderDropdownButton = (name: string, label: string) => (
    <button
      onClick={(e) => handleDropdownClick(name, e)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${activeDropdown === name
          ? 'text-teal-500 dark:text-teal-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400'}`}
      aria-expanded={activeDropdown === name}>
      {label}
      <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === name ? 'rotate-180' : ''}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const renderDropdownMenu = (name: string, items: { href: string; label: string }[]) => (
    <div className={`absolute left-0 mt-2 w-56 rounded-xl overflow-hidden z-50
      ${isDarkMode ? 'bg-[#12141a] border border-white/8' : 'bg-white border border-gray-100 shadow-xl shadow-black/8'}
      transition-all duration-200 ease-out
      ${activeDropdown === name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
      <div className="py-1.5">
        {items.map((item, i) => (
          <Link key={i} href={item.href}
            className={`block px-4 py-2.5 text-sm transition-all duration-150
              ${isDarkMode
                ? 'text-gray-300 hover:bg-teal-500/10 hover:text-teal-400'
                : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'}`}
            onClick={handleLinkClick}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] ${ease} ${navBg}`}>
      <div className={`max-w-7xl mx-auto px-6 transition-[padding] ${ease} ${scrolled ? 'py-[9px]' : 'py-3.5'}`}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src={isDarkMode ? "/logo-dark.png" : "/logo.png"}
                alt="M Securities"
                width={140}
                height={36}
                className={`w-auto object-contain transition-[height] ${ease} ${scrolled ? 'h-7' : 'h-8'}`}
              />
            </Link>
            {/* MMI link */}
            <a href="https://mmi.msecurities.mn" target="_blank" rel="noopener noreferrer"
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all
                ${isDarkMode
                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20'
                  : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              M Market Intelligence
            </a>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <div className="relative">
              {renderDropdownButton('about', t('navbar.about'))}
              {renderDropdownMenu('about', [
                { href: "/about#introduction", label: t('navbar.sections.introduction') },
                { href: "/about#vision", label: t('navbar.sections.vision') },
                { href: "/about#goal", label: t('navbar.sections.goal') },
                { href: "/about#values", label: t('navbar.sections.values') },
                { href: "/about#team", label: t('navbar.sections.team') },
              ])}
            </div>
            <div className="relative">
              {renderDropdownButton('services', t('navbar.services'))}
              {renderDropdownMenu('services', [
                { href: "/services/broker", label: t('navbar.sections.broker') },
                { href: "/services/mining-broker", label: t('navbar.sections.miningBroker') },
                { href: "/services/foreign-trading", label: t('navbar.sections.foreignTrading') },
              ])}
            </div>
            <div className="relative">
              {renderDropdownButton('research', t('navbar.research'))}
              {renderDropdownMenu('research', [
                { href: "/research/news", label: t('navbar.sections.news') },
                { href: "/research/analysis", label: t('navbar.sections.analysis') },
                { href: "/research/weekly", label: t('navbar.sections.weekly') },
              ])}
            </div>
            {/* one page left under FAQ, so a plain link instead of a dropdown */}
            <Link href="/faq/common-questions" onClick={handleLinkClick}
              aria-current={pathname.startsWith('/faq') ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${pathname.startsWith('/faq')
                  ? 'text-teal-500 dark:text-teal-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400'}`}>
              {t('navbar.faqs')}
            </Link>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <DarkModeToggle />
            <Link href={TRADE_URL}>
              <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                bg-gradient-to-r from-teal-500 to-cyan-500
                shadow-lg shadow-teal-500/20
                transition-all hover:-translate-y-0.5 hover:shadow-teal-500/35
                inline-flex items-center gap-1.5">
                {t('navbar.trade')} <ArrowTrendingUpIcon className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Mobile */}
          <button className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 rounded-2xl overflow-hidden border
            ${isDarkMode ? 'bg-[#12141a] border-white/8' : 'bg-white border-gray-100 shadow-lg'}`}>
            <div className="p-4 space-y-1">
              {[
                { key: 'about', label: t('navbar.about'), items: [
                  { href: "/about#introduction", label: t('navbar.sections.introduction') },
                  { href: "/about#vision", label: t('navbar.sections.vision') },
                  { href: "/about#goal", label: t('navbar.sections.goal') },
                  { href: "/about#values", label: t('navbar.sections.values') },
                  { href: "/about#team", label: t('navbar.sections.team') },
                ]},
                { key: 'services', label: t('navbar.services'), items: [
                  { href: "/services/broker", label: t('navbar.sections.broker') },
                  { href: "/services/mining-broker", label: t('navbar.sections.miningBroker') },
                  { href: "/services/foreign-trading", label: t('navbar.sections.foreignTrading') },
                ]},
                { key: 'research', label: t('navbar.research'), items: [
                  { href: "/research/news", label: t('navbar.sections.news') },
                  { href: "/research/analysis", label: t('navbar.sections.analysis') },
                  { href: "/research/weekly", label: t('navbar.sections.weekly') },
                ]},
              ].map(section => (
                <div key={section.key}>
                  <button
                    onClick={(e) => handleDropdownClick(`${section.key}-m`, e)}
                    className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isDarkMode ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}>
                    {section.label}
                    <svg className={`w-3.5 h-3.5 transition-transform ${activeDropdown === `${section.key}-m` ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeDropdown === `${section.key}-m` && (
                    <div className="ml-3 mt-1 space-y-0.5">
                      {section.items.map((item, i) => (
                        <Link key={i} href={item.href}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors
                            ${isDarkMode ? 'text-gray-400 hover:text-teal-400 hover:bg-teal-500/10' : 'text-gray-500 hover:text-teal-600 hover:bg-teal-50'}`}
                          onClick={handleLinkClick}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/faq/common-questions" onClick={handleLinkClick}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isDarkMode ? 'text-gray-200 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}>
                {t('navbar.faqs')}
              </Link>
              <div className={`pt-3 mt-3 border-t flex items-center justify-between
                ${isDarkMode ? 'border-white/8' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <LanguageSwitcher up />
                  <DarkModeToggle />
                </div>
                <Link href={TRADE_URL}>
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                    bg-gradient-to-r from-teal-500 to-cyan-500">
                    {t('navbar.trade')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll progress along the bottom edge, shown once the bar has separated */}
      <div aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-teal-500 to-cyan-500
          [transform:scaleX(var(--nav-progress,0))] [transition:opacity_.4s_cubic-bezier(0.2,0.8,0.2,1),transform_.1s_linear] motion-reduce:transition-none
          ${scrolled && !isMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
    </nav>
  );
};

export default Navbar;

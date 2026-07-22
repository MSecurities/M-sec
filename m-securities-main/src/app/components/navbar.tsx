'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import LanguageSwitcher from './language-switcher';
import DarkModeToggle from './dark-mode-toggle';
import { useLanguage } from '../context/LanguageContext';
import { useDarkMode } from '../context/DarkModeContext';
import Image from 'next/image';

const Navbar = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navBg = isDarkMode
    ? scrolled ? 'bg-[#0a0c10]/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
    : scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm' : 'bg-transparent';

  const renderDropdownButton = (name: string, label: string) => (
    <button
      onClick={(e) => handleDropdownClick(name, e)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${activeDropdown === name
          ? 'text-teal-500 dark:text-teal-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400'
        }`}
      aria-expanded={activeDropdown === name}
    >
      {label}
      <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === name ? 'rotate-180' : ''}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const renderDropdownMenu = (name: string, items: { href: string; label: string }[]) => (
    <div className={`absolute left-0 mt-2 w-56 rounded-xl overflow-hidden z-50
      bg-white dark:bg-[#12141a]
      shadow-xl shadow-black/10 dark:shadow-black/40
      border border-gray-100 dark:border-white/8
      transition-all duration-200 ease-out
      ${activeDropdown === name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
      <div className="py-1.5">
        {items.map((item, i) => (
          <Link key={i} href={item.href}
            className="block px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300
              hover:bg-teal-50 dark:hover:bg-teal-500/10
              hover:text-teal-600 dark:hover:text-teal-400
              transition-all duration-150"
            onClick={handleLinkClick}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <nav ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src={isDarkMode ? "/logo-dark.png" : "/logo.png"}
              alt="M Securities"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop — pill nav (Үнэт Секьюритис загвар) */}
          <div className={`hidden md:flex items-center gap-1 px-3 py-2 rounded-full border transition-all duration-300
            ${isDarkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-white/80 border-gray-200/80 backdrop-blur-sm shadow-sm'}`}>
            <div className="relative">
              {renderDropdownButton('about', t('navbar.about'))}
              {renderDropdownMenu('about', [
                { href: "/about/introduction", label: t('navbar.sections.introduction') },
                { href: "/about/vision", label: t('navbar.sections.vision') },
                { href: "/about/goal", label: t('navbar.sections.goal') },
                { href: "/about/values", label: t('navbar.sections.values') },
                { href: "/about/team", label: t('navbar.sections.team') },
              ])}
            </div>
            <div className="relative">
              {renderDropdownButton('services', t('navbar.services'))}
              {renderDropdownMenu('services', [
                { href: "/services/broker", label: t('navbar.sections.broker') },
                { href: "/services/underwriter", label: t('navbar.sections.underwriter') },
                { href: "/services/investment-advisor", label: t('navbar.sections.investmentAdvisor') },
                { href: "/services/mining-broker", label: t('navbar.sections.miningBroker') },
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
            <div className="relative">
              {renderDropdownButton('faqs', t('navbar.faqs'))}
              {renderDropdownMenu('faqs', [
                { href: "/faq/common-questions", label: t('navbar.sections.commonQuestions') },
                { href: "/faq/manage-account", label: t('navbar.sections.manageAccount') },
                { href: "/faq/contact", label: t('navbar.sections.contact') },
              ])}
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <DarkModeToggle />
            <Link href="https://trader.msecurities.mn/auth/login?callbackUrl=/dashboard/profile/info/stock">
              <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                bg-gradient-to-r from-teal-500 to-cyan-500
                hover:from-teal-400 hover:to-cyan-400
                shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40
                transition-all duration-200 hover:-translate-y-0.5">
                {t('navbar.trade')} ↗
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300"
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
                  { href: "/about/introduction", label: t('navbar.sections.introduction') },
                  { href: "/about/vision", label: t('navbar.sections.vision') },
                  { href: "/about/goal", label: t('navbar.sections.goal') },
                  { href: "/about/values", label: t('navbar.sections.values') },
                  { href: "/about/team", label: t('navbar.sections.team') },
                ]},
                { key: 'services', label: t('navbar.services'), items: [
                  { href: "/services/broker", label: t('navbar.sections.broker') },
                  { href: "/services/underwriter", label: t('navbar.sections.underwriter') },
                  { href: "/services/investment-advisor", label: t('navbar.sections.investmentAdvisor') },
                  { href: "/services/mining-broker", label: t('navbar.sections.miningBroker') },
                ]},
                { key: 'research', label: t('navbar.research'), items: [
                  { href: "/research/news", label: t('navbar.sections.news') },
                  { href: "/research/analysis", label: t('navbar.sections.analysis') },
                  { href: "/research/weekly", label: t('navbar.sections.weekly') },
                ]},
                { key: 'faqs', label: t('navbar.faqs'), items: [
                  { href: "/faq/common-questions", label: t('navbar.sections.commonQuestions') },
                  { href: "/faq/manage-account", label: t('navbar.sections.manageAccount') },
                  { href: "/faq/contact", label: t('navbar.sections.contact') },
                ]},
              ].map(section => (
                <div key={section.key}>
                  <button
                    onClick={(e) => handleDropdownClick(`${section.key}-m`, e)}
                    className="w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-sm font-medium
                      text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
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
                          className="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400
                            hover:text-teal-500 dark:hover:text-teal-400 transition-colors rounded-lg
                            hover:bg-teal-50 dark:hover:bg-teal-500/10"
                          onClick={handleLinkClick}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LanguageSwitcher />
                  <DarkModeToggle />
                </div>
                <Link href="https://trader.msecurities.mn/auth/login?callbackUrl=/dashboard/profile/info/stock">
                  <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                    bg-gradient-to-r from-teal-500 to-cyan-500 transition-all">
                    {t('navbar.trade')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

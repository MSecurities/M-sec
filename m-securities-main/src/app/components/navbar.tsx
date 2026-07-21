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
  const navRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownClick = (dropdownName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  // Updated dropdown button renderer
  const renderDropdownButton = (name: string, label: string) => (
    <button
      onClick={(e) => handleDropdownClick(name, e)}
      className="text-gray-700 dark:text-gray-200 hover:text-teal-500 dark:hover:text-teal-400 
                 text-lg font-medium flex items-center transition-colors duration-200
                 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 
                 rounded-lg px-3 py-2"
      aria-expanded={activeDropdown === name}
    >
      {label}
      <svg 
        className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
          activeDropdown === name ? 'rotate-180' : ''
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  // Updated dropdown menu renderer
  const renderDropdownMenu = (name: string, items: { href: string; label: string }[]) => (
    <div 
      className={`absolute left-0 mt-1 w-64 rounded-lg overflow-hidden
                 bg-white dark:bg-[#26282c] 
                 shadow-lg border border-gray-100 dark:border-gray-700
                 transform transition-all duration-200 ease-in-out
                 ${activeDropdown === name 
                   ? 'opacity-100 visible translate-y-0' 
                   : 'opacity-0 invisible -translate-y-2'}`}
    >
      <div className="py-1">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block px-4 py-2.5 text-base text-gray-700 dark:text-gray-200
                     hover:bg-gray-50 dark:hover:bg-gray-700/50
                     hover:text-teal-500 dark:hover:text-teal-400
                     transition-all duration-300 ease-in-out
                     hover:translate-x-2"
            onClick={handleLinkClick}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <nav className="bg-white dark:bg-[#26282c] shadow-md relative z-50 transition-colors duration-200" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src={isDarkMode ? "/logo-dark.png" : "/logo.png"} 
                alt="Logo" 
                width={180}
                height={40}
                className="h-8 md:h-10 w-auto object-contain transition-opacity duration-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* About Dropdown */}
            <div className="relative group">
              {renderDropdownButton('about', t('navbar.about'))}
              {renderDropdownMenu('about', [
                { href: "/about/introduction", label: t('navbar.sections.introduction') },
                { href: "/about/vision", label: t('navbar.sections.vision') },
                { href: "/about/goal", label: t('navbar.sections.goal') },
                { href: "/about/values", label: t('navbar.sections.values') },
                { href: "/about/team", label: t('navbar.sections.team') }
              ])}
            </div>

            {/* Services Dropdown */}
            <div className="relative group">
              {renderDropdownButton('services', t('navbar.services'))}
              {renderDropdownMenu('services', [
                { href: "/services/broker", label: t('navbar.sections.broker') },
                { href: "/services/underwriter", label: t('navbar.sections.underwriter') },
                { href: "/services/investment-advisor", label: t('navbar.sections.investmentAdvisor') },
                { href: "/services/mining-broker", label: t('navbar.sections.miningBroker') }
              ])}
            </div>

            {/* Research Dropdown */}
            <div className="relative group">
              {renderDropdownButton('research', t('navbar.research'))}
              {renderDropdownMenu('research', [
                { href: "/research/news", label: t('navbar.sections.news') },
                { href: "/research/analysis", label: t('navbar.sections.analysis') },
                { href: "/research/weekly", label: t('navbar.sections.weekly') }
              ])}
            </div>

            {/* FAQs Dropdown */}
            <div className="relative group">
              {renderDropdownButton('faqs', t('navbar.faqs'))}
              {renderDropdownMenu('faqs', [
                { href: "/faq/common-questions", label: t('navbar.sections.commonQuestions') },
                { href: "/faq/manage-account", label: t('navbar.sections.manageAccount') },
                { href: "/faq/contact", label: t('navbar.sections.contact') }
              ])}
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="https://trader.msecurities.mn/auth/login?callbackUrl=/dashboard/profile/info/stock">
              <button className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold 
                               hover:bg-teal-600 transition duration-300 text-lg
                               shadow-sm hover:shadow-md">
                {t('navbar.trade')}
              </button>
            </Link>
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-2 py-3">
              {/* About Mobile Dropdown */}
              <div>
                <button
                  onClick={(e) => handleDropdownClick('about-mobile', e)}
                  className={`w-full text-left px-4 py-2 flex justify-between items-center
                             ${activeDropdown === 'about-mobile' 
                               ? 'text-teal-500 dark:text-teal-400 bg-gray-50 dark:bg-gray-800/40' 
                               : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {t('navbar.about')}
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      activeDropdown === 'about-mobile' ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'about-mobile' && (
                  <div className="pl-4 py-2 space-y-2">
                    {[
                      { href: "/about/introduction", label: t('navbar.sections.introduction') },
                      { href: "/about/vision", label: t('navbar.sections.vision') },
                      { href: "/about/goal", label: t('navbar.sections.goal') },
                      { href: "/about/values", label: t('navbar.sections.values') },
                      { href: "/about/team", label: t('navbar.sections.team') }
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                                 hover:text-teal-500 dark:hover:text-teal-400"
                        onClick={handleLinkClick}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Services Mobile Dropdown */}
              <div>
                <button
                  onClick={(e) => handleDropdownClick('services-mobile', e)}
                  className={`w-full text-left px-4 py-2 flex justify-between items-center
                             ${activeDropdown === 'services-mobile' 
                               ? 'text-teal-500 dark:text-teal-400 bg-gray-50 dark:bg-gray-800/40' 
                               : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {t('navbar.services')}
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      activeDropdown === 'services-mobile' ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'services-mobile' && (
                  <div className="pl-4 py-2 space-y-2">
                    {[
                      { href: "/services/broker", label: t('navbar.sections.broker') },
                      { href: "/services/underwriter", label: t('navbar.sections.underwriter') },
                      { href: "/services/investment-advisor", label: t('navbar.sections.investmentAdvisor') },
                      { href: "/services/mining-broker", label: t('navbar.sections.miningBroker') }
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                                 hover:text-teal-500 dark:hover:text-teal-400"
                        onClick={handleLinkClick}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Research Mobile Dropdown */}
              <div>
                <button
                  onClick={(e) => handleDropdownClick('research-mobile', e)}
                  className={`w-full text-left px-4 py-2 flex justify-between items-center
                             ${activeDropdown === 'research-mobile' 
                               ? 'text-teal-500 dark:text-teal-400 bg-gray-50 dark:bg-gray-800/40' 
                               : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {t('navbar.research')}
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      activeDropdown === 'research-mobile' ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'research-mobile' && (
                  <div className="pl-4 py-2 space-y-2">
                    {[
                      { href: "/research/news", label: t('navbar.sections.news') },
                      { href: "/research/analysis", label: t('navbar.sections.analysis') },
                      { href: "/research/weekly", label: t('navbar.sections.weekly') }
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                                 hover:text-teal-500 dark:hover:text-teal-400"
                        onClick={handleLinkClick}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQs Mobile Dropdown */}
              <div>
                <button
                  onClick={(e) => handleDropdownClick('faqs-mobile', e)}
                  className={`w-full text-left px-4 py-2 flex justify-between items-center
                             ${activeDropdown === 'faqs-mobile' 
                               ? 'text-teal-500 dark:text-teal-400 bg-gray-50 dark:bg-gray-800/40' 
                               : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {t('navbar.faqs')}
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      activeDropdown === 'faqs-mobile' ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'faqs-mobile' && (
                  <div className="pl-4 py-2 space-y-2">
                    {[
                      { href: "/faq/common-questions", label: t('navbar.sections.commonQuestions') },
                      { href: "/faq/manage-account", label: t('navbar.sections.manageAccount') },
                      { href: "/faq/contact", label: t('navbar.sections.contact') }
                    ].map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300
                                 hover:text-teal-500 dark:hover:text-teal-400"
                        onClick={handleLinkClick}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Bottom Section */}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="px-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <DarkModeToggle />
                  </div>
                  <Link href="https://trader.msecurities.mn/auth/login?callbackUrl=/dashboard/profile/info/stock">
                    <button className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium
                                     hover:bg-teal-600 transition duration-200">
                      {t('navbar.trade')}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

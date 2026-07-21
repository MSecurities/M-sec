'use client';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = (lang: 'en' | 'mn') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg 
                 bg-white dark:bg-[#26282c]
                 border border-gray-200 dark:border-gray-700 
                 hover:border-teal-500 dark:hover:border-teal-500
                 shadow-sm transition-all duration-300 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm">
            {language === 'en' ? (
              /* English Flag */
              <svg className="w-full h-full" viewBox="0 0 640 480">
                <g fillRule="evenodd">
                  <path fill="#012169" d="M0 0h640v480H0z"/>
                  <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
                  <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
                  <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
                  <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
                </g>
              </svg>
            ) : (
              /* Mongolian Flag */
              <svg className="w-full h-full" viewBox="0 0 640 480">
                <path fill="#c4272f" d="M0 0h640v480H0z"/>
                <path fill="#015197" d="M213.3 0h213.4v480H213.3z"/>
                <circle cx="106.7" cy="189.3" r="29.3" fill="#f9cf02"/>
                <circle cx="106.7" cy="176" r="32" fill="#c4272f"/>
                <path fill="#f9cf02" d="M106.7 146.7a29.3 29.3 0 0 1 0 58.6 24 24 0 0 0 0-58.6m-16 29.3a16 16 0 0 0 32 0 16 16 0 0 0-32 0"/>
                <path fill="#f9cf02" d="M93.3 176h9.4v37.3h-9.4zm18.7 0h9.4v37.3H112z"/>
                <path fill="#c4272f" stroke="#f9cf02" strokeWidth="2" d="m106.7 128 4 12-10.7-7.7h13.4L104 140z"/>
              </svg>
            )}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            {language === 'en' ? 'EN' : 'МН'}
          </span>
          {/* Dropdown arrow */}
          <svg 
            className={`w-4 h-4 ml-1 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute right-0 mt-2 py-2 w-40 
                   bg-white dark:bg-[#26282c]
                   rounded-lg shadow-lg 
                   border border-gray-100 dark:border-gray-700
                   transform transition-all duration-200 origin-top
                   ${isOpen 
                     ? 'opacity-100 scale-100 visible' 
                     : 'opacity-0 scale-95 invisible'}`}
      >
        <button
          onClick={() => toggleLanguage('en')}
          className="w-full px-4 py-2 flex items-center space-x-3 
                   text-gray-700 dark:text-gray-200
                   hover:bg-gray-50 dark:hover:bg-gray-700/50
                   hover:text-teal-500 dark:hover:text-teal-400
                   transition-colors duration-200"
        >
          <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm">
            <svg className="w-full h-full" viewBox="0 0 640 480">
              <g fillRule="evenodd">
                <path fill="#012169" d="M0 0h640v480H0z"/>
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
                <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
                <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
                <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
              </g>
            </svg>
          </div>
          <span className="text-sm font-medium">English</span>
        </button>
        <button
          onClick={() => toggleLanguage('mn')}
          className="w-full px-4 py-2 flex items-center space-x-3 
                   text-gray-700 dark:text-gray-200
                   hover:bg-gray-50 dark:hover:bg-gray-700/50
                   hover:text-teal-500 dark:hover:text-teal-400
                   transition-colors duration-200"
        >
          <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm">
            <svg className="w-full h-full" viewBox="0 0 640 480">
              <path fill="#c4272f" d="M0 0h640v480H0z"/>
              <path fill="#015197" d="M213.3 0h213.4v480H213.3z"/>
              <circle cx="106.7" cy="189.3" r="29.3" fill="#f9cf02"/>
              <circle cx="106.7" cy="176" r="32" fill="#c4272f"/>
              <path fill="#f9cf02" d="M106.7 146.7a29.3 29.3 0 0 1 0 58.6 24 24 0 0 0 0-58.6m-16 29.3a16 16 0 0 0 32 0 16 16 0 0 0-32 0"/>
              <path fill="#f9cf02" d="M93.3 176h9.4v37.3h-9.4zm18.7 0h9.4v37.3H112z"/>
              <path fill="#c4272f" stroke="#f9cf02" strokeWidth="2" d="m106.7 128 4 12-10.7-7.7h13.4L104 140z"/>
            </svg>
          </div>
          <span className="text-sm font-medium">Монгол</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 
'use client';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

type Lang = 'mn' | 'zh' | 'en';

/* Flags drawn at 3:2 so they fill the 24×16 chip without letterboxing. */
// Mongolia: red–blue–red thirds, the gold Soyombo centred in the hoist stripe
const FlagMN = () => (
  <svg viewBox="0 0 900 600" className="w-full h-full block" aria-hidden="true">
    <rect width="900" height="600" fill="#C4272F" />
    <rect x="300" width="300" height="600" fill="#015197" />
    <g fill="#F9CF02" transform="translate(0 14)">
      {/* fire */}
      <path d="M115 150c-3-25 3-38 10-55 3 17 8 23 13 25-2-25 7-45 12-65 5 20 14 40 12 65 5-2 10-8 13-25 7 17 13 30 10 55z" />
      {/* sun and moon */}
      <circle cx="150" cy="190" r="32" />
      <path d="M96 220a56 56 0 0 0 108 0a80 80 0 0 1-108 0z" />
      {/* triangles, bars and the two pillars */}
      <path d="M108 280h84l-42 34zM108 488h84l-42 34z" />
      <rect x="108" y="324" width="84" height="15" />
      <rect x="108" y="463" width="84" height="15" />
      <rect x="80" y="280" width="18" height="242" />
      <rect x="202" y="280" width="18" height="242" />
      {/* yin-yang */}
      <circle cx="150" cy="401" r="45" />
      <path d="M150 356a45 45 0 0 1 0 90a22.5 22.5 0 0 1 0-45a22.5 22.5 0 0 0 0-45z" fill="#C4272F" />
      <circle cx="150" cy="378.5" r="7" fill="#C4272F" />
      <circle cx="150" cy="423.5" r="7" />
    </g>
  </svg>
);
// China: the large star and four small ones, each small star pointing at the large one's centre
const STAR = 'M0-1 .587785.809017-.951057-.309017H.951057L-.587785.809017z';
const FlagCN = () => (
  <svg viewBox="0 0 30 20" className="w-full h-full block" aria-hidden="true">
    <rect width="30" height="20" fill="#DE2910" />
    <g fill="#FFDE00">
      <path d={STAR} transform="translate(5 5) scale(3)" />
      <path d={STAR} transform="translate(10 2) rotate(23.036)" />
      <path d={STAR} transform="translate(12 4) rotate(45.87)" />
      <path d={STAR} transform="translate(12 7) rotate(69.945)" />
      <path d={STAR} transform="translate(10 9) rotate(20.66)" />
    </g>
  </svg>
);
// United Kingdom (Union Jack), cropped to 3:2 from the centre
const FlagEN = () => (
  <svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" className="w-full h-full block" aria-hidden="true">
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
    <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
    <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
    <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
  </svg>
);

const LANGS: { id: Lang; code: string; name: string; Flag: () => JSX.Element }[] = [
  { id: 'mn', code: 'MN', name: 'Монгол', Flag: FlagMN },
  { id: 'zh', code: 'CN', name: '中文', Flag: FlagCN },
  { id: 'en', code: 'EN', name: 'English', Flag: FlagEN },
];

const Chip = ({ Flag }: { Flag: () => JSX.Element }) => (
  <span className="w-6 h-4 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10 dark:ring-white/15"><Flag /></span>
);

// `up`: the mobile menu puts it in its bottom-left corner, inside an overflow-hidden panel
const LanguageSwitcher = ({ up = false }: { up?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const current = LANGS.find(l => l.id === language) ?? LANGS[0];

  // close on a click outside or Escape
  useEffect(() => {
    if (!isOpen) return;
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setIsOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [isOpen]);

  const choose = (lang: Lang) => { setLanguage(lang); setIsOpen(false); };

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-3 rounded-lg
                 bg-white dark:bg-[#26282c]
                 border border-gray-200 dark:border-gray-700
                 hover:border-teal-500 dark:hover:border-teal-500
                 shadow-sm transition-all duration-300"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${current.name} (${current.code})`}
      >
        <Chip Flag={current.Flag} />
        <span className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">{current.code}</span>
        <svg className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute ${up ? 'left-0 bottom-full mb-2 origin-bottom-left' : 'right-0 top-full mt-2 origin-top-right'} p-1.5 w-48 z-50
                   bg-white dark:bg-[#26282c]
                   rounded-xl shadow-lg shadow-black/10
                   border border-gray-100 dark:border-gray-700
                   transition-all duration-200
                   ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
      >
        {LANGS.map(l => {
          const on = l.id === language;
          return (
            <button
              key={l.id}
              type="button"
              lang={l.id}
              onClick={() => choose(l.id)}
              aria-current={on ? 'true' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200
                ${on
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-teal-600 dark:hover:text-teal-400'}`}
            >
              <Chip Flag={l.Flag} />
              <span className="text-sm font-medium">{l.name}</span>
              <span className="ml-auto text-xs font-semibold tracking-wide text-gray-400 dark:text-gray-500">{l.code}</span>
              <svg className={`w-4 h-4 text-teal-500 ${on ? '' : 'invisible'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 10.5 3.2 3L15 6.5" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;

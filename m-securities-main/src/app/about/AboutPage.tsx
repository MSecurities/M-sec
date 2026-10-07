'use client';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import Image from 'next/image';
import { clamp, onScrollFrame, prefersReducedMotion, scrollToSection } from '../components/home/shared';
import { RefPage, cssVars, useTr } from '../components/services/parts';
import { TeamSection } from './TeamSection';
import a from './about.module.css';

// One page for the whole About section; /about/<section> redirects to /about#<section>
export const SECTIONS = ['introduction', 'vision', 'goal', 'values', 'team'] as const;
type Section = (typeof SECTIONS)[number];

const Ic = ({ children, size = 22 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const initials = (name: string) => name.split(/[\s.]+/).filter(Boolean).map(p => p[0]).join('').toUpperCase().slice(0, 2);
const NAV_OFFSET = 132; // fixed navbar + the sticky section bar

/* ---------- section frame: number + title, alternating background ---------- */
function Sec({ id, n, title, sub, alt, band, children }: { id: Section; n: number; title: string; sub?: string; alt?: boolean; band?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`${a.sec}${alt ? ` ${a.alt}` : ''}${band ? ` ${a.band}` : ''}`} aria-labelledby={`${id}-h`}>
      <div className={a.inner}>
        <div data-io className={a.sh}>
          <span className={a.num}>{String(n).padStart(2, '0')}</span>
          <h2 id={`${id}-h`}>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------- introduction: history + board ---------- */
function Introduction() {
  const { t } = useTr();
  const board = (['chairman', 'member1', 'member2'] as const).map(k => ({
    key: k, name: t(`about.introduction.board.${k}.name`), position: t(`about.introduction.board.${k}.position`),
  }));
  return (
    <>
      <div data-io className={a.story}>
        <div className={a.panel} aria-hidden="true">
          <div className={a.orb} />
          <Image src="/logo-dark.png" alt="" width={220} height={56} className={a.plogo} style={{ height: 'auto' }} />
        </div>
        <div>
          <h3 className={a.gh}>{t('about.introduction.organizationalHistory.title')}</h3>
          <p className={a.leadp}>{t('about.introduction.organizationalHistory.description1')}</p>
          <p className={a.p}>{t('about.introduction.organizationalHistory.description2')}</p>
        </div>
      </div>
      <div data-io className={a.boardw}>
        <h3 className={a.gh}>{t('about.introduction.board.title')}</h3>
        <div className={a.board}>
          {board.map((m, k) => (
            <article key={m.key} className={`${a.member}${k === 0 ? ` ${a.chair}` : ''}`} data-card style={cssVars({ '--k': k })}>
              <span className={a.mono} aria-hidden="true">{initials(m.name)}</span>
              <div><h4>{m.name}</h4><p>{m.position}</p></div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- vision: the statement large on a dark band, the objective under a rule ---------- */
// The words light up one after another as the statement scrolls through the viewport (--p, 0 → 1).
function Vision() {
  const { t, language } = useTr();
  const ref = useRef<HTMLParagraphElement>(null);
  const text = t('about.vision.description');
  const words = language === 'zh' ? [...text] : text.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.style.setProperty('--p', '1'); return; }
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--p', clamp((innerHeight * .9 - r.top) / (innerHeight * .5)).toFixed(3));
    });
  }, []);

  return (
    <>
      <p ref={ref} className={a.vbig} style={cssVars({ '--n': words.length })}>
        <span className={a.sr}>{text}</span>
        {words.map((w, i) => (
          <span key={`${language}-${i}`} aria-hidden="true" style={cssVars({ '--i': i })}>{w}{language === 'zh' ? '' : ' '}</span>
        ))}
      </p>
      <div data-io className={a.vobj}>
        <h3>{t('about.objective.title')}</h3>
        <p>{t('about.objective.description')}</p>
      </div>
    </>
  );
}

/* ---------- goal: four numbered aims ---------- */
const GOAL_ICONS = [
  <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.8 2.6 15.2 0 18M12 3c-2.6 2.8-2.6 15.2 0 18" /></>,
  <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>,
  <path d="M4 20V11M10 20V5M16 20v-6M3 20h18M15 8l3-3 3 3" />,
  <><circle cx="9" cy="8" r="3" /><path d="M3 19c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3" /><path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 13.9c1.9.6 3.1 2.3 3.5 5.1" /></>,
];
function Goal() {
  const { t } = useTr();
  const items = (t('about.goal.items') as unknown as string[]) ?? [];
  return (
    <div data-io className={a.goals}>
      {items.map((g, k) => (
        <article key={k} className={a.goal} data-card style={cssVars({ '--k': k })}>
          <span className={a.gn}>{String(k + 1).padStart(2, '0')}</span>
          <span className={a.gic}><Ic size={26}>{GOAL_ICONS[k % GOAL_ICONS.length]}</Ic></span>
          <p>{g.trim()}</p>
        </article>
      ))}
    </div>
  );
}

/* ---------- values: seven cards, four over three ---------- */
const VALUES: [string, ReactNode][] = [
  ['mastery', <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="m12 12 6-6M15 6h3v3" /></>],
  ['teamSpirit', <><circle cx="9" cy="8" r="3" /><path d="M3 19c.6-3.4 3-5.3 6-5.3s5.4 1.9 6 5.3" /><path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 13.9c1.9.6 3.1 2.3 3.5 5.1" /></>],
  ['leadership', <path d="M5 21V4M5 4h11l-2 4 2 4H5" />],
  ['mcsSpirit', <path d="M12 3l2.2 5.4L20 9l-4.4 3.8L17 18.5 12 15.6 7 18.5l1.4-5.7L4 9l5.8-.6z" />],
  ['creativity', <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.2h5.2c0-.9.4-1.7 1-2.2A6 6 0 0 0 12 3Z" /></>],
  ['integrity', <><path d="M12 3 19 5.6v5.8c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V5.6Z" /><path d="m9 12 2 2 4-4" /></>],
  ['sustainable', <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" /><path d="M5 19c3-4 6-6.5 9.5-8.5" /></>],
];
function Values() {
  const { t } = useTr();
  return (
    <div data-io className={a.vals}>
      {VALUES.map(([key, icon], k) => (
        <article key={key} className={a.val} data-card style={cssVars({ '--k': k })}>
          <div className={a['val-top']}>
            <span className={a.vicn}><Ic>{icon}</Ic></span>
            <span className={a.gn}>{String(k + 1).padStart(2, '0')}</span>
          </div>
          <h3>{t(`about.value.items.${key}.title`)}</h3>
          <p>{t(`about.value.items.${key}.description`)}</p>
        </article>
      ))}
    </div>
  );
}

/* ---------- page ---------- */
export default function AboutPage() {
  const { t } = useTr();
  const [active, setActive] = useState<Section>('introduction');
  const bar = useRef<HTMLDivElement>(null);

  // the section under the sticky bar is the current one
  useEffect(() => onScrollFrame(() => {
    let cur: Section = SECTIONS[0];
    for (const id of SECTIONS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= NAV_OFFSET + 40) cur = id;
    }
    setActive(cur);
  }), []);
  // keep the current tab visible when the bar scrolls sideways (phones)
  useEffect(() => {
    const b = bar.current, tab = b?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (b && tab && b.scrollWidth > b.clientWidth) b.scrollTo({ left: tab.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  const go = (id: Section) => (e: MouseEvent) => {
    e.preventDefault();
    history.replaceState(history.state, '', `#${id}`);
    scrollToSection(id, () => -(NAV_OFFSET - 24));
  };

  return (
    <RefPage>
      <header className={a.head}>
        <div className={a['head-bg']} />
        <span className={a.kick}><i />M Securities</span>
        <h1 className={a.h1}>{t('about.title')}</h1>
      </header>

      <div className={a.snav}>
        <nav ref={bar} className={a.tabs} aria-label={t('about.title')}>
          {SECTIONS.map(id => (
            <a key={id} href={`#${id}`} onClick={go(id)} className={a.tab} aria-current={active === id ? 'true' : undefined}>{t(`navbar.sections.${id}`)}</a>
          ))}
        </nav>
      </div>

      <Sec id="introduction" n={1} title={t('about.introduction.title')}><Introduction /></Sec>
      <Sec id="vision" n={2} title={t('about.vision.title')} band><Vision /></Sec>
      <Sec id="goal" n={3} title={t('about.goal.title')}><Goal /></Sec>
      <Sec id="values" n={4} title={t('about.value.title')} sub={t('about.value.description')} alt><Values /></Sec>
      <Sec id="team" n={5} title={t('about.team.title')}><TeamSection /></Sec>
    </RefPage>
  );
}

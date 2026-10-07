'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { clamp, onScrollFrame, prefersReducedMotion, scrollToSection } from '../../components/home/shared';
import { RefPage, cssVars, p, useTr } from '../../components/services/parts';
import f from './faq.module.css';

type QA = { question: string; answer: string };
type FAQData = { title: string; questions: QA[]; trading?: { title: string; questions: QA[] }; account?: { title: string; questions: QA[] } };
type Group = { key: string; label: string; title: string; icon: ReactNode; items: (QA & { id: string; n: number })[] };

const Ic = ({ size = 20, children }: { size?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const CHAT = <><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5v6a1.5 1.5 0 0 1-1.5 1.5H8l-3.5 3v-3h0A1.5 1.5 0 0 1 3 10.5Z" /><path d="M7.4 6.3a1.7 1.7 0 0 1 3.2.6c0 1.1-1.6 1.3-1.6 2.1M9 10.2v.1" /></>;
const CANDLES = <><path d="M5 2.5v13M9 4.5v9M13 3v12" /><rect x="3.6" y="6" width="2.8" height="5" rx=".6" /><rect x="7.6" y="7" width="2.8" height="3.5" rx=".6" /><rect x="11.6" y="5" width="2.8" height="6" rx=".6" /></>;
const WALLET = <><path d="M14 6V4.5A1.5 1.5 0 0 0 12.5 3h-8A1.5 1.5 0 0 0 3 4.5v9A1.5 1.5 0 0 0 4.5 15h9a1.5 1.5 0 0 0 1.5-1.5V7.5A1.5 1.5 0 0 0 13.5 6H4.5" /><circle cx="12" cy="10.5" r=".6" fill="currentColor" /></>;

/* ---------- answers: the plain text carries structure, render it ---------- */
type Block =
  | { k: 'p'; text: string }
  | { k: 'lead'; text: string }
  | { k: 'defs'; rows: [string, string][] }
  | { k: 'bul'; rows: string[] }
  | { k: 'time'; rows: [string, string][] };
const TIME = /^(.{0,14}?\d{1,2}:\d{2}(?:\s*[–-]\s*\d{1,2}:\d{2})?.{0,16}?)\s+[–—-]\s+(.+)$/; // "09:00–10:00 – Pre-open"
const BUL = /^[·•●▪]\s*(.+)$/;                                                              // "· reason"
const LEAD = /^(.{2,70})[:：]$/;                                                             // "Settlement cycle:"
const DEF = /^([^:：.。!?！？]{2,48})[:：](?!\/\/)\s*(.+)$/;                                  // "Primary market: …"
const tidy = (s: string) => s.trim().replace(/[,;，；]$/, '');
const hasLetter = (s: string) => /\p{L}/u.test(s) && !/^\d/.test(s.trim());

function parse(answer: string): Block[] {
  const out: Block[] = [];
  const push = <K extends 'defs' | 'bul' | 'time'>(k: K, row: Extract<Block, { k: K }>['rows'][number]) => {
    const last = out[out.length - 1];
    if (last?.k === k) (last.rows as unknown[]).push(row);
    else out.push({ k, rows: [row] } as Extract<Block, { k: K }>);
  };
  for (const line of answer.split(/\n+/).map(s => s.trim()).filter(Boolean)) {
    let m: RegExpExecArray | null;
    if ((m = TIME.exec(line))) push('time', [m[1].trim(), tidy(m[2])]);
    else if ((m = BUL.exec(line))) push('bul', tidy(m[1]));
    else if ((m = LEAD.exec(line)) && hasLetter(m[1])) out.push({ k: 'lead', text: m[1] });
    else if ((m = DEF.exec(line)) && hasLetter(m[1])) push('defs', [m[1].trim(), m[2]]);
    else out.push({ k: 'p', text: line });
  }
  return out;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function mark(s: string, terms: string[]): ReactNode {
  if (!terms.length) return s;
  return s.split(new RegExp(`(${terms.map(esc).join('|')})`, 'iu')).map((x, i) => (i % 2 ? <mark key={i}>{x}</mark> : x));
}
// URLs become links (ending on a latin letter/digit or slash, so "app-д" keeps its suffix outside)
const URL_RE = /(https?:\/\/[\w./?=&%#:~+-]*[\w/])/;
const Rich = ({ text, terms }: { text: string; terms: string[] }) => (
  <>{text.split(URL_RE).map((part, i) => (i % 2
    ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{mark(part, terms)}</a>
    : <Fragment key={i}>{mark(part, terms)}</Fragment>))}</>
);

function Answer({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {parse(text).map((b, i) => {
        if (b.k === 'p') return <p key={i}><Rich text={b.text} terms={terms} /></p>;
        if (b.k === 'lead') return <p key={i} className={f.lead}><Rich text={b.text} terms={terms} /></p>;
        if (b.k === 'bul') return <ul key={i} className={f.bul}>{b.rows.map((r, j) => <li key={j}><Rich text={r} terms={terms} /></li>)}</ul>;
        if (b.k === 'time') return (
          <ol key={i} className={f.sched}>
            {b.rows.map(([tm, tx], j) => <li key={j}><span className={f.tm}><Rich text={tm} terms={terms} /></span><span><Rich text={tx} terms={terms} /></span></li>)}
          </ol>
        );
        return (
          <div key={i} className={f.defs}>
            {b.rows.map(([term, tx], j) => <div key={j} className={f.def}><b><Rich text={term} terms={terms} /></b><span><Rich text={tx} terms={terms} /></span></div>)}
          </div>
        );
      })}
    </>
  );
}

/* ---------- page ---------- */
const FAQ = () => {
  const { t, tr, language } = useTr();
  const data = t('faq.commonQuestions') as unknown as FAQData;
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState('general');
  const hero = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // "АРИЛЖААНЫ ТАЛААР" → "Арилжааны талаар"
  const tame = (s = '') => (s && s === s.toLocaleUpperCase() && /\p{L}/u.test(s) ? s[0] + s.slice(1).toLocaleLowerCase() : s);
  const groups: Group[] = (() => {
    const raw: [string, string, string, ReactNode, QA[] | undefined][] = [
      ['general', tr('Ерөнхий', 'General', '常规'), tr('Ерөнхий асуултууд', 'General questions', '常规问题'), CHAT, data.questions],
      ['trading', tr('Арилжаа', 'Trading', '交易'), tame(data.trading?.title), CANDLES, data.trading?.questions],
      ['account', tr('Данс', 'Account', '账户'), tame(data.account?.title), WALLET, data.account?.questions],
    ];
    let n = 0;
    return raw.filter(([, , , , items]) => Array.isArray(items) && items.length)
      .map(([key, label, title, icon, items]) => ({ key, label, title, icon, items: items!.map((it, i) => ({ ...it, id: `q-${key}-${i}`, n: ++n })) }));
  })();
  const all = groups.flatMap(g => g.items);

  const terms = useMemo(() => q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean), [q]);
  const hit = (it: QA) => { const s = `${it.question} ${it.answer}`.toLocaleLowerCase(); return terms.every(w => s.includes(w)); };
  const shown = new Set(all.filter(hit).map(it => it.id));
  const visible = all.filter(it => shown.has(it.id));
  const allOpen = visible.length > 0 && visible.every(it => open.has(it.id));

  // a narrow search opens its answers so the highlights can be seen
  useEffect(() => {
    if (!terms.length) return;
    const ids = all.filter(hit).map(it => it.id);
    if (ids.length <= 4) setOpen(new Set(ids));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms.join(' '), language]);

  // hero parallax, scroll-spy over the visible groups, "/" to search, #q-… deep links
  useEffect(() => {
    const el = hero.current;
    const reduce = prefersReducedMotion();
    const off = onScrollFrame(() => {
      if (el && !reduce) el.style.setProperty('--bp', clamp(scrollY / innerHeight).toFixed(3));
      const secs = [...document.querySelectorAll<HTMLElement>('[data-faq-group]:not([hidden])')];
      let cur = secs[0]?.dataset.faqGroup;
      for (const s of secs) if (s.getBoundingClientRect().top <= innerHeight * .32) cur = s.dataset.faqGroup;
      setActive(cur ?? '');
    });
    const onKey = (e: KeyboardEvent) => {
      const tg = e.target as HTMLElement;
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || tg.closest('input,textarea,select,[contenteditable="true"]')) return;
      e.preventDefault();
      input.current?.focus({ preventScroll: true });
      input.current?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    };
    let timer = 0;
    const fromHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!/^q-[a-z]+-\d+$/.test(id) || !document.getElementById(id)) return;
      setOpen(prev => new Set(prev).add(id));
      clearTimeout(timer);
      timer = window.setTimeout(() => scrollToSection(id, () => -(innerWidth <= 1024 ? 150 : 110)), 350);
    };
    fromHash();
    addEventListener('keydown', onKey);
    addEventListener('hashchange', fromHash);
    return () => { off(); removeEventListener('keydown', onKey); removeEventListener('hashchange', fromHash); clearTimeout(timer); };
  }, []);

  // on the chip bar (narrow screens) keep the current category in view
  useEffect(() => {
    const a = document.querySelector<HTMLElement>(`a[href="#faq-${active}"]`), bar = a?.closest('nav');
    if (a && bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: a.offsetLeft - 16, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  // groups come and go with the search: re-run the scroll-spy
  useEffect(() => { dispatchEvent(new Event('scroll')); }, [q]);

  const toggle = (id: string) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
      if (location.hash === `#${id}`) history.replaceState(history.state, '', location.pathname + location.search);
    } else {
      next.add(id);
      history.replaceState(history.state, '', `#${id}`);
    }
    return next;
  });
  const jump = (key: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection(`faq-${key}`, () => -(innerWidth <= 1024 ? 140 : 100));
  };

  // title: "Investor Guide – Frequently Asked Questions" splits on the dash; otherwise the last word is line two
  const dashed = (data.title || '').split(/\s+[–—-]\s+/);
  const words = (s: string) => (language === 'zh' ? [s] : s.split(/\s+/));
  const head = t('faq.title');
  const lines: [string[], string[]] = dashed.length === 2 && language !== 'mn'
    ? [words(dashed[0]), words(dashed[1])]
    : [words(head).slice(0, -1), words(head).slice(-1)];
  const sep = language === 'zh' ? '' : ' ';
  const wordSpans = (line: string[], offset: number) => line.map((w, k) => (
    <Fragment key={`${language}-${offset + k}`}>{k > 0 && sep}<span className={p.w}><span className={p.wi} style={cssVars({ '--i': offset + k })}>{w}</span></span></Fragment>
  ));

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: all.map(it => ({ '@type': 'Question', name: it.question, acceptedAnswer: { '@type': 'Answer', text: it.answer } })),
  };

  return (
    <RefPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section ref={hero} className={f.hero} aria-labelledby="faq-title">
        <div className={f['hero-bg']} />
        <div className={`${f.bub} ${f.b1}`} aria-hidden="true"><div className={f.card}>?</div></div>
        <div className={`${f.bub} ${f.b2}`} aria-hidden="true"><div className={f.card}><Ic size={30}><path d="M4.5 9.2 7.6 12.2 13.5 6" /></Ic></div></div>
        <div className={`${f.bub} ${f.b3}`} aria-hidden="true"><div className={f.card}><i /><i /><i /></div></div>

        <div className={f['hero-in']}>
          <h1 id="faq-title" className={`${p.title} ${f.title}`} aria-label={[...lines[0], ...lines[1]].join(sep)}>
            {lines[0].length > 0 && <span className={p.ln1} aria-hidden="true">{wordSpans(lines[0], 0)}</span>}
            <span className={p.ln2} aria-hidden="true">
              <span className={p.hl}>{wordSpans(lines[1], lines[0].length)}<svg className={p.ul} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength={1} d="M3 9 C 50 3, 120 2, 197 7" /></svg></span>
            </span>
          </h1>

          <div className={f.search} role="search">
            <Ic size={22}><circle cx="8" cy="8" r="5.2" /><path d="m12 12 3.5 3.5" /></Ic>
            <input ref={input} type="search" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setQ(''); }}
              placeholder={tr('Асуултаа бичээд хайх…', 'Search the questions…', '搜索问题…')} aria-label={tr('Асуулт хайх', 'Search questions', '搜索问题')}
              aria-controls="faq-list" autoComplete="off" enterKeyHint="search" />
            {q
              ? <button type="button" className={f.clear} onClick={() => { setQ(''); input.current?.focus(); }} aria-label={tr('Хайлтыг цэвэрлэх', 'Clear search', '清除搜索')}><Ic size={16}><path d="m4.5 4.5 9 9M13.5 4.5l-9 9" /></Ic></button>
              : <kbd className={f.kbd} aria-hidden="true">/</kbd>}
          </div>
          <p className={f.meta} aria-live="polite">
            {terms.length
              ? <><b>{visible.length}</b> {tr('илэрц', visible.length === 1 ? 'result' : 'results', '个结果')}</>
              : <><b>{all.length}</b> {tr('асуулт', 'questions', '个问题')} · <b>{groups.length}</b> {tr('ангилал', 'categories', '个分类')}</>}
          </p>
        </div>
      </section>

      <section className={f.body} aria-label={t('navbar.faqs')}>
        <div className={f.wrap}>
          <aside className={f.rail}>
            <span className={`${p.kick} ${f['rail-k']}`}><i></i>{tr('Ангилал', 'Categories', '分类')}</span>
            <nav aria-label={tr('Ангилал', 'Categories', '分类')}>
              <ul>
                {groups.map(g => {
                  const c = g.items.filter(it => shown.has(it.id)).length;
                  return (
                    <li key={g.key}>
                      <a href={`#faq-${g.key}`} onClick={jump(g.key)} className={`${f.cat}${c ? '' : ` ${f.none}`}`} aria-current={active === g.key ? 'true' : undefined}>
                        <span className={f.ci}><Ic size={17}>{g.icon}</Ic></span>{g.label}<em>{c}</em>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <button type="button" className={f.all} onClick={() => setOpen(allOpen ? new Set() : new Set(visible.map(it => it.id)))} disabled={!visible.length} aria-controls="faq-list">
              <span className={`${f['all-ic']}${allOpen ? ` ${f.on}` : ''}`} aria-hidden="true"><i /><i /></span>
              {allOpen ? tr('Бүгдийг хураах', 'Collapse all', '全部收起') : tr('Бүгдийг дэлгэх', 'Expand all', '全部展开')}
            </button>
          </aside>

          <div className={f.groups} id="faq-list">
            {groups.map(g => {
              const c = g.items.filter(it => shown.has(it.id)).length;
              return (
                <section key={g.key} id={`faq-${g.key}`} data-faq-group={g.key} data-io className={f.group} hidden={!c} aria-labelledby={`faq-${g.key}-h`}>
                  <header className={f.gh}>
                    <span className={f.gi}><Ic size={24}>{g.icon}</Ic></span>
                    <div>
                      <h2 id={`faq-${g.key}-h`}>{g.title}</h2>
                      <span>{c} {tr('асуулт', c === 1 ? 'question' : 'questions', '个问题')}</span>
                    </div>
                  </header>
                  <ol className={f.items}>
                    {g.items.map((it, k) => {
                      const on = open.has(it.id);
                      return (
                        <li key={it.id} id={it.id} className={`${f.item}${on ? ` ${f.open}` : ''}`} hidden={!shown.has(it.id)} style={cssVars({ '--k': k })}>
                          <h3 className={f.q}>
                            <button type="button" id={`${it.id}-b`} aria-expanded={on} aria-controls={`${it.id}-a`} onClick={() => toggle(it.id)}>
                              <span className={f.n}>{String(it.n).padStart(2, '0')}</span>
                              <span className={f.qt}>{mark(it.question, terms)}</span>
                              <span className={f.pm} aria-hidden="true"><i /><i /></span>
                            </button>
                          </h3>
                          <div className={f.ans} id={`${it.id}-a`} role="region" aria-labelledby={`${it.id}-b`} {...({ inert: !on } as Record<string, boolean>)}>
                            <div className={f['ans-c']}>
                              <div className={f['ans-in']}><Answer text={it.answer} terms={terms} /></div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}

            {terms.length > 0 && !visible.length && (
              <div className={f.empty} role="status">
                <span className={f['empty-ic']}><Ic size={26}><circle cx="8" cy="8" r="5.2" /><path d="m12 12 3.5 3.5M6.2 6.2l3.6 3.6M9.8 6.2 6.2 9.8" /></Ic></span>
                <h3>{tr('Илэрц олдсонгүй', 'No results found', '未找到结果')}</h3>
                <p>{tr('Өөр түлхүүр үгээр хайж үзнэ үү.', 'Try a different keyword.', '请尝试其他关键词。')}</p>
                <button type="button" onClick={() => { setQ(''); input.current?.focus(); }}>{tr('Хайлтыг цэвэрлэх', 'Clear search', '清除搜索')}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </RefPage>
  );
};

export default FAQ;

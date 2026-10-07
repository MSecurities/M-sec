'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { prefersReducedMotion } from '../../components/home/shared';
import { Bento, Contact, Cta, Hero, RefPage, SecHead, VzTeam, cssVars, jumpTo, useTr } from '../../components/services/parts';
import { TRADE_URL } from '../../../lib/links';
import b from './broker.module.css';


const Ic = ({ size = 20, children }: { size?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const USER = <><circle cx="9" cy="6" r="3" /><path d="M3 16c.5-3.2 2.9-5 6-5s5.5 1.8 6 5" /></>;
const ORG = <><rect x="3" y="2.5" width="12" height="13.5" rx="1.5" /><path d="M6.5 6h1.5M10 6h1.5M6.5 9h1.5M10 9h1.5M7.5 16v-3h3v3" /></>;
const GLOBE = <><circle cx="9" cy="9" r="7" /><path d="M2 9h14M9 2c2.2 2.4 2.2 11.6 0 14C6.8 13.6 6.8 4.4 9 2" /></>;

/* ---------- hero: live candle strip ---------- */
type Candle = { id: number; o: number; h: number; l: number; c: number; v: number };
const STEP = 22, BODY = 12, KEEP = 160;
const nextCandle = (id: number, o: number): Candle => {
  const c = o + (Math.random() - .46) * 2.2;
  return { id, o, c, h: Math.max(o, c) + Math.random() * 1.2, l: Math.min(o, c) - Math.random() * 1.2, v: .3 + Math.random() * .7 };
};
// A market that keeps trading along the bottom of the hero: the last candle ticks every 0.7s, a new
// one opens every ~5s and the strip slides left; the gold line is an 8-period average. Paused while
// off screen or the tab is hidden; still with reduced motion.
function LiveCandles() {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [data, setData] = useState<Candle[]>([]);
  const introLast = useRef(-1);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const series: Candle[] = [];
    let o = 50;
    for (let i = 0; i < KEEP; i++) { const cd = nextCandle(i, o); series.push(cd); o = cd.c; }
    introLast.current = KEEP - 1;
    setData(series);
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);

    if (prefersReducedMotion()) return () => ro.disconnect();
    let visible = true, ticks = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    const id = window.setInterval(() => {
      if (!visible || document.hidden) return;
      ticks++;
      setData(d => {
        const last = d[d.length - 1];
        if (ticks % 7 === 0) return [...d.slice(1 - KEEP), { id: last.id + 1, o: last.c, h: last.c, l: last.c, c: last.c, v: .2 }];
        const c = last.c + (Math.random() - .47) * .9;
        return [...d.slice(0, -1), { ...last, c, h: Math.max(last.h, c), l: Math.min(last.l, c), v: Math.min(1, last.v + Math.random() * .12) }];
      });
    }, 700);
    return () => { ro.disconnect(); io.disconnect(); clearInterval(id); };
  }, []);

  const view = useMemo(() => {
    if (!size || !data.length) return null;
    const { w, h } = size;
    const shown = data.slice(-(Math.ceil(w / STEP) + 3));
    const lo = Math.min(...shown.map(x => x.l)), hi = Math.max(...shown.map(x => x.h));
    const top = Math.max(34, h * .3), volH = h * .2, plotH = h - top - volH - 10;
    const y = (v: number) => top + ((hi - v) / (hi - lo || 1)) * plotH;
    const vmax = Math.max(...shown.map(x => x.v));
    const last = data[data.length - 1];
    const right = Math.max(84, w * .12);
    const tx = w - right - (last.id + 1) * STEP;
    const ma = shown.map(cd => {
      const i = data.indexOf(cd), win = data.slice(Math.max(0, i - 7), i + 1);
      return `${cd.id * STEP + BODY / 2},${y(win.reduce((s, x) => s + x.c, 0) / win.length).toFixed(1)}`;
    }).join(' ');
    const dotX = w - right - STEP + BODY / 2;
    return { w, h, shown, y, volH, vmax, last, tx, ma, dotX, up: last.c >= last.o };
  }, [size, data]);

  return (
    <div ref={box} className={`${b.mkt}${view && !view.up ? ` ${b.dn}` : ''}`} aria-hidden="true">
      {view && (
        <>
          <svg viewBox={`0 0 ${view.w} ${view.h}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="brk-cU" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'rgba(var(--dot),.7)' }} /><stop offset="1" style={{ stopColor: 'rgba(var(--dot),.25)' }} /></linearGradient>
              <linearGradient id="brk-cD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: 'rgba(var(--dot),.12)' }} /><stop offset="1" style={{ stopColor: 'rgba(var(--dot),.02)' }} /></linearGradient>
            </defs>
            <g className={b.strip} style={{ transform: `translateX(${view.tx}px)` }}>
              {view.shown.map((cd, k) => {
                const yo = view.y(cd.o), yc = view.y(cd.c), yh = view.y(cd.h), yl = view.y(cd.l), vh = (cd.v / view.vmax) * view.volH * .9;
                const intro = cd.id <= introLast.current;
                const cls = [b.c, cd.c >= cd.o ? b.u : b.d, cd.id === view.last.id ? b.live : '', intro ? b.grow : b.pop].join(' ');
                return (
                  <g key={cd.id} transform={`translate(${cd.id * STEP} 0)`}>
                    <g className={cls} style={intro ? cssVars({ '--dl': `${k * 22 + 300}ms` }) : undefined}>
                      <rect className={b.v} x="0" width={BODY} y={view.h - vh} height={vh} rx="2" />
                      <rect className={b.w} x={BODY / 2 - .6} width="1.2" y={yh} height={Math.max(1, yl - yh)} />
                      <rect className={b.b} x="0" width={BODY} y={Math.min(yo, yc)} height={Math.max(2, Math.abs(yo - yc))} rx="2" />
                    </g>
                  </g>
                );
              })}
              <polyline className={b.ma} pathLength={1} points={view.ma} />
            </g>
          </svg>
          <span className={b.lvl} style={{ top: view.y(view.last.c), width: view.dotX + 10 }} />
          <span className={b.dot} style={{ left: view.dotX, top: view.y(view.last.c) }} />
          <span className={`${b.tag}${view.up ? '' : ` ${b.dn}`}`} style={{ left: view.dotX + 18, top: view.y(view.last.c) }}><i /></span>
        </>
      )}
    </div>
  );
}

/* ---------- bento visuals ---------- */
const VzTiles = () => (
  <div className={b.tiles} aria-hidden="true">
    {Array.from({ length: 48 }, (_, i) => <i key={i} style={cssVars({ '--d': (i % 12) + Math.floor(i / 12) * 3 })} />)}
  </div>
);
const VzShield = () => (
  <svg className={b.shield} viewBox="0 0 220 160" aria-hidden="true">
    <circle className={b.rg} cx="110" cy="80" r="58" />
    <circle className={`${b.rg} ${b.r2}`} cx="110" cy="80" r="58" />
    <circle className={`${b.rg} ${b.r3}`} cx="110" cy="80" r="58" />
    <path className={b.sh} d="M110 28 150 42v36c0 26-17 44-40 54-23-10-40-28-40-54V42Z" />
    <path className={b.ck} pathLength={1} d="M93 80 106 93 129 67" />
  </svg>
);
// Over-the-counter: an investor and an institution deal directly inside a closed (locked) circle,
// asset and payment passing each other along the line between them
const VzOtc = () => (
  <svg className={b.otc} viewBox="0 0 320 200" aria-hidden="true">
    <rect className={b.room} x="14" y="34" width="292" height="132" rx="30" />
    <path className={b.wire} d="M92 100H228" />
    <circle className={`${b.tok} ${b.t1}`} cx="92" cy="100" r="6" />
    <circle className={`${b.tok} ${b.t2}`} cx="228" cy="100" r="6" />
    <g className={b.node}>
      <circle cx="62" cy="100" r="30" />
      <path d="M62 92a7 7 0 1 0 0 .1M49 116c1.6-7 6.6-11 13-11s11.4 4 13 11" />
    </g>
    <g className={`${b.node} ${b.n2}`}>
      <circle cx="258" cy="100" r="30" />
      <path d="M246 116V91l12-7 12 7v25M243 116h30M252 116v-9h12v9M251 97h4M261 97h4" />
    </g>
    <g className={b.lock}>
      <rect x="143" y="78" width="34" height="44" rx="10" />
      <path d="M152 99v-5a8 8 0 0 1 16 0v5M151 99h18v14h-18zM160 104v4" />
    </g>
  </svg>
);

/* ---------- required documents ---------- */
type DocGroup = { key: string; icon: ReactNode; title: string; items: string[] };
// "Name (copies / note)" → the note becomes a tag under the name
const splitNote = (s: string): [string, string] => {
  const t = s.trim(), i = t.search(/[（(]/);
  return i > 0 && /[）)]$/.test(t) ? [t.slice(0, i).trim(), t.slice(i + 1, -1).trim()] : [t, ''];
};
// Tabs per client type; the list can be ticked off while preparing (kept in memory only). The front
// sheet of the paper stack shows the chosen type and swaps on change; a gold stamp lands once every
// document of that type is ticked.
function Docs({ groups, kick, title }: { groups: DocGroup[]; kick: string; title: string }) {
  const { tr } = useTr();
  const [sel, setSel] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [swaps, setSwaps] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ind = useRef<HTMLSpanElement>(null);
  const sig = groups.map(g => g.title).join('|');

  useEffect(() => {
    const place = () => {
      const t = tabs.current[sel], i = ind.current;
      if (!t || !i) return;
      i.style.left = t.offsetLeft + 'px'; i.style.width = t.offsetWidth + 'px';
      const bar = t.parentElement; // keep the chosen tab in view when the bar scrolls
      if (bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
    };
    place();
    document.fonts?.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [sel, sig]);

  const choose = (i: number) => { if (i !== sel) { setSel(i); setSwaps(n => n + 1); } };
  const onKey = (e: KeyboardEvent) => {
    const n = groups.length;
    const next = { ArrowRight: sel + 1, ArrowDown: sel + 1, ArrowLeft: sel - 1 + n, ArrowUp: sel - 1 + n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    choose(next % n); tabs.current[next % n]?.focus();
  };

  const g = groups[sel];
  const count = g.items.filter((_, i) => done[`${g.key}:${i}`]).length;
  const complete = count === g.items.length;

  return (
    <section id="documents" data-io className={`${b.docs}${complete ? ` ${b.done}` : ''}`} aria-labelledby="docs-title">
      <SecHead kick={kick} title={title} titleId="docs-title" />
      <div className={b['docs-wrap']}>
        <div className={b.tabs} role="tablist" aria-label={title} onKeyDown={onKey}>
          <span ref={ind} className={b['tab-ind']} aria-hidden="true" />
          {groups.map((x, i) => (
            <button key={x.key} ref={el => { tabs.current[i] = el; }} type="button" role="tab" id={`docs-tab-${i}`} className={b.tab}
              aria-selected={i === sel} aria-controls="docs-panel" tabIndex={i === sel ? 0 : -1} onClick={() => choose(i)}>
              <Ic size={17}>{x.icon}</Ic>{x.title}<em>{x.items.length}</em>
            </button>
          ))}
        </div>
        <div className={b['docs-body']}>
          <div className={b.panels} id="docs-panel" role="tabpanel" aria-labelledby={`docs-tab-${sel}`}>
            <div className={b['pd-head']}>
              <h3>{g.title}</h3>
              <span className={b.prog}>
                <span><b>{count}</b> / {g.items.length} {tr('бэлэн', 'ready', '已备好')}</span>
                <span className={b.pb} style={cssVars({ '--pv': `${(count / g.items.length) * 100}%` })}><i /></span>
              </span>
            </div>
            <ol className={b.list} key={g.key}>
              {g.items.map((item, i) => {
                const k = `${g.key}:${i}`, [name, note] = splitNote(item);
                return (
                  <li key={k} style={cssVars({ '--j': i })}>
                    <label className={b.item}>
                      <input type="checkbox" checked={!!done[k]} onChange={() => setDone(d => ({ ...d, [k]: !d[k] }))} />
                      <span className={b.cb} aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14"><path d="m3 7.4 2.6 2.6L11 4.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                      <span className={b.it}><b>{name}</b>{note && <small>{note}</small>}</span>
                    </label>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className={b.stack} aria-hidden="true">
            <div className={`${b.sheet} ${b.s3}`} />
            <div className={`${b.sheet} ${b.s2}`} />
            <div key={swaps} className={`${b.sheet} ${b.s1}${swaps ? ` ${b.swap}` : ''}`}>
              <span className={b['s-ic']}><Ic size={22}>{g.icon}</Ic></span>
              <span className={b['s-t']}>{g.title}</span>
              <i /><i /><i /><i />
              <span className={b.stamp}><svg width="28" height="28" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 9.2 7.6 12.2 13.5 6" /></svg></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BrokerService = () => {
  const { t, tr, language } = useTr();

  const advantages = [
    { viz: <VzTiles />, icon: <Ic><rect x="2.5" y="2.5" width="5" height="5" rx="1" /><rect x="10.5" y="2.5" width="5" height="5" rx="1" /><rect x="2.5" y="10.5" width="5" height="5" rx="1" /><rect x="10.5" y="10.5" width="5" height="5" rx="1" /></Ic>,
      title: tr('МХБ-ийн бүрэн хамрах хүрээ', 'Full MSE Coverage', '全面覆盖交易所'), desc: tr('Монголын Хөрөнгийн Биржид бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа.', 'Trade stocks, bonds, and other securities listed on the Mongolian Stock Exchange.', '交易蒙古证券交易所上市的股票、债券及其他证券。') },
    { viz: <VzTeam />, icon: <Ic><circle cx="6.5" cy="6" r="2.6" /><path d="M1.8 15c.4-2.8 2.3-4.4 4.7-4.4s4.3 1.6 4.7 4.4" /><path d="M12 3.6a2.5 2.5 0 0 1 0 4.8M13.4 10.8c1.5.5 2.5 1.9 2.8 4.2" /></Ic>,
      title: tr('Мэргэжлийн баг', 'Expert Team', '专业团队'), desc: tr('Санхүүгийн байдлын шинжилгээ, эрсдэлийн үнэлгээ хийж, тохирсон шийдэл санал болгоно.', 'Financial analysis and risk assessment to recommend the right solution for you.', '进行财务分析和风险评估，提供合适的方案。') },
    { viz: <VzShield />, icon: <Ic><path d="M9 1.5 14.5 3.5V8c0 3-2.5 5.5-5.5 6.5C6 13.5 3.5 11 3.5 8V3.5Z" /><path d="m6.6 8.1 1.7 1.6 3.2-3.3" /></Ic>,
      title: tr('Найдвартай, зохицуулалттай', 'Safe & Regulated', '安全合规'), desc: tr('СЗХ-ны хяналт дор, олон улсын стандартад нийцсэн брокерийн үйлчилгээ санал болгоно.', 'We offer brokerage services under FRC supervision, aligned with international standards.', '在金融监管委员会监管下，提供符合国际标准的经纪服务。') },
    { viz: <VzOtc />, icon: <Ic><path d="M3 6.5h11.5L11.5 3.5M15 11.5H3.5l3 3" /></Ic>,
      title: tr('Биржийн бус зах зээлийн бүтээгдэхүүн, үйлчилгээ', 'Over-the-Counter Products & Services', '场外市场产品与服务'),
      desc: tr('Over The Counter market-аас хаалттай, мэргэжлийн хөрөнгө оруулалтыг хийх боломж.', 'Make closed, professional investments on the Over-The-Counter market.', '在场外交易市场（OTC）进行封闭式、专业化的投资。') },
  ];

  const groups: DocGroup[] = ([['citizen', USER], ['legalEntity', ORG], ['foreignCitizen', GLOBE]] as const).map(([key, icon]) => ({
    key, icon,
    title: t(`services.broker.requiredDocs.${key}.title`),
    items: t(`services.broker.requiredDocs.${key}.items`) as unknown as string[],
  }));

  const title = t('services.broker.title');
  const words = title.split(' ');

  return (
    <RefPage>
      <Hero
        titleId="bh-title"
        lines={language === 'zh' ? [['证券经纪'], ['服务']] : [words.slice(0, -1), words.slice(-1)]}
        underline
        sub={t('services.broker.description')}
        actions={<>
          <Cta href={TRADE_URL} primary external magnetic>{tr('Данс нээх', 'Open Account', '开立账户')}</Cta>
          <Cta href="#contact" onClick={jumpTo('contact')}>{tr('Брокертой холбогдох', 'Contact Broker', '联系经纪人')}</Cta>
        </>}
        art={<LiveCandles />}
      />

      <Bento id="advantages" kick={tr('Бидний давуу тал', 'Our Advantages', '我们的优势')} title={tr('Яагаад М Секьюритис?', 'Why M Securities?', '为什么选择 M Securities?')} items={advantages} />

      <Docs groups={groups} kick={tr('Данс нээлгэх', 'Open an Account', '开户')} title={t('services.broker.requiredDocs.title')} />

      <Contact
        subject={tr('Брокерийн үйлчилгээ - Холбоо барих хүсэлт', 'Broker Service - Contact Request', '经纪服务 - 联系请求')}
        cta={{ href: TRADE_URL, label: tr('Данс нээх', 'Open Account', '开立账户') }}
      />
    </RefPage>
  );
};

export default BrokerService;

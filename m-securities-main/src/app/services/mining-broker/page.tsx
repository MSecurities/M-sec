'use client';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { miningArt } from '../../components/shared/miningArt';
import { clamp, onScrollFrame, prefersReducedMotion } from '../../components/home/shared';
import { Bento, Contact, Cta, Hero, RefPage, SecHead, VzTeam, cssVars, jumpTo, useTr } from '../../components/services/parts';
import m from './mining.module.css';

const PLATFORM_URL = 'https://mining.msecurities.mn/dashboard/app';
const ART = miningArt(m.spark);

const Ic = ({ children }: { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

/* ---------- hero art ---------- */
const R0 = 'M0 250 L120 180 L210 225 L330 120 L450 210 L560 150 L690 230 L800 110 L930 205 L1040 160 L1160 225 L1280 140 L1440 210';
const R1 = 'M0 290 L150 240 L270 275 L400 210 L540 270 L680 225 L820 285 L960 230 L1100 280 L1240 235 L1440 280';
const Mountains = () => (
  <svg className={m['mh-mtn']} viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <path className={m.rg} pathLength={1} d={R0} />
    <path className={`${m.rf} ${m.f0}`} d={`${R0} V360 H0Z`} />
    <path className={`${m.rg} ${m.r1}`} pathLength={1} d={R1} />
    <path className={`${m.rf} ${m.f1}`} d={`${R1} V360 H0Z`} />
    <path className={m.vein} pathLength={1} d="M40 340 C 200 300, 300 330, 470 296 S 740 316, 880 290 S 1140 306, 1400 268" />
    {[[470, 296], [880, 290], [1400, 268]].map(([cx, cy], o) => <circle key={cx} className={m.ore} cx={cx} cy={cy} r="4" style={cssVars({ '--o': o })} />)}
  </svg>
);

/* ---------- bento visuals ---------- */
const TICKS = [[38, 120, 48, 120], [41.5, 97.8, 51, 100.8], [51.8, 77.7, 59.8, 83.6], [67.7, 61.8, 73.6, 69.8], [87.8, 51.5, 90.8, 61], [110, 48, 110, 58],
  [132.2, 51.5, 129.2, 61], [152.3, 61.8, 146.4, 69.8], [168.2, 77.7, 160.2, 83.6], [178.5, 97.8, 169, 100.8], [182, 120, 172, 120]];
const VzGauge = () => (
  <svg className={m.gauge} viewBox="0 0 220 140" aria-hidden="true">
    <defs><linearGradient id="svc-gg" x1="0" x2="1"><stop offset="0" style={{ stopColor: 'var(--teal)' }} /><stop offset="1" style={{ stopColor: 'rgba(var(--dot),.15)' }} /></linearGradient></defs>
    <path className={m.gt} d="M30 120 A80 80 0 0 1 190 120" />
    <path className={m.ga} pathLength={1} d="M30 120 A80 80 0 0 1 190 120" />
    {TICKS.map(([x1, y1, x2, y2]) => <line key={`${x1}-${y1}`} className={m.tk} x1={x1} y1={y1} x2={x2} y2={y2} />)}
    <g className={m.nd}><line x1="110" y1="120" x2="110" y2="58" /><circle cx="110" cy="120" r="7" /></g>
    <text x="110" y="104" textAnchor="middle" className={m.pct}>%</text>
  </svg>
);
const VzTerm = () => (
  <div className={m.term} aria-hidden="true">
    <div className={m['tm-bar']}><i></i><i></i></div>
    {[72, 48, 86, 60, 38].map((w, r) => <div key={r} className={m['tm-row']} style={cssVars({ '--r': r })}><b style={cssVars({ '--w': `${w}%` })}></b><span></span></div>)}
    <svg viewBox="0 0 200 40"><path pathLength={1} d="M0 32 L25 26 L50 29 L75 18 L100 22 L125 12 L150 16 L175 6 L200 9" /></svg>
  </div>
);
const BANK = 'M2 6.5 9 2.5l7 4M3 6.5h12M4.5 8v5M7.5 8v5M10.5 8v5M13.5 8v5M2.5 15.5h13';
const VzBank = () => (
  <svg className={m.bank} viewBox="0 0 240 140" aria-hidden="true">
    <rect className={m.nb} x="20" y="44" width="62" height="52" rx="14" />
    <g transform="translate(37 55)" className={m.bic}><path stroke="currentColor" fill="none" strokeWidth="1.5" d={BANK} /></g>
    <rect className={m.nb} x="158" y="44" width="62" height="52" rx="14" />
    <g transform="translate(175 55)" className={m.bic}>
      <path stroke="currentColor" fill="none" strokeWidth="1.5" d="M10.5 1.5H5a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 5 16.5h8a1.5 1.5 0 0 0 1.5-1.5V5.5Z" />
      <path stroke="currentColor" fill="none" strokeWidth="1.5" d="M10.5 1.5v4h4M6.5 10h5M6.5 13h3" />
    </g>
    <path className={m.fl} d="M88 62 H152" /><path className={m.fl} d="M152 80 H88" />
    <circle className={`${m.pk} ${m.p1}`} r="4" /><circle className={`${m.pk} ${m.p2}`} r="4" />
  </svg>
);

/* ---------- roadmap ---------- */
type Phase = { state: 'past' | 'now' | 'next'; label: string; date: string; items: string[] };
// The rail fills with scroll up to "today", placed from the real date inside the transition period
// (2022-01-01 → 2027-04-01); the countdown to full transition hides once that date has passed.
function Roadmap({ phases, kick, title, sub }: { phases: Phase[]; kick: string; title: string; sub: string }) {
  const { tr } = useTr();
  const ref = useRef<HTMLElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const sec = ref.current, tl = tlRef.current;
    if (!sec || !tl) return;
    const now = Date.now(), s0 = Date.UTC(2022, 0, 1), s1 = Date.UTC(2027, 3, 1);
    const pos = now >= s1 ? 2 / 3 + .02 : 1 / 3 + clamp((now - s0) / (s1 - s0)) / 3;
    setDays(Math.ceil((s1 - now) / 864e5));
    sec.style.setProperty('--tp', String(pos));
    if (prefersReducedMotion()) { sec.style.setProperty('--tf', String(pos)); sec.style.setProperty('--to', '1'); return; }
    return onScrollFrame(() => {
      const vh = innerHeight, q = clamp((vh * .85 - tl.getBoundingClientRect().top) / (vh * .45));
      sec.style.setProperty('--tf', String(q * pos)); sec.style.setProperty('--to', q > .95 ? '1' : '0');
    });
  }, []);

  return (
    <section ref={ref} id="roadmap" data-io className={m.road} aria-labelledby="road-title">
      <SecHead kick={kick} title={title} titleId="road-title" sub={sub} />
      <div ref={tlRef} className={m.tl}>
        <div className={m['tl-rail']}>
          <span className={m['tl-fill']} />
          <span className={m['tl-today']}>
            <b>{tr('Өнөөдөр', 'Today', '今天')}</b>
            <em>{days > 0 ? tr(`Бүрэн шилжилт хүртэл ${days} хоног`, `${days} days until full transition`, `距全面转型还有 ${days} 天`) : ''}</em>
          </span>
        </div>
        <div className={m['tl-phases']}>
          {phases.map((ph, i) => (
            <article key={ph.state} className={`${m.phz} ${m[ph.state]}`} style={cssVars({ '--p': i })}>
              <span className={m['phz-node']} />
              <span className={m['phz-k']}>{ph.label}</span>
              <span className={m['phz-d']}>{ph.date}</span>
              <ul>{ph.items.map(it => <li key={it}>{it}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- fees ---------- */
type Who = 'all' | 'seller' | 'buyer';
type FeeRow = { who: 'seller' | 'buyer' | 'both'; party: string; type: string; amount: string; hl: boolean };
// "All / Seller / Buyer" switch: the chosen side's rows light up, the other side's dim
function Fees({ rows, cols, choices, kick, title, note }: { rows: FeeRow[]; cols: string[]; choices: [Who, string][]; kick: string; title: string; note: string }) {
  const [w, setW] = useState<Who>('all');
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const ind = useRef<HTMLSpanElement>(null);
  const sel = choices.findIndex(([k]) => k === w);
  const sig = choices.map(([, l]) => l).join('|');

  useEffect(() => {
    const place = () => {
      const b = btns.current[sel], i = ind.current;
      if (!b || !i) return;
      i.style.left = b.offsetLeft + 'px'; i.style.width = b.offsetWidth + 'px';
    };
    place();
    document.fonts?.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, [sel, sig]);

  const onKey = (e: KeyboardEvent) => {
    const n = choices.length;
    const next = { ArrowRight: sel + 1, ArrowDown: sel + 1, ArrowLeft: sel - 1 + n, ArrowUp: sel - 1 + n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setW(choices[next % n][0]); btns.current[next % n]?.focus();
  };

  return (
    <section id="fees" data-io className={m.fee} aria-labelledby="fee-title">
      <SecHead kick={kick} title={title} titleId="fee-title" />
      <div className={m['fee-wrap']}>
        <div className={m.seg} role="radiogroup" aria-label={cols[0]} onKeyDown={onKey}>
          <span ref={ind} className={m['seg-ind']} aria-hidden="true" />
          {choices.map(([k, label], i) => (
            <button key={k} ref={el => { btns.current[i] = el; }} type="button" role="radio" aria-checked={k === w} tabIndex={k === w ? 0 : -1} onClick={() => setW(k)}>{label}</button>
          ))}
        </div>
        <div className={m.ftable} role="table" aria-label={title} data-w={w}>
          <div className={`${m.tr} ${m.th}`} role="row">{cols.map(c => <span key={c} role="columnheader">{c}</span>)}</div>
          {rows.map(r => (
            <div key={r.who} className={m.tr} data-who={r.who} role="row">
              <span role="cell" className={m.who}>{r.party}</span>
              <span role="cell">{r.type}</span>
              <span role="cell" className={`${m.amt}${r.hl ? ` ${m.hl}` : ''}`}>{r.amount}</span>
            </div>
          ))}
        </div>
        <p className={m.fnote}>* {note}</p>
      </div>
    </section>
  );
}

const GoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const MiningBrokerService = () => {
  const { tr, language } = useTr();
  const L = <T,>(mn: T, en: T, zh: T) => (language === 'mn' ? mn : language === 'zh' ? zh : en);

  const advantages = [
    { viz: <VzGauge />, icon: <Ic><rect x="1.5" y="4.5" width="15" height="9" rx="1.5" /><circle cx="9" cy="9" r="2" /><path d="M4 7v4M14 7v4" /></Ic>,
      title: tr('Хамгийн бага шимтгэл', 'Lowest Fees', '最低手续费'), desc: tr('Зах зээл дээрх хамгийн өрсөлдөхүйц шимтгэлийн хувь хэмжээ.', 'Most competitive fee rates in the market.', '市场上最具竞争力的费率。') },
    { viz: <VzTerm />, icon: <Ic><rect x="4.5" y="4.5" width="9" height="9" rx="1.5" /><rect x="7" y="7" width="4" height="4" rx=".5" /><path d="M7 2v2.5M11 2v2.5M7 13.5V16M11 13.5V16M2 7h2.5M2 11h2.5M13.5 7H16M13.5 11H16" /></Ic>,
      title: tr('Цогц платформ', 'Comprehensive Platform', '综合平台'), desc: tr('Өөрсдийн хөгжүүлсэн арилжааны платформ — хурдан, найдвартай.', 'In-house trading platform — fast and reliable.', '自主研发的交易平台，快速可靠。') },
    { viz: <VzBank />, icon: <Ic><path d={BANK} /></Ic>,
      title: tr('Банкны хамтын ажиллагаа', 'Bank Partnership', '银行合作'), desc: tr('Аккредитив болон бусад төлбөрийн шийдлийг банктай хамтран гүйцэтгэнэ.', 'Letter of credit and payment solutions with banking partners.', '与银行合作提供信用证及其他支付解决方案。') },
    { viz: <VzTeam />, icon: <Ic><circle cx="6.5" cy="6" r="2.6" /><path d="M1.8 15c.4-2.8 2.3-4.4 4.7-4.4s4.3 1.6 4.7 4.4" /><path d="M12 3.6a2.5 2.5 0 0 1 0 4.8M13.4 10.8c1.5.5 2.5 1.9 2.8 4.2" /></Ic>,
      title: tr('Туршлагатай баг', 'Expert Team', '专业团队'), desc: tr('Арилжааны туршлагатай, ёс суртахуунтай мэргэжлийн хамт олон.', 'Experienced and ethical professional team.', '经验丰富、职业道德高尚的专业团队。') },
  ];

  // Before the exchange → the transition we are in now → broker-only trading
  const phases: Phase[] = [
    { state: 'past', label: tr('Өмнөх үе', 'Previous Era', '历史阶段'), date: tr('2021 хүртэл', 'Until 2021', '截至2021年'),
      items: L(['Бирж байхгүй', 'Шууд гүйлгээ', 'Үнэ ил тод бус'], ['No exchange', 'Direct transactions', 'Non-transparent pricing'], ['无交易所', '直接交易', '价格不透明']) },
    { state: 'now', label: tr('Шилжилтийн үе', 'Transition', '过渡期'), date: tr('2022 — 2027.03.31', '2022 — Mar 31, 2027', '2022年—2027年3月31日'),
      items: L(['МХБ эсвэл брокер — 2 сонголт', 'Хагас бирж төвтэй', 'Хууль эцэслэгдэж байна'], ['2 options: MSE or broker', 'Semi-centralized', 'Regulations finalizing'], ['MSE或经纪商 — 2种选择', '半集中化', '法规完善中']) },
    { state: 'next', label: tr('Бүрэн шилжилт', 'Full Transition', '全面转型'), date: tr('2027.04.01-ээс', 'From Apr 1, 2027', '2027年4月1日起'),
      items: L(['Зөвхөн брокероор', 'Бүрэн бирж төвтэй', 'МХБ үргэлжлүүлнэ'], ['Broker only', 'Fully centralized', 'MSE continues'], ['仅限经纪商', '全面集中化', 'MSE持续运营']) },
  ];

  const active = tr('Арилжаанд', 'Active', '交易中');
  const products = [
    { name: tr('Нүүрс', 'Coal', '煤炭') },
    { name: tr('Зэсийн баяжмал', 'Copper Concentrate', '铜精矿') },
    { name: tr('Төмрийн хүдэр', 'Iron Ore', '铁矿石') },
    { name: tr('Бусад эрдэс', 'Other Minerals', '其他矿产') },
  ];

  const byAgreement = tr('Гэрээгээр тохиролцоно.', 'Agreed by contract.', '以合同约定。');
  const seller = tr('Худалдагч', 'Seller', '卖方'), buyer = tr('Худалдан авагч', 'Buyer', '买方');
  const fees: FeeRow[] = [
    { who: 'seller', party: seller, type: tr('Захиалга бүртгэлийн хураамж', 'Order registration fee', '委托登记费'), amount: byAgreement, hl: true },
    { who: 'buyer', party: buyer, type: tr('Арилжааны дүнгийн хувь', 'Percentage of trade value', '交易金额百分比'), amount: byAgreement, hl: true },
    { who: 'both', party: tr('Талууд', 'Parties', '双方'), type: tr('МХБ-ийн биржийн хураамж', 'MSE exchange fee', '交易所费用'), amount: tr('МХБ-ийн журмын дагуу', 'Per MSE regulations', '按交易所规定'), hl: false },
  ];

  const laws = [
    { icon: <Ic><path d="M10.5 1.5H5a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 5 16.5h8a1.5 1.5 0 0 0 1.5-1.5V5.5Z" /><path d="M10.5 1.5v4h4M6.5 10h5M6.5 13h3" /></Ic>,
      src: 'УИХ · 2022.12.23', title: tr('Уул Уурхайн Бүтээгдэхүүний Биржийн тухай хууль', 'Mining Products Exchange Law', '矿产品交易所法'),
      desc: tr('Арилжааг шударга, нээлттэй зохион байгуулж, зах зээлийн бодит үнэ тогтох боломжийг бүрдүүлнэ.', 'Organize trading fairly and transparently, enabling real market price formation.', '以公平、透明的方式组织交易，确保市场价格真实形成。'),
      href: 'https://legalinfo.mn/mn/detail?lawId=16532653439101' },
    { icon: <Ic><path d="M9 2v14M5 16h8M3 5h12M5 5l-2.5 6a2.5 2.5 0 0 0 5 0Zm8 0-2.5 6a2.5 2.5 0 0 0 5 0Z" /></Ic>,
      src: 'СЗХ · 2024.03.29 · Тогтоол №133', title: tr('Брокерийн шимтгэлийн зохицуулалт', 'Broker Fee Regulation', '经纪手续费监管规定'),
      desc: tr('Шимтгэлийг хэт өндрөөр тогтоох, ялгавартай байдлаас сэргийлж арилжааны шударга нөхцлийг хангана.', 'Prevent excessive fees and discrimination, ensuring fair trading conditions.', '防止过高收费和差别对待，确保公平交易条件。'),
      href: 'https://www.frc.mn' },
    { icon: <Ic><rect x="4" y="3" width="10" height="13" rx="1.5" /><path d="M7 3V2h4v1M6.5 7.5h5M6.5 10.5h5M6.5 13.5h3" /></Ic>,
      src: 'МХБ · Арилжааны журам', title: tr('Уул Уурхайн Бүтээгдэхүүний арилжааны журам', 'Mining Products Trading Rules', '矿产品交易规则'),
      desc: tr('Захиалга бүртгэх, арилжаа зохион байгуулах, мэдээллийн ил тод байдлыг хангахтай холбоотой харилцаа.', 'Governs order registration, trade organization and information transparency.', '规范委托登记、交易组织及信息透明度相关事宜。'),
      href: 'https://mse.mn/uploads/images/2025-02-24-%D1%83%D1%83%D0%BB_%D1%83%D1%83%D1%80%D1%85%D0%B0%D0%B9%D0%BD_%D0%B0%D1%80%D0%B8%D0%BB%D0%B6%D0%B0%D0%B0%D0%BD%D1%8B_%D0%B6%D1%83%D1%80%D0%B0%D0%BC.pdf' },
  ];

  return (
    <RefPage>
      <Hero
        titleId="bh-title"
        lines={L([['Уул', 'уурхайн'], ['цахим', 'арилжаа']], [['Mining', 'Products'], ['Online', 'Trading']], [['矿产品'], ['在线交易']])}
        sub={tr('М Секьюритис ҮЦК нь СЗХ-ны уул уурхайн бүтээгдэхүүний биржийн арилжааны зуучлагч (брокер)-ийн үйл ажиллагаа эрхлэх тусгай зөвшөөрөлтэй, Монголын хөрөнгийн биржийн уул уурхайн бүтээгдэхүүний арилжааны брокерийн гишүүн байгууллага юм. Бид уул уурхайн бүтээгдэхүүний арилжаанд мэргэжлийн, найдвартай брокерийн үйлчилгээг үзүүлэн ажиллаж байна.',
          'M Securities is licensed by the Financial Regulatory Commission to act as an exchange trading intermediary (broker) for mining products, and is a broker member of the Mongolian Stock Exchange for mining product trading. We provide professional, reliable brokerage services in mining product trading.',
          'M Securities 证券公司持有金融监管委员会颁发的矿产品交易所交易中介（经纪商）业务许可，是蒙古证券交易所矿产品交易的经纪会员单位。我们为矿产品交易提供专业、可靠的经纪服务。')}
        actions={<>
          <Cta href={PLATFORM_URL} primary external magnetic>{tr('Арилжаа хийх', 'Start Trading', '开始交易')}</Cta>
          <Cta href="#contact" onClick={jumpTo('contact')}>{tr('Брокертой холбогдох', 'Contact Broker', '联系经纪人')}</Cta>
        </>}
        art={<Mountains />}
      />

      <Bento id="advantages" kick={tr('Бидний давуу тал', 'Our Advantages', '我们的优势')} title={tr('Яагаад М Секьюритис?', 'Why M Securities?', '为什么选择 M Securities?')} items={advantages} />

      <Roadmap
        phases={phases}
        kick={tr('Арилжааны хөгжил', 'Trading Development', '交易发展')}
        title={tr('Бүрэн биржийн арилжаанд шилжих замнал', 'Roadmap to Full Exchange Trading', '全面转向交易所交易的路线图')}
        sub={tr('2027 оны 4 дүгээр сараас уул уурхайн арилжааг зөвхөн брокероор дамжуулж гүйцэтгэнэ.', 'From April 2027, mining product trading must be conducted through brokers.', '2027年4月起，矿产品交易须通过经纪商进行。')}
      />

      <section id="products" data-io className={m.prods} aria-labelledby="prod-title">
        <SecHead kick={tr('Арилжигдаж буй бүтээгдэхүүн', 'Trading Products', '交易产品')} title={tr('Уул уурхайн бүтээгдэхүүн', 'Mining Products', '矿产品')} titleId="prod-title" />
        <div className={m['pd-grid']}>
          {products.map((pr, i) => (
            <article key={i} className={m.pd} style={cssVars({ '--i': i })}>
              <div className={m['pd-art']}><svg className={m.art} viewBox="0 0 84 64" aria-hidden="true">{ART[i]}</svg></div>
              <h3>{pr.name}</h3>
              <span className={`${m.st} ${m.on}`}><i></i>{active}</span>
            </article>
          ))}
        </div>
      </section>

      <Fees
        rows={fees}
        cols={[tr('Оролцогч', 'Participant', '参与方'), tr('Шимтгэлийн төрөл', 'Fee Type', '费用类型'), tr('Хэмжээ', 'Amount', '金额')]}
        choices={[['all', tr('Бүгд', 'All', '全部')], ['seller', seller], ['buyer', buyer]]}
        kick={tr('Үнэ тариф', 'Pricing', '费率')}
        title={tr('Брокерийн шимтгэл', 'Broker Fees', '经纪手续费')}
        note={tr('Харилцагчтай харилцан тохиролцсоны үндсэн дээр шимтгэлийг тохируулах боломжтой.', 'Fees are negotiable with clients.', '费率可与客户协商确定。')}
      />

      <section id="legal" data-io className={m.legal} aria-labelledby="law-title">
        <SecHead kick={tr('Эрх зүйн орчин', 'Legal Framework', '法律环境')} title={tr('Холбогдох хууль, дүрэм', 'Relevant Laws & Regulations', '相关法律法规')} titleId="law-title" />
        <div className={m.laws}>
          {laws.map((l, i) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={m.law} style={cssVars({ '--i': i })}>
              <span className={m['law-ic']}>{l.icon}</span>
              <span className={m['law-tx']}><small>{l.src}</small><b>{l.title}</b><span>{l.desc}</span></span>
              <span className={m['law-go']}><GoIcon /></span>
            </a>
          ))}
        </div>
      </section>

      <Contact
        subject={tr('Уул уурхайн брокер - Холбоо барих хүсэлт', 'Mining Broker - Contact Request', '矿业经纪 - 联系请求')}
        cta={{ href: PLATFORM_URL, label: tr('Арилжааны платформ руу орох', 'Enter Trading Platform', '进入交易平台') }}
      />
    </RefPage>
  );
};

export default MiningBrokerService;

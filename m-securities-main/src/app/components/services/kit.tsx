"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { Onest } from "next/font/google";
import { useLanguage } from "../../context/LanguageContext";
import { onScrollFrame, pick, prefersReducedMotion, scrollToSection } from "../home/shared";
import { useSmoothScroll } from "../smoothScroll";
import { Skeleton } from "./visuals";
import s from "./kit.module.css";

export { s };

// Same face as the home page; cyrillic-ext carries Ө / Ү.
const onest = Onest({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-onest",
});

// --i drives per-item animation delays, --d the reveal stagger
export const vi = (i: number) => ({ "--i": i } as CSSProperties);
export const dv = (d: number) => ({ "--d": d } as CSSProperties);
export const pad = (n: number) => String(n).padStart(2, "0");

export function useTr() {
  const { t, language } = useLanguage();
  const tr = (mn: string, en: string, zh: string) => pick(language, mn, en, zh);
  return { t, tr, language };
}

/* ---------- icons ---------- */
const Svg = ({ size = 18, children }: { size?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
export const ArrowRight = () => <Svg size={17}><path d="M3.5 9h11M10 4.5 14.5 9 10 13.5" /></Svg>;
const PhoneIcon = () => <Svg><path d="M6.6 2.5H4.3A1.8 1.8 0 0 0 2.5 4.4c.4 6 5.1 10.7 11.1 11.1a1.8 1.8 0 0 0 1.9-1.8v-2.3l-3-1.3-1.6 1.6a8.4 8.4 0 0 1-3.8-3.8L8.7 6.3 7.4 3.3Z" /></Svg>;
const MailIcon = () => <Svg><rect x="2" y="3.5" width="14" height="11" rx="2.5" /><path d="m2.8 5 6.2 4.6L15.2 5" /></Svg>;
const PinIcon = () => <Svg><path d="M9 16s5.5-4.6 5.5-9A5.5 5.5 0 0 0 3.5 7c0 4.4 5.5 9 5.5 9Z" /><circle cx="9" cy="7" r="2" /></Svg>;
const ClockIcon = () => <Svg><circle cx="9" cy="9" r="7" /><path d="M9 5.5V9l2.5 1.5" /></Svg>;

/* ---------- page shell ---------- */
// Tokens, font and motion for a service page: [data-reveal] blocks get .in once in view (their .rv
// children come into focus with a stagger). Reduced motion shows the final states.
export function ServicePage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useSmoothScroll();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blocks = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (prefersReducedMotion()) { blocks.forEach(b => b.classList.add(s.in)); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add(s.in); io.unobserve(e.target);
    }), { threshold: .08, rootMargin: "0px 0px -8% 0px" });
    blocks.forEach(b => io.observe(b));
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={`${onest.variable} ${s.page}`}>{children}</div>;
}

// In-page jump (through Lenis when it runs) that keeps the #hash link working without JS
export const jumpTo = (id: string) => (e: MouseEvent) => { e.preventDefault(); scrollToSection(id, () => -84); };

type BtnProps = { href: string; kind?: "p" | "g"; external?: boolean; onClick?: (e: MouseEvent) => void; children: ReactNode };
export function Btn({ href, kind = "p", external, onClick, children }: BtnProps) {
  const cls = `${s.btn} ${kind === "p" ? s.bp : s.bg}`;
  const inner = <>{children}{kind === "p" && <span className={s.bi}><ArrowRight /></span>}</>;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  if (href.startsWith("#")) return <a href={href} onClick={onClick} className={cls}>{inner}</a>;
  return <Link href={href} className={cls}>{inner}</Link>;
}

/* ---------- cover ---------- */
type CoverProps = { crumb: string; badge: string; title: [string, string]; lead: string; actions: ReactNode; display: ReactNode };
// Breadcrumb + licence badge, a two-weight title that comes into focus, lead and actions on a rule,
// then the service's dark display band.
export function Cover({ crumb, badge, title, lead, actions, display }: CoverProps) {
  const { tr, language } = useTr();
  return (
    <section className={s.cover}>
      <div className={s.wrap}>
        <div className={s.top}>
          <nav aria-label={tr("Байршил", "Breadcrumb", "位置")}>
            <ol className={s.crumbs}>
              <li><Link href="/">{tr("Нүүр", "Home", "首页")}</Link></li>
              <li>{tr("Үйлчилгээ", "Services", "服务")}</li>
              <li aria-current="page">{crumb}</li>
            </ol>
          </nav>
          <span className={s.badge}><i></i>{badge}</span>
        </div>
        <h1 className={s.title} aria-label={title.join(language === "zh" ? "" : " ")}>
          <span className={s.t1} style={vi(0)} aria-hidden="true">{title[0]}</span>
          <span className={s.t2} style={vi(1)} aria-hidden="true">{title[1]}<i className={s.dot}></i></span>
        </h1>
        <div className={s["cover-grid"]}>
          <p className={s.lead}>{lead}</p>
          <div className={s.acts}>{actions}</div>
        </div>
        <div className={s.display}>{display}</div>
      </div>
    </section>
  );
}

/* ---------- body: sticky index + numbered sections ---------- */
export type TocItem = { id: string; label: string };
export function Body({ toc, children }: { toc: TocItem[]; children: ReactNode }) {
  const { tr } = useTr();
  const [active, setActive] = useState(toc[0]?.id);
  const ids = toc.map(x => x.id).join(",");

  // the last section whose top has passed 40% of the viewport is the active one (the first before that)
  useEffect(() => {
    const els = ids.split(",").map(id => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    return onScrollFrame(() => {
      const line = innerHeight * .4;
      let cur = els[0]?.id;
      els.forEach(e => { if (e.getBoundingClientRect().top < line) cur = e.id; });
      setActive(cur);
    });
  }, [ids]);

  return (
    <div className={`${s.wrap} ${s.body}`}>
      <aside className={s.toc}>
        <nav aria-label={tr("Агуулга", "Contents", "目录")}>
          <p className={s["toc-l"]}>{tr("Агуулга", "Contents", "目录")}</p>
          {toc.map((x, i) => (
            <a key={x.id} href={`#${x.id}`} onClick={jumpTo(x.id)} className={x.id === active ? s.on : undefined} aria-current={x.id === active ? "true" : undefined}>
              <span>{pad(i + 1)}</span>{x.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className={s.main}>{children}</div>
    </div>
  );
}

type SecProps = { id: string; n: number; title: ReactNode; lead?: string; children: ReactNode };
export function Sec({ id, n, title, lead, children }: SecProps) {
  return (
    <section id={id} data-reveal className={s.sec}>
      <div className={s.sh}>
        <span className={`${s.num} ${s.rv}`}>{pad(n)}</span>
        <div>
          <h2 className={s.rv} style={dv(1)}>{title}</h2>
          {lead && <p className={s.rv} style={dv(2)}>{lead}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ---------- advantages: numbered rows ---------- */
export type Row = { icon: ReactNode; title: string; desc: string };
export function Rows({ items }: { items: Row[] }) {
  return (
    <div className={s.rows}>
      {items.map((f, i) => (
        <article key={i} className={`${s.row} ${s.sweep} ${s.rv}`} style={dv(i + 2)}>
          <span className={s.ri}>{f.icon}</span>
          <div><h3>{f.title}</h3><p>{f.desc}</p></div>
          <span className={s.rn}>{pad(i + 1)}</span>
        </article>
      ))}
    </div>
  );
}

/* ---------- closing band ---------- */
export function Band({ title, lead, actions }: { title: [string, string]; lead: string; actions: ReactNode }) {
  return (
    <div data-reveal className={`${s.band} ${s.rv}`}>
      <div>
        <h2><span className={s.t1}>{title[0]}</span><span>{title[1]}</span></h2>
        <p>{lead}</p>
      </div>
      <div className={s.acts}>{actions}</div>
    </div>
  );
}

/* ---------- other services ---------- */
type ServiceKey = "broker" | "mining" | "foreign";
export function NextServices({ current }: { current?: ServiceKey }) {
  const { t, tr } = useTr();
  const all = [
    { key: "broker", href: "/services/broker", title: t("navbar.sections.broker"),
      desc: tr("МХБ-д бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа хийх", "Buy and sell stocks, bonds, and securities listed on the Mongolian Stock Exchange", "在蒙古证券交易所买卖股票、债券及其他证券") },
    { key: "mining", href: "/services/mining-broker", title: t("navbar.sections.miningBroker"),
      desc: tr("Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний цахим арилжаа", "Electronic trading of mining products through the Mongolian Stock Exchange", "通过蒙古证券交易所进行矿产品在线交易") },
    { key: "foreign", href: "/services/foreign-trading", title: t("navbar.sections.foreignTrading"),
      desc: tr("М Банк апп-ийн \"Хувьцаа\" цэснээс дэлхийн тэргүүлэх биржүүд дээр гадаад хувьцаа, бонд, ETF-д хөрөнгө оруулах", "Invest in foreign stocks, bonds, and ETFs on the world's leading exchanges via the \"Stocks\" menu of the M Bank app", "通过M Bank应用的“股票”菜单在全球领先交易所投资境外股票、债券、ETF") },
  ].filter(x => x.key !== current);

  return (
    <section data-reveal className={s.more}>
      <div className={s.wrap}>
        <div className={s.sh}>
          <span className={`${s.num} ${s.rv}`}><ArrowRight /></span>
          <div><h2 className={s.rv} style={dv(1)}>{current ? tr("Бусад үйлчилгээ", "Other services", "其他服务") : tr("Манай үйлчилгээнүүд", "Our services", "我们的服务")}</h2></div>
        </div>
        <div className={s.next}>
          {all.map((o, i) => (
            <Link key={o.key} href={o.href} className={`${s.nx} ${s.sweep} ${s.rv}`} style={dv(i + 2)}>
              <span className={s.n}>{pad(i + 1)}</span>
              <span><b>{o.title}</b><span className={s.d}>{o.desc}</span></span>
              <span className={s.go}><ArrowRight /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- coming soon ---------- */
export function ComingSoon({ name }: { name: [[string, string], [string, string], [string, string]] }) {
  const { tr, language } = useTr();
  const title = language === "mn" ? name[0] : language === "zh" ? name[2] : name[1];
  return (
    <ServicePage>
      <Cover
        crumb={title.join(language === "zh" ? "" : " ")}
        badge={tr("Тун удахгүй", "Coming Soon", "即将推出")}
        title={title}
        lead={tr("Энэ үйлчилгээний хуудас бэлтгэгдэж байна. Удахгүй дахин зочилно уу!", "This service page is under construction. Please check back later!", "该服务页面正在建设中，敬请稍后再来！")}
        actions={<>
          <Btn href="/services/broker#contact">{tr("Брокертой холбогдох", "Contact Broker", "联系经纪人")}</Btn>
          <Btn href="/" kind="g">{tr("Нүүр хуудас", "Home", "首页")}</Btn>
        </>}
        display={<Skeleton label={tr("Бэлтгэгдэж байна", "In progress", "建设中")} />}
      />
      <div style={{ height: "clamp(64px,10vh,110px)" }} />
      <NextServices />
    </ServicePage>
  );
}

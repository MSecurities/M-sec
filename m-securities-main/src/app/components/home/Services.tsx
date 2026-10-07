"use client";

import { Fragment, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, isFullScreenLayout, onScrollFrame, pick, prefersReducedMotion, scrollToSection, vi } from "./shared";
import s from "./home.module.css";

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// Broker: bars + rising line
const BARS = [[21, 108, 52], [53, 92, 68], [85, 116, 44], [117, 82, 78], [149, 98, 62], [181, 70, 90], [213, 78, 82], [245, 56, 104], [277, 64, 96]];
const VizBroker = () => (
  <svg className={s.v1} viewBox="0 0 340 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    {BARS.map(([x, y, h], i) => <rect key={x} className={s.bar} style={vi(i)} x={x} y={y} width="18" height={h} rx="4" />)}
    <defs><linearGradient id="svc-v1g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: "var(--teal)" }} stopOpacity=".28" /><stop offset="1" style={{ stopColor: "var(--teal)" }} stopOpacity="0" /></linearGradient></defs>
    <path className={s.area} d="M30,96 L30,96 L62,80 L94,104 L126,70 L158,86 L190,58 L222,66 L254,44 L286,52 L286,160 L30,160Z" fill="url(#svc-v1g)" />
    <polyline className={s.ln} pathLength={1} points="30,96 62,80 94,104 126,70 158,86 190,58 222,66 254,44 286,52" />
    <g className={s.tip}><circle className={s.ring} cx="286" cy="52" r="5" fill="none" style={{ stroke: "var(--teal)" }} strokeWidth="1.5" /><circle cx="286" cy="52" r="5" style={{ fill: "var(--teal)" }} /></g>
    <line x1="14" y1="160" x2="326" y2="160" style={{ stroke: "var(--line)" }} strokeWidth="1" />
  </svg>
);

// Mining: three ridges with a gold vein
const VizMining = () => (
  <svg className={s.v2} viewBox="0 0 340 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path className={s.rg} style={{ ...vi(0), fill: "rgba(var(--dot),.12)" }} d="M-10 150 L60 80 L105 118 L170 46 L235 112 L280 74 L350 140 V200 H-10Z" />
    <path className={s.rg} style={{ ...vi(1), fill: "rgba(var(--dot),.2)" }} d="M-10 165 L50 120 L120 150 L190 92 L260 146 L310 118 L350 150 V200 H-10Z" />
    <path className={s.rg} style={{ ...vi(2), fill: "rgba(var(--dot),.32)" }} d="M-10 182 L80 150 L150 170 L230 140 L300 168 L350 160 V200 H-10Z" />
    <path className={s.vein} pathLength={1} d="M70 178 C 110 150, 120 170, 160 140 S 210 120, 240 150 S 290 140, 300 120" />
    <circle className={`${s.ore} ${s.p}`} style={vi(0)} cx="160" cy="140" r="4.5" />
    <circle className={`${s.ore} ${s.p}`} style={vi(1)} cx="240" cy="150" r="4" />
    <circle className={`${s.ore} ${s.p}`} style={vi(2)} cx="300" cy="120" r="5" />
  </svg>
);

// Foreign trading: spinning globe with inflows home
const ARCS = [["M40 40 Q105.0 0 170 95", 40, 40], ["M300 46 Q235.0 6 170 95", 300, 46], ["M28 150 Q99.0 160 170 95", 28, 150], ["M312 150 Q241.0 160 170 95", 312, 150]] as const;
const VizGlobal = () => (
  <svg className={s.v3} viewBox="0 0 340 190" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <g className={s.wrapg}>
      <circle className={s.sph} cx="170" cy="95" r="62" />
      <ellipse className={s.mer} cx="170" cy="95" rx="62" ry="62" />
      <ellipse className={`${s.mer} ${s.m2}`} cx="170" cy="95" rx="62" ry="62" />
      <ellipse className={`${s.mer} ${s.m3}`} cx="170" cy="95" rx="62" ry="62" />
      <ellipse className={s.sph} cx="170" cy="95" rx="62" ry="20" style={{ stroke: "rgba(var(--dot),.22)" }} />
    </g>
    {ARCS.map(([d, x, y], i) => (
      <Fragment key={d}>
        <path className={s.arc} style={vi(i)} pathLength={1} d={d} />
        <path className={s.cm} style={vi(i)} pathLength={1} d={d} />
        <circle className={s.src} cx={x} cy={y} r="3.5" />
      </Fragment>
    ))}
    <circle className={s.homering} cx="170" cy="95" r="6" />
    <circle className={s.home} cx="170" cy="95" r="6" />
  </svg>
);

type Card = { title: string; desc: string; href: string; viz: ReactNode };

export default function Services() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const spanRef = useRef<HTMLDivElement>(null);
  const tr = (mn: string, en: string, zh: string) => pick(language, mn, en, zh);

  // The section heading (#svc-title) surfaces over the globe at the end of the hero dive (Hero.tsx).
  const more = tr("Дэлгэрэнгүй", "Learn more", "了解更多");

  const cards: Card[] = [
    {
      title: t("navbar.sections.broker"), href: "/services/broker", viz: <VizBroker />,
      desc: tr("МХБ-д бүртгэлтэй хувьцаа, бонд, бусад үнэт цаасны арилжаа хийх", "Buy and sell stocks, bonds, and securities listed on the Mongolian Stock Exchange", "在蒙古证券交易所买卖股票、债券及其他证券"),
    },
    {
      title: t("navbar.sections.miningBroker"), href: "#mining", viz: <VizMining />,
      desc: tr("Монголын Хөрөнгийн Биржээр дамжуулан уул уурхайн бүтээгдэхүүний цахим арилжаа", "Electronic trading of mining products through the Mongolian Stock Exchange", "通过蒙古证券交易所进行矿产品在线交易"),
    },
    {
      title: t("navbar.sections.foreignTrading"), href: "/services/foreign-trading", viz: <VizGlobal />,
      desc: tr("М Банк апп-ийн \"Хувьцаа\" цэснээс дэлхийн тэргүүлэх биржүүд дээр гадаад хувьцаа, бонд, ETF-д хөрөнгө оруулах", "Invest in foreign stocks, bonds, and ETFs on the world's leading exchanges via the \"Stocks\" menu of the M Bank app", "通过M Bank应用的“股票”菜单在全球领先交易所投资境外股票、债券、ETF"),
    },
  ];

  // The mining card scrolls to the mining section on this page: to the end of its pinned scene
  // (card fully expanded) where it pins, otherwise to its top
  const toMining = (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection("mining", el => (isFullScreenLayout() && !prefersReducedMotion() ? el.offsetHeight - innerHeight : -76));
  };
  const cardLink = (c: Card, className: string, children?: ReactNode, label?: string) =>
    c.href.startsWith("#")
      ? <a href={c.href} className={className} aria-label={label} onClick={toMining}>{children}</a>
      : <Link href={c.href} className={className} aria-label={label}>{children}</Link>;

  useEffect(() => {
    const sec = sectionRef.current, span = spanRef.current;
    if (!sec || !span) return;
    const reduced = prefersReducedMotion();
    const piers = [...span.querySelectorAll(`.${s.pier}`)], nodes = [...span.querySelectorAll(`.${s.node}`)];
    const cards = [...sec.querySelectorAll<HTMLElement>(`.${s.card}`)];
    const timers: number[] = [];
    const cleanups: (() => void)[] = [];

    // Bridge deck draws left → right with scroll; piers/nodes pop in, then the gold flow runs
    const scrub = () => {
      const vh = innerHeight, r = span.getBoundingClientRect(), sp = clamp((vh * .92 - r.top) / (vh * .45));
      span.style.setProperty("--sp", String(1 - sp));
      [.15, .5, .85].forEach((c, k) => { piers[k].classList.toggle(s.on, sp >= c); nodes[k].classList.toggle(s.on, sp >= c); });
      sec.classList.toggle(s.live, sp >= 1);
    };
    if (reduced) {
      span.style.setProperty("--sp", "0"); [...piers, ...nodes].forEach(e => e.classList.add(s.on)); sec.classList.add(s.live);
    } else cleanups.push(onScrollFrame(scrub));

    // Cards rise in from depth (staggered in CSS); tilt only once the entrance has settled
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      el.classList.add(s.in); co.unobserve(el);
      timers.push(window.setTimeout(() => { el.dataset.ready = "1"; }, 1400));
    }), { threshold: .2 });
    cards.forEach(c => (reduced ? c.classList.add(s.in) : co.observe(c)));

    const fine = matchMedia("(pointer:fine)").matches;
    cards.forEach(c => {
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty("--x", x + "px"); c.style.setProperty("--y", y + "px");
        if (!reduced && c.dataset.ready && fine) {
          c.classList.add(s.tilt);
          c.style.transform = "perspective(1000px) rotateX(" + ((.5 - y / r.height) * 5) + "deg) rotateY(" + ((x / r.width - .5) * 6) + "deg) translateY(-4px)";
        }
      };
      const leave = () => { c.style.transform = ""; timers.push(window.setTimeout(() => c.classList.remove(s.tilt), 200)); };
      c.addEventListener("pointermove", move); c.addEventListener("pointerleave", leave);
      cleanups.push(() => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); });
    });

    return () => { co.disconnect(); timers.forEach(clearTimeout); cleanups.forEach(f => f()); };
  }, []);

  return (
    <section ref={sectionRef} id="services" className={s.svc} aria-labelledby="svc-title">
      <div ref={spanRef} className={s.span} aria-hidden="true">
        <svg viewBox="0 0 1180 64" preserveAspectRatio="none">
          <path className={s.deck} pathLength={1} d="M0 14 H1180" />
          <path className={s.pier} pathLength={1} d="M190 14 V64" />
          <path className={s.pier} pathLength={1} d="M590 14 V64" />
          <path className={s.pier} pathLength={1} d="M990 14 V64" />
          <path className={s.flow} pathLength={1} d="M0 14 H1180" /><path className={`${s.flow} ${s.f2}`} pathLength={1} d="M0 14 H1180" />
        </svg>
        <svg viewBox="0 0 1180 64" preserveAspectRatio="xMidYMid meet" style={{ pointerEvents: "none" }}>
          <circle className={s.node} cx="190" cy="14" r="6" /><circle className={s.node} cx="590" cy="14" r="6" /><circle className={s.node} cx="990" cy="14" r="6" />
        </svg>
      </div>

      <div className={s.cards}>
        {cards.map((c, i) => (
          <article key={c.href} className={s.card} style={vi(i)}>
            {cardLink(c, s.stretch, undefined, `${c.title} — ${more.toLowerCase()}`)}
            <div className={s.viz}>{c.viz}</div>
            <div className={s["card-body"]}>
              <span className={s.idx}><b>{String(i + 1).padStart(2, "0")}</b><i></i></span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              {cardLink(c, s["more-link"], <><span>{more}</span><ArrowRight /></>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react";
import { Onest } from "next/font/google";
import { useLanguage } from "../../context/LanguageContext";
import { clamp, onScrollFrame, pick, prefersReducedMotion, scrollToSection } from "../home/shared";
import { useSmoothScroll } from "../smoothScroll";
import p from "./parts.module.css";

export { p };

// Same face as the home page; cyrillic-ext carries Ө / Ү.
export const onest = Onest({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-onest",
});

export const cssVars = (v: Record<string, string | number>) => v as CSSProperties;

export function useTr() {
  const { t, language } = useLanguage();
  const tr = (mn: string, en: string, zh: string) => pick(language, mn, en, zh);
  return { t, tr, language };
}

/* ---------- icons ---------- */
export const TrendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 10.5 5.5 6.5 8 9l4.5-5M9 4h3.5v3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const Ic = ({ size = 17, children }: { size?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

/* ---------- page shell ---------- */
// Tokens, font, grain and motion for a service page: [data-io] blocks get data-in once a fifth is in
// view (CSS reveals from it), [data-card] cards follow the cursor. Reduced motion shows the final states.
export function RefPage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useSmoothScroll();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blocks = [...root.querySelectorAll<HTMLElement>("[data-io]")];
    const show = (el: Element) => el.setAttribute("data-in", "");
    if (prefersReducedMotion()) { blocks.forEach(show); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      show(e.target); io.unobserve(e.target);
    }), { threshold: .2 });
    blocks.forEach(b => io.observe(b));

    const spot = (e: PointerEvent) => {
      const el = (e.target as Element).closest<HTMLElement>("[data-card]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--x", e.clientX - r.left + "px"); el.style.setProperty("--y", e.clientY - r.top + "px");
    };
    root.addEventListener("pointermove", spot);
    return () => { io.disconnect(); root.removeEventListener("pointermove", spot); };
  }, []);

  return <div ref={ref} className={`${onest.variable} ${p.page}`}>{children}</div>;
}

// In-page jump (through Lenis when it runs) that keeps the #hash link working without JS
export const jumpTo = (id: string) => (e: MouseEvent) => { e.preventDefault(); scrollToSection(id, () => 0); };

/* ---------- buttons ---------- */
type CtaProps = { href: string; primary?: boolean; external?: boolean; magnetic?: boolean; className?: string; onClick?: (e: MouseEvent) => void; children: ReactNode };
export function Cta({ href, primary, external, magnetic, className, onClick, children }: CtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  // the reference's magnetic pull on the hero's primary button
  useEffect(() => {
    const b = ref.current;
    if (!b || !magnetic || prefersReducedMotion() || !matchMedia("(pointer:fine)").matches) return;
    const pull = (e: PointerEvent) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; };
    const release = () => { b.style.transform = ""; };
    b.addEventListener("pointermove", pull); b.addEventListener("pointerleave", release);
    return () => { b.removeEventListener("pointermove", pull); b.removeEventListener("pointerleave", release); };
  }, [magnetic]);
  return (
    <a ref={ref} href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${p.cta} ${primary ? p["cta-1"] : p["cta-2"]}${className ? ` ${className}` : ""}`}>
      {children}{primary && <TrendIcon />}
    </a>
  );
}

/* ---------- hero ---------- */
type HeroProps = {
  titleId: string; lines: [string[], string[]]; sub: string; actions: ReactNode; art?: ReactNode;
  underline?: boolean;
};
// Minimal hero: two-line title (second line teal, optionally underlined in gold)
// rising word by word, lead, actions; the art sits along the bottom. Scrolling away lifts and fades
// the copy (--bp, 0 → 1 over the first screen).
export function Hero({ titleId, lines, sub, actions, art, underline }: HeroProps) {
  const { language } = useTr();
  const ref = useRef<HTMLElement>(null);
  const sep = language === "zh" ? "" : " ";

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return onScrollFrame(() => el.style.setProperty("--bp", clamp(scrollY / innerHeight).toFixed(3)));
  }, []);

  const words = (line: string[], offset: number) => line.map((w, k) => (
    <Fragment key={`${language}-${offset + k}`}>
      {k > 0 && sep}
      <span className={p.w}><span className={p.wi} style={cssVars({ "--i": offset + k })}>{w}</span></span>
    </Fragment>
  ));

  return (
    <section ref={ref} className={p.bh} aria-labelledby={titleId}>
      <div className={p["bh-bg"]} />
      {art}
      <div className={p["bh-in"]}>
        <h1 id={titleId} className={p.title} aria-label={[...lines[0], ...lines[1]].join(sep)}>
          <span className={p.ln1} aria-hidden="true">{words(lines[0], 0)}</span>
          <span className={p.ln2} aria-hidden="true">
            {underline
              ? <span className={p.hl}>{words(lines[1], lines[0].length)}<svg className={p.ul} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength={1} d="M3 9 C 50 3, 120 2, 197 7" /></svg></span>
              : words(lines[1], lines[0].length)}
          </span>
        </h1>
        <p className={p.sub}>{sub}</p>
        <div className={p.ctas}>{actions}</div>
      </div>
    </section>
  );
}

/* ---------- section head ---------- */
export function SecHead({ kick, title, titleId, sub }: { kick: string; title: string; titleId: string; sub?: string }) {
  return (
    <div data-io className={p["sec-head"]}>
      <span className={p.kick}><i></i>{kick}</span>
      <h2 id={titleId}>{title}</h2>
      {sub && <p className={p["sec-sub"]}>{sub}</p>}
    </div>
  );
}

/* ---------- advantages bento ---------- */
export type BentoItem = { icon: ReactNode; title: string; desc: string; viz: ReactNode };
const LAYOUT = ["a1", "a2", "a3", "a4"] as const;
// Four cards: wide / narrow / narrow / wide, each entering from its own direction
export function Bento({ id, kick, title, items }: { id: string; kick: string; title: string; items: BentoItem[] }) {
  return (
    <section id={id} data-io className={p.adv} aria-labelledby={`${id}-title`}>
      <SecHead kick={kick} title={title} titleId={`${id}-title`} />
      <div className={p.bento}>
        {items.map((it, k) => (
          <article key={k} data-card className={`${p.bn} ${p[LAYOUT[k % 4]]}`} style={cssVars({ "--k": k })}>
            <div className={p["bn-vz"]}>{it.viz}</div>
            <div className={p["bn-tx"]}>
              <span className={p["bn-ic"]}>{it.icon}</span>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export const VzTeam = () => (
  <svg className={p["vz-team"]} viewBox="0 0 220 140" aria-hidden="true">
    <path className={p.tl} d="M110 70 L48 40 M110 70 L176 36 M110 70 L58 112 M110 70 L168 110" />
    <circle className={`${p.tn} ${p.c0}`} cx="110" cy="70" r="20" />
    <circle className={p.tn} cx="48" cy="40" r="13" />
    <circle className={p.tn} cx="176" cy="36" r="13" />
    <circle className={p.tn} cx="58" cy="112" r="13" />
    <circle className={p.tn} cx="168" cy="110" r="13" />
  </svg>
);

/* ---------- contact ---------- */
// Outline of Mongolia (reference contact card); Ulaanbaatar is the gold point
const MN = "M4.0 67.8 L5.7 67.8 L6.8 66.5 L8.1 64.7 L8.9 61.5 L11.4 60.8 L13.4 60.8 L15.2 61.3 L17.1 61.5 L17.6 59.8 L18.5 60.2 L19.4 61.1 L21.6 59.8 L22.3 57.6 L24.3 58.0 L26.7 56.1 L27.9 55.0 L27.5 51.8 L30.6 50.7 L32.2 48.1 L33.4 47.5 L36.1 46.4 L38.8 45.1 L41.4 44.0 L42.9 42.7 L45.2 40.6 L47.9 39.9 L49.3 39.5 L50.7 38.4 L52.7 37.1 L54.1 35.2 L57.3 34.5 L60.2 34.5 L61.4 32.2 L62.3 31.1 L64.1 33.2 L65.9 34.7 L67.3 34.3 L68.8 32.6 L70.1 33.4 L70.8 35.6 L73.5 36.5 L75.7 36.5 L78.6 36.9 L80.9 37.1 L84.4 37.3 L87.2 38.6 L88.0 43.2 L88.6 45.7 L89.9 46.8 L91.3 49.2 L92.7 48.8 L95.4 48.8 L96.8 50.5 L98.5 50.9 L101.2 50.9 L103.0 51.6 L105.4 50.3 L107.2 49.4 L108.4 50.5 L109.4 49.6 L110.6 50.1 L113.2 51.8 L115.1 51.6 L116.1 52.0 L117.4 51.8 L121.9 52.2 L123.3 53.9 L124.7 55.5 L127.4 54.6 L129.6 51.6 L131.3 50.7 L132.9 50.7 L135.0 49.4 L136.4 47.3 L137.4 44.7 L138.5 40.6 L138.5 38.2 L136.8 37.3 L135.2 35.6 L134.3 33.0 L134.2 31.1 L132.9 29.3 L132.8 27.0 L133.8 23.3 L133.8 22.0 L134.7 19.9 L136.1 17.7 L137.7 17.0 L138.5 14.5 L139.4 12.5 L144.6 8.4 L145.8 5.0 L147.2 4.3 L148.9 5.6 L153.0 8.2 L155.5 8.8 L157.9 10.1 L161.1 12.1 L166.6 12.3 L169.7 13.8 L174.4 16.2 L177.2 17.9 L179.4 17.9 L183.9 19.0 L187.7 20.5 L188.3 22.4 L188.2 25.7 L188.9 28.7 L188.9 31.7 L189.8 33.0 L190.1 35.2 L190.0 37.1 L191.5 38.0 L193.3 39.7 L196.0 41.6 L199.6 43.2 L202.0 44.0 L204.5 45.5 L207.2 46.6 L209.4 45.7 L211.4 46.2 L214.2 46.0 L216.4 43.6 L219.6 42.7 L224.5 41.4 L227.2 40.4 L229.7 39.5 L233.6 40.8 L237.6 41.6 L240.4 43.2 L244.9 42.5 L248.5 44.2 L251.0 47.7 L253.4 49.8 L258.6 50.1 L262.3 50.7 L262.4 52.9 L262.5 56.3 L263.4 57.2 L264.6 59.1 L268.6 62.6 L271.1 64.3 L275.1 63.9 L281.9 64.7 L285.8 66.0 L291.6 67.5 L294.5 66.5 L297.1 68.2 L299.7 67.5 L306.2 63.4 L308.4 63.4 L311.3 62.6 L313.8 62.1 L319.6 60.2 L323.7 60.2 L326.4 58.9 L328.7 56.3 L331.6 52.4 L335.0 49.4 L338.8 47.5 L343.2 44.0 L345.4 44.0 L349.0 44.2 L351.7 45.7 L354.5 48.3 L357.8 51.6 L360.8 52.0 L363.5 51.6 L367.9 49.4 L370.6 50.1 L374.1 52.2 L373.6 56.3 L369.1 67.5 L367.3 72.5 L366.3 76.0 L363.7 80.3 L363.5 85.2 L361.4 88.7 L360.4 93.9 L362.3 97.1 L364.8 99.5 L367.0 97.3 L370.2 95.8 L372.6 96.2 L375.8 95.6 L378.3 96.2 L381.5 98.4 L383.4 100.3 L384.8 98.4 L387.6 94.7 L389.7 92.8 L392.3 92.4 L394.8 92.8 L399.1 94.1 L401.5 98.0 L403.9 99.3 L405.6 100.3 L406.1 102.3 L407.5 103.8 L408.6 105.1 L409.5 106.2 L412.3 109.6 L414.3 112.4 L414.7 114.8 L416.1 117.4 L416.1 120.2 L414.2 122.3 L412.6 123.0 L408.8 122.8 L405.0 121.1 L402.5 119.5 L401.0 121.1 L399.2 121.1 L395.7 120.4 L392.6 121.5 L389.3 124.3 L387.5 124.7 L386.0 123.2 L384.2 123.6 L383.5 126.4 L383.1 128.2 L380.8 128.2 L377.1 127.5 L374.9 129.0 L373.2 129.7 L371.7 132.5 L369.4 136.8 L369.0 139.2 L368.6 141.6 L366.6 142.8 L363.4 146.1 L360.1 148.0 L356.0 148.9 L352.2 149.3 L348.6 148.7 L347.0 149.8 L346.7 151.7 L344.0 155.1 L341.4 158.2 L339.5 159.5 L337.2 161.2 L335.1 162.9 L333.4 162.5 L330.1 162.1 L323.8 160.1 L321.1 157.3 L318.4 156.2 L315.1 155.8 L311.5 158.2 L309.8 161.2 L308.5 166.8 L307.1 170.0 L307.4 172.2 L308.5 175.0 L310.6 178.2 L313.1 181.7 L313.9 184.5 L313.1 186.0 L311.1 187.3 L308.9 189.9 L307.6 190.3 L303.0 192.7 L300.7 195.1 L298.6 198.3 L297.1 200.9 L294.9 204.1 L294.1 205.6 L291.6 206.9 L287.2 209.1 L283.7 211.2 L280.5 212.8 L274.5 213.0 L270.4 213.0 L265.5 212.5 L260.7 213.4 L254.2 214.7 L249.2 215.6 L246.5 216.6 L244.3 217.7 L235.9 222.5 L231.4 225.5 L227.3 227.9 L225.4 230.5 L223.0 230.0 L218.3 229.6 L215.9 225.5 L208.2 227.6 L202.3 223.5 L196.6 221.2 L188.3 218.8 L184.7 216.0 L181.9 211.5 L179.7 210.6 L174.6 210.4 L167.2 208.9 L160.3 207.6 L153.7 210.0 L144.0 208.4 L131.3 206.3 L119.8 205.9 L114.2 206.7 L113.5 203.9 L111.4 200.2 L108.0 196.1 L107.1 192.5 L103.9 182.3 L103.1 180.2 L101.0 178.9 L100.6 176.7 L101.1 173.5 L97.0 173.5 L92.6 171.5 L88.2 167.9 L83.0 164.6 L80.3 161.2 L77.3 158.8 L69.6 157.1 L65.2 157.3 L60.0 156.7 L55.9 156.0 L52.4 155.8 L50.6 154.9 L47.8 154.3 L45.6 152.8 L43.8 153.4 L43.0 151.9 L41.7 148.5 L40.6 146.1 L41.2 141.8 L43.0 138.5 L44.4 136.2 L45.0 133.6 L43.8 130.1 L44.6 127.5 L45.3 123.6 L45.0 121.7 L43.8 117.0 L42.4 114.6 L40.3 112.2 L38.5 108.1 L38.1 105.5 L37.0 102.3 L36.3 100.1 L34.6 99.3 L33.0 97.1 L32.5 95.4 L31.0 96.2 L29.3 96.5 L28.1 95.4 L26.5 92.8 L23.5 92.1 L20.8 93.0 L18.9 91.7 L17.2 90.6 L13.9 88.0 L13.1 84.6 L10.4 82.6 L7.2 81.1 L6.0 80.3 L6.6 79.0 L7.2 77.5 L5.7 76.4 L4.0 74.7 L3.3 72.9 L4.6 71.9 L4.4 70.6 L4.1 68.6Z";

const MnMap = () => (
  <svg className={p["mn-map"]} viewBox="0 0 420 240" aria-hidden="true">
    <defs>
      <pattern id="svc-mn-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" style={{ fill: "rgba(var(--dot),.55)" }} /></pattern>
      <clipPath id="svc-mn-clip"><path d={MN} /></clipPath>
    </defs>
    <rect width="420" height="240" fill="url(#svc-mn-dots)" clipPath="url(#svc-mn-clip)" />
    <path className={p["mn-b"]} pathLength={1} d={MN} />
    <circle className={p["ub-r"]} cx="249.4" cy="94.5" r="6" />
    <circle className={p.ub} cx="249.4" cy="94.5" r="5" />
  </svg>
);

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mojgbavj";
type Field = "name" | "email" | "phone" | "company" | "message";
const REQUIRED: Field[] = ["name", "email", "phone"];

// Company details with the Mongolia map, and the request form: floating labels, required fields
// shake when empty, the button spins while sending and turns gold with a check when sent (Formspree).
export function Contact({ subject, cta }: { subject: string; cta: { href: string; label: string } }) {
  const { tr } = useTr();
  const empty: Record<Field, string> = { name: "", email: "", phone: "", company: "", message: "" };
  const [form, setForm] = useState(empty);
  const [bad, setBad] = useState<Field[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state !== "idle") return;
    const wrong = REQUIRED.filter(k => !form[k].trim() || (k === "email" && !/^\S+@\S+\.\S+$/.test(form[k])));
    setBad(wrong);
    if (wrong.length) { setMsg({ text: tr("Тэмдэглэсэн талбаруудыг бөглөнө үү.", "Please fill in the highlighted fields.", "请填写标记的字段。"), bad: true }); return; }
    setMsg(null); setState("loading");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: subject }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      setMsg({ text: tr("Амжилттай илгээгдлээ! Бид тантай удахгүй холбогдоно.", "Sent successfully! We will contact you soon.", "发送成功！我们会尽快与您联系。") });
      timer.current = window.setTimeout(() => { setState("idle"); setForm(empty); setMsg(null); }, 3200);
    } catch {
      setState("idle");
      setMsg({ text: tr("Алдаа гарлаа. Дахин оролдоно уу.", "Something went wrong. Please try again.", "出现错误，请重试。"), bad: true });
    }
  };

  const set = (k: Field) => (e: { target: { value: string } }) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (bad.includes(k)) setBad(b => b.filter(x => x !== k));
  };
  const fields: [Field, string, string, string][] = [
    ["name", tr("Бүтэн нэр", "Full Name", "全名"), "text", "name"],
    ["email", tr("Имэйл хаяг", "Email Address", "电子邮件"), "email", "email"],
    ["phone", tr("Утасны дугаар", "Phone Number", "电话号码"), "tel", "tel"],
    ["company", tr("Компанийн нэр", "Company Name", "公司名称"), "text", "organization"],
  ];

  return (
    <section id="contact" data-io className={p.contact} aria-labelledby="ct-title">
      <SecHead kick={tr("Холбоо барих", "Contact", "联系我们")} title={tr("Брокертой холбогдох", "Contact Our Broker", "联系经纪人")} titleId="ct-title" />
      <div className={p["ct-card"]}>
        <div className={p["ct-info"]}>
          <h3>{tr("М Секьюритис ҮЦК", "M Securities SC", "M Securities 证券公司")}</h3>
          <ul>
            <li><span className={p.ci}><Ic><path d="M9 16s5.5-4.6 5.5-9A5.5 5.5 0 0 0 3.5 7c0 4.4 5.5 9 5.5 9Z" /><circle cx="9" cy="7" r="2" /></Ic></span><span>{tr("Нью Хориязонс Оффис 401, Улаанбаатар", "New Horizons Office 401, Ulaanbaatar", "新地平线办公室401，乌兰巴托")}</span></li>
            <li><span className={p.ci}><Ic><path d="M4.5 2.5h2.6l1.3 3.4-1.7 1.2a8.5 8.5 0 0 0 4.2 4.2l1.2-1.7 3.4 1.3v2.6a1.5 1.5 0 0 1-1.6 1.5A13 13 0 0 1 3 4.1a1.5 1.5 0 0 1 1.5-1.6Z" /></Ic></span><a href="tel:+97672270008">+976-72270008</a></li>
            <li><span className={p.ci}><Ic><rect x="2" y="3.5" width="14" height="11" rx="2" /><path d="m2.5 5 6.5 5 6.5-5" /></Ic></span><a href="mailto:info@msecurities.mn">info@msecurities.mn</a></li>
            <li><span className={p.ci}><Ic><circle cx="9" cy="9" r="7" /><path d="M9 5v4l2.5 1.5" /></Ic></span><span>{tr("Даваа–Баасан · 09:00–18:00", "Mon–Fri · 09:00–18:00", "周一至周五 09:00–18:00")}</span></li>
          </ul>
          <Cta href={cta.href} primary external className={p["ct-open"]}>{cta.label}</Cta>
          <MnMap />
        </div>
        <form className={p["ct-form"]} onSubmit={submit} noValidate>
          {fields.map(([k, label, type, auto], i) => (
            <div key={k} className={`${p.fld}${bad.includes(k) ? ` ${p.err}` : ""}`} style={cssVars({ "--f": i })}>
              <input id={`ct-${k}`} name={k} type={type} autoComplete={auto} placeholder=" " required={REQUIRED.includes(k)}
                aria-invalid={bad.includes(k) || undefined} value={form[k]} onChange={set(k)} />
              <label htmlFor={`ct-${k}`}>{label}</label>
            </div>
          ))}
          <div className={p.fld} style={cssVars({ "--f": 4 })}>
            <textarea id="ct-message" name="message" rows={4} placeholder=" " data-lenis-prevent value={form.message} onChange={set("message")} />
            <label htmlFor="ct-message">{tr("Санал, хүсэлт", "Message", "留言")}</label>
          </div>
          <button type="submit" className={`${p.send}${state === "loading" ? ` ${p.loading}` : state === "done" ? ` ${p.done}` : ""}`} aria-busy={state === "loading"}>
            <span className={p.lbl}>{tr("Хүсэлт илгээх", "Submit Request", "提交申请")}</span><ArrowRight />
            <span className={p.spin} aria-hidden="true" />
            <span className={p.ok} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 9.2 7.6 12.2 13.5 6" /></svg></span>
          </button>
          <p className={`${p["form-msg"]}${msg?.bad ? ` ${p.bad}` : ""}`} role="status" aria-live="polite">{msg?.text}</p>
        </form>
      </div>
    </section>
  );
}

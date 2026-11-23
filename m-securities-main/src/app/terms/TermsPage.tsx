'use client';
import { Fragment, useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { onScrollFrame, prefersReducedMotion, scrollToSection } from '../components/home/shared';
import { RefPage, cssVars, p } from '../components/services/parts';
import { useLanguage } from '../context/LanguageContext';
import { HTML_LANG } from '../translations';
import { SECTION_IDS, TERMS, TERMS_DATE, TERMS_VERSION } from './content';
import s from './terms.module.css';

const Ic = ({ size = 16, children }: { size?: number; children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const two = (n: number) => String(n).padStart(2, '0');
// room for the fixed navbar (and the chip bar under it on narrow screens)
const OFFSET = () => -(innerWidth <= 1024 ? 140 : 110);
const CLAUSES = TERMS.mn.sections.reduce((n, sec) => n + sec.clauses.length, 0);

// The document follows the site language; English and Chinese readers can switch it to the Mongolian
// original, which is the version that applies.
const TermsPage = () => {
  const { tr, language } = useLanguage();
  const [active, setActive] = useState<string>(SECTION_IDS[0]);
  const [original, setOriginal] = useState(false);
  const showOriginal = language !== 'mn' && original;
  const ui = TERMS[language];
  const doc = showOriginal ? TERMS.mn : ui;
  // the translation note only shows in English and Chinese
  const enZh = (en: string, zh: string) => (language === 'zh' ? zh : en);
  const title = tr(
    ['Үйлчилгээний нөхцөл,', 'Нууцлалын бодлого'],
    ['Terms of Service', '& Privacy Policy'],
    ['服务条款', '与隐私政策'],
  );

  // scroll-spy over the sections
  useEffect(() => onScrollFrame(() => {
    let cur: string = SECTION_IDS[0];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= innerHeight * .32) cur = id;
    }
    setActive(cur);
  }), []);

  // on the chip bar (narrow screens) keep the current section in view
  useEffect(() => {
    const a = document.querySelector<HTMLElement>(`a[href="#${active}"][data-toc]`), bar = a?.closest('nav');
    if (a && bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: a.offsetLeft - 16, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollToSection(id, OFFSET);
    history.replaceState(history.state, '', `#${id}`);
  };

  // title: each line rises word by word; Chinese lines rise whole
  const sep = language === 'zh' ? '' : ' ';
  const lines = title.map(l => (language === 'zh' ? [l] : l.split(/\s+/)));
  const wordSpans = (line: string[], offset: number) => line.map((w, k) => (
    <Fragment key={`${language}-${offset + k}`}>{k > 0 && sep}<span className={p.w}><span className={p.wi} style={cssVars({ '--i': offset + k })}>{w}</span></span></Fragment>
  ));

  return (
    <RefPage>
      <section className={s.hero} aria-labelledby="terms-title">
        <div className={s['hero-bg']} />
        <div className={s['hero-in']}>
          <span className={`${p.kick} ${s.kick}`}><i></i>{tr('Эрх зүйн баримт бичиг', 'Legal', '法律文件')}</span>
          <h1 id="terms-title" className={`${p.title} ${s.title}`} aria-label={title.join(sep)}>
            <span className={p.ln1} aria-hidden="true">{wordSpans(lines[0], 0)}</span>
            <span className={p.ln2} aria-hidden="true">
              <span className={p.hl}>{wordSpans(lines[1], lines[0].length)}<svg className={p.ul} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength={1} d="M3 9 C 50 3, 120 2, 197 7" /></svg></span>
            </span>
          </h1>
          <p className={s.sub}>{tr(
            '“М Секьюритис ҮЦК” ХХК-ийн онлайн системээр үйлчилгээ авах нөхцөл, таны мэдээллийг бид хэрхэн цуглуулж, ашиглаж, хамгаалдаг тухай.',
            'The terms for using M Securities’ online system, and how we collect, use and protect your information.',
            '通过 M Securities 在线系统接受服务的条款，以及我们如何收集、使用和保护您的信息。',
          )}</p>
          <ul className={s.meta}>
            <li><Ic><path d="M10.5 2.5H5a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 5 15.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5Z" /><path d="M10.5 2.5v4h4M6.5 10h5M6.5 12.5h3" /></Ic>{tr('Хувилбар', 'Version', '版本')} <b>{TERMS_VERSION}</b></li>
            <li><Ic><rect x="2.5" y="3.5" width="13" height="12" rx="2" /><path d="M2.5 7.5h13M6 2v3M12 2v3" /></Ic><b>{TERMS_DATE[language]}</b></li>
            <li><Ic><path d="M6.5 4.5h9M6.5 9h9M6.5 13.5h9M2.5 4.5h.01M2.5 9h.01M2.5 13.5h.01" /></Ic>
              <b>{SECTION_IDS.length}</b> {tr('бүлэг', 'sections', '章')} · <b>{CLAUSES}</b> {tr('заалт', 'clauses', '条')}
            </li>
          </ul>
        </div>
      </section>

      <section className={s.body} aria-label={title.join(sep)}>
        <div className={s.wrap}>
          <aside className={s.rail}>
            <span className={`${p.kick} ${s['rail-k']}`}><i></i>{tr('Агуулга', 'Contents', '目录')}</span>
            <nav aria-label={tr('Агуулга', 'Contents', '目录')}>
              <ol>
                {ui.sections.map((sec, i) => (
                  <li key={SECTION_IDS[i]}>
                    <a href={`#${SECTION_IDS[i]}`} data-toc onClick={jump(SECTION_IDS[i])} className={s.toc} aria-current={active === SECTION_IDS[i] ? 'true' : undefined}>
                      <span className={s.tn}>{two(i + 1)}</span>{sec.short}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className={s.doc}>
            {language !== 'mn' && (
              <div className={s.note} role="note">
                <span className={s['note-ic']}><Ic size={18}><circle cx="9" cy="9" r="6.5" /><path d="M9 8.2v4M9 5.8v.1" /></Ic></span>
                <div>
                  <p>{showOriginal
                    ? enZh('You are reading the Mongolian original, which is the version that applies.', '您正在阅读蒙古文原文，以原文为准。')
                    : enZh('This translation is provided for reference. If it differs from the Mongolian original, the Mongolian original applies.', '本译文仅供参考。如与蒙古文原文不一致，以蒙古文原文为准。')}</p>
                  <button type="button" className={s.swap} onClick={() => setOriginal(o => !o)} aria-pressed={showOriginal}>
                    <Ic size={15}><path d="M3 6h11l-3-3M15 12H4l3 3" /></Ic>
                    {showOriginal ? enZh('Show the English translation', '显示中文译文') : enZh('Show the Mongolian original', '显示蒙古文原文')}
                  </button>
                </div>
              </div>
            )}

            <article lang={showOriginal ? 'mn' : undefined} className={s.art}>
              <div data-io className={s.pre}>
                <ul>{doc.preamble.map((para, i) => <li key={i}>{para}</li>)}</ul>
              </div>

              {doc.sections.map((sec, i) => {
                const id = SECTION_IDS[i];
                return (
                  <section key={id} id={id} data-io className={s.sec} aria-labelledby={`${id}-h`}>
                    <header className={s.sh}>
                      <span className={s.sn}>{two(i + 1)}</span>
                      <div>
                        <h2 id={`${id}-h`}>{sec.title}</h2>
                        <span lang={showOriginal ? HTML_LANG[language] : undefined}>{sec.clauses.length} {tr('заалт', 'clauses', '条')}</span>
                      </div>
                    </header>
                    <ol className={s.cl}>
                      {sec.clauses.map((text, k) => {
                        const n = `${i + 1}.${k + 1}`;
                        return (
                          <li key={n} id={`c${i + 1}-${k + 1}`}>
                            <a className={s.cn} href={`#c${i + 1}-${k + 1}`}>{n}</a>
                            <p>{text}</p>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                );
              })}
            </article>

            <aside data-io className={s.ask} aria-labelledby="terms-ask">
              <div>
                <h2 id="terms-ask">{tr('Асуулт байна уу?', 'Questions about these terms?', '对条款有疑问？')}</h2>
                <p>{tr(
                  'Үйлчилгээний нөхцөл, нууцлалын бодлоготой холбоотой асуултаа бидэнд илгээнэ үү.',
                  'Contact us about the Terms of Service or the Privacy Policy.',
                  '如对服务条款或隐私政策有任何疑问，请联系我们。',
                )}</p>
              </div>
              <div className={s['ask-links']}>
                <a href="mailto:info@msecurities.mn"><Ic><rect x="2" y="3.5" width="14" height="11" rx="2" /><path d="m2.5 5 6.5 5 6.5-5" /></Ic>info@msecurities.mn</a>
                <a href="tel:+97672270008"><Ic><path d="M4.5 2.5h2.6l1.3 3.4-1.7 1.2a8.5 8.5 0 0 0 4.2 4.2l1.2-1.7 3.4 1.3v2.6a1.5 1.5 0 0 1-1.6 1.5A13 13 0 0 1 3 4.1a1.5 1.5 0 0 1 1.5-1.6Z" /></Ic>+976-72270008</a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </RefPage>
  );
};

export default TermsPage;

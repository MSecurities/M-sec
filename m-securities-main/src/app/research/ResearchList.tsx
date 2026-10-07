'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { RefPage, cssVars, useTr } from '../components/services/parts';
import { KINDS, KIND_LABEL, KIND_PATH, fmtDate, pick, postHref, type Lang, type Post, type PostKind } from '../../lib/posts';
import r from './research.module.css';

const ICON: Record<PostKind, string> = {
  news: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5',
  analysis: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  weekly: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
};
export const KindIcon = ({ kind, size = 22 }: { kind: PostKind; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON[kind]} /></svg>
);
const Arrow = ({ out }: { out?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={out ? 'M5 11 11 5M6 5h5v5' : 'M3 8h10M9 4l4 4-4 4'} />
  </svg>
);

// Research section header: title of the current list and links to the other two
export function ResearchHead({ kind, count }: { kind: PostKind; count?: number }) {
  const { tr, language } = useTr();
  const li = language === 'en' ? 1 : language === 'zh' ? 2 : 0;
  return (
    <header className={r.head}>
      <div className={r['head-bg']} />
      <span className={r.kick}><i />{tr('Судалгаа', 'Research', '研究')}</span>
      <h1 className={r.h1}>{KIND_LABEL[kind][li]}</h1>
      {count !== undefined && <p className={r.count}>{count} {tr('бичлэг', count === 1 ? 'post' : 'posts', '篇')}</p>}
      <nav className={r.tabs} aria-label={tr('Судалгааны хэсгүүд', 'Research sections', '研究栏目')}>
        {KINDS.map(k => (
          <Link key={k} href={KIND_PATH[k]} className={r.tab} aria-current={k === kind ? 'page' : undefined}>
            <KindIcon kind={k} size={17} />{KIND_LABEL[k][li]}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Card({ p, lang, lead, i }: { p: Post; lang: Lang; lead?: boolean; i: number }) {
  const { tr } = useTr();
  const { href, external } = postHref(p);
  const title = pick(p, 'title', lang), summary = pick(p, 'summary', lang), cat = pick(p, 'category', lang);
  const inner = (
    <>
      <div className={r.cover}>
        {p.cover_url
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={p.cover_url} alt="" loading={i < 3 ? 'eager' : 'lazy'} />
          : <span className={r.ph}><KindIcon kind={p.kind} size={lead ? 46 : 34} /></span>}
        {p.file_url && <span className={r.pdf}>PDF</span>}
      </div>
      <div className={r.ctext}>
        <div className={r.meta}>
          {cat && <span className={r.cat}>{cat}</span>}
          <time dateTime={p.published_at}>{fmtDate(p.published_at)}</time>
        </div>
        <h2 className={r.ct}>{title}</h2>
        {summary && <p className={r.cs}>{summary}</p>}
        <span className={r.more}>{external ? tr('Эх сурвалжаас унших', 'Read at source', '阅读原文') : tr('Дэлгэрэнгүй', 'Read more', '阅读更多')}<Arrow out={external} /></span>
      </div>
    </>
  );
  const cls = `${r.card}${lead ? ` ${r.lead}` : ''}`;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-card style={cssVars({ '--k': i })}>{inner}</a>
    : <Link href={href} className={cls} data-card style={cssVars({ '--k': i })}>{inner}</Link>;
}

export default function ResearchList({ kind, posts }: { kind: PostKind; posts: Post[] }) {
  const { tr, language } = useTr();
  const lang = language as Lang;
  const [cat, setCat] = useState('');
  const cats = useMemo(() => [...new Set(posts.map(p => pick(p, 'category', lang)).filter(Boolean))], [posts, lang]);
  const shown = cat ? posts.filter(p => pick(p, 'category', lang) === cat) : posts;

  if (kind === 'weekly') return <Weekly posts={posts} />;

  // a featured post (or simply the newest) opens the list in a wide card
  const leadPost = shown.find(p => p.featured) ?? shown[0];
  const rest = shown.filter(p => p !== leadPost);

  return (
    <RefPage>
      <ResearchHead kind={kind} count={posts.length} />
      <section className={r.body}>
        {cats.length > 1 && (
          <div className={r.chips} role="group" aria-label={tr('Ангилал', 'Category', '分类')}>
            <button type="button" aria-pressed={!cat} onClick={() => setCat('')}>{tr('Бүгд', 'All', '全部')}</button>
            {cats.map(c => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}
        {leadPost ? (
          <div data-io className={r.grid}>
            <Card p={leadPost} lang={lang} lead i={0} />
            {rest.map((p, i) => <Card key={p.id} p={p} lang={lang} i={i + 1} />)}
          </div>
        ) : (
          <Empty kind={kind} />
        )}
      </section>
    </RefPage>
  );
}

function Empty({ kind }: { kind: PostKind }) {
  const { tr } = useTr();
  return (
    <div className={r.empty}>
      <span><KindIcon kind={kind} size={28} /></span>
      <p>{tr('Одоогоор нийтлэл алга. Удахгүй шинэ мэдээлэл орно.', 'Nothing here yet. New posts are coming soon.', '暂无内容，敬请期待。')}</p>
    </div>
  );
}

/* ---------- weekly: the latest review open, the archive below ---------- */
function Weekly({ posts }: { posts: Post[] }) {
  const { tr, language } = useTr();
  const lang = language as Lang;
  const [latest, ...archive] = posts;
  return (
    <RefPage>
      <ResearchHead kind="weekly" count={posts.length} />
      <section className={r.body}>
        {latest ? (
          <>
            <article data-io className={r.latest}>
              <div className={r['latest-tx']}>
                <span className={r.cat}>{tr('Шинэ', 'Latest', '最新')}</span>
                <time dateTime={latest.published_at}>{fmtDate(latest.published_at)}</time>
                <h2>{pick(latest, 'title', lang)}</h2>
                {pick(latest, 'summary', lang) && <p>{pick(latest, 'summary', lang)}</p>}
                <div className={r.acts}>
                  <Link href={`${KIND_PATH.weekly}/${latest.slug}`} className={r.btn}>{tr('Нээх', 'Open', '打开')}<Arrow /></Link>
                  {latest.file_url && <a href={latest.file_url} download className={`${r.btn} ${r.ghost}`}>{tr('PDF татах', 'Download PDF', '下载 PDF')}</a>}
                </div>
              </div>
              {latest.file_url && (
                <div className={r.viewer}>
                  <iframe src={`${latest.file_url}#view=FitH`} title={pick(latest, 'title', lang)} loading="lazy" />
                </div>
              )}
            </article>
            {archive.length > 0 && (
              <div data-io className={r.archive}>
                <h2>{tr('Өмнөх тоймууд', 'Earlier reviews', '往期综述')}</h2>
                <ul>
                  {archive.map(p => (
                    <li key={p.id}>
                      <Link href={`${KIND_PATH.weekly}/${p.slug}`}>
                        <time dateTime={p.published_at}>{fmtDate(p.published_at)}</time>
                        <span>{pick(p, 'title', lang)}</span>
                        {p.file_url && <em>PDF</em>}
                        <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : <Empty kind="weekly" />}
      </section>
    </RefPage>
  );
}

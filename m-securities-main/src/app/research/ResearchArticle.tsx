'use client';
import Link from 'next/link';
import { RefPage, useTr } from '../components/services/parts';
import Markdown from '../components/research/Markdown';
import prose from '../components/research/prose.module.css';
import { KIND_LABEL, KIND_PATH, fmtDate, pick, type Lang, type Post } from '../../lib/posts';
import { KindIcon } from './ResearchList';
import r from './research.module.css';

export default function ResearchArticle({ post: p }: { post: Post }) {
  const { tr, language } = useTr();
  const lang = language as Lang;
  const li = lang === 'en' ? 1 : lang === 'zh' ? 2 : 0;
  const title = pick(p, 'title', lang), summary = pick(p, 'summary', lang), body = pick(p, 'body', lang), cat = pick(p, 'category', lang);

  return (
    <RefPage>
      <article className={r.article}>
        <div className={r['head-bg']} />
        <div className={r.aw}>
          <Link href={KIND_PATH[p.kind]} className={r.back}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" /></svg>
            {KIND_LABEL[p.kind][li]}
          </Link>
          <div className={r.meta}>
            {cat && <span className={r.cat}>{cat}</span>}
            <time dateTime={p.published_at}>{fmtDate(p.published_at)}</time>
          </div>
          <h1 className={r.at}>{title}</h1>
          {summary && <p className={r.al}>{summary}</p>}
        </div>

        {p.cover_url && (
          <figure className={r.acover}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover_url} alt="" />
          </figure>
        )}

        <div className={r.aw}>
          {body && <Markdown text={body} className={`${prose.prose} ${r.abody}`} />}

          {p.file_url && (
            <div className={r.doc}>
              <div className={r['doc-h']}>
                <span className={r['doc-ic']}><KindIcon kind={p.kind} size={20} /></span>
                <b>{tr('Хавсралт файл', 'Attached file', '附件')}</b>
                <a href={p.file_url} download className={r.btn}>{tr('PDF татах', 'Download PDF', '下载 PDF')}</a>
                <a href={p.file_url} target="_blank" rel="noopener noreferrer" className={`${r.btn} ${r.ghost}`}>{tr('Шинэ цонхонд', 'Open in new tab', '新窗口打开')}</a>
              </div>
              <div className={r.viewer}><iframe src={`${p.file_url}#view=FitH`} title={title} loading="lazy" /></div>
            </div>
          )}

          {p.external_url && (
            <a href={p.external_url} target="_blank" rel="noopener noreferrer" className={r.source}>
              {tr('Эх сурвалж', 'Source', '来源')}
              <span>{p.external_url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
            </a>
          )}
        </div>
      </article>
    </RefPage>
  );
}

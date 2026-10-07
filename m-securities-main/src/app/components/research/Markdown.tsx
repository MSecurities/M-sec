import { Fragment } from 'react';
import type { ReactNode } from 'react';

// A small Markdown subset for article bodies written in the admin: headings (#, ##, ###), paragraphs
// (single line breaks kept), - / 1. lists, > quotes, --- rules, ![alt](url) images on their own line,
// **bold**, *italic*, `code`, [links](url) and bare URLs. Output is React elements only, and only
// http(s), mailto:, tel: and site-relative URLs become links or images.

const safeUrl = (u: string) => (/^(https?:\/\/|mailto:|tel:|\/(?!\/))/i.test(u.trim()) ? u.trim() : null);

const INLINE = /(\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|_([^_\s][^_]*)_|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>()]+[^\s<>().,;:!?"'»”]))/g;

export function inline(text: string, key = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0, n = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const k = `${key}-${n++}`;
    if (m[2] !== undefined) out.push(<strong key={k}>{inline(m[2], k)}</strong>);
    else if (m[3] !== undefined || m[4] !== undefined) out.push(<em key={k}>{inline(m[3] ?? m[4], k)}</em>);
    else if (m[5] !== undefined) out.push(<code key={k}>{m[5]}</code>);
    else if (m[6] !== undefined) {
      const href = safeUrl(m[7]);
      out.push(href ? <a key={k} href={href} {...(href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>{inline(m[6], k)}</a> : m[0]);
    } else if (m[8] !== undefined) out.push(<a key={k} href={m[8]} target="_blank" rel="noopener noreferrer">{m[8]}</a>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const withBreaks = (lines: string[], key: string) =>
  lines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{inline(l, `${key}-${i}`)}</Fragment>);

export default function Markdown({ text, className }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i], t = line.trim(), k = `b${i}`;
    if (!t) { i++; continue; }
    let m: RegExpMatchArray | null;
    if ((m = t.match(/^(#{1,3})\s+(.+)$/))) {
      const lvl = m[1].length, content = inline(m[2], k);
      blocks.push(lvl === 1 ? <h2 key={k}>{content}</h2> : lvl === 2 ? <h3 key={k}>{content}</h3> : <h4 key={k}>{content}</h4>);
      i++;
    } else if (/^(-{3,}|\*{3,})$/.test(t)) {
      blocks.push(<hr key={k} />); i++;
    } else if ((m = t.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
      const src = safeUrl(m[2]);
      // eslint-disable-next-line @next/next/no-img-element
      if (src) blocks.push(<figure key={k}><img src={src} alt={m[1]} loading="lazy" />{m[1] && <figcaption>{m[1]}</figcaption>}</figure>);
      i++;
    } else if (/^>\s?/.test(t)) {
      const q: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) q.push(lines[i++].trim().replace(/^>\s?/, ''));
      blocks.push(<blockquote key={k}>{withBreaks(q, k)}</blockquote>);
    } else if (/^[-*•·]\s+/.test(t) || /^\d+[.)]\s+/.test(t)) {
      const ordered = /^\d+[.)]\s+/.test(t), re = ordered ? /^\d+[.)]\s+/ : /^[-*•·]\s+/;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i].trim())) items.push(lines[i++].trim().replace(re, ''));
      const lis = items.map((it, j) => <li key={j}>{inline(it, `${k}-${j}`)}</li>);
      blocks.push(ordered ? <ol key={k}>{lis}</ol> : <ul key={k}>{lis}</ul>);
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>|[-*•·]\s|\d+[.)]\s|!\[|-{3,}$|\*{3,}$)/.test(lines[i].trim())) para.push(lines[i++].trim());
      if (!para.length) para.push(lines[i++].trim());
      blocks.push(<p key={k}>{withBreaks(para, k)}</p>);
    }
  }
  return <div className={className}>{blocks}</div>;
}

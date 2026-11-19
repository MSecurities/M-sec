// beehiiv → "Долоо хоногийн тойм" sync. Server-only (uses BEEHIIV_API_KEY).
//
// New beehiiv posts are inserted into public.posts as kind 'weekly'. Rows that already exist (same
// beehiiv link in external_url, or the same URL slug) are never touched, so anything edited by hand in
// /admin stays as it is. Used by the daily cron (/api/cron/beehiiv) and the admin "beehiiv-ээс татах" button.

import type { SupabaseClient } from '@supabase/supabase-js';
import { slugify } from './posts';

type BeehiivPost = {
  id: string;
  title: string;
  subtitle?: string | null;
  preview_text?: string | null;
  status: string;
  slug?: string | null;
  web_url?: string | null;
  thumbnail_url?: string | null;
  publish_date?: number | null;
  displayed_date?: number | null;
  content?: { free?: { web?: string | null; rss?: string | null; email?: string | null } };
};

export type SyncItem = { title: string; action: 'added' | 'exists' | 'skipped' | 'error'; slug?: string; note?: string };
export type SyncResult = { ok: boolean; error?: string; items: SyncItem[] };

const API = 'https://api.beehiiv.com/v2';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchPosts(apiKey: string, pubId: string, sinceSec: number): Promise<BeehiivPost[]> {
  const out: BeehiivPost[] = [];
  for (let page = 1; page <= 5; page++) {
    const qs = new URLSearchParams({
      status: 'confirmed', order_by: 'publish_date', direction: 'desc', limit: '20', page: String(page),
    });
    qs.append('expand[]', 'free_rss_content');
    qs.append('expand[]', 'free_web_content');
    const url = `${API}/publications/${pubId}/posts?${qs}`;

    let res: Response | null = null;
    // beehiiv answers 202 + Retry-After while it prepares the expanded content
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` }, cache: 'no-store' });
      if (res.status !== 202) break;
      await sleep(Math.min(Number(res.headers.get('retry-after')) || 3, 8) * 1000);
    }
    if (!res || res.status === 202) throw new Error('beehiiv агуулгаа бэлдэж байна, дараа дахин оролдоно уу.');
    if (!res.ok) throw new Error(`beehiiv API ${res.status}: ${(await res.text()).slice(0, 200)}`);

    const json = await res.json() as { data: BeehiivPost[]; total_pages?: number };
    let older = false;
    for (const p of json.data ?? []) {
      const at = p.publish_date ?? p.displayed_date ?? 0;
      if (at && at < sinceSec) { older = true; continue; }
      out.push(p);
    }
    if (older || !json.total_pages || page >= json.total_pages) break;
  }
  return out;
}

// beehiiv dates are Unix seconds; the site stores the day in Ulaanbaatar time
const ubDate = (sec: number) => new Date((sec + 8 * 3600) * 1000).toISOString().slice(0, 10);

export async function syncBeehiiv(db: SupabaseClient, opts: { since?: string } = {}): Promise<SyncResult> {
  const apiKey = process.env.BEEHIIV_API_KEY, pubId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !pubId) return { ok: false, error: 'BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID тохируулаагүй байна.', items: [] };

  const sinceStr = opts.since ?? process.env.BEEHIIV_SYNC_SINCE;
  const sinceSec = sinceStr && /^\d{4}-\d{2}-\d{2}$/.test(sinceStr)
    ? Date.parse(`${sinceStr}T00:00:00+08:00`) / 1000
    : Date.now() / 1000 - 30 * 86400; // default: the last 30 days
  const status = process.env.BEEHIIV_SYNC_STATUS === 'draft' ? 'draft' : 'published';

  let posts: BeehiivPost[];
  try { posts = await fetchPosts(apiKey, pubId, sinceSec); }
  catch (e) { return { ok: false, error: (e as Error).message, items: [] }; }

  const items: SyncItem[] = [];
  for (const p of posts.reverse()) { // oldest first, so created_at follows the newsletter order
    const title = cleanTitle(p.title);
    try {
      const html = p.content?.free?.rss || p.content?.free?.web || '';
      if (!title || !html) { items.push({ title: title || p.id, action: 'skipped', note: 'гарчиг эсвэл агуулга хоосон' }); continue; }

      const slug = slugify(title) || `weekly-${p.id.replace(/^post_/, '').slice(0, 8)}`;
      const link = p.web_url || null;
      const { data: found } = await db.from('posts').select('id,slug')
        .or(link ? `slug.eq.${slug},external_url.eq."${link}"` : `slug.eq.${slug}`).limit(1);
      if (found?.length) { items.push({ title, action: 'exists', slug: found[0].slug }); continue; }

      const body = htmlToMarkdown(html);
      if (!body) { items.push({ title, action: 'skipped', note: 'агуулгыг хөрвүүлж чадсангүй' }); continue; }
      const summary = (p.subtitle || '').trim() || firstParagraph(body);

      const { error } = await db.from('posts').insert({
        kind: 'weekly', status, slug,
        published_at: ubDate(p.publish_date ?? p.displayed_date ?? Date.now() / 1000),
        title_mn: title, summary_mn: summary || null, body_mn: body,
        cover_url: p.thumbnail_url || null, external_url: link, featured: false,
      });
      if (error) items.push({ title, action: 'error', note: error.message });
      else items.push({ title, action: 'added', slug });
    } catch (e) {
      items.push({ title: title || p.id, action: 'error', note: (e as Error).message });
    }
  }
  return { ok: !items.some(i => i.action === 'error'), items };
}

// Emoji in newsletter titles ("🌍 Хөрөнгийн…", "💰150 тэрбумын бонд…📉") are left out on the site
const cleanTitle = (t: string) => (t || '').replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, ' ')
  .replace(/^[^\p{L}\p{N}"«]+/u, '').replace(/\s+/g, ' ').trim();

function firstParagraph(md: string): string {
  for (const block of md.split(/\n{2,}/)) {
    const t = block.trim();
    if (!t || /^(#|!\[|-{3}|[-*]\s|\d+[.)]\s|>)/.test(t)) continue;
    const plain = t.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ');
    return plain.length > 280 ? `${plain.slice(0, 277).replace(/\s+\S*$/, '')}…` : plain;
  }
  return '';
}

/* ------------------------------------------------------------------------------------------------
 * HTML → the site's Markdown subset (see components/research/Markdown.tsx): headings, paragraphs,
 * lists, quotes, rules, images on their own line, **bold**, *italic* and [links](url).
 * A small lenient parser, no dependencies.
 * ---------------------------------------------------------------------------------------------- */

type Node = { tag: string; attrs: Record<string, string>; children: (Node | string)[] };

const VOID = new Set(['img', 'br', 'hr', 'source', 'meta', 'link', 'input', 'wbr', 'col', 'area', 'base', 'embed', 'track']);
const SKIP = new Set(['script', 'style', 'head', 'noscript', 'svg', 'form', 'button', 'iframe', 'video', 'audio', 'template', 'select', 'textarea', 'title']);
const BLOCK = new Set(['p', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'figure', 'figcaption',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
  'picture', 'pre', 'center', 'body', 'html', 'small']);

const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', bull: '•', middot: '·', times: '×', minus: '−', copy: '©', reg: '®', trade: '™', zwj: '', zwnj: '', shy: '' };
const decode = (s: string) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
  if (e[0] === '#') { const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
  return ENT[e.toLowerCase()] ?? m;
});

function parse(html: string): Node {
  const root: Node = { tag: '#root', attrs: {}, children: [] };
  const stack: Node[] = [root];
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+|<)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[5] !== undefined) { top.children.push(decode(m[5])); continue; }
    if (!m[2]) continue; // comment / doctype
    const tag = m[2].toLowerCase();
    if (m[1]) { // closing tag: pop to the nearest match, ignore strays
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].tag === tag) { stack.length = i; break; }
      continue;
    }
    const attrs: Record<string, string> = {};
    for (const a of (m[3] || '').matchAll(/([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
      attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '');
    const node: Node = { tag, attrs, children: [] };
    top.children.push(node);
    if (!VOID.has(tag) && !m[4]) {
      if (SKIP.has(tag)) { // jump past the whole element
        const end = html.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
        if (end < 0) break;
        re.lastIndex = html.indexOf('>', end) + 1 || html.length;
        continue;
      }
      stack.push(node);
    }
  }
  return root;
}

const safeUrl = (u?: string) => {
  const t = (u || '').trim();
  return /^(https?:\/\/|mailto:|tel:)/i.test(t) ? t.replace(/\s/g, '%20').replace(/\)/g, '%29') : null;
};
// beehiiv's CDN URLs carry resize options; the plain variant keeps the original size
const imgUrl = (n: Node) => safeUrl(n.attrs.src || n.attrs['data-src'] || (n.attrs.srcset || '').split(/[\s,]+/)[0]);
const altText = (s?: string) => (s || '').replace(/[\[\]]/g, m => (m === '[' ? '(' : ')')).replace(/\s+/g, ' ').trim();
const isEl = (c: Node | string): c is Node => typeof c !== 'string';

function inline(nodes: (Node | string)[]): string {
  let s = '';
  for (const c of nodes) {
    if (!isEl(c)) { s += c.replace(/[ \t\r\n\f]+/g, ' '); continue; }
    switch (c.tag) {
      case 'br': s += '\n'; break;
      case 'img': case 'source': case 'picture': case 'hr': break;
      case 'strong': case 'b': s += wrap(inline(c.children), '**'); break;
      case 'em': case 'i': s += wrap(inline(c.children), '*'); break;
      case 'code': { const t = inline(c.children).trim(); s += t ? `\`${t.replace(/`/g, "'")}\`` : ''; break; }
      case 'a': {
        const text = inline(c.children).trim(), href = safeUrl(c.attrs.href);
        s += text && href && !/^\*?\*?https?:/.test(text) ? `[${text.replace(/[\[\]]/g, '')}](${href})` : text || (href ?? '');
        break;
      }
      default: s += inline(c.children);
    }
  }
  return s;
}
// keep the spaces outside the markers so "**Анхаарах зүйл: **текст" still renders as bold
function wrap(t: string, mark: string) {
  const m = t.match(/^(\s*)([\s\S]*?)(\s*)$/)!;
  if (!m[2] || /^[*\s]+$/.test(m[2])) return t;
  return `${m[1]}${mark}${m[2].replace(/\*\*/g, '')}${mark}${m[3]}`;
}
const tidy = (s: string) => s.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');

function hasBlock(n: Node): boolean {
  return n.children.some(c => isEl(c) && (BLOCK.has(c.tag) || c.tag === 'img' || hasBlock(c)));
}
function findImg(n: Node): Node | null {
  for (const c of n.children) if (isEl(c)) { if (c.tag === 'img') return c; const f = findImg(c); if (f) return f; }
  return null;
}

function blocks(nodes: (Node | string)[], out: string[]) {
  let buf: (Node | string)[] = [];
  const flush = () => { const t = tidy(inline(buf)); if (t) out.push(t); buf = []; };

  for (const c of nodes) {
    if (!isEl(c) || (!BLOCK.has(c.tag) && c.tag !== 'img' && !(c.tag === 'a' && findImg(c)) && !hasBlock(c))) { buf.push(c); continue; }
    flush();
    switch (c.tag) {
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
        const t = tidy(inline(c.children)).replace(/\n/g, ' ').replace(/\*\*/g, '');
        if (t) out.push(`${c.tag <= 'h2' ? '##' : '###'} ${t}`);
        break;
      }
      case 'hr': out.push('---'); break;
      case 'img': { const src = imgUrl(c); if (src) out.push(`![${altText(c.attrs.alt)}](${src})`); break; }
      case 'a': { // a linked image (banner/button): the picture, then the link under it
        const img = findImg(c), src = img && imgUrl(img), href = safeUrl(c.attrs.href);
        if (src) out.push(`![${altText(img!.attrs.alt)}](${src})`);
        if (href) out.push(`[Дэлгэрэнгүй →](${href})`);
        break;
      }
      case 'ul': case 'ol': {
        let n = 0;
        const lines: string[] = [];
        for (const li of c.children) {
          if (!isEl(li) || li.tag !== 'li') continue;
          const inner: string[] = [];
          blocks(li.children, inner);
          const t = inner.filter(b => !b.startsWith('![')).join(' ').replace(/\n/g, ' ').trim();
          if (t) lines.push(`${c.tag === 'ol' ? `${++n}.` : '-'} ${t}`);
        }
        if (lines.length) out.push(lines.join('\n'));
        break;
      }
      case 'blockquote': {
        const inner: string[] = [];
        blocks(c.children, inner);
        const t = inner.join('\n').trim();
        if (t) out.push(t.split('\n').map(l => `> ${l}`).join('\n'));
        break;
      }
      case 'figcaption': case 'small': {
        const t = tidy(inline(c.children)).replace(/\n/g, ' ');
        if (t) out.push(wrap(t, '*'));
        break;
      }
      case 'table': {
        const rows: string[] = [];
        const walk = (n: Node) => n.children.forEach(r => {
          if (!isEl(r)) return;
          if (r.tag === 'tr') {
            const cells = r.children.filter(isEl).filter(x => x.tag === 'td' || x.tag === 'th')
              .map(x => tidy(inline(x.children)).replace(/\n/g, ' ')).filter(Boolean);
            if (cells.length) rows.push(`- ${cells.join(' · ')}`);
          } else walk(r);
        });
        walk(c);
        if (rows.length) out.push(rows.join('\n'));
        break;
      }
      default: blocks(c.children, out); // p, div, section, figure, picture, li-less containers…
    }
  }
  flush();
}

export function htmlToMarkdown(html: string): string {
  // a full web page: keep only the post body
  const start = html.search(/<div[^>]+id=["']content-blocks["']/i);
  const src = start >= 0 ? html.slice(start) : html;
  const out: string[] = [];
  blocks(parse(src).children, out);

  const clean: string[] = [];
  for (const b of out) {
    if (b === '---' && (!clean.length || clean[clean.length - 1] === '---')) continue;
    if (/^[-—–_=\s]{3,}$/.test(b)) { if (clean.length && clean[clean.length - 1] !== '---') clean.push('---'); continue; }
    if (/plain text version of this post|View online|Unsubscribe|Update your email preferences/i.test(b)) continue;
    clean.push(b);
  }
  while (clean[clean.length - 1] === '---') clean.pop();
  return clean.join('\n\n').trim();
}

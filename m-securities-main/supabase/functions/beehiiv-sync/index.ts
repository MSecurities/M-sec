// Supabase Edge Function "beehiiv-sync": copies published beehiiv newsletters into public.posts
// (kind 'weekly' = "Долоо хоногийн тойм" on msecurities.mn). Existing rows (same slug or beehiiv link)
// are never changed. Secret needed: BEEHIIV_API_KEY.
// Auth: callers must send a project secret key (header `apikey: sb_secret_…` or `Authorization: Bearer …`);
// deploy with "Verify JWT" OFF. Body/query: since=YYYY-MM-DD (default: last 30 days), dry=true (preview,
// no writes), wait=true (run and return the result; otherwise the job runs in the background and the call
// returns 202 at once — the Supabase Cron HTTP timeout is 5 s).
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const PUB = Deno.env.get('BEEHIIV_PUBLICATION_ID') ?? 'pub_ae5127fb-c0a8-44b7-a09a-606136473215';
const API = 'https://api.beehiiv.com/v2';
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

type BP = { id: string; title: string; subtitle?: string | null; status: string; platform?: string; web_url?: string | null;
  thumbnail_url?: string | null; publish_date?: number | null; displayed_date?: number | null;
  content?: { free?: { web?: string | null; rss?: string | null; email?: string | null } } };

async function fetchPosts(key: string, sinceSec: number): Promise<BP[]> {
  const out: BP[] = [];
  for (let page = 1; page <= 10; page++) {
    const qs = new URLSearchParams({ status: 'confirmed', order_by: 'publish_date', direction: 'desc', limit: '10', page: String(page) });
    for (const e of ['free_rss_content', 'free_web_content', 'free_email_content']) qs.append('expand[]', e);
    let res: Response | null = null;
    for (let i = 0; i < 4; i++) {
      res = await fetch(`${API}/publications/${PUB}/posts?${qs}`, { headers: { Authorization: `Bearer ${key}` } });
      if (res.status !== 202) break;
      await sleep(Math.min(Number(res.headers.get('retry-after')) || 3, 8) * 1000);
    }
    if (!res || res.status === 202) throw new Error('beehiiv is still preparing content, try again in a minute');
    if (!res.ok) throw new Error(`beehiiv API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const j = await res.json() as { data: BP[]; total_pages?: number };
    let older = false;
    for (const p of j.data ?? []) { const at = p.publish_date ?? p.displayed_date ?? 0; if (at && at < sinceSec) { older = true; continue; } out.push(p); }
    if (older || !j.total_pages || page >= j.total_pages) break;
  }
  return out;
}

const ubDate = (sec: number) => new Date((sec + 8 * 3600) * 1000).toISOString().slice(0, 10);

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


// Mongolian Cyrillic → latin for URL slugs
const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: 'i', э: 'e', ю: 'yu', я: 'ya', '№': 'no-', '&': '-and-',
};
function slugify(s: string): string {
  const latin = [...s.toLowerCase()].map(ch => TR[ch] ?? ch).join('');
  return latin.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
}

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
      default: blocks(c.children, out); // p, div, section, figure, picture, li-less containers…
    }
  }
  flush();
}

function htmlToMarkdown(html: string): string {
  // a full web page: keep only the post body
  const start = html.search(/<div[^>]+id=["']content-blocks["']/i);
  const src = start >= 0 ? html.slice(start) : html;
  const out: string[] = [];
  blocks(parse(src).children, out);

  const clean: string[] = [];
  for (const b of out) {
    if (b === '---' && (!clean.length || clean[clean.length - 1] === '---')) continue;
    if (/^[-—–_=\s]{3,}$/.test(b)) { if (clean.length && clean[clean.length - 1] !== '---') clean.push('---'); continue; }
    if (/plain text version of this post|View online|Read online|Unsubscribe|Update your email preferences|Powered by beehiiv|Manage your subscription|You received this email|Sign up|Login|Log in/i.test(b) && b.length < 300) continue;
    clean.push(b);
  }
  while (clean[clean.length - 1] === '---') clean.pop();
  return clean.join('\n\n').trim();
}

function secretKeys(): string[] {
  const out = [Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), Deno.env.get('SUPABASE_SECRET_KEY')];
  try { out.push(...Object.values(JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')) as string[]); } catch { /* none */ }
  return out.filter((k): k is string => !!k);
}

Deno.serve(async (req) => {
  const given = req.headers.get('apikey') || (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!given || !secretKeys().includes(given)) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  const url = new URL(req.url);
  const key = Deno.env.get('BEEHIIV_API_KEY');
  if (!key) return Response.json({ ok: false, error: 'BEEHIIV_API_KEY secret is not set' }, { status: 500 });
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* no body */ }
  const since = String(url.searchParams.get('since') ?? body.since ?? '');
  const dry = (url.searchParams.get('dry') ?? String(body.dry ?? '')) === '1' || body.dry === true;
  const wait = dry || body.wait === true || url.searchParams.get('wait') === '1';
  const sinceSec = /^\d{4}-\d{2}-\d{2}$/.test(since) ? Date.parse(`${since}T00:00:00+08:00`) / 1000 : Date.now() / 1000 - 30 * 86400;

  const run = async (): Promise<{ ok: boolean; error?: string; count?: number; items?: unknown[] }> => {
    let sk = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY') || '';
    if (!sk) { try { const ks = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}'); sk = ks.default || Object.values(ks)[0] || ''; } catch { /* none */ } }
    if (!sk) return { ok: false, error: 'no service key in the function environment' };
    const db = createClient(Deno.env.get('SUPABASE_URL')!, sk as string, { auth: { persistSession: false } });
    let posts: BP[];
    try { posts = await fetchPosts(key!, sinceSec); } catch (e) { return { ok: false, error: (e as Error).message }; }

    const items: Record<string, unknown>[] = [];
    for (const p of posts.reverse()) { // oldest first
      const title = cleanTitle(p.title);
      try {
        const f = p.content?.free ?? {};
        const html = f.rss || f.web || f.email || '';
        const md = html ? htmlToMarkdown(html) : '';
        if (!title || !md) { items.push({ title: title || p.id, action: 'skipped', note: 'empty content' }); continue; }
        const slug = slugify(title) || `weekly-${p.id.replace(/^post_/, '').slice(0, 8)}`;
        const link = p.platform === 'email' ? null : (p.web_url || null);
        const { data: found } = await db.from('posts').select('slug').or(link ? `slug.eq.${slug},external_url.eq."${link}"` : `slug.eq.${slug}`).limit(1);
        if (found?.length) { items.push({ title, action: 'exists', slug: found[0].slug }); continue; }
        const row = {
          kind: 'weekly', status: 'published', slug,
          published_at: ubDate(p.publish_date ?? p.displayed_date ?? Date.now() / 1000),
          title_mn: title, summary_mn: (p.subtitle || '').trim() || firstParagraph(md) || null, body_mn: md,
          cover_url: p.thumbnail_url || null, external_url: link, featured: false,
        };
        if (dry) { items.push({ title, action: 'would-add', slug, date: row.published_at, source: f.rss ? 'rss' : f.web ? 'web' : 'email', preview: md.slice(0, 600) }); continue; }
        const { error } = await db.from('posts').insert(row);
        items.push(error ? { title, action: 'error', note: error.message } : { title, action: 'added', slug, date: row.published_at });
        await sleep(150); // keep created_at in publish order
      } catch (e) { items.push({ title, action: 'error', note: (e as Error).message }); }
    }
    return { ok: !items.some(i => i.action === 'error'), count: items.length, items };
  };

  if (!wait) {
    // Cron: answer at once, keep working after the response
    EdgeRuntime.waitUntil(run().then(r => console.log('[beehiiv-sync]', JSON.stringify({ ok: r.ok, error: r.error,
      added: (r.items as { action: string }[] | undefined)?.filter(x => x.action === 'added').length }))));
    return Response.json({ ok: true, started: true }, { status: 202 });
  }
  const r = await run();
  return Response.json(r, { status: r.ok ? 200 : 500 });
});

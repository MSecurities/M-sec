// Research content managed from /admin (Supabase table public.posts). Shared by the admin and the
// public research pages; no server-only imports here.

export type PostKind = 'news' | 'analysis' | 'weekly';
export type PostStatus = 'draft' | 'published';
export type Lang = 'mn' | 'en' | 'zh';

export type Post = {
  id: string;
  kind: PostKind;
  status: PostStatus;
  slug: string;
  published_at: string; // YYYY-MM-DD
  title_mn: string; title_en: string | null; title_zh: string | null;
  summary_mn: string | null; summary_en: string | null; summary_zh: string | null;
  body_mn: string | null; body_en: string | null; body_zh: string | null;
  category_mn: string | null; category_en: string | null; category_zh: string | null;
  cover_url: string | null;
  file_url: string | null;
  external_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export const POST_COLUMNS =
  'id,kind,status,slug,published_at,title_mn,title_en,title_zh,summary_mn,summary_en,summary_zh,body_mn,body_en,body_zh,category_mn,category_en,category_zh,cover_url,file_url,external_url,featured,created_at,updated_at';

export const KINDS: PostKind[] = ['news', 'analysis', 'weekly'];
export const KIND_PATH: Record<PostKind, string> = { news: '/research/news', analysis: '/research/analysis', weekly: '/research/weekly' };
export const KIND_LABEL: Record<PostKind, [string, string, string]> = {
  news: ['Мэдээ', 'News', '新闻'],
  analysis: ['Судалгаа шинжилгээ', 'Analysis', '研究分析'],
  weekly: ['Долоо хоногийн тойм', 'Weekly review', '每周综述'],
};

type Field = 'title' | 'summary' | 'body' | 'category';
// The chosen language, falling back to Mongolian (the only required one)
export const pick = (p: Post, f: Field, lang: Lang): string =>
  ((p[`${f}_${lang}` as keyof Post] as string | null) || (p[`${f}_mn` as keyof Post] as string | null) || '').trim();

export const hasBody = (p: Post) => !!(p.body_mn || p.body_en || p.body_zh)?.trim();

// Where a card leads: our own page when there is something to show there, otherwise straight out
export function postHref(p: Post): { href: string; external: boolean } {
  if (hasBody(p) || p.file_url || !p.external_url) return { href: `${KIND_PATH[p.kind]}/${p.slug}`, external: false };
  return { href: p.external_url, external: true };
}

export const fmtDate = (d: string) => d.slice(0, 10).replace(/-/g, '.');

// Mongolian Cyrillic → latin for URL slugs
const TR: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: 'i', э: 'e', ю: 'yu', я: 'ya', '№': 'no-', '&': '-and-',
};
export function slugify(s: string): string {
  const latin = [...s.toLowerCase()].map(ch => TR[ch] ?? ch).join('');
  return latin.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
}
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

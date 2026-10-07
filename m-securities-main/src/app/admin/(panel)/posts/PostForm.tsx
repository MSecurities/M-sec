'use client';
import { useEffect, useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../../lib/supabase/client';
import { KINDS, KIND_LABEL, KIND_PATH, SLUG_RE, slugify, type Lang, type Post, type PostKind } from '../../../../lib/posts';
import { deletePost, savePost, type PostInput } from '../../actions';
import Markdown from '../../../components/research/Markdown';
import { StatusBadge } from '../ui';
import prose from '../../../components/research/prose.module.css';

const LANGS: [Lang, string][] = [['mn', 'Монгол'], ['en', 'English'], ['zh', '中文']];
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MB = 1024 * 1024;
type TextKey = Exclude<keyof PostInput, 'id' | 'kind' | 'status' | 'featured'>;

const localToday = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const blank = (kind: PostKind): PostInput => ({
  kind, status: 'draft', slug: '', published_at: localToday(),
  title_mn: '', title_en: '', title_zh: '', summary_mn: '', summary_en: '', summary_zh: '',
  body_mn: '', body_en: '', body_zh: '', category_mn: '', category_en: '', category_zh: '',
  cover_url: '', file_url: '', external_url: '', featured: false,
});
const fromPost = (p: Post): PostInput => ({
  id: p.id, kind: p.kind, status: p.status, slug: p.slug, published_at: p.published_at.slice(0, 10),
  title_mn: p.title_mn, title_en: p.title_en ?? '', title_zh: p.title_zh ?? '',
  summary_mn: p.summary_mn ?? '', summary_en: p.summary_en ?? '', summary_zh: p.summary_zh ?? '',
  body_mn: p.body_mn ?? '', body_en: p.body_en ?? '', body_zh: p.body_zh ?? '',
  category_mn: p.category_mn ?? '', category_en: p.category_en ?? '', category_zh: p.category_zh ?? '',
  cover_url: p.cover_url ?? '', file_url: p.file_url ?? '', external_url: p.external_url ?? '', featured: p.featured,
});
const fileName = (url: string) => decodeURIComponent(url.split('/').pop() ?? url).replace(/^\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-/, '');

const input = 'w-full rounded-lg border border-gray-300 bg-white px-3 text-[15px] outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-white/15 dark:bg-[#0b1117]';
const card = 'rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111a22]';
const Label = ({ children, htmlFor, hint }: { children: ReactNode; htmlFor?: string; hint?: string }) => (
  <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium">
    <span>{children}</span>{hint && <span className="text-xs font-normal text-gray-400">{hint}</span>}
  </label>
);

export default function PostForm({ initial, kind }: { initial: Post | null; kind: PostKind }) {
  const router = useRouter();
  const params = useSearchParams();
  const [f, setF] = useState<PostInput>(() => (initial ? fromPost(initial) : blank(kind)));
  const saved = useRef(JSON.stringify(f));
  const [lang, setLang] = useState<Lang>('mn');
  const [preview, setPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [savedStatus, setSavedStatus] = useState(initial?.status ?? null);
  const [busy, setBusy] = useState<'' | 'save' | 'delete'>('');
  const [uploading, setUploading] = useState<'' | 'cover' | 'file' | 'image'>('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(params.get('saved') ? { ok: true, text: 'Хадгалагдлаа.' } : null);
  const body = useRef<HTMLTextAreaElement>(null);
  const bodyImage = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(f) !== saved.current;
  // leaving with unsaved changes asks first
  useEffect(() => {
    if (!dirty) return;
    const stop = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    addEventListener('beforeunload', stop);
    return () => removeEventListener('beforeunload', stop);
  }, [dirty]);
  // drop the ?saved flag from the address once shown
  useEffect(() => { if (params.get('saved')) history.replaceState(history.state, '', location.pathname); }, [params]);
  useEffect(() => { if (!msg?.ok) return; const t = setTimeout(() => setMsg(null), 3500); return () => clearTimeout(t); }, [msg]);

  const setText = (k: TextKey, v: string) => setF(prev => {
    const next = { ...prev, [k]: v };
    if (k === 'title_mn' && !slugTouched) next.slug = slugify(v);
    return next;
  });
  const key = (field: 'title' | 'summary' | 'body' | 'category') => `${field}_${lang}` as TextKey;

  /* ---------- uploads (straight to Supabase Storage; RLS allows admins only) ---------- */
  async function upload(file: File, folder: 'covers' | 'files' | 'images'): Promise<string | null> {
    const isPdf = file.type === 'application/pdf';
    if (folder === 'files' ? !isPdf : !IMAGE_TYPES.includes(file.type)) {
      setMsg({ ok: false, text: folder === 'files' ? 'Зөвхөн PDF файл оруулна.' : 'Зөвхөн JPG, PNG, WEBP, GIF, AVIF зураг оруулна.' });
      return null;
    }
    if (file.size > (isPdf ? 50 : 10) * MB) { setMsg({ ok: false, text: isPdf ? 'PDF 50MB-аас ихгүй байна.' : 'Зураг 10MB-аас ихгүй байна.' }); return null; }
    const ext = (file.name.split('.').pop() ?? (isPdf ? 'pdf' : 'jpg')).toLowerCase().replace(/[^a-z0-9]/g, '');
    const base = slugify(file.name.replace(/\.[^.]+$/, '')).slice(0, 60) || 'file';
    const path = `${f.kind}/${folder}/${localToday()}-${crypto.randomUUID().slice(0, 8)}-${base}.${ext}`;
    const sb = createClient();
    const { error } = await sb.storage.from('research').upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
    if (error) { setMsg({ ok: false, text: `Файл илгээж чадсангүй: ${error.message}` }); return null; }
    return sb.storage.from('research').getPublicUrl(path).data.publicUrl;
  }
  const take = async (file: File | undefined, what: 'cover' | 'file') => {
    if (!file) return;
    setUploading(what); setMsg(null);
    const url = await upload(file, what === 'cover' ? 'covers' : 'files');
    setUploading('');
    if (url) setText(what === 'cover' ? 'cover_url' : 'file_url', url);
  };
  const drop = (what: 'cover' | 'file') => ({
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => { e.preventDefault(); take(e.dataTransfer.files[0], what); },
  });

  /* ---------- body toolbar ---------- */
  const edit = (make: (sel: string) => { text: string; from: number; to: number }) => {
    const ta = body.current;
    if (!ta) return;
    const { selectionStart: a, selectionEnd: b, value } = ta;
    const { text, from, to } = make(value.slice(a, b));
    setText(key('body'), value.slice(0, a) + text + value.slice(b));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(a + from, a + to); });
  };
  const wrap = (pre: string, post: string, ph: string) => edit(sel => { const t = sel || ph; return { text: pre + t + post, from: pre.length, to: pre.length + t.length }; });
  const prefix = (p: string, ph: string) => edit(sel => {
    const lines = (sel || ph).split('\n').map(l => p + l).join('\n');
    const lead = body.current && body.current.selectionStart > 0 && body.current.value[body.current.selectionStart - 1] !== '\n' ? '\n' : '';
    return { text: lead + lines, from: lead.length + p.length, to: lead.length + lines.length };
  });
  const insertImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading('image'); setMsg(null);
    const url = await upload(file, 'images');
    setUploading('');
    if (url) edit(() => { const t = `\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n`; return { text: t, from: t.length, to: t.length }; });
  };

  /* ---------- save / delete ---------- */
  async function save(status = f.status) {
    if (!f.title_mn.trim()) { setLang('mn'); setMsg({ ok: false, text: 'Монгол гарчиг заавал хэрэгтэй.' }); return; }
    if (f.slug && !SLUG_RE.test(f.slug)) { setMsg({ ok: false, text: 'URL нэр зөвхөн латин жижиг үсэг, тоо, зураас (-) агуулна.' }); return; }
    setBusy('save'); setMsg(null);
    const payload = { ...f, status };
    const r = await savePost(payload).catch(() => ({ ok: false as const, error: 'Сервертэй холбогдож чадсангүй.' }));
    setBusy('');
    if (!r.ok) { setMsg({ ok: false, text: r.error }); return; }
    const next = { ...payload, id: r.id, slug: r.slug };
    saved.current = JSON.stringify(next);
    setF(next); setSlugTouched(true); setSavedStatus(status);
    if (!initial) { router.replace(`/admin/posts/${r.id}?saved=1`); return; }
    setMsg({ ok: true, text: status === 'published' ? 'Хадгалж, сайтад нийтэллээ.' : 'Хадгалагдлаа.' });
    router.refresh();
  }
  async function remove() {
    if (!f.id || !confirm('Энэ бичлэгийг устгах уу? Буцаах боломжгүй.')) return;
    setBusy('delete');
    const r = await deletePost(f.id).catch(() => ({ ok: false, error: 'Сервертэй холбогдож чадсангүй.' }));
    setBusy('');
    if (!r.ok) { setMsg({ ok: false, text: r.error ?? 'Устгаж чадсангүй.' }); return; }
    saved.current = JSON.stringify(f);
    router.push(`/admin/posts?kind=${f.kind}`);
    router.refresh();
  }

  const isPublished = savedStatus === 'published' && f.status === 'published';
  const publicUrl = `${KIND_PATH[f.kind]}/${f.slug}`;
  const filled = (l: Lang) => !!(f[`title_${l}` as TextKey] as string).trim();
  const tool = 'grid h-8 min-w-8 place-items-center rounded-md px-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5';

  return (
    <form onSubmit={e => { e.preventDefault(); save(); }} className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center gap-3">
        <Link href={`/admin/posts?kind=${f.kind}`} className="text-sm font-medium text-gray-500 hover:text-teal-600">← {KIND_LABEL[f.kind][0]}</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold tracking-tight">{initial ? 'Засах' : `Шинэ ${KIND_LABEL[f.kind][0].toLowerCase()}`}</h1>
        {savedStatus && <StatusBadge status={savedStatus} />}
        {dirty && <span className="text-xs font-medium text-amber-600 dark:text-amber-400">● Хадгалаагүй өөрчлөлттэй</span>}
      </div>

      {msg && (
        <p role={msg.ok ? 'status' : 'alert'} className={`mt-4 rounded-lg px-4 py-2.5 text-sm ${msg.ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>{msg.text}</p>
      )}

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ---------- content, per language ---------- */}
        <div className={card}>
          <div role="tablist" aria-label="Хэл" className="mb-5 inline-flex rounded-lg bg-gray-100 p-1 dark:bg-white/5">
            {LANGS.map(([l, name]) => (
              <button key={l} type="button" role="tab" aria-selected={lang === l} onClick={() => setLang(l)}
                className={`flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${lang === l ? 'bg-white shadow-sm dark:bg-[#1a2630]' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                {name}{l === 'mn' && <span className="text-red-500">*</span>}
                <i className={`h-1.5 w-1.5 rounded-full ${filled(l) ? 'bg-teal-500' : 'bg-gray-300 dark:bg-white/20'}`} />
              </button>
            ))}
          </div>
          {lang !== 'mn' && <p className="-mt-2 mb-4 text-xs text-gray-500 dark:text-gray-400">Хоосон үлдээсэн талбарт монгол хувилбар харагдана.</p>}

          <Label htmlFor="title">Гарчиг{lang === 'mn' && <span className="text-red-500"> *</span>}</Label>
          <input id="title" value={f[key('title')] as string} onChange={e => setText(key('title'), e.target.value)} className={`${input} h-11 text-base font-semibold`} placeholder="Гарчгаа бичнэ үү" />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category" hint="жишээ: Санхүү, Хууль">Ангилал</Label>
              <input id="category" value={f[key('category')] as string} onChange={e => setText(key('category'), e.target.value)} className={`${input} h-10`} />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="summary" hint="картан дээр харагдана">Товч тайлбар</Label>
            <textarea id="summary" rows={3} value={f[key('summary')] as string} onChange={e => setText(key('summary'), e.target.value)} className={`${input} py-2.5 leading-relaxed`} />
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium">Агуулга</span>
              <div className="inline-flex rounded-lg bg-gray-100 p-0.5 text-xs font-medium dark:bg-white/5">
                <button type="button" onClick={() => setPreview(false)} className={`h-7 rounded-md px-2.5 ${!preview ? 'bg-white shadow-sm dark:bg-[#1a2630]' : 'text-gray-500'}`}>Бичих</button>
                <button type="button" onClick={() => setPreview(true)} className={`h-7 rounded-md px-2.5 ${preview ? 'bg-white shadow-sm dark:bg-[#1a2630]' : 'text-gray-500'}`}>Урьдчилж харах</button>
              </div>
            </div>
            {preview ? (
              <div className="min-h-[320px] rounded-lg border border-gray-200 px-5 py-4 dark:border-white/10">
                {(f[key('body')] as string).trim()
                  ? <Markdown text={f[key('body')] as string} className={prose.prose} />
                  : <p className="text-sm text-gray-400">Агуулга хоосон байна.</p>}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-300 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/15 dark:border-white/15">
                <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-1.5 py-1 dark:border-white/10">
                  <button type="button" className={tool} title="Дэд гарчиг" onClick={() => prefix('## ', 'Дэд гарчиг')}>H</button>
                  <button type="button" className={`${tool} font-bold`} title="Тод" onClick={() => wrap('**', '**', 'тод текст')}>B</button>
                  <button type="button" className={`${tool} italic`} title="Налуу" onClick={() => wrap('*', '*', 'налуу текст')}>I</button>
                  <button type="button" className={tool} title="Жагсаалт" onClick={() => prefix('- ', 'жагсаалт')}>•≡</button>
                  <button type="button" className={tool} title="Дугаартай жагсаалт" onClick={() => prefix('1. ', 'жагсаалт')}>1.</button>
                  <button type="button" className={tool} title="Ишлэл" onClick={() => prefix('> ', 'ишлэл')}>❝</button>
                  <button type="button" className={tool} title="Холбоос" onClick={() => edit(sel => { const t = sel || 'холбоосын текст'; const s = `[${t}](https://)`; return { text: s, from: t.length + 3, to: s.length - 1 }; })}>🔗</button>
                  <button type="button" className={tool} title="Зураг оруулах" disabled={!!uploading} onClick={() => bodyImage.current?.click()}>
                    {uploading === 'image' ? '…' : '🖼'}
                  </button>
                  <input ref={bodyImage} type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={e => { insertImage(e.target.files?.[0]); e.target.value = ''; }} />
                </div>
                <textarea ref={body} rows={16} value={f[key('body')] as string} onChange={e => setText(key('body'), e.target.value)}
                  className="block w-full resize-y bg-transparent px-3 py-2.5 font-mono text-[14px] leading-relaxed outline-none"
                  placeholder={'Нийтлэлийн бүтэн агуулга (заавал биш).\n\n## Дэд гарчиг\nЭнгийн догол мөр. **тод**, *налуу*, [холбоос](https://...)\n- жагсаалт'} />
              </div>
            )}
            <p className="mt-1.5 text-xs text-gray-400">Агуулгагүй бол картыг дарахад доорх “Гадаад холбоос” руу (жишээ нь Facebook пост) шилжинэ.</p>
          </div>
        </div>

        {/* ---------- side: publishing and files ---------- */}
        <div className="space-y-4 lg:sticky lg:top-6">
          <div className={card}>
            <Label htmlFor="date">Огноо</Label>
            <input id="date" type="date" required value={f.published_at} onChange={e => setText('published_at', e.target.value)} className={`${input} h-10`} />
            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" checked={f.featured} onChange={e => setF(p => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 accent-teal-500" />
              Онцлох (жагсаалтын эхэнд томоор)
            </label>
            <div className="mt-5 grid gap-2">
              {f.status === 'published' ? (
                <>
                  <button type="submit" disabled={!!busy || !!uploading} className="h-10 rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">{busy === 'save' ? 'Хадгалж байна…' : 'Хадгалах'}</button>
                  <button type="button" disabled={!!busy || !!uploading} onClick={() => save('draft')} className="h-10 rounded-lg border border-gray-300 text-sm font-semibold hover:border-amber-500 hover:text-amber-600 disabled:opacity-60 dark:border-white/15">Нийтлэлээс буцаах (ноорог)</button>
                </>
              ) : (
                <>
                  <button type="button" disabled={!!busy || !!uploading} onClick={() => save('published')} className="h-10 rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">{busy === 'save' ? 'Хадгалж байна…' : 'Нийтлэх'}</button>
                  <button type="submit" disabled={!!busy || !!uploading} className="h-10 rounded-lg border border-gray-300 text-sm font-semibold hover:border-teal-500 hover:text-teal-600 disabled:opacity-60 dark:border-white/15">Ноорог хадгалах</button>
                </>
              )}
              {isPublished && !dirty && (
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-center text-sm font-medium text-teal-600 hover:underline dark:text-teal-400">Сайт дээр харах ↗</a>
              )}
            </div>
          </div>

          <div className={card}>
            <Label htmlFor="kind">Төрөл</Label>
            <select id="kind" value={f.kind} onChange={e => setF(p => ({ ...p, kind: e.target.value as PostKind }))} className={`${input} h-10`}>
              {KINDS.map(k => <option key={k} value={k}>{KIND_LABEL[k][0]}</option>)}
            </select>
            <div className="mt-4">
              <Label htmlFor="slug" hint="латин, жижиг үсэг">URL нэр</Label>
              <input id="slug" value={f.slug} onChange={e => { setSlugTouched(true); setText('slug', e.target.value.toLowerCase()); }}
                className={`${input} h-10 font-mono text-sm ${f.slug && !SLUG_RE.test(f.slug) ? 'border-red-400' : ''}`} placeholder="garchgaas-uusne" />
              <p className="mt-1.5 break-all text-xs text-gray-400">{KIND_PATH[f.kind]}/<b className="font-medium text-gray-600 dark:text-gray-300">{f.slug || '…'}</b></p>
              {slugTouched && <button type="button" onClick={() => { setSlugTouched(false); setText('slug', slugify(f.title_mn)); }} className="mt-1 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400">Гарчгаас дахин үүсгэх</button>}
            </div>
          </div>

          <div className={card} {...drop('cover')}>
            <Label hint="JPG/PNG/WEBP · 10MB">Нүүр зураг</Label>
            {f.cover_url ? (
              <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.cover_url} alt="" className="aspect-[16/9] w-full object-cover" />
                <button type="button" onClick={() => setText('cover_url', '')} className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white hover:bg-black/80">Хасах</button>
              </div>
            ) : (
              <label className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 transition hover:border-teal-500 hover:text-teal-600 dark:border-white/15">
                {uploading === 'cover' ? 'Илгээж байна…' : <><span className="text-2xl">＋</span>Зураг сонгох эсвэл чирж оруулах</>}
                <input type="file" accept={IMAGE_TYPES.join(',')} hidden onChange={e => { take(e.target.files?.[0], 'cover'); e.target.value = ''; }} />
              </label>
            )}
          </div>

          <div className={card} {...drop('file')}>
            <Label hint="PDF · 50MB">Файл (PDF)</Label>
            {f.file_url ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-500/10 text-xs font-bold text-red-600">PDF</span>
                <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium hover:text-teal-600">{fileName(f.file_url)}</a>
                <button type="button" onClick={() => setText('file_url', '')} className="text-xs font-semibold text-gray-500 hover:text-red-600">Хасах</button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-5 text-sm text-gray-500 transition hover:border-teal-500 hover:text-teal-600 dark:border-white/15">
                {uploading === 'file' ? 'Илгээж байна…' : <>＋ PDF сонгох эсвэл чирж оруулах</>}
                <input type="file" accept="application/pdf" hidden onChange={e => { take(e.target.files?.[0], 'file'); e.target.value = ''; }} />
              </label>
            )}
            {f.kind === 'weekly' && <p className="mt-2 text-xs text-gray-400">Тойм нийтлэхэд PDF эсвэл агуулга хэрэгтэй.</p>}
          </div>

          <div className={card}>
            <Label htmlFor="ext" hint="заавал биш">Гадаад холбоос</Label>
            <input id="ext" type="url" value={f.external_url} onChange={e => setText('external_url', e.target.value)} className={`${input} h-10 text-sm`} placeholder="https://www.facebook.com/…" />
          </div>

          {f.id && (
            <button type="button" onClick={remove} disabled={!!busy} className="w-full rounded-lg py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-500/10">
              {busy === 'delete' ? 'Устгаж байна…' : 'Устгах'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

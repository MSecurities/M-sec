import Link from 'next/link';
import { createClient } from '../../../../lib/supabase/server';
import { KINDS, KIND_LABEL, KIND_PATH, fmtDate, type PostKind, type PostStatus } from '../../../../lib/posts';
import { setStatus } from '../../actions';
import { StatusBadge } from '../ui';

export const dynamic = 'force-dynamic';

type Search = { kind?: string; status?: string; q?: string };

export default async function PostList({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const kind = KINDS.includes(sp.kind as PostKind) ? (sp.kind as PostKind) : null;
  const status = sp.status === 'published' || sp.status === 'draft' ? (sp.status as PostStatus) : null;
  const q = (sp.q ?? '').trim();

  const supabase = await createClient();
  let query = supabase.from('posts').select('id,kind,status,slug,title_mn,category_mn,published_at,cover_url,file_url,featured')
    .order('published_at', { ascending: false }).order('created_at', { ascending: false }).limit(200);
  if (kind) query = query.eq('kind', kind);
  if (status) query = query.eq('status', status);
  if (q) query = query.ilike('title_mn', `%${q.replace(/[%_]/g, m => `\\${m}`)}%`);
  const { data: posts, error } = await query;

  const link = (patch: Partial<Search>) => {
    const p = new URLSearchParams();
    const next = { kind: kind ?? undefined, status: status ?? undefined, q: q || undefined, ...patch };
    Object.entries(next).forEach(([k, v]) => { if (v) p.set(k, v); });
    const s = p.toString();
    return `/admin/posts${s ? `?${s}` : ''}`;
  };
  const tab = (active: boolean) => `inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition ${active ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'}`;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{kind ? KIND_LABEL[kind][0] : 'Бүх агуулга'}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{posts?.length ?? 0} бичлэг</p>
        </div>
        <Link href={`/admin/posts/new${kind ? `?kind=${kind}` : ''}`} className="inline-flex h-10 items-center rounded-lg bg-teal-500 px-4 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 hover:bg-teal-600">+ Шинэ нэмэх</Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link href={link({ kind: undefined })} className={tab(!kind)}>Бүгд</Link>
        {KINDS.map(k => <Link key={k} href={link({ kind: k })} className={tab(kind === k)}>{KIND_LABEL[k][0]}</Link>)}
        <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-white/10" />
        <Link href={link({ status: undefined })} className={tab(!status)}>Бүх төлөв</Link>
        <Link href={link({ status: 'published' })} className={tab(status === 'published')}>Нийтлэгдсэн</Link>
        <Link href={link({ status: 'draft' })} className={tab(status === 'draft')}>Ноорог</Link>
        <form className="ml-auto" action="/admin/posts">
          {kind && <input type="hidden" name="kind" value={kind} />}
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Гарчгаар хайх…" aria-label="Гарчгаар хайх"
            className="h-9 w-56 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-white/15 dark:bg-[#0b1117]" />
        </form>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error.message}</p>}

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111a22]">
        {posts?.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {posts.map(p => {
              const k = p.kind as PostKind, st = p.status as PostStatus;
              return (
                <li key={p.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                  <div className="hidden h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/10 sm:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {p.cover_url && <img src={p.cover_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <Link href={`/admin/posts/${p.id}`} className="min-w-0 flex-1 group">
                    <span className="block truncate font-medium group-hover:text-teal-600 dark:group-hover:text-teal-400">{p.featured && <span className="mr-1 text-amber-500" title="Онцлох">★</span>}{p.title_mn}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {!kind && `${KIND_LABEL[k][0]} · `}{fmtDate(p.published_at)}{p.category_mn && ` · ${p.category_mn}`}{p.file_url && ' · PDF'}
                    </span>
                  </Link>
                  <StatusBadge status={st} />
                  <div className="flex shrink-0 items-center gap-1">
                    <form action={setStatus.bind(null, p.id, st === 'published' ? 'draft' : 'published')}>
                      <button className="h-8 rounded-md px-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                        {st === 'published' ? 'Нуух' : 'Нийтлэх'}
                      </button>
                    </form>
                    {st === 'published' && (
                      <a href={`${KIND_PATH[k]}/${p.slug}`} target="_blank" rel="noopener noreferrer" title="Сайт дээр харах"
                        className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-teal-600 dark:hover:bg-white/5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
                      </a>
                    )}
                    <Link href={`/admin/posts/${p.id}`} className="h-8 rounded-md px-2.5 text-xs font-semibold leading-8 text-teal-700 hover:bg-teal-500/10 dark:text-teal-300">Засах</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-5 py-14 text-center text-sm text-gray-500">{q ? `“${q}” гэсэн гарчигтай бичлэг олдсонгүй.` : 'Одоогоор бичлэг алга.'}</p>
        )}
      </div>
    </div>
  );
}

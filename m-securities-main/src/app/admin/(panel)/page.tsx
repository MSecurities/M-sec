import Link from 'next/link';
import { createClient } from '../../../lib/supabase/server';
import { KINDS, KIND_LABEL, fmtDate, type PostKind, type PostStatus } from '../../../lib/posts';
import { StatusBadge } from './ui';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createClient();
  const [{ data: all }, { data: recent }] = await Promise.all([
    supabase.from('posts').select('kind,status'),
    supabase.from('posts').select('id,kind,status,title_mn,published_at,updated_at').order('updated_at', { ascending: false }).limit(8),
  ]);
  const count = (k: PostKind, s?: PostStatus) => (all ?? []).filter(p => p.kind === k && (!s || p.status === s)).length;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold tracking-tight">Хянах самбар</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Судалгаа хэсгийн мэдээ, шинжилгээ, тоймыг эндээс удирдана. Нийтэлсэн агуулга сайтад шууд гарна.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {KINDS.map(k => (
          <div key={k} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#111a22]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{KIND_LABEL[k][0]}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{count(k, 'published')}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">нийтлэгдсэн · {count(k, 'draft')} ноорог</p>
            <div className="mt-4 flex gap-2">
              <Link href={`/admin/posts/new?kind=${k}`} className="inline-flex h-9 items-center rounded-lg bg-teal-500 px-3 text-sm font-semibold text-white hover:bg-teal-600">+ Шинэ</Link>
              <Link href={`/admin/posts?kind=${k}`} className="inline-flex h-9 items-center rounded-lg border border-gray-300 px-3 text-sm font-medium hover:border-teal-500 hover:text-teal-600 dark:border-white/15">Жагсаалт</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#111a22]">
        <h2 className="border-b border-gray-200 px-5 py-4 text-sm font-semibold dark:border-white/10">Сүүлд засварласан</h2>
        {recent?.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {recent.map(p => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/[.03]">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{p.title_mn}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{KIND_LABEL[p.kind as PostKind][0]} · {fmtDate(p.published_at)}</span>
                  </span>
                  <StatusBadge status={p.status as PostStatus} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-gray-500">Одоогоор агуулга алга. Дээрх “+ Шинэ” товчоор эхлүүлнэ үү.</p>
        )}
      </div>
    </div>
  );
}

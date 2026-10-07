import type { PostStatus } from '../../../lib/posts';

export function StatusBadge({ status }: { status: PostStatus }) {
  return status === 'published'
    ? <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><i className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Нийтлэгдсэн</span>
    : <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300"><i className="h-1.5 w-1.5 rounded-full bg-gray-400" />Ноорог</span>;
}

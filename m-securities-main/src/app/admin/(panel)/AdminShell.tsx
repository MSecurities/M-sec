'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut } from '../actions';

const I = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const NAV = [
  { href: '/admin', label: 'Хянах самбар', icon: 'M3 12 12 4l9 8M5 10v10h5v-6h4v6h5V10' },
  { href: '/admin/posts?kind=news', kind: 'news', label: 'Мэдээ', icon: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5' },
  { href: '/admin/posts?kind=analysis', kind: 'analysis', label: 'Судалгаа шинжилгээ', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { href: '/admin/posts?kind=weekly', kind: 'weekly', label: 'Долоо хоногийн тойм', icon: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6' },
];

export default function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname, params]);

  const kindNow = params.get('kind');
  const isActive = (n: (typeof NAV)[number]) =>
    n.kind ? pathname.startsWith('/admin/posts') && kindNow === n.kind : pathname === '/admin';

  const side = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2 px-5 h-16 shrink-0">
        <Image src="/logo.png" alt="M Securities" width={120} height={30} className="h-7 w-auto dark:hidden" style={{ width: 'auto' }} />
        <Image src="/logo-dark.png" alt="M Securities" width={120} height={30} className="h-7 w-auto hidden dark:block" style={{ width: 'auto' }} />
        <span className="ml-1 rounded-md bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Admin</span>
      </Link>
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[.16em] text-gray-400">Судалгаа</p>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} aria-current={isActive(n) ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 h-10 text-sm font-medium transition
              ${isActive(n) ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'}`}>
            <I d={n.icon} />{n.label}
          </Link>
        ))}
        <p className="px-3 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-[.16em] text-gray-400">Сайт</p>
        <a href="/research/news" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 h-10 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
          <I d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />Сайт руу очих
        </a>
        <Link href="/admin/settings" aria-current={pathname === '/admin/settings' ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 h-10 text-sm font-medium transition
            ${pathname === '/admin/settings' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'}`}>
          <I d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v2" />Нууц үг солих
        </Link>
      </nav>
      <div className="border-t border-gray-200 p-4 dark:border-white/10">
        <p className="truncate text-xs text-gray-500 dark:text-gray-400" title={email}>{email}</p>
        <form action={signOut}>
          <button className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 h-9 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-500/10 dark:hover:text-red-300">
            <I d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />Гарах
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-gray-200 bg-white dark:border-white/10 dark:bg-[#0e161d] lg:block">{side}</aside>
      {/* phone: top bar + drawer */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-[#0e161d]/90 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="M Securities" width={110} height={28} className="h-6 w-auto dark:hidden" style={{ width: 'auto' }} />
          <Image src="/logo-dark.png" alt="M Securities" width={110} height={28} className="h-6 w-auto hidden dark:block" style={{ width: 'auto' }} />
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Цэс" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
          <I d="M4 7h16M4 12h16M4 17h16" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-[#0e161d]">{side}</aside>
        </div>
      )}
      <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
    </div>
  );
}

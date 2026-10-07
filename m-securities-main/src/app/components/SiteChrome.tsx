'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

// The site navbar / footer (with its ticker) stay off the admin area, which has its own shell.
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith('/admin') ? null : <>{children}</>;
}

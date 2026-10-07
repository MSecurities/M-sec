import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Админ | M Securities',
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b1117] dark:text-gray-100">{children}</div>;
}

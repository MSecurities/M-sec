import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { signOut } from '../actions';
import AdminShell from './AdminShell';

// Signed-in users who are not on the admin list get a notice instead of the panel.
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect('/admin/login');
  const email = typeof claims.email === 'string' ? claims.email : '';
  const { data: me } = await supabase.from('admin_users').select('user_id').eq('user_id', claims.sub).maybeSingle();

  if (!me) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#111a22]">
          <h1 className="text-xl font-bold">Админ эрх алга</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <b className="text-gray-700 dark:text-gray-200">{email}</b> хаягаар нэвтэрсэн ч админы жагсаалтад бүртгэлгүй байна. Системийн админд хандана уу.
          </p>
          <form action={signOut} className="mt-6">
            <button className="h-10 px-5 rounded-lg border border-gray-300 text-sm font-semibold hover:border-teal-500 hover:text-teal-600 dark:border-white/15">Гарах</button>
          </form>
        </div>
      </div>
    );
  }
  return <AdminShell email={email}>{children}</AdminShell>;
}

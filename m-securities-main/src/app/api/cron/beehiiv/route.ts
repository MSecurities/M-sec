import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { syncBeehiiv } from '../../../../lib/beehiiv';

// Optional scheduled endpoint (add a Vercel cron for it if Supabase Cron is not used): copies new beehiiv newsletters into "Долоо хоногийн тойм".
// Vercel calls it with "Authorization: Bearer <CRON_SECRET>"; anyone else gets 401.
// Writes with the Supabase service-role key because no one is signed in here.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`)
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY тохируулаагүй байна.' }, { status: 500 });
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const result = await syncBeehiiv(db);
  const added = result.items.filter(i => i.action === 'added');
  if (added.length) {
    revalidatePath('/research/weekly');
    added.forEach(i => revalidatePath(`/research/weekly/${i.slug}`));
    revalidatePath('/admin', 'layout');
  }
  if (!result.ok) console.error('[beehiiv-sync]', result.error ?? result.items.filter(i => i.action === 'error'));
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

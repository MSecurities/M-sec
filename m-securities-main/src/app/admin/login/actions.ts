'use server';
import { headers } from 'next/headers';
import { createClient } from '../../../lib/supabase/server';

// Password-only sign-in: there is one admin account whose e-mail lives in the server environment
// (ADMIN_EMAIL); the visitor only types the password. Supabase Auth checks it and sets the session
// cookies. Failed attempts are throttled per IP on top of Supabase's own limits.

const WINDOW = 15 * 60 * 1000, MAX_FAILS = 5;
const fails = new Map<string, { n: number; first: number }>();

async function clientIp() {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'local';
}

export async function passwordLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  const email = process.env.ADMIN_EMAIL;
  if (!email) return { ok: false, error: 'Сервер дээр ADMIN_EMAIL тохируулаагүй байна.' };
  if (typeof password !== 'string' || !password || password.length > 200) return { ok: false, error: 'Нууц үгээ оруулна уу.' };

  const ip = await clientIp(), now = Date.now();
  const rec = fails.get(ip);
  if (rec && now - rec.first > WINDOW) fails.delete(ip);
  const cur = fails.get(ip);
  if (cur && cur.n >= MAX_FAILS) {
    const mins = Math.ceil((WINDOW - (now - cur.first)) / 60000);
    return { ok: false, error: `Хэт олон буруу оролдлого. ${mins} минутын дараа дахин оролдоно уу.` };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    fails.set(ip, cur ? { ...cur, n: cur.n + 1 } : { n: 1, first: now });
    await new Promise(r => setTimeout(r, 600)); // slows guessing a little more
    if (error.code === 'over_request_rate_limit') return { ok: false, error: 'Хэт олон оролдлого. Түр хүлээгээд дахин оролдоно уу.' };
    return { ok: false, error: 'Нууц үг буруу байна.' };
  }
  fails.delete(ip);
  return { ok: true };
}

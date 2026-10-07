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
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    if (error.code === 'over_request_rate_limit') return { ok: false, error: 'Хэт олон оролдлого. Түр хүлээгээд дахин оролдоно уу.' };
    // only a rejected password counts as a wrong guess; anything else is a setup or network problem
    if (error.code !== 'invalid_credentials') {
      console.error('[admin login]', error.code, error.status, error.message);
      return { ok: false, error: `Нэвтрэх үйлчилгээтэй холбогдож чадсангүй (${error.code ?? error.status ?? 'алдаа'}). Серверийн Supabase тохиргоог шалгана уу.` };
    }
    fails.set(ip, cur ? { ...cur, n: cur.n + 1 } : { n: 1, first: now });
    await new Promise(r => setTimeout(r, 600)); // slows guessing a little more
    return { ok: false, error: 'Нууц үг буруу байна.' };
  }
  fails.delete(ip);
  return { ok: true };
}

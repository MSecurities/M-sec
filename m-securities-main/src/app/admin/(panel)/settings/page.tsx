'use client';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { changePassword } from '../../actions';

const input = 'w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-[15px] outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/15 dark:border-white/15 dark:bg-[#0b1117]';

export default function Settings() {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const mismatch = !!again && next !== again;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (next.length < 10) { setMsg({ ok: false, text: 'Шинэ нууц үг дор хаяж 10 тэмдэгт байна.' }); return; }
    if (next !== again) { setMsg({ ok: false, text: 'Шинэ нууц үгнүүд таарахгүй байна.' }); return; }
    setBusy(true); setMsg(null);
    const r = await changePassword(cur, next).catch(() => ({ ok: false, error: 'Сервертэй холбогдож чадсангүй.' }));
    setBusy(false);
    if (!r.ok) { setMsg({ ok: false, text: r.error ?? 'Солих боломжгүй.' }); return; }
    setCur(''); setNext(''); setAgain('');
    setMsg({ ok: true, text: 'Нууц үг солигдлоо. Дараагийн нэвтрэлтэд шинэ нууц үгээ ашиглана.' });
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold tracking-tight">Нууц үг солих</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Админ хэсэгт нэвтрэх нууц үг. Дор хаяж 10 тэмдэгт, үсэг тоо холих нь зүйтэй.</p>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#111a22]">
        <div>
          <label htmlFor="cur" className="mb-1.5 block text-sm font-medium">Одоогийн нууц үг</label>
          <input id="cur" type="password" autoComplete="current-password" required value={cur} onChange={e => setCur(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="next" className="mb-1.5 block text-sm font-medium">Шинэ нууц үг</label>
          <input id="next" type="password" autoComplete="new-password" required minLength={10} value={next} onChange={e => setNext(e.target.value)} className={input} />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10" aria-hidden="true">
            <div className={`h-full rounded-full transition-all ${next.length >= 14 ? 'bg-emerald-500' : next.length >= 10 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (next.length / 14) * 100)}%` }} />
          </div>
        </div>
        <div>
          <label htmlFor="again" className="mb-1.5 block text-sm font-medium">Шинэ нууц үг (дахин)</label>
          <input id="again" type="password" autoComplete="new-password" required value={again} onChange={e => setAgain(e.target.value)} className={`${input} ${mismatch ? 'border-red-400' : ''}`} aria-invalid={mismatch} />
          {mismatch && <p className="mt-1.5 text-xs text-red-600">Таарахгүй байна.</p>}
        </div>
        {msg && <p role={msg.ok ? 'status' : 'alert'} className={`rounded-lg px-3 py-2 text-sm ${msg.ok ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>{msg.text}</p>}
        <button type="submit" disabled={busy || !cur || !next || !again} className="h-11 w-full rounded-lg bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600 disabled:opacity-60">
          {busy ? 'Сольж байна…' : 'Нууц үг солих'}
        </button>
      </form>
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '../../context/DarkModeContext';
import { onest } from '../../components/services/parts';
import { passwordLogin } from './actions';
import s from './login.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState('');
  const [shakes, setShakes] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);

  const capsCheck = (e: KeyboardEvent<HTMLInputElement>) => setCaps(e.getModifierState?.('CapsLock') ?? false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pw || busy || ok) return;
    setBusy(true); setError('');
    const r = await passwordLogin(pw).catch(() => ({ ok: false, error: 'Сервертэй холбогдож чадсангүй.' }));
    setBusy(false);
    if (!r.ok) {
      setError(r.error ?? 'Нууц үг буруу байна.');
      setShakes(n => n + 1);
      requestAnimationFrame(() => input.current?.select());
      return;
    }
    setOk(true);
    // back to the admin page that sent us here, if any
    const next = new URLSearchParams(location.search).get('next');
    setTimeout(() => {
      router.replace(next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
      router.refresh();
    }, 650);
  };

  return (
    <div className={`${onest.variable} ${s.root}`}>
      <div className={s.bg} aria-hidden="true"><div className={s.orb} /></div>
      <button type="button" className={s.theme} onClick={toggleDarkMode} aria-label="Өнгөний горим солих">
        {isDarkMode
          ? <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="9" cy="9" r="3.4" /><path d="M9 1.5v1.8M9 14.7v1.8M1.5 9h1.8M14.7 9h1.8M3.7 3.7l1.3 1.3M13 13l1.3 1.3M3.7 14.3 5 13M13 5l1.3-1.3" /></svg>
          : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 11.2A6 6 0 0 1 6.8 3.5a6 6 0 1 0 7.7 7.7Z" /></svg>}
      </button>

      <main className={s.wrap}>
        <div className={s.brand}>
          <Image src={isDarkMode ? '/logo-dark.png' : '/logo.png'} alt="M Securities" width={150} height={38} className={s.logo} priority style={{ width: 'auto' }} />
          <span className={s.role}>
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 1.5 15 3.7V8.4c0 3.4-2.6 6.2-6 7.1-3.4-.9-6-3.7-6-7.1V3.7Z" /></svg>
            АДМИН
          </span>
        </div>

        <section className={`${s.card}${ok ? ` ${s.ok}` : ''}`} aria-labelledby="login-t">
          <div className={s.lock} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path className={s.shackle} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><path d="M12 14.5v2" /></svg>
          </div>
          <h1 id="login-t">Нэвтрэх</h1>
          <p className={s.sub}>Сайтын агуулгыг удирдах хэсэг</p>

          <form className={s.form} onSubmit={submit} noValidate>
            <div className={s['label-row']}>
              <label htmlFor="pw">Нууц үг</label>
              <span className={`${s.caps}${caps ? ` ${s.on}` : ''}`} aria-live="polite">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2 3 8h3v5h4V8h3Z" /></svg>
                {caps ? 'Caps Lock асаалттай' : ''}
              </span>
            </div>
            <div key={shakes} className={`${s.field}${error ? ` ${s.err}` : ''}${shakes ? ` ${s.shake}` : ''}`}>
              <input ref={input} id="pw" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Нууц үгээ оруулна уу" required
                value={pw} onChange={e => { setPw(e.target.value); setError(''); }} onKeyDown={capsCheck} onKeyUp={capsCheck} onBlur={() => setCaps(false)}
                aria-describedby="login-msg" aria-invalid={!!error} readOnly={ok} />
              <svg className={s.key} width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="6.5" cy="13.5" r="3.5" /><path d="M9 11 17 3M14 6l2 2M12 8l1.5 1.5" /></svg>
              <button type="button" className={s.eye} aria-pressed={show} aria-label={show ? 'Нууц үг нуух' : 'Нууц үг харах'} onClick={() => { setShow(!show); input.current?.focus(); }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1.8 10S5 4.2 10 4.2 18.2 10 18.2 10 15 15.8 10 15.8 1.8 10 1.8 10Z" /><circle cx="10" cy="10" r="2.6" /><path className={s.slash} d="M3 17 17 3" /></svg>
              </button>
            </div>
            <p className={s.msg} id="login-msg" role="alert">{error}</p>
            <button className={`${s.go}${busy ? ` ${s.loading}` : ''}`} type="submit" disabled={!pw || busy || ok}>
              <span className={s.lbl}>{ok ? 'Амжилттай' : 'Нэвтрэх'}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className={s.spin} />
            </button>
          </form>
        </section>

        <p className={s.foot}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6.3" /><path d="M8 7.2v4M8 4.8v.1" /></svg>
          Нууц үгээ мартсан бол системийн админд хандана уу.
        </p>
      </main>
    </div>
  );
}

'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';
import { KINDS, KIND_PATH, SLUG_RE, slugify, type PostKind, type PostStatus } from '../../lib/posts';

export type PostInput = {
  id?: string;
  kind: PostKind;
  status: PostStatus;
  slug: string;
  published_at: string;
  title_mn: string; title_en: string; title_zh: string;
  summary_mn: string; summary_en: string; summary_zh: string;
  body_mn: string; body_en: string; body_zh: string;
  category_mn: string; category_en: string; category_zh: string;
  cover_url: string; file_url: string; external_url: string;
  featured: boolean;
};
export type ActionResult = { ok: true; id: string; slug: string } | { ok: false; error: string };

const clean = (v?: string | null) => { const t = (v ?? '').trim(); return t || null; };
const okUrl = (v: string | null) => !v || /^(https?:\/\/|\/(?!\/))/i.test(v);

// The admin check runs again here (the layout already did it) and RLS enforces it in the database too.
async function admin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims?.sub;
  if (!uid) return { supabase, error: 'Нэвтрэх шаардлагатай.' };
  const { data: me } = await supabase.from('admin_users').select('user_id').eq('user_id', uid).maybeSingle();
  return { supabase, error: me ? null : 'Танд админ эрх алга.' };
}

function refresh(...posts: ({ kind: PostKind; slug: string } | null | undefined)[]) {
  for (const p of posts) {
    if (!p) continue;
    revalidatePath(KIND_PATH[p.kind]);
    revalidatePath(`${KIND_PATH[p.kind]}/${p.slug}`);
  }
  revalidatePath('/admin', 'layout');
}

export async function savePost(input: PostInput): Promise<ActionResult> {
  const { supabase, error } = await admin();
  if (error) return { ok: false, error };

  const title = clean(input.title_mn);
  if (!title) return { ok: false, error: 'Монгол гарчиг заавал хэрэгтэй.' };
  if (!KINDS.includes(input.kind)) return { ok: false, error: 'Төрөл буруу байна.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.published_at)) return { ok: false, error: 'Огноо буруу байна.' };
  const row = {
    kind: input.kind,
    status: input.status === 'published' ? 'published' : 'draft',
    published_at: input.published_at,
    title_mn: title, title_en: clean(input.title_en), title_zh: clean(input.title_zh),
    summary_mn: clean(input.summary_mn), summary_en: clean(input.summary_en), summary_zh: clean(input.summary_zh),
    body_mn: clean(input.body_mn), body_en: clean(input.body_en), body_zh: clean(input.body_zh),
    category_mn: clean(input.category_mn), category_en: clean(input.category_en), category_zh: clean(input.category_zh),
    cover_url: clean(input.cover_url), file_url: clean(input.file_url), external_url: clean(input.external_url),
    featured: !!input.featured,
  } as const;
  for (const [k, label] of [['cover_url', 'Зургийн'], ['file_url', 'Файлын'], ['external_url', 'Холбоосын']] as const)
    if (!okUrl(row[k])) return { ok: false, error: `${label} хаяг http(s):// эсвэл /-ээр эхлэх ёстой.` };
  if (row.kind === 'weekly' && row.status === 'published' && !row.file_url && !row.body_mn)
    return { ok: false, error: 'Долоо хоногийн тойм нийтлэхэд PDF файл эсвэл агуулга хэрэгтэй.' };

  let slug = clean(input.slug) ?? slugify(title);
  if (!slug) slug = `${input.kind}-${input.published_at}`;
  if (!SLUG_RE.test(slug)) return { ok: false, error: 'URL нэр зөвхөн латин жижиг үсэг, тоо, зураас (-) агуулна.' };

  if (input.id) {
    const { data: before } = await supabase.from('posts').select('kind,slug').eq('id', input.id).maybeSingle();
    const { data, error: e } = await supabase.from('posts').update({ ...row, slug }).eq('id', input.id).select('id,slug').maybeSingle();
    if (e) return { ok: false, error: e.code === '23505' ? 'Энэ URL нэр өөр нийтлэлд ашиглагдсан байна.' : e.message };
    if (!data) return { ok: false, error: 'Нийтлэл олдсонгүй эсвэл засах эрхгүй.' };
    refresh(before as { kind: PostKind; slug: string } | null, { kind: row.kind, slug: data.slug });
    return { ok: true, id: data.id, slug: data.slug };
  }

  // new post: a taken slug gets -2, -3, …
  for (let n = 1; n <= 20; n++) {
    const candidate = n === 1 ? slug : `${slug}-${n}`;
    const { data, error: e } = await supabase.from('posts').insert({ ...row, slug: candidate }).select('id,slug').single();
    if (!e && data) { refresh({ kind: row.kind, slug: data.slug }); return { ok: true, id: data.id, slug: data.slug }; }
    if (e?.code !== '23505') return { ok: false, error: e?.message ?? 'Хадгалж чадсангүй.' };
  }
  return { ok: false, error: 'Давхардаагүй URL нэр олдсонгүй.' };
}

export async function deletePost(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error } = await admin();
  if (error) return { ok: false, error };
  const { data, error: e } = await supabase.from('posts').delete().eq('id', id)
    .select('kind,slug,cover_url,file_url,body_mn,body_en,body_zh').maybeSingle();
  if (e) return { ok: false, error: e.message };
  if (data) {
    // the post's own uploads (cover, PDF, images in the body) go with it
    const marker = '/storage/v1/object/public/research/';
    const text = [data.cover_url, data.file_url, data.body_mn, data.body_en, data.body_zh].filter(Boolean).join(' ');
    const paths = [...new Set([...text.matchAll(/https?:\/\/[^\s)"']+/g)].map(m => m[0]).filter(u => u.includes(marker))
      .map(u => decodeURIComponent(u.split(marker)[1].split(/[?#]/)[0])))];
    if (paths.length) await supabase.storage.from('research').remove(paths);
  }
  refresh(data as { kind: PostKind; slug: string } | null);
  return { ok: true };
}

// Publish / unpublish straight from the list (form action)
export async function setStatus(id: string, status: PostStatus): Promise<void> {
  const { supabase, error } = await admin();
  if (error) return;
  const { data } = await supabase.from('posts').update({ status }).eq('id', id).select('kind,slug').maybeSingle();
  refresh(data as { kind: PostKind; slug: string } | null);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// The shared admin account's password, changed from /admin/settings after re-entering the current one
export async function changePassword(current: string, next: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase, error } = await admin();
  if (error) return { ok: false, error };
  if (typeof next !== 'string' || next.length < 10) return { ok: false, error: 'Шинэ нууц үг дор хаяж 10 тэмдэгт байна.' };
  if (next.length > 72) return { ok: false, error: 'Шинэ нууц үг 72 тэмдэгтээс ихгүй байна.' };
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === 'string' ? data.claims.email : '';
  const { error: wrong } = await supabase.auth.signInWithPassword({ email, password: current });
  if (wrong) return { ok: false, error: 'Одоогийн нууц үг буруу байна.' };
  const { error: e } = await supabase.auth.updateUser({ password: next });
  if (e) return { ok: false, error: e.code === 'same_password' ? 'Шинэ нууц үг хуучинтайгаа ижил байна.' : e.message };
  return { ok: true };
}

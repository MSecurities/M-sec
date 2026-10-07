import { createPublicClient } from './supabase/server';
import { POST_COLUMNS, type Post, type PostKind } from './posts';

// Published posts for the public pages. A missing configuration or an outage leaves the page empty
// instead of failing it.
export async function listPosts(kind: PostKind, limit = 120): Promise<Post[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data, error } = await db.from('posts').select(POST_COLUMNS)
    .eq('kind', kind).eq('status', 'published')
    .order('published_at', { ascending: false }).order('created_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('[posts] list', kind, error.message); return []; }
  return (data ?? []) as Post[];
}

export async function getPost(kind: PostKind, slug: string): Promise<Post | null> {
  const db = createPublicClient();
  if (!db) return null;
  const { data, error } = await db.from('posts').select(POST_COLUMNS)
    .eq('kind', kind).eq('slug', slug).eq('status', 'published').maybeSingle();
  if (error) { console.error('[posts] get', kind, slug, error.message); return null; }
  return data as Post | null;
}

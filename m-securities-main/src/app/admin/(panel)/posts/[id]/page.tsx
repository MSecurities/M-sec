import { notFound } from 'next/navigation';
import { createClient } from '../../../../../lib/supabase/server';
import { POST_COLUMNS, type Post } from '../../../../../lib/posts';
import PostForm from '../PostForm';

export const dynamic = 'force-dynamic';

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select(POST_COLUMNS).eq('id', id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;
  return <PostForm initial={post} kind={post.kind} />;
}

import { KINDS, type PostKind } from '../../../../../lib/posts';
import PostForm from '../PostForm';

export default async function NewPost({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  return <PostForm initial={null} kind={KINDS.includes(kind as PostKind) ? (kind as PostKind) : 'news'} />;
}

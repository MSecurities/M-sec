import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, listPosts } from '../../lib/posts.server';
import { KIND_LABEL, KIND_PATH, type PostKind } from '../../lib/posts';
import ResearchList from './ResearchList';
import ResearchArticle from './ResearchArticle';

// The three research sections share their list and article routes; content comes from /admin.
// Pages are cached and refreshed every 5 minutes, and at once when an admin saves.

export const listPage = (kind: PostKind) => async function List() {
  return <ResearchList kind={kind} posts={await listPosts(kind)} />;
};
export const listMetadata = (kind: PostKind): Metadata => ({
  title: `${KIND_LABEL[kind][0]} | M Securities`,
  alternates: { canonical: `https://msecurities.mn${KIND_PATH[kind]}` },
});

type Params = { params: Promise<{ slug: string }> };
export const articlePage = (kind: PostKind) => async function Article({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(kind, slug);
  if (!post) notFound();
  return <ResearchArticle post={post} />;
};
export const articleMetadata = (kind: PostKind) => async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(kind, slug);
  if (!post) return { title: 'M Securities' };
  const description = (post.summary_mn ?? post.body_mn ?? '').replace(/\s+/g, ' ').slice(0, 180);
  const url = `https://msecurities.mn${KIND_PATH[kind]}/${post.slug}`;
  return {
    title: `${post.title_mn} | M Securities`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article', url, title: post.title_mn, description, siteName: 'M Securities',
      publishedTime: post.published_at,
      ...(post.cover_url ? { images: [{ url: post.cover_url }] } : {}),
    },
  };
};

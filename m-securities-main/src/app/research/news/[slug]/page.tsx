import { articleMetadata, articlePage } from '../../routes';

export const revalidate = 300;
// nothing prebuilt: each article is rendered on its first visit, then served from cache (ISR)
export const generateStaticParams = async () => [];
export const generateMetadata = articleMetadata('news');
export default articlePage('news');

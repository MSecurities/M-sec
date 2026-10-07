import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'Бидний тухай | M Securities',
  description: 'М Секьюритис ҮЦК — М-Си-Эс Холдинг ХХК-ийн охин компани. Танилцуулга, алсын хараа, эрхэм зорилго, үнэт зүйлс, манай баг.',
  alternates: { canonical: 'https://msecurities.mn/about' },
};

export default function Page() {
  return <AboutPage />;
}

import type { Metadata } from 'next';
import TermsPage from './TermsPage';

export const metadata: Metadata = {
  title: 'Үйлчилгээний нөхцөл, нууцлалын бодлого | M Securities',
  description: '“М Секьюритис ҮЦК” ХХК-ийн онлайн системээр үйлчилгээ авах нөхцөл, харилцагчийн мэдээллийг цуглуулах, ашиглах, хадгалах, хамгаалах нууцлалын бодлого.',
  alternates: { canonical: 'https://msecurities.mn/terms' },
};

export default function Page() {
  return <TermsPage />;
}

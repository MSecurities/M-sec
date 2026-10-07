import { redirect } from 'next/navigation';

// The About section is one page now; old links land on their section
export default function Page() {
  redirect('/about#introduction');
}

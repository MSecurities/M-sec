import { redirect } from 'next/navigation';

// Removed from the FAQ menu; old links land on the FAQ
export default function FaqManageAccount() {
  redirect('/faq/common-questions');
}

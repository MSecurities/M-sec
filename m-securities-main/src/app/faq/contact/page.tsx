import { redirect } from 'next/navigation';

// Removed from the FAQ menu: contact details live on /contact (and in the footer)
export default function FaqContact() {
  redirect('/contact');
}

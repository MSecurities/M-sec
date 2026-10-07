import { createBrowserClient } from '@supabase/ssr';

// Browser client (admin pages): keeps the session in cookies the middleware refreshes.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

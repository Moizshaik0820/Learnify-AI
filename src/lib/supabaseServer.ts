import { createClient } from '@supabase/supabase-js';

const rawUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://emkeoulksymofnelsjmc.supabase.co';

// Server-side: use SUPABASE_SERVICE_ROLE_KEY if available (bypasses RLS for public leaderboard ranking),
// otherwise fallback to NEXT_PUBLIC_SUPABASE_ANON_KEY
const serverKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_OD2AL2p0brhRY0KUARdlQA_086HHacM';

export const supabaseServer = createClient(rawUrl.trim(), serverKey.trim(), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

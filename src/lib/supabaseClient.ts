import { createClient } from '@supabase/supabase-js';

const rawUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://emkeoulksymofnelsjmc.supabase.co';
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_OD2AL2p0brhRY0KUARdlQA_086HHacM';

// Clean any accidental whitespace or newlines
const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
);

// Hardcoded, secure Supabase client connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

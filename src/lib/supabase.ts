import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gseueojxksbhbgvisshq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseAnonKey && supabaseAnonKey.trim().length > 10 && !supabaseAnonKey.includes('YOUR_')
);

// Fallback dummy client for SSR or when anon key is not yet set
const dummyClient = createClient(
  supabaseUrl,
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export const supabase: SupabaseClient = dummyClient;

export function getSupabaseConnectionInfo() {
  return {
    url: supabaseUrl,
    isConfigured: isSupabaseConfigured,
    hasKey: Boolean(supabaseAnonKey && supabaseAnonKey.length > 0),
  };
}

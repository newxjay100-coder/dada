import { createClient, SupabaseClient } from '@supabase/supabase-js';

const defaultUrl = 'https://gseueojxksbhbgvisshq.supabase.co';
const defaultAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzZXVlb2p4a3NiaGJndmlzc2hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNjU5ODAsImV4cCI6MjEwNjg0MTk4MH0.OYM9CwrRd01j7bFGxdUez3hPTRTf6LnzLM8iFuoKeEM';

function getStoredUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dassoba_supabase_url');
    if (stored && stored.trim().startsWith('http')) return stored.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || defaultUrl;
}

function getStoredAnonKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dassoba_supabase_anon_key');
    if (stored && stored.trim().length > 10) return stored.trim();
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;
}

let activeUrl = getStoredUrl();
let activeAnonKey = getStoredAnonKey();

export function checkIsConfigured(key: string): boolean {
  return Boolean(key && key.trim().length > 15 && !key.includes('YOUR_'));
}

export let isSupabaseConfigured = checkIsConfigured(activeAnonKey);

function buildClient(url: string, key: string): SupabaseClient {
  return createClient(
    url || defaultUrl,
    key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
}

let currentClient: SupabaseClient = buildClient(activeUrl, activeAnonKey);

/**
 * Dynamic Supabase Client Proxy
 * Delegates all property accesses to the currently active Supabase instance,
 * enabling runtime key updates without requiring Vite restarts.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (currentClient as any)[prop];
  },
});

export function getSupabaseConnectionInfo() {
  return {
    url: activeUrl,
    anonKey: activeAnonKey ? `${activeAnonKey.slice(0, 8)}...${activeAnonKey.slice(-6)}` : '',
    fullAnonKey: activeAnonKey,
    isConfigured: isSupabaseConfigured,
    hasKey: Boolean(activeAnonKey && activeAnonKey.length > 0),
  };
}

export function isSupabaseReady(): boolean {
  return checkIsConfigured(activeAnonKey);
}

/**
 * Dynamically updates the Supabase URL and Anon Key in runtime and localStorage
 */
export function updateSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    const trimmedUrl = url.trim() || defaultUrl;
    const trimmedKey = anonKey.trim();

    activeUrl = trimmedUrl;
    activeAnonKey = trimmedKey;
    isSupabaseConfigured = checkIsConfigured(trimmedKey);

    if (typeof window !== 'undefined') {
      localStorage.setItem('dassoba_supabase_url', trimmedUrl);
      if (trimmedKey) {
        localStorage.setItem('dassoba_supabase_anon_key', trimmedKey);
      } else {
        localStorage.removeItem('dassoba_supabase_anon_key');
      }

      // Persist to .env file directly via dev server endpoint
      fetch('/api/save-supabase-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl, anonKey: trimmedKey }),
      }).catch((e) => console.warn('Could not persist to .env:', e));

      window.dispatchEvent(
        new CustomEvent('supabase_config_changed', {
          detail: { isConfigured: isSupabaseConfigured, url: activeUrl },
        })
      );
    }

    currentClient = buildClient(activeUrl, activeAnonKey);
    return true;
  } catch (err) {
    console.error('Failed to update Supabase config:', err);
    return false;
  }
}

/**
 * Pings Supabase to check actual connectivity and table status
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  message: string;
  tables?: { [name: string]: boolean };
  latencyMs?: number;
}> {
  if (!isSupabaseReady()) {
    return {
      ok: false,
      message: 'Supabase Anon Key가 아직 설정되지 않았습니다. 관리자 센터에서 키를 등록해주세요.',
    };
  }

  const startTime = Date.now();
  const tables: { [name: string]: boolean } = {};

  try {
    // 1. Check products table
    const { error: prodErr } = await currentClient.from('products').select('id').limit(1);
    tables['products'] = !prodErr;

    // 2. Check profiles table
    const { error: profErr } = await currentClient.from('profiles').select('id').limit(1);
    tables['profiles'] = !profErr;

    // 3. Check orders table
    const { error: ordErr } = await currentClient.from('orders').select('id').limit(1);
    tables['orders'] = !ordErr;

    // 4. Check header features tables
    const { error: cartErr } = await currentClient.from('cart_items').select('id').limit(1);
    tables['cart_items'] = !cartErr;

    const { error: wishErr } = await currentClient.from('wishlists').select('id').limit(1);
    tables['wishlists'] = !wishErr;

    const { error: searchErr } = await currentClient.from('search_logs').select('id').limit(1);
    tables['search_logs'] = !searchErr;

    const { error: inqErr } = await currentClient.from('inquiries').select('id').limit(1);
    tables['inquiries'] = !inqErr;

    const { error: addrErr } = await currentClient.from('user_addresses').select('id').limit(1);
    tables['user_addresses'] = !addrErr;

    const { error: roleLogErr } = await currentClient.from('role_audit_logs').select('id').limit(1);
    tables['role_audit_logs'] = !roleLogErr;

    const { error: authLogErr } = await currentClient.from('auth_logs').select('id').limit(1);
    tables['auth_logs'] = !authLogErr;

    const latencyMs = Date.now() - startTime;
    const anyTableOk = Object.values(tables).some(Boolean);

    if (anyTableOk) {
      return {
        ok: true,
        message: `Supabase 클라우드 데이터베이스와 정상적으로 연결되었습니다 (${latencyMs}ms)`,
        tables,
        latencyMs,
      };
    } else {
      return {
        ok: true,
        message: `Supabase 연결 성공 (테이블 생성 전이거나 RLS 정책 확인 필요, ${latencyMs}ms)`,
        tables,
        latencyMs,
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      message: `Supabase 연결 오류: ${err.message || '네트워크 통신 실패'}`,
      latencyMs: Date.now() - startTime,
    };
  }
}

import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Copy,
  Check,
  Server,
  Key,
  Shield,
  Layers,
  Sparkles,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import {
  getSupabaseConnectionInfo,
  updateSupabaseConfig,
  testSupabaseConnection,
} from '@/lib/supabase';
import { api } from '@/services/api';
import { useToast } from '@/context/ToastContext';

export const AdminSupabaseCenterPage: React.FC = () => {
  const [connInfo, setConnInfo] = useState(getSupabaseConnectionInfo);
  const [inputUrl, setInputUrl] = useState(connInfo.url);
  const [inputKey, setInputKey] = useState(connInfo.fullAnonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncingPush, setIsSyncingPush] = useState(false);
  const [isSyncingPull, setIsSyncingPull] = useState(false);
  const [isSyncingAttached, setIsSyncingAttached] = useState(false);
  const [attachedStorageUrl, setAttachedStorageUrl] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    tables?: { [name: string]: boolean };
    latencyMs?: number;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const { showToast } = useToast();

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
      if (res.ok) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (e: any) {
      setTestResult({ ok: false, message: e.message || '테스트 실패' });
      showToast('연결 테스트 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateSupabaseConfig(inputUrl, inputKey);
    if (success) {
      setConnInfo(getSupabaseConnectionInfo());
      showToast('Supabase 연결 설정이 실시간으로 저장 및 적용되었습니다.', 'success');
      handleTestConnection();
    } else {
      showToast('설정 저장에 실패했습니다.', 'error');
    }
  };

  const handlePushAll = async () => {
    if (
      !window.confirm(
        '로컬에 저장된 모든 상품, 회원, 이벤트, 주문, 배송, 원부자재, 발주, 세금계산서 데이터를 Supabase 클라우드로 즉시 업로드하시겠습니까?'
      )
    ) {
      return;
    }

    setIsSyncingPush(true);
    try {
      const res = await api.syncAllToSupabase();
      if (res.success) {
        showToast(
          `전체 데이터 업로드 완료! (상품: ${res.syncedCounts.products}개, 회원: ${res.syncedCounts.profiles}명, 주문: ${res.syncedCounts.orders}건, 배송: ${res.syncedCounts.deliveries}건, 원부자재: ${res.syncedCounts.materials}건, 발주: ${res.syncedCounts.purchaseOrders}건, 세금계산서: ${res.syncedCounts.taxDocuments}건)`,
          'success'
        );
      } else {
        showToast(`일부 업로드 실패: ${res.errors.join(', ')}`, 'info');
      }
    } catch (err: any) {
      showToast(`업로드 오류: ${err.message}`, 'error');
    } finally {
      setIsSyncingPush(false);
    }
  };

  const handlePullAll = async () => {
    if (!window.confirm('Supabase 클라우드 데이터베이스에서 최신 데이터를 가져와 동기화하시겠습니까?')) {
      return;
    }

    setIsSyncingPull(true);
    try {
      const res = await api.syncAllFromSupabase();
      if (res.success) {
        showToast(
          `데이터 가져오기 완료! (상품: ${res.pulledCounts.products}개, 회원: ${res.pulledCounts.profiles}명, 주문: ${res.pulledCounts.orders}건, 원부자재: ${res.pulledCounts.materials}건)`,
          'success'
        );
      } else {
        showToast(`가져오기 실패: ${res.errors.join(', ')}`, 'info');
      }
    } catch (err: any) {
      showToast(`가져오기 오류: ${err.message}`, 'error');
    } finally {
      setIsSyncingPull(false);
    }
  };

  // Upload attached image to Supabase Storage 'products' bucket & save product
  const handleSyncAttachedImage = async () => {
    setIsSyncingAttached(true);
    try {
      const res = await api.syncAttachedProductAndStorage();
      if (res.success) {
        setAttachedStorageUrl(res.storageUrl || null);
        showToast(
          `첨부 이미지가 Supabase Storage 'products' 및 products 테이블에 성공적으로 업로드되었습니다! (${res.product?.name})`,
          'success'
        );
        handleTestConnection();
      } else {
        showToast(`업로드 실패: ${res.error}`, 'error');
      }
    } catch (e: any) {
      showToast(`업로드 중 오류: ${e.message}`, 'error');
    } finally {
      setIsSyncingAttached(false);
    }
  };

  const sampleSql = `-- ==========================================
-- DASSOBA (다써바) Full Enterprise ERP Schema
-- Copy and paste this into Supabase Dashboard > SQL Editor
-- ==========================================

-- 1. Profiles & Members
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  login_id TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  member_grade TEXT DEFAULT 'BRONZE',
  role TEXT DEFAULT 'customer',
  points_balance INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Products & Variants
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE,
  name TEXT,
  brand_id TEXT,
  category_id TEXT,
  description TEXT,
  cost_price INT DEFAULT 0,
  regular_price INT DEFAULT 0,
  sale_price INT DEFAULT 0,
  discount_rate INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  primary_image TEXT,
  is_one_plus_one BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  is_best BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  sale_count INT DEFAULT 0,
  rating_avg NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  variant_sku TEXT,
  color TEXT,
  color_code TEXT,
  size TEXT,
  additional_price INT DEFAULT 0,
  stock_quantity INT DEFAULT 10,
  status TEXT DEFAULT 'active'
);

-- 3. Events & Hero Banners
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT,
  subtitle TEXT,
  banner_image_url TEXT,
  link_url TEXT,
  event_type TEXT DEFAULT 'campaign',
  start_date TEXT,
  end_date TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders & Order Items
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE,
  user_id TEXT,
  order_name TEXT,
  buyer_name TEXT,
  buyer_phone TEXT,
  buyer_email TEXT,
  recipient_name TEXT,
  recipient_phone TEXT,
  postal_code TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  delivery_memo TEXT,
  total_product_amount INT DEFAULT 0,
  delivery_fee INT DEFAULT 0,
  discount_amount INT DEFAULT 0,
  coupon_discount INT DEFAULT 0,
  points_used INT DEFAULT 0,
  final_payment_amount INT DEFAULT 0,
  payment_method TEXT DEFAULT 'credit_card',
  order_status TEXT DEFAULT 'paid',
  payment_status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  variant_id TEXT,
  product_name TEXT,
  variant_info TEXT,
  unit_price INT DEFAULT 0,
  quantity INT DEFAULT 1,
  total_amount INT DEFAULT 0,
  is_one_plus_one BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Deliveries (Logistics)
CREATE TABLE IF NOT EXISTS public.deliveries (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  carrier TEXT DEFAULT 'CJ대한통운',
  tracking_number TEXT,
  shipment_status TEXT DEFAULT 'ready',
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Raw Materials (원부자재)
CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  material_code TEXT UNIQUE,
  material_name TEXT,
  supplier_id TEXT,
  supplier_name TEXT,
  stock NUMERIC DEFAULT 0,
  unit TEXT DEFAULT 'YD',
  cost INT DEFAULT 0,
  location TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Purchase Orders (발주 관리 PO)
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT UNIQUE,
  supplier_id TEXT,
  supplier_name TEXT,
  status TEXT DEFAULT 'ordered',
  total_cost INT DEFAULT 0,
  requested_date TEXT,
  expected_date TEXT,
  received_date TEXT,
  items_count INT DEFAULT 0,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Tax Invoices & Documents (세금계산서/명세서)
CREATE TABLE IF NOT EXISTS public.tax_documents (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  document_type TEXT DEFAULT 'tax_invoice',
  company_name TEXT,
  business_registration_number TEXT,
  representative_name TEXT,
  supply_amount INT DEFAULT 0,
  tax_amount INT DEFAULT 0,
  total_amount INT DEFAULT 0,
  issue_status TEXT DEFAULT 'issued',
  issue_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Storage Buckets (Public)
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- Storage Public Read Policy
CREATE POLICY "Public Storage Access" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'product-images', 'banners', 'avatars'));
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSql);
    setCopiedSql(true);
    showToast('Supabase SQL 생성 쿼리가 클립보드에 복사되었습니다.', 'info');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-black text-white">
              SUPABASE 클라우드 실시간 연동 관리 센터
            </h1>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              LIVE CLOUD
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            모든 상품, 이미지, 회원 관리, 주문 및 기획전 데이터를 Supabase 클라우드 데이터베이스에 실시간으로 업로드하고 제어합니다.
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={isTesting}
          className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs flex items-center gap-1.5 border border-neutral-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          <span>연결 상태 새로고침</span>
        </button>
      </div>

      {/* Live Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection Status Card */}
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono">연결 상태</span>
            <Cloud className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                testResult?.ok ? 'bg-emerald-400 animate-pulse' : 'bg-pink-500'
              }`}
            />
            <span className="text-base font-bold text-white font-mono">
              {testResult?.ok ? '클라우드 연결됨 (CONNECTED)' : '연결 확인 필요'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 truncate">
            {testResult?.message || '연결 진단 중...'}
          </p>
        </div>

        {/* Project URL Card */}
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono">프로젝트 URL</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono truncate">
            {connInfo.url}
          </div>
          <p className="text-[11px] text-neutral-400 font-mono">
            엔드포인트: {connInfo.url.split('//')[1] || connInfo.url}
          </p>
        </div>

        {/* Public API Key Card */}
        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono">익명(Anon) 키 상태</span>
            <Key className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono">
            {connInfo.hasKey ? (
              <span className="text-emerald-400">등록됨 ({connInfo.anonKey})</span>
            ) : (
              <span className="text-pink-400">키 등록 필요</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400">
            {connInfo.hasKey ? '실시간 즉시 업로드 활성화' : '아래 입력창에 Anon Key를 입력해주세요'}
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Attached Image & Storage Upload Card (User Explicit Request) */}
      {/* ================================================================= */}
      <div className="p-5 bg-neutral-950 border border-pink-500/30 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              첨부 이미지 Supabase Storage (products 버킷) 업로드 &amp; 상품 테이블 동기화
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950 text-pink-300 border border-pink-800/60 font-bold">
            BUCKET: products
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-3">
            <div className="aspect-square bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 relative group">
              <img
                src="/images/products/cyber_street_2077_grand_opening.jpg"
                alt="Cyber Street 2077 Grand Opening"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono text-cyan-300">
                CYBER_STREET_2077
              </div>
            </div>
          </div>

          <div className="md:col-span-9 space-y-3">
            <div>
              <span className="text-[10px] font-mono text-pink-400 font-bold tracking-wider">
                [2077 GRAND OPENING CELEBRATION COLLECTION]
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                사이버 스트리트 네온 텍티컬 후디 자켓 &amp; 카고 컬렉션
              </h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                첨부해주신 이미지를 Supabase Storage의 <code className="text-cyan-400">products</code> 버킷에 즉시 저장하고, 해당 이미지를 대표 이미지로 사용하는 신규 상품(<code className="text-pink-400">prod-cyber-2077</code>)과 기획전 배너를 Supabase <code className="text-cyan-400">products</code> 및 <code className="text-cyan-400">events</code> 테이블에 실시간 동기화합니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleSyncAttachedImage}
                disabled={isSyncingAttached}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase flex items-center gap-2 rounded-lg shadow-[0_0_15px_rgba(255,0,127,0.4)] transition-all"
              >
                <UploadCloud className={`w-4 h-4 ${isSyncingAttached ? 'animate-bounce' : ''}`} />
                <span>
                  {isSyncingAttached
                    ? 'Storage 및 products 테이블 업로드 중...'
                    : '첨부 이미지를 Supabase Storage (products) 및 DB에 즉시 업로드'}
                </span>
              </button>

              {attachedStorageUrl && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> 업로드 완료
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Batch Action Toolbar */}
      <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-neutral-950 to-pink-950/30 border border-cyan-500/30 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <h3 className="text-sm font-bold text-white font-mono">
            원클릭 양방향 클라우드 데이터 동기화 (전체 8개 테이블 일괄 처리)
          </h3>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          상품, 상품 옵션, 회원 명단, 프로모션 기획전, 주문, 배송(운송장), 원부자재, 발주(PO), 세금계산서 데이터를 클릭 한 번으로 Supabase 클라우드 데이터베이스에 실시간 일괄 업로드하거나 가져옵니다.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handlePushAll}
            disabled={isSyncingPush}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <UploadCloud className={`w-4 h-4 ${isSyncingPush ? 'animate-bounce' : ''}`} />
            <span>{isSyncingPush ? 'Supabase 업로드 중...' : '전체 데이터 Supabase 즉시 업로드 (Push All)'}</span>
          </button>

          <button
            onClick={handlePullAll}
            disabled={isSyncingPull}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase flex items-center gap-2 border border-neutral-700 transition-all"
          >
            <DownloadCloud className={`w-4 h-4 ${isSyncingPull ? 'animate-bounce' : ''}`} />
            <span>{isSyncingPull ? '데이터 가져오는 중...' : 'Supabase 클라우드에서 최신 데이터 가져오기 (Pull All)'}</span>
          </button>
        </div>
      </div>

      {/* Credentials Configuration Form */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">
            Supabase 연결 계정 설정 (실시간 반영)
          </h3>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1">
              SUPABASE PROJECT URL
            </label>
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-neutral-300 mb-1">
              SUPABASE ANON PUBLIC KEY (API Key)
            </label>
            <textarea
              rows={3}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 rounded"
            />
            <p className="text-[11px] text-neutral-500 font-mono mt-1">
              Supabase 대시보드 &gt; Project Settings &gt; API &gt; Project API keys &gt; anon public 키를 입력하세요.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase transition-colors"
            >
              설정 저장 및 즉시 연결
            </button>
          </div>
        </form>
      </div>

      {/* SQL Setup Helper */}
      <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Supabase 필수 테이블 &amp; 스토리지 버킷 원클릭 SQL (전체 스키마)
            </h3>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors border border-neutral-700"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? '복사 완료!' : 'SQL 스크립트 복사'}</span>
          </button>
        </div>
        <p className="text-xs text-neutral-400">
          신규 Supabase 프로젝트를 생성했을 경우, Supabase 대시보드의 **SQL Editor**에 위 스크립트를 붙여넣고 실행하면 필요한 테이블 8개(`products`, `profiles`, `orders`, `deliveries`, `materials`, `purchase_orders`, `tax_documents`, `events`)와 스토리지 버킷(`products`, `banners` 등)이 즉시 생성됩니다.
        </p>
        <pre className="p-3 bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 rounded max-h-56 overflow-y-auto">
          {sampleSql}
        </pre>
      </div>
    </div>
  );
};

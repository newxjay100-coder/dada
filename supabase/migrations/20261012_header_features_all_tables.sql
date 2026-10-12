-- ========================================================
-- DASSOBA (다써바) Header Features & Cloud Storage Migration
-- Migration: 20261012_header_features_all_tables.sql
-- Covers all 8 functional areas in Header:
-- 1. ROLE Switcher & Auditing (profiles, role_audit_logs)
-- 2. User Profile, Grade & Points (profiles, member_grades, point_transactions)
-- 3. MyPage Management (user_addresses, user_coupons, coupons)
-- 4. Auth & Logout Auditing (auth_logs)
-- 5. Shopping Cart (cart_items)
-- 6. Customer Support Center (inquiries, notices, faqs)
-- 7. Search Bar & Trends (search_logs, popular_keywords)
-- 8. Wishlist (wishlists)
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES (역할 및 회원 프로필)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  login_id TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  birthday TEXT,
  gender TEXT,
  member_grade TEXT DEFAULT 'BRONZE',
  role TEXT DEFAULT 'customer',
  points_balance INT DEFAULT 5000,
  status TEXT DEFAULT 'active',
  marketing_consent BOOLEAN DEFAULT false,
  terms_consent BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ROLE AUDIT LOGS (관리자 / 유저 역할 전환 및 권한 이력)
CREATE TABLE IF NOT EXISTS public.role_audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  previous_role TEXT NOT NULL,
  new_role TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- AUTH LOGS (로그인 / 로그아웃 / 회원가입 접속 이력)
CREATE TABLE IF NOT EXISTS public.auth_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'LOGIN', 'LOGOUT', 'SIGNUP', 'ROLE_SWITCH'
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MEMBER GRADES (회원 등급 및 혜택)
CREATE TABLE IF NOT EXISTS public.member_grades (
  id TEXT PRIMARY KEY,
  grade_code TEXT UNIQUE NOT NULL,
  grade_name TEXT NOT NULL,
  min_spent INT DEFAULT 0,
  discount_rate NUMERIC DEFAULT 0,
  point_rate NUMERIC DEFAULT 1.0,
  benefits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Default Member Grades
INSERT INTO public.member_grades (id, grade_code, grade_name, min_spent, discount_rate, point_rate, benefits)
VALUES
  ('mg-bronze', 'BRONZE', '브론즈', 0, 0, 1.0, '["신규 가입 5,000P 지급", "기본 1% 적립"]'::jsonb),
  ('mg-silver', 'SILVER', '실버', 100000, 3.0, 2.0, '["전상품 3% 상시 할인", "구매 2% 적립", "무료배송 쿠폰 1장"]'::jsonb),
  ('mg-gold', 'GOLD', '골드', 300000, 5.0, 3.0, '["전상품 5% 상시 할인", "구매 3% 적립", "생일 10% 축하 쿠폰"]'::jsonb),
  ('mg-vip', 'VIP', 'VIP', 1000000, 7.0, 5.0, '["전상품 7% 상시 할인", "구매 5% 적립", "무료배송 상시 지원", "VIP 전용 비밀 기획전"]'::jsonb),
  ('mg-vvip', 'VVIP', 'VVIP 마스터', 3000000, 10.0, 7.0, '["전상품 10% 상시 할인", "구매 7% 적립", "무제한 무료 반품", "전담 컨시어지 1:1 상담"]'::jsonb)
ON CONFLICT (grade_code) DO NOTHING;

-- POINT TRANSACTIONS (적립금 충전/사용 내역)
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  amount INT NOT NULL,
  balance_after INT NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MYPAGE DATA (배송지 관리 및 쿠폰)
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  address_name TEXT NOT NULL DEFAULT '기본배송지',
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  is_default BOOLEAN DEFAULT false,
  delivery_memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'fixed', 'percentage', 'free_shipping'
  discount_value NUMERIC NOT NULL,
  min_order_amount INT DEFAULT 0,
  max_discount_amount INT,
  target_grade TEXT,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_coupons (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  coupon_id TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  order_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 4. CART ITEMS (장바구니)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  is_selected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

-- 5. WISHLIST (찜하기 / 하트 위시리스트)
CREATE TABLE IF NOT EXISTS public.wishlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_wishlist_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlists(user_id);

-- 6. SEARCH LOGS & POPULAR KEYWORDS (검색창 검색 이력 및 인기 검색어)
CREATE TABLE IF NOT EXISTS public.search_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  source TEXT DEFAULT 'header',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_logs_query ON public.search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON public.search_logs(created_at DESC);

CREATE TABLE IF NOT EXISTS public.popular_keywords (
  id TEXT PRIMARY KEY,
  keyword TEXT UNIQUE NOT NULL,
  search_count INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Popular Keywords
INSERT INTO public.popular_keywords (id, keyword, search_count)
VALUES
  ('pk-01', '테크웨어', 1240),
  ('pk-02', '네온 카고', 980),
  ('pk-03', '1+1 특가', 850),
  ('pk-04', '사이버 스트릿', 740),
  ('pk-05', '고딕 드레스', 620),
  ('pk-06', '오버핏 자켓', 510),
  ('pk-07', '컴뱃 부츠', 430),
  ('pk-08', '메탈릭 파카', 390)
ON CONFLICT (keyword) DO UPDATE
SET search_count = public.popular_keywords.search_count + EXCLUDED.search_count;

-- 7. CUSTOMER SERVICE (고객센터 1:1 문의, 공지사항, FAQ)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL, -- 'product', 'shipping', 'exchange_return', 'refund', 'points_coupon', 'general'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'submitted', -- 'submitted', 'in_progress', 'answered'
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_user ON public.inquiries(user_id);

CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) on newly formed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies for frictionless user and admin interaction
DROP POLICY IF EXISTS "Public access profiles" ON public.profiles;
CREATE POLICY "Public access profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access role_audit_logs" ON public.role_audit_logs;
CREATE POLICY "Public access role_audit_logs" ON public.role_audit_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access auth_logs" ON public.auth_logs;
CREATE POLICY "Public access auth_logs" ON public.auth_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access member_grades" ON public.member_grades;
CREATE POLICY "Public access member_grades" ON public.member_grades FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access point_transactions" ON public.point_transactions;
CREATE POLICY "Public access point_transactions" ON public.point_transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access user_addresses" ON public.user_addresses;
CREATE POLICY "Public access user_addresses" ON public.user_addresses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access coupons" ON public.coupons;
CREATE POLICY "Public access coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access user_coupons" ON public.user_coupons;
CREATE POLICY "Public access user_coupons" ON public.user_coupons FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access cart_items" ON public.cart_items;
CREATE POLICY "Public access cart_items" ON public.cart_items FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access wishlists" ON public.wishlists;
CREATE POLICY "Public access wishlists" ON public.wishlists FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access search_logs" ON public.search_logs;
CREATE POLICY "Public access search_logs" ON public.search_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access popular_keywords" ON public.popular_keywords;
CREATE POLICY "Public access popular_keywords" ON public.popular_keywords FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access inquiries" ON public.inquiries;
CREATE POLICY "Public access inquiries" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access notices" ON public.notices;
CREATE POLICY "Public access notices" ON public.notices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access faqs" ON public.faqs;
CREATE POLICY "Public access faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

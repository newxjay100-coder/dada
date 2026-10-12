-- ========================================================
-- DASSOBA (다써바) Comprehensive Seed Data
-- Supabase Migration: 20261006000004_seed_data.sql
-- ========================================================

-- 1. Member Grades
INSERT INTO member_grades (grade_code, grade_name, min_spent, discount_rate, point_rate, benefits)
VALUES
  ('BRONZE', '일반회원', 0, 0, 1.0, '["가입축하 5,000원 쿠폰", "1% 포인트 적립"]'::jsonb),
  ('SILVER', '실버회원', 100000, 2.0, 1.5, '["상시 2% 할인", "1.5% 포인트 적립", "매월 5% 쿠폰 1장"]'::jsonb),
  ('GOLD', '골드회원', 300000, 5.0, 2.0, '["상시 5% 할인", "2.0% 포인트 적립", "무료배송 쿠폰 2장"]'::jsonb),
  ('VIP', 'VIP회원', 700000, 7.0, 3.0, '["상시 7% 할인", "3.0% 포인트 적립", "생일쿠폰 15%", "상시 무료반품"]'::jsonb),
  ('VVIP', 'VVIP 프리미엄', 1500000, 10.0, 5.0, '["상시 10% 할인", "5.0% 포인트 적립", "프리미엄 기프트", "VIP 전담 라운지"]'::jsonb)
ON CONFLICT (grade_code) DO NOTHING;

-- 2. Brands (Contemporary / Editorial Fashion Brands)
INSERT INTO brands (id, slug, name, english_name, description, is_featured, is_active)
VALUES
  ('11111111-1111-1111-1111-111111110001', 'the-noir', '더 느와르', 'THE NOIR', '어반 시크와 현대적인 테일러링을 결합한 컨템포러리 레이블', true, true),
  ('11111111-1111-1111-1111-111111110002', 'atelier-82', '아틀리에 82', 'ATELIER 82', '장인 정신과 정교한 실루엣을 탐구하는 파리지앵 감성 브랜드', true, true),
  ('11111111-1111-1111-1111-111111110003', 'maison-seoul', '메종 드 서울', 'MAISON DE SEOUL', '서울의 현대적인 라이프스타일에서 영감을 얻은 미니멀 에디토리얼', true, true),
  ('11111111-1111-1111-1111-111111110004', 'studio-archive', '스튜디오 아카이브', 'STUDIO ARCHIVE', '타임리스 클래식과 정제된 핏을 제안하는 프리미엄 유니섹스', true, true),
  ('11111111-1111-1111-1111-111111110005', 'minimal-standard', '미니멀 스탠다드', 'MINIMAL STANDARD', '절제된 미학과 최상의 원사를 사용하는 럭셔리 데일리웨어', true, true),
  ('11111111-1111-1111-1111-111111110006', 'urban-essence', '어반 에센스', 'URBAN ESSENCE', '실용성과 하이엔드 무드를 동시에 갖춘 컨템포러리 캐주얼', true, true),
  ('11111111-1111-1111-1111-111111110007', 'letoile', '레투알', 'L''ETOILE', '세련된 감각과 유려한 드레이핑의 여성 디자이너 컬렉션', true, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Categories (Parent Categories)
INSERT INTO categories (id, slug, name, depth, display_order)
VALUES
  ('22222222-2222-2222-2222-222222220001', 'women', '여성', 1, 1),
  ('22222222-2222-2222-2222-222222220002', 'men', '남성', 1, 2),
  ('22222222-2222-2222-2222-222222220003', 'kids', '키즈', 1, 3),
  ('22222222-2222-2222-2222-222222220004', 'acc', '잡화', 1, 4)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories (여성)
INSERT INTO categories (id, parent_id, slug, name, depth, display_order)
VALUES
  ('22222222-2222-2222-2222-222222220101', '22222222-2222-2222-2222-222222220001', 'women-tshirts', '티셔츠', 2, 1),
  ('22222222-2222-2222-2222-222222220102', '22222222-2222-2222-2222-222222220001', 'women-shirts', '셔츠/블라우스', 2, 2),
  ('22222222-2222-2222-2222-222222220103', '22222222-2222-2222-2222-222222220001', 'women-knit', '니트/스웨터', 2, 3),
  ('22222222-2222-2222-2222-222222220104', '22222222-2222-2222-2222-222222220001', 'women-outer', '아우터', 2, 4),
  ('22222222-2222-2222-2222-222222220105', '22222222-2222-2222-2222-222222220001', 'women-pants', '팬츠', 2, 5),
  ('22222222-2222-2222-2222-222222220106', '22222222-2222-2222-2222-222222220001', 'women-denim', '데님', 2, 6),
  ('22222222-2222-2222-2222-222222220107', '22222222-2222-2222-2222-222222220001', 'women-skirt', '스커트', 2, 7),
  ('22222222-2222-2222-2222-222222220108', '22222222-2222-2222-2222-222222220001', 'women-dress', '원피스', 2, 8),
  ('22222222-2222-2222-2222-222222220109', '22222222-2222-2222-2222-222222220001', 'women-sport', '스포츠/수영복', 2, 9)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories (남성)
INSERT INTO categories (id, parent_id, slug, name, depth, display_order)
VALUES
  ('22222222-2222-2222-2222-222222220201', '22222222-2222-2222-2222-222222220002', 'men-tshirts', '티셔츠', 2, 1),
  ('22222222-2222-2222-2222-222222220202', '22222222-2222-2222-2222-222222220002', 'men-shirts', '셔츠', 2, 2),
  ('22222222-2222-2222-2222-222222220203', '22222222-2222-2222-2222-222222220002', 'men-knit', '니트/스웨터', 2, 3),
  ('22222222-2222-2222-2222-222222220204', '22222222-2222-2222-2222-222222220002', 'men-outer', '아우터', 2, 4),
  ('22222222-2222-2222-2222-222222220205', '22222222-2222-2222-2222-222222220002', 'men-pants', '팬츠', 2, 5),
  ('22222222-2222-2222-2222-222222220206', '22222222-2222-2222-2222-222222220002', 'men-denim', '데님', 2, 6),
  ('22222222-2222-2222-2222-222222220207', '22222222-2222-2222-2222-222222220002', 'men-suit', '수트/정장', 2, 7),
  ('22222222-2222-2222-2222-222222220208', '22222222-2222-2222-2222-222222220002', 'men-underwear', '언더웨어', 2, 8),
  ('22222222-2222-2222-2222-222222220209', '22222222-2222-2222-2222-222222220002', 'men-sport', '스포츠/수영복', 2, 9)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories (키즈)
INSERT INTO categories (id, parent_id, slug, name, depth, display_order)
VALUES
  ('22222222-2222-2222-2222-222222220301', '22222222-2222-2222-2222-222222220003', 'kids-boys', '남아', 2, 1),
  ('22222222-2222-2222-2222-222222220302', '22222222-2222-2222-2222-222222220003', 'kids-girls', '여아', 2, 2),
  ('22222222-2222-2222-2222-222222220303', '22222222-2222-2222-2222-222222220003', 'kids-clothing', '의류', 2, 3),
  ('22222222-2222-2222-2222-222222220304', '22222222-2222-2222-2222-222222220003', 'kids-shoes', '신발', 2, 4),
  ('22222222-2222-2222-2222-222222220305', '22222222-2222-2222-2222-222222220003', 'kids-acc', '액세서리', 2, 5)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories (잡화)
INSERT INTO categories (id, parent_id, slug, name, depth, display_order)
VALUES
  ('22222222-2222-2222-2222-222222220401', '22222222-2222-2222-2222-222222220003', 'acc-women-bag', '여성가방', 2, 1),
  ('22222222-2222-2222-2222-222222220402', '22222222-2222-2222-2222-222222220003', 'acc-men-bag', '남성가방', 2, 2),
  ('22222222-2222-2222-2222-222222220403', '22222222-2222-2222-2222-222222220003', 'acc-women-shoes', '여성신발', 2, 3),
  ('22222222-2222-2222-2222-222222220404', '22222222-2222-2222-2222-222222220003', 'acc-men-shoes', '남성신발', 2, 4),
  ('22222222-2222-2222-2222-222222220405', '22222222-2222-2222-2222-222222220003', 'acc-hats', '모자', 2, 5),
  ('22222222-2222-2222-2222-222222220406', '22222222-2222-2222-2222-222222220003', 'acc-wallets', '지갑', 2, 6),
  ('22222222-2222-2222-2222-222222220407', '22222222-2222-2222-2222-222222220003', 'acc-belts', '벨트', 2, 7),
  ('22222222-2222-2222-2222-222222220408', '22222222-2222-2222-2222-222222220003', 'acc-jewelry', '주얼리', 2, 8),
  ('22222222-2222-2222-2222-222222220409', '22222222-2222-2222-2222-222222220003', 'acc-fashion', '패션잡화', 2, 9)
ON CONFLICT (slug) DO NOTHING;

-- 4. Coupons
INSERT INTO coupons (id, code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_from, valid_until, is_active)
VALUES
  ('33333333-3333-3333-3333-333333330001', 'WELCOME10', '신규 회원 10% 웰컴 쿠폰', '가입 회원 전원 첫 구매 10% 즉시 할인', 'percentage', 10, 30000, 20000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', true),
  ('33333333-3333-3333-3333-333333330002', 'DASSOBA5000', 'DASSOBA 런칭 기념 5,000원 할인권', '5만원 이상 구매 시 즉시 할인', 'fixed', 5000, 50000, NULL, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days', true),
  ('33333333-3333-3333-3333-333333330003', 'FREESHIP', '무료 배송 혜택 쿠폰', '조건 없이 배송비 3,000원 무료 적용', 'free_shipping', 3000, 0, NULL, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days', true),
  ('33333333-3333-3333-3333-333333330004', 'VIPSPECIAL', 'VIP 전용 15,000원 스페셜 쿠폰', '10만원 이상 구매 시 적용 가능한 VIP 프리미엄 쿠폰', 'fixed', 15000, 100000, NULL, NOW() - INTERVAL '1 day', NOW() + INTERVAL '90 days', true)
ON CONFLICT (code) DO NOTHING;

-- 5. Boards
INSERT INTO boards (id, slug, name, description, is_active, display_order)
VALUES
  ('44444444-4444-4444-4444-444444440001', 'qna', '질문과 답변 (Q&A)', '상품 및 배송에 대한 궁금한 사항을 질문해주세요.', true, 1),
  ('44444444-4444-4444-4444-444444440002', 'free', '자유 게시판', '패션 스타일과 코디 팁을 자유롭게 나누는 공간입니다.', true, 2),
  ('44444444-4444-4444-4444-444444440003', 'reservation', '예약 확인 게시판', '오프라인 쇼룸 피팅 예약 및 사전예약 확인 내역입니다.', true, 3),
  ('44444444-4444-4444-4444-444444440004', 'notice', '공지사항', '다써바 공식 소식과 서비스 안내입니다.', true, 4),
  ('44444444-4444-4444-4444-444444440005', 'faq', '자주 묻는 질문 (FAQ)', '고객님들이 가장 많이 문의하시는 질문 모음입니다.', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- 6. Events & Campaigns
INSERT INTO events (id, slug, title, subtitle, banner_image_url, link_url, event_type, start_date, end_date, is_active, display_order)
VALUES
  ('55555555-5555-5555-5555-555555550001', 'spring-editorial-2026', '2026 SPRING EDITORIAL', '빛과 실루엣이 빚어낸 현대적 모더니즘의 새로운 정의', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop', '/special/editorial', 'campaign', CURRENT_DATE - 5, CURRENT_DATE + 30, true, 1),
  ('55555555-5555-5555-5555-555555550002', 'one-plus-one-special', 'DASSOBA 1+1 SPECIAL EVENT', '하나 가격으로 두 가지 스타일을 완성하는 스페셜 셀렉션', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop', '/1plus1', 'one_plus_one', CURRENT_DATE - 2, CURRENT_DATE + 20, true, 2),
  ('55555555-5555-5555-5555-555555550003', 'the-noir-signature', 'THE NOIR SIGNATURE TAILORING', '감각적인 절개선과 섬세한 질감의 럭셔리 수트 캡슐 컬렉션', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop', '/brands/the-noir', 'brand', CURRENT_DATE - 1, CURRENT_DATE + 40, true, 3),
  ('55555555-5555-5555-5555-555555550004', 'minimal-knitwear-week', 'MINIMAL CASHMERE & SILK WEEK', '체온을 머금는 최상급 천연 원사 니트 특별전', 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=1600&auto=format&fit=crop', '/special/knitwear', 'seasonal', CURRENT_DATE, CURRENT_DATE + 14, true, 4),
  ('55555555-5555-5555-5555-555555550005', 'grand-opening-benefits', 'DASSOBA GRAND OPENING', '전 회원 대상 최대 20% 쿠폰팩 및 리뷰 포인트 2배 적립', 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1600&auto=format&fit=crop', '/event/opening', 'campaign', CURRENT_DATE - 10, CURRENT_DATE + 60, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- 7. Popups
INSERT INTO popups (id, title, desktop_image_url, link_url, start_datetime, end_datetime, priority, is_active)
VALUES
  ('66666666-6666-6666-6666-666666660001', '봄 신상품 론칭 기념 15% 쿠폰팩 증정', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', '/event', NOW() - INTERVAL '1 day', NOW() + INTERVAL '14 days', 1, true)
ON CONFLICT (id) DO NOTHING;

-- 8. Suppliers
INSERT INTO suppliers (id, supplier_code, name, business_number, contact_person, phone, email, address, memo)
VALUES
  ('77777777-7777-7777-7777-777777770001', 'SUP-NOIR-01', '(주)느와르 어패럴', '101-81-12345', '김도현 실장', '02-540-1234', 'supply@noirapparel.kr', '서울시 성동구 성수이로 88', '메인 아우터 및 블레이저 전문 납품'),
  ('77777777-7777-7777-7777-777777770002', 'SUP-TEX-02', '(주)아틀리에 텍스타일', '214-86-67890', '이서연 팀장', '02-777-8899', 'order@ateliertextile.com', '서울시 중구 동호로 12', '수입 울, 캐시미어 및 코튼 원사 원단 공급')
ON CONFLICT (supplier_code) DO NOTHING;

-- 9. Materials
INSERT INTO materials (id, material_code, material_name, supplier_id, stock, unit, cost, location, memo)
VALUES
  ('88888888-8888-8888-8888-888888880001', 'MAT-W-CASH-01', '이태리 프리미엄 캐시미어 100% 원사', '77777777-7777-7777-7777-777777770002', 320.5, 'KG', 185000, 'MAT-WH-A01', '블랙/오트밀/버건디 염색용'),
  ('88888888-8888-8888-8888-888888880002', 'MAT-SILK-02', '고밀도 오가닉 실크 블렌드 원단', '77777777-7777-7777-7777-777777770002', 450.0, 'YD', 42000, 'MAT-WH-B03', '블라우스 및 원피스용 최고급 원단')
ON CONFLICT (material_code) DO NOTHING;

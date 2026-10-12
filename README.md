# 다써바 | DASSOBA — 프리미엄 컨템포러리 패션 스토어

> **"입어보고 싶은 모든 스타일을 한곳에서"**  
> H FASHION의 편리한 내비게이션 탐색 및 쇼핑 UX를 계승하되, 정제된 모던 에디토리얼 감성과 버건디 & 웜베이지 컬러 팔레트로 새롭게 탄생한 한국 컨템포러리 풀스택 패션 이커머스 & ERP 백오피스 플랫폼입니다.

---

## 📌 프로젝트 개요

- **브랜드명**: 다써바 (DASSOBA)
- **도메인 컨셉**: Contemporary Fashion Curation, 1+1 Special Selections, Designer Archive
- **개발 환경**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide React
- **백엔드 / 클라우드**: Supabase (PostgreSQL 43개 테이블, Auth, Storage, RLS, Edge Functions)
- **배포 지원**: GitHub & Vercel (`vercel.json` SPA 및 보안 헤더 내장)
- **동작 모드**: **하이브리드 아키텍처** (로컬 브라우저 상태 엔진 + Supabase 실시간 연동 자동 전환)

---

## 🎨 브랜드 & 디자인 시스템

- **Tone & Mood**: Premium, Clean, Modern, Fashion Editorial, Contemporary Minimal
- **Color Palette**:
  - `Burgundy Accent`: `#721b29` (포인트 / 1+1 배지 / 활성 탭)
  - `Warm Beige`: `#faf9f6` / `#f8f6f0` (배경 / 에디토리얼 카드)
  - `Deep Black & Charcoal`: `#111111` / `#1a1a1a` (텍스트 / 메인 버튼)
  - `Soft Gray`: `#e5e5e7` / `#f5f5f7` (보더 / 디바이더)
- **반응형 그리드 체계**:
  - 데스크톱 (1024px+): 4열 그리드 (`grid-cols-4`)
  - 태블릿 (768px~1023px): 3열 그리드 (`grid-cols-3`)
  - 모바일 (360px~767px): 2열 그리드 (`grid-cols-2`), 하단 고정 내비게이션 바

---

## 🚀 주요 기능 명세

### 1. 고객 쇼핑몰 (Customer Storefront)
- **글로벌 헤더 & 대형 메가메뉴 (Mega Menu)**:
  - 여성, 남성, 키즈, 잡화 대분류 호버 시 세부 카테고리(티셔츠, 셔츠, 니트, 아우터, 팬츠, 데님, 원피스 등) 즉시 노출
  - 신상품, 베스트, 1+1 기획전, 브랜드, 매거진, 아울렛, 리뷰 원클릭 바로가기
  - 실시간 통합 검색창 (브랜드명, 상품명, 키워드 검색)
- **홈페이지 (10대 핵심 섹션)**:
  1. `01 HERO`: 감각적인 룩북 캠페인 슬라이더 (모바일/데스크톱 대응)
  2. `02 QUICK CATEGORY`: 원형 퀵 아이콘 카테고리
  3. `03 TREND KEYWORDS`: 실시간 인기 검색어 칩스
  4. `04 NEW ARRIVALS`: 탭별(ALL, WOMEN, MEN, KIDS, ACC) 신상품 그리드
  5. `05 BEST RANKING`: 일간/주간/월간 랭킹 넘버링 배지
  6. `06 PERSONAL RECOMMENDATION`: 최근 본 상품 및 AI 추천 큐레이션
  7. `07 1+1 SPECIAL EVENT`: 버건디 에디토리얼 1+1 특별 기획전
  8. `08 BEST REVIEWS`: 실구매 고객 포토 리뷰 및 실착 후기
  9. `09 STYLE & MAGAZINE`: 디자이너 브랜드 스토리 및 룩북 에디토리얼
  10. `10 EVENT POPUP MODAL`: 오늘 하루 열지 않기 지원 프로모션 팝업
- **상품 목록 및 다중 필터링 (Product List & Filters)**:
  - 8종 정렬 (추천순, 신상품순, 인기순, 판매순, 낮은가격순, 높은가격순, 리뷰순, 할인율순)
  - 다중 필터 (브랜드, 가격대, 할인율, 색상 스와치, 1+1 여부, 품절 제외)
- **상품 상세 (Product Detail)**:
  - 고해상도 갤러리 썸네일 전환, 색상/사이즈 옵션 선택기
  - 쿠폰 적용 혜택가 및 구매 적립 포인트 자동 계산
  - 탭 구성: 상세설명, 사이즈 실측 가이드, 배송/교환 정책, 포토 리뷰(별점), Q&A 문의
  - 모바일 하단 플로팅 구매 바 (장바구니, 바로구매, 찜)
- **장바구니 & 주문서 (Cart & Checkout)**:
  - 품목 개별/전체 선택, 수량 변경, 실시간 배송비(5만원 이상 무료) 계산
  - 보유 쿠폰 목록 선택 및 적립금 포인트(전액/부분) **동시 적용**
  - 플러그형 결제 어댑터 구조 (`PaymentAdapter` - 개발용 Mock PG 탑재)
  - 결제 완료 시 고유 주문번호(`ORD-YYYYMMDD-XXXXX`) 및 주문 완료 안내
- **마이페이지 (10대 세부 메뉴)**:
  - 대시보드: 회원등급(BRONZE/SILVER/GOLD/VIP), 보유 포인트, 쿠폰, 장바구니 현황
  - 1. 나의 주문 내역 (배송조회 및 구매확정)
  - 2. 취소 / 반품 / 환불 / 교환 접수 내역
  - 3. 찜한 상품 (위시리스트)
  - 4. 장바구니
  - 5. 쿠폰함 (등록 및 만료일자 확인)
  - 6. 포인트 복식부기 원장 내역 (지급/차감/적립)
  - 7. 상품 리뷰 관리 (작성 가능한 리뷰 & 작성한 리뷰)
  - 8. 1:1 문의 내역
  - 9. 배송지 관리
  - 10. 회원정보 수정
- **커뮤니티 및 고객센터**:
  - 고객센터 메인, 공지사항(아코디언), 자주 묻는 질문(FAQ)
  - Q&A 질문답변 게시판 (공개/비공개 자물쇠), 자유 게시판, 한남 플래그십 쇼룸 피팅 예약 게시판
- **플로팅 위젯**:
  - AI 상담 챗봇 위젯 (주문조회, 배송, 교환/반품, 포인트, 쿠폰 퀵 액션)
  - 카카오톡 채널 1:1 상담 바로가기 버튼

---

### 2. 관리자 통합 ERP 백오피스 (`/admin`)

헤더 우측 상단 **[모드: 관리자]** 버튼을 누르거나 `/admin` 주소로 접속하면 엔터프라이즈 관리자 콘솔을 즉시 이용할 수 있습니다.

1. **ERP 대시보드**: 실시간 매출 현황, 주문 접수, 배송 대기, 품절 임박 SKU 알림, 최근 발주 내역
2. **회원 관리 (`/admin/members`)**: 회원별 등급 변경, 포인트 수동 지급/차감(원장 기록), 계정 상태(정상/정지) 관리
3. **상품 관리 (`/admin/products`)**: 상품 신규 등록, 정가/할인가/재고 수정, 1+1 지정, 판매상태 변경
4. **주문 관리 (`/admin/orders`)**: 11단계 주문 상태 변경(결제완료, 상품준비, 발주, 배송준비, 배송중, 배송완료, 구매확정, 취소/반품/환불 승인)
5. **발주 관리 PO (`/admin/purchase-orders`)**: 원단사/제조사 공급업체별 발주서 발행, 입고 예정일, 총 공급가액 관리
6. **재고 및 입출고 (`/admin/inventory`)**: SKU 단위 실시간 재고 현황, 입고/출고/조정 트랜잭션 기록
7. **원부자재 관리 (`/admin/materials`)**: 울, 캐시미어, 수피마 코튼, YKK 지퍼, 천연 소뿔 단추 등 원자재 수불 관리
8. **세금계산서 / 증빙 (`/admin/tax-documents`)**: 공급가액, 부가세 10% 자동 계산, 국세청 홈택스 연동 규격 전자세금계산서 발행
9. **배송 및 송장 관리 (`/admin/delivery`)**: 택배사 지정(CJ대한통운, 롯데, 한진, 우체국, 로젠) 및 운송장 번호 등록, 실시간 추적
10. **이벤트 & 기획전 (`/admin/events`)**: 메인 배너, 1+1 프로모션, 팝업 공지 등록 및 노출 기간 제어

---

## 🛠 기술 스택 & 디렉토리 구조

```
p5/
├── index.html                   # 한국어 SEO 메타태그, Pretendard 웹폰트
├── vercel.json                  # SPA 라우팅 리라이트 및 보안 헤더 설정
├── package.json
├── vite.config.ts               # Tailwind CSS v4 플러그인, @ 경로 별칭
├── tsconfig.app.json            # TS 6.0 ignoreDeprecations 호환 설정
│
├── supabase/                    # Supabase 인프라 파일
│   ├── migrations/              # PostgreSQL 스키마 및 마이그레이션 SQL
│   │   ├── 20261006000001_initial_schema.sql    # 43개 테이블, 외래키, 트리거
│   │   ├── 20261006000002_rls_policies.sql      # Row Level Security 보안 정책
│   │   ├── 20261006000003_storage_buckets.sql   # Storage 버킷 5종 설정
│   │   └── 20261006000004_seed_data.sql         # 카테고리, 브랜드, 쿠폰, 공급사 시드
│   └── functions/               # Supabase Edge Functions (보안 서버리스)
│       ├── order-processor/     # 주문 유효성 검증 및 재고 선점
│       ├── chatbot-assistant/   # AI 챗봇 프록시 (Frontend에 키 노출 차단)
│       └── tax-invoice/         # 전자세금계산서 발행 엔진
│
└── src/
    ├── App.tsx                  # 전역 라우터 및 컨텍스트 프로바이더 구성
    ├── index.css                # Tailwind CSS v4 테마 변수 및 글로벌 스타일
    ├── main.tsx
    ├── types/                   # 43개 테이블 풀스택 TypeScript 인터페이스
    │   └── database.types.ts
    ├── lib/
    │   ├── supabase.ts          # 유연한 Supabase 클라이언트 (연동 감지기)
    │   ├── paymentAdapter.ts    # 플러그형 결제 PG 어댑터 (Dev PG 구현체)
    │   └── utils.ts             # 통화 표기, 주문번호 생성, 날짜 헬퍼
    ├── mock/                    # 오프라인 및 프로토타입 상태 엔진
    │   ├── seedProducts.ts      # 32개 패션 상품 및 멀티 옵션
    │   ├── mockData.ts          # 회원, 쿠폰, 이벤트, 리뷰, 게시판 데이터
    │   └── mockStorage.ts       # localStorage 기반 영속 저장소
    ├── services/
    │   └── api.ts               # Supabase 연동 시 원격, 미설정 시 로컬 자동 폴백
    ├── context/
    │   ├── AuthContext.tsx      # 고객/관리자 전환 및 세션 관리
    │   ├── CartContext.tsx      # 장바구니 실시간 계산 및 옵션 제어
    │   ├── WishlistContext.tsx  # 위시리스트 토글
    │   └── ToastContext.tsx     # 고해상도 토스트 피드백
    ├── components/
    │   ├── layout/              # Header, MegaMenu, Footer, MobileNav
    │   ├── home/                # HeroSlider, 1+1, New, Best, Magazine 등
    │   ├── common/              # ProductCard, Badge, SearchModal
    │   ├── widgets/             # FloatingChatbot, KakaoFloatingButton
    │   └── admin/               # AdminLayout (사이드바, 탑바)
    └── pages/
        ├── HomePage.tsx
        ├── ProductListPage.tsx  # 다중 필터 & 정렬 상품 목록
        ├── ProductDetailPage.tsx
        ├── CartPage.tsx
        ├── CheckoutPage.tsx     # 쿠폰/포인트 동시 적용 결제
        ├── OrderSuccessPage.tsx
        ├── auth/                # 로그인, 회원가입, 아이디/비밀번호 찾기
        ├── mypage/              # 10대 마이페이지 서브 화면
        ├── boards/              # Q&A, 자유게시판, 쇼룸 예약
        ├── customer/            # 고객센터 메인, 공지사항, FAQ
        ├── special/             # 1+1 특별전, 브랜드, 이벤트, 리뷰, 매거진
        └── admin/               # 10대 ERP 관리자 화면
```

---

## 💻 로컬 개발 환경 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

### 3. 프로덕션 빌드 및 검증
```bash
npm run build
```
TypeScript 타입 체킹(`tsc -b`)과 Vite 번들링이 수행되며 `dist/` 폴더가 생성됩니다.

---

## 🔒 환경 변수 설정 (Environment Variables)

프로젝트 루트에 `.env` 파일을 생성하거나 수정합니다:

```env
# Supabase 접속 정보 (Frontend에는 ANON/PUBLIC 키만 입력)
VITE_SUPABASE_URL=https://gseueojxksbhbgvisshq.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here

# 카카오톡 상담 채널 URL
VITE_KAKAO_CHANNEL_URL=https://pf.kakao.com/_example
```

> **🛡️ 보안 가이드라인 준수**:
> - 프론트엔드 환경변수에는 오직 `VITE_SUPABASE_ANON_KEY`만 사용합니다.
> - `service_role` 키, 데이터베이스 비밀번호, PG사 Secret Key, AI Secret Key는 클라이언트에 절대 노출되지 않으며, `supabase/functions/` Edge Function 서버 환경에서 안전하게 처리됩니다.
> - `VITE_SUPABASE_ANON_KEY`가 입력되지 않은 상태에서도 내장된 **Mock Storage Engine**을 통해 모든 기능(회원가입, 주문, 결제, 포인트 원장, 관리자 ERP)이 100% 정상 작동합니다.

---

## 🗄️ Supabase 데이터베이스 설정 가이드

실제 Supabase 프로젝트(`https://gseueojxksbhbgvisshq.supabase.co`)에 스키마를 반영하려면 Supabase 대시보드의 **SQL Editor**에서 아래 순서대로 실행합니다:

1. `supabase/migrations/20261006000001_initial_schema.sql`  
   → 43개 테이블, 외래키, 트리거, 인덱스 생성
2. `supabase/migrations/20261006000002_rls_policies.sql`  
   → 사용자 및 관리자 RLS(Row Level Security) 접근 제어 정책 적용
3. `supabase/migrations/20261006000003_storage_buckets.sql`  
   → `products`, `reviews`, `events`, `boards`, `profiles` 5대 스토리지 버킷 생성
4. `supabase/migrations/20261006000004_seed_data.sql`  
   → 회원등급(4종), 카테고리, 7대 디자이너 브랜드, 쿠폰, 이벤트, 원자재 및 공급업체 기초 데이터 주입

---

## 🌐 Vercel 배포 가이드

1. **GitHub 리포지토리 생성 및 푸시**:
   ```bash
   git add .
   git commit -m "feat: complete DASSOBA fashion ecommerce system"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. **Vercel 프로젝트 가져오기 (Import)**:
   - Vercel 대시보드에서 해당 GitHub 리포지토리 선택
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables 입력**:
   - `VITE_SUPABASE_URL`: `https://gseueojxksbhbgvisshq.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Supabase Project Settings > API > `anon public` 키 입력
   - `VITE_KAKAO_CHANNEL_URL`: 카카오톡 채널 URL
4. **Deploy**:
   - 배포 즉시 `vercel.json`의 SPA 라우팅 규칙에 따라 모든 서브 라우트(`/products`, `/cart`, `/admin` 등)가 새로고침 시에도 정상 동작합니다.

---

## 🧪 테스트 계정 및 시연 팁

화면 우측 상단의 **[모드: 고객 / 관리자]** 스위처를 클릭하면 별도의 로그인 과정 없이도 즉시 역할을 전환하며 전 기능을 검증할 수 있습니다:

- **VIP 고객 모드**:
  - 이름: 김다써 (`vip@dassoba.kr`)
  - 등급: VIP (전용 할인 및 14,500P 보유)
  - 사용 가능 쿠폰 2장 탑재
  - 주문서 결제 시 포인트 + 쿠폰 동시 할인 및 결제 성공 테스트 가능
- **관리자 모드 (`/admin`)**:
  - 모든 ERP 콘솔(회원 등급 조정, 상품 CRUD, 발주 PO 발행, 송장 등록, 세금계산서 조회)에 즉시 접근 가능

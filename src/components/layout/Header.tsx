import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Shield,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { MegaMenu } from './MegaMenu';
import { MobileCategoryDrawer } from './MobileCategoryDrawer';
import { SearchModal } from '../common/SearchModal';
import { isSupabaseConfigured } from '@/lib/supabase';

export const Header: React.FC = () => {
  const { user, isLoggedIn, isAdmin, logout, switchUserRole } = useAuth();
  const { totalItemsCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const [activeMegaCategory, setActiveMegaCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const navCategories = [
    { label: '여성', slug: 'women', hasMega: true, path: '/category/women' },
    { label: '남성', slug: 'men', hasMega: true, path: '/category/men' },
    { label: '키즈', slug: 'kids', hasMega: true, path: '/category/kids' },
    { label: '잡화', slug: 'acc', hasMega: true, path: '/category/acc' },
    { label: '아울렛', slug: 'outlet', hasMega: false, path: '/special/outlet' },
    { label: '브랜드', slug: 'brands', hasMega: false, path: '/brands' },
    { label: '매거진', slug: 'magazine', hasMega: false, path: '/magazine' },
    { label: '신상품', slug: 'new', hasMega: false, path: '/new' },
    { label: '베스트', slug: 'best', hasMega: false, path: '/best' },
    { label: '기획전', slug: 'editorial', hasMega: false, path: '/special/editorial' },
    { label: '이벤트', slug: 'events', hasMega: false, path: '/events' },
    { label: '1+1', slug: 'one-plus-one', hasMega: false, path: '/1plus1', highlight: true },
    { label: '리뷰', slug: 'reviews', hasMega: false, path: '/reviews' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      {/* Top Utility Bar */}
      <div className="bg-[#fcfbfa] border-b border-neutral-100 text-[11px] text-neutral-500 py-1.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Tagline & Supabase Status */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-normal tracking-wide text-neutral-600">
              입어보고 싶은 모든 스타일을 한곳에서
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
              title={
                isSupabaseConfigured
                  ? 'Supabase 실시간 데이터베이스 연동됨'
                  : '로컬 프로토타입 모드 작동 중 (.env 파일에 VITE_SUPABASE_ANON_KEY 설정 시 실시간 연동)'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
              {isSupabaseConfigured ? 'Supabase Live' : 'Demo Prototype'}
            </span>
          </div>

          {/* Right: User Utility Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Role Switcher for seamless test review */}
            <div className="flex items-center gap-1.5 bg-neutral-100 px-2 py-0.5 rounded">
              <span className="text-[10px] text-neutral-400">모드:</span>
              <button
                onClick={() => switchUserRole('customer')}
                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  !isAdmin ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                고객
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                  isAdmin ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                관리자
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-semibold text-[#721b29] hover:underline"
              >
                <Shield className="w-3 h-3" /> 관리자 콘솔
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <span className="text-neutral-800 font-medium hidden sm:inline">
                  {user?.name}님 ({user?.member_grade})
                </span>
                <Link to="/mypage" className="hover:text-neutral-900 transition-colors">
                  마이페이지
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-neutral-900 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hover:text-neutral-900 transition-colors">
                  로그인
                </Link>
                <Link to="/auth/register" className="hover:text-neutral-900 transition-colors">
                  회원가입
                </Link>
              </>
            )}

            <Link to="/cart" className="hover:text-neutral-900 transition-colors">
              장바구니 ({totalItemsCount})
            </Link>
            <Link to="/customer" className="hover:text-neutral-900 transition-colors hidden sm:inline">
              고객센터
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Menu & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1 text-neutral-800 hover:text-black"
              aria-label="카테고리 메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex flex-col group">
              <span className="text-2xl md:text-3xl font-serif font-black tracking-tight text-neutral-950 group-hover:text-[#721b29] transition-colors">
                DASSOBA
              </span>
              <span className="text-[9px] tracking-widest text-neutral-400 font-sans uppercase -mt-1 font-medium">
                다써바 • Contemporary
              </span>
            </Link>
          </div>

          {/* Center: Large Integrated Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center bg-[#f8f8f8] hover:bg-[#f3f3f3] focus-within:bg-white border border-neutral-300 focus-within:border-neutral-900 transition-all"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="입어보고 싶은 스타일, 브랜드, 1+1 기획전 검색"
                className="w-full py-2.5 pl-4 pr-10 text-xs text-neutral-900 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-3 text-neutral-500 hover:text-neutral-900"
                aria-label="검색"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Quick Action Icons */}
          <div className="flex items-center gap-3 md:gap-5 text-neutral-800">
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 hover:text-[#721b29]"
              aria-label="검색창 열기"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/mypage/wishlist"
              className="relative p-2 hover:text-[#721b29] transition-colors"
              aria-label="찜한 상품"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#721b29] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:text-[#721b29] transition-colors"
              aria-label="장바구니"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-neutral-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User MyPage */}
            <Link
              to={isLoggedIn ? '/mypage' : '/auth/login'}
              className="p-2 hover:text-[#721b29] transition-colors hidden sm:block"
              aria-label="마이페이지"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) */}
      <div className="hidden md:block border-t border-neutral-100 bg-white relative">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex items-center justify-between text-xs tracking-tight">
            <div className="flex items-center space-x-7">
              {navCategories.map((cat) => {
                const isActive =
                  location.pathname === cat.path ||
                  (cat.hasMega && location.pathname.startsWith(`/category/${cat.slug}`));

                return (
                  <div
                    key={cat.slug}
                    className="relative py-3.5 group"
                    onMouseEnter={() => {
                      if (cat.hasMega) setActiveMegaCategory(cat.slug);
                      else setActiveMegaCategory(null);
                    }}
                  >
                    <Link
                      to={cat.path}
                      className={`font-medium transition-colors flex items-center gap-1 ${
                        isActive
                          ? 'text-[#721b29] font-bold border-b-2 border-[#721b29] -mb-[2px] pb-3'
                          : cat.highlight
                          ? 'text-[#721b29] font-bold hover:text-black'
                          : 'text-neutral-800 hover:text-[#721b29]'
                      }`}
                    >
                      {cat.label}
                      {cat.hasMega && (
                        <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-neutral-800 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Editorial Quick Promo Tag */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="text-[#721b29] font-semibold">봄 정기 신상전</span>
              <span>최대 30% 할인</span>
            </div>
          </nav>
        </div>

        {/* Mega Menu Overlay */}
        <MegaMenu
          activeCategorySlug={activeMegaCategory}
          onClose={() => setActiveMegaCategory(null)}
        />
      </div>

      {/* Mobile Category Drawer */}
      <MobileCategoryDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

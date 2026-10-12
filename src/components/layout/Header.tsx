import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Shield,
  Zap,
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
    { label: '1+1 특가', slug: 'one-plus-one', hasMega: false, path: '/1plus1', highlight: true },
    { label: '리뷰', slug: 'reviews', hasMega: false, path: '/reviews' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a14]/95 backdrop-blur-xl border-b border-cyan-500/25 text-white">
      {/* Top Utility Bar */}
      <div className="bg-[#05050b] border-b border-white/5 text-[11px] text-neutral-400 py-1.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Tagline & Status */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono tracking-wide text-neutral-400">
              ⚡ DASSOBA CYBER STREETWEAR // 2077
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full animate-ping ${
                  isSupabaseConfigured ? 'bg-emerald-400' : 'bg-cyan-400'
                }`}
              />
              {isSupabaseConfigured ? 'CORE: LIVE' : 'CYBER_DEMO'}
            </span>
          </div>

          {/* Right: User Utility Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Role Switcher */}
            <div className="flex items-center gap-1 bg-[#101020] border border-cyan-500/30 px-1.5 py-0.5 rounded">
              <span className="text-[10px] font-mono text-cyan-400">ROLE:</span>
              <button
                onClick={() => switchUserRole('customer')}
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold transition-all ${
                  !isAdmin
                    ? 'bg-cyan-400 text-black shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                USER
              </button>
              <button
                onClick={() => switchUserRole('admin')}
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold transition-all ${
                  isAdmin
                    ? 'bg-pink-500 text-white shadow-[0_0_8px_rgba(255,0,127,0.6)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ADMIN
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-mono font-bold text-pink-400 hover:text-pink-300 transition-colors"
              >
                <Shield className="w-3 h-3 text-pink-400" /> 관리자 콘솔
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <span className="text-cyan-300 font-mono hidden sm:inline">
                  {user?.name}님 [{user?.member_grade}]
                </span>
                <Link to="/mypage" className="hover:text-cyan-300 transition-colors">
                  마이페이지
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-pink-400 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-cyan-300 transition-colors">
                  로그인
                </Link>
                <Link to="/register" className="hover:text-pink-400 transition-colors">
                  회원가입
                </Link>
              </>
            )}

            <Link to="/cart" className="hover:text-cyan-300 transition-colors">
              장바구니 ({totalItemsCount})
            </Link>
            <Link to="/customer" className="hover:text-cyan-300 transition-colors hidden sm:inline">
              고객센터
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile Menu & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1 text-neutral-300 hover:text-cyan-300"
              aria-label="카테고리 메뉴 열기"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex flex-col group">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                DASSOBA
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 uppercase -mt-1 font-bold">
                CYBER_STREET // CONTEMPORARY
              </span>
            </Link>
          </div>

          {/* Center: Large Cyber Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center bg-[#101020] hover:bg-[#15152a] focus-within:bg-[#121226] border border-cyan-500/30 focus-within:border-cyan-400 rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] focus-within:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="테크웨어, 네온 카고, 1+1 듀얼특가, 사이버 스트릿 검색"
                className="w-full py-2.5 pl-4 pr-10 text-xs text-white placeholder-neutral-500 bg-transparent focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="absolute right-3 text-cyan-400 hover:text-cyan-300"
                aria-label="검색"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Quick Action Icons */}
          <div className="flex items-center gap-3 md:gap-5 text-neutral-300">
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 hover:text-cyan-300"
              aria-label="검색창 열기"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to="/mypage/wishlist"
              className="relative p-2 hover:text-pink-400 transition-colors"
              aria-label="찜한 상품"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono shadow-[0_0_8px_rgba(255,0,127,0.7)]">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:text-cyan-300 transition-colors"
              aria-label="장바구니"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-cyan-400 text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono shadow-[0_0_8px_rgba(0,240,255,0.7)]">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User MyPage */}
            <Link
              to={isLoggedIn ? '/mypage' : '/login'}
              className="p-2 hover:text-cyan-300 transition-colors hidden sm:block"
              aria-label="마이페이지"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) */}
      <div className="hidden md:block border-t border-cyan-500/15 bg-[#07070f] relative">
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
                    className="relative py-3 group"
                    onMouseEnter={() => {
                      if (cat.hasMega) setActiveMegaCategory(cat.slug);
                      else setActiveMegaCategory(null);
                    }}
                  >
                    <Link
                      to={cat.path}
                      className={`font-mono text-xs transition-all flex items-center gap-1 ${
                        isActive
                          ? 'text-cyan-300 font-bold border-b-2 border-cyan-400 -mb-[2px] pb-2.5 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]'
                          : cat.highlight
                          ? 'text-yellow-300 font-bold hover:text-white drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]'
                          : 'text-neutral-300 hover:text-cyan-300'
                      }`}
                    >
                      {cat.label}
                      {cat.hasMega && (
                        <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-cyan-300 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Cyber Quick Promo Tag */}
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-pink-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-300" /> S/S CYBER DROP
              </span>
              <span className="text-neutral-400">UP TO 50% OFF</span>
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

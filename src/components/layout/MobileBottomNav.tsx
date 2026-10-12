import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Grid, Search, Heart, User } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface MobileBottomNavProps {
  onOpenCategory?: () => void;
  onOpenSearch?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenCategory,
  onOpenSearch,
}) => {
  const navigate = useNavigate();
  const { totalWishlistCount } = useWishlist();

  const handleCategoryClick = () => {
    if (onOpenCategory) onOpenCategory();
    else navigate('/products');
  };

  const handleSearchClick = () => {
    if (onOpenSearch) onOpenSearch();
    else navigate('/search');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a14]/95 border-t border-cyan-500/30 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.8)] px-2 py-1 safe-area-bottom font-mono">
      <nav className="flex items-center justify-around h-14">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold transition-all ${
              isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>홈</span>
        </NavLink>

        {/* Category Drawer Trigger */}
        <button
          onClick={handleCategoryClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold text-neutral-400 hover:text-cyan-300 transition-colors"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>카테고리</span>
        </button>

        {/* Search Modal Trigger */}
        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold text-neutral-400 hover:text-cyan-300 transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>검색</span>
        </button>

        {/* Wishlist */}
        <NavLink
          to="/mypage/wishlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold transition-all ${
              isActive ? 'text-pink-400 drop-shadow-[0_0_8px_rgba(255,0,127,0.6)]' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>찜</span>
          {totalWishlistCount > 0 && (
            <span className="absolute top-1 right-3 bg-pink-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-[0_0_6px_rgba(255,0,127,0.8)]">
              {totalWishlistCount}
            </span>
          )}
        </NavLink>

        {/* MyPage */}
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold transition-all ${
              isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'text-neutral-400 hover:text-white'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>MY</span>
        </NavLink>
      </nav>
    </div>
  );
};

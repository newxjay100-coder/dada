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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-lg px-2 py-1 safe-area-bottom">
      <nav className="flex items-center justify-around h-14">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>홈</span>
        </NavLink>

        {/* Category Drawer Trigger */}
        <button
          onClick={handleCategoryClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>카테고리</span>
        </button>

        {/* Search Modal Trigger */}
        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>검색</span>
        </button>

        {/* Wishlist */}
        <NavLink
          to="/mypage/wishlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#721b29] font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          <Heart className="w-5 h-5 mb-0.5" />
          <span>찜</span>
          {totalWishlistCount > 0 && (
            <span className="absolute top-1 right-3.5 bg-[#721b29] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalWishlistCount}
            </span>
          )}
        </NavLink>

        {/* My Page */}
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>마이</span>
        </NavLink>
      </nav>
    </div>
  );
};

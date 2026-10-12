import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  Heart,
  Tag,
  Coins,
  MessageSquare,
  MapPin,
  UserCheck,
  RotateCcw,
  ShoppingBag,
  Star,
} from 'lucide-react';

export const MyPageLayout: React.FC = () => {
  const { user } = useAuth();
  const { totalItemsCount } = useCart();
  const { totalWishlistCount } = useWishlist();

  const mypageMenus = [
    { label: 'MY 홈 / 대시보드', path: '/mypage', exact: true },
    { label: '1. 나의 주문 내역', path: '/mypage/orders', icon: Package },
    { label: '2. 취소 / 반품 / 환불 / 교환', path: '/mypage/claims', icon: RotateCcw },
    { label: '3. 찜한 상품', path: '/mypage/wishlist', icon: Heart, count: totalWishlistCount },
    { label: '4. 장바구니', path: '/cart', icon: ShoppingBag, count: totalItemsCount },
    { label: '5. 쿠폰함', path: '/mypage/coupons', icon: Tag },
    { label: '6. 포인트 내역', path: '/mypage/points', icon: Coins },
    { label: '7. 상품 리뷰 관리', path: '/mypage/reviews', icon: Star },
    { label: '8. 1:1 문의 내역', path: '/mypage/inquiries', icon: MessageSquare },
    { label: '9. 배송지 관리', path: '/mypage/addresses', icon: MapPin },
    { label: '10. 회원정보 수정', path: '/mypage/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* User Summary Card */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* User Grade and Name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-serif font-black text-xl">
                {user?.name ? user.name[0] : 'D'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-900">{user?.name || '김다써'}님</h2>
                  <span className="px-2 py-0.5 bg-[#721b29] text-white text-[10px] font-bold tracking-wider">
                    {user?.member_grade || 'VIP'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {user?.email || 'vip@dassoba.kr'}
                </p>
              </div>
            </div>

            {/* Metric counters: Points, Coupons, Cart, Wishlist */}
            <div className="grid grid-cols-4 gap-4 sm:gap-8 border-t sm:border-t-0 pt-4 sm:pt-0 border-neutral-100 text-center">
              <div>
                <span className="text-[11px] text-neutral-400 block mb-0.5">포인트</span>
                <Link
                  to="/mypage/points"
                  className="text-base sm:text-lg font-black text-neutral-900 hover:text-[#721b29]"
                >
                  {user?.points_balance?.toLocaleString() || '14,500'}P
                </Link>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block mb-0.5">쿠폰</span>
                <Link
                  to="/mypage/coupons"
                  className="text-base sm:text-lg font-black text-neutral-900 hover:text-[#721b29]"
                >
                  2장
                </Link>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block mb-0.5">장바구니</span>
                <Link
                  to="/cart"
                  className="text-base sm:text-lg font-black text-neutral-900 hover:text-[#721b29]"
                >
                  {totalItemsCount}개
                </Link>
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block mb-0.5">찜</span>
                <Link
                  to="/mypage/wishlist"
                  className="text-base sm:text-lg font-black text-neutral-900 hover:text-[#721b29]"
                >
                  {totalWishlistCount}개
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Split: Left Navigation / Right Outlet */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1 bg-white border border-neutral-200 p-4 shadow-2xs h-fit space-y-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-3 py-2 block">
              MY SHOPPING MENU
            </span>
            {mypageMenus.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                end={menu.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  {menu.icon && <menu.icon className="w-4 h-4 shrink-0" />}
                  <span>{menu.label}</span>
                </div>
                {menu.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-neutral-200 text-neutral-800 rounded font-bold">
                    {menu.count}
                  </span>
                )}
              </NavLink>
            ))}
          </aside>

          {/* Right Outlet */}
          <main className="md:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

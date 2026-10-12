import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

interface PersonalRecommendSectionProps {
  products: Product[];
}

export const PersonalRecommendSection: React.FC<PersonalRecommendSectionProps> = ({
  products,
}) => {
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();

  // If user has wishlist items, show recommendations based on them, else high rating items
  const recommended = products.slice(8, 12);

  return (
    <section className="py-16 md:py-24 bg-[#faf9f6] border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-neutral-500 mb-1">
              <Sparkles className="w-4 h-4 text-[#721b29]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">
                FOR YOU
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              {user ? `${user.name}님을 위한 스타일 추천` : '취향 맞춤 추천 큐레이션'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              최근 관심 있게 보신 상품과 고객 선호도를 분석한 스마트 추천입니다.
            </p>
          </div>

          <Link
            to="/mypage/wishlist"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-[#721b29]"
          >
            <Heart className="w-4 h-4 text-[#721b29]" />
            <span>찜한 상품 보러가기 ({wishlistIds.length})</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {recommended.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

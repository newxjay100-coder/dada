import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, Heart, Cpu } from 'lucide-react';
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

  const recommended = products.slice(8, 12);

  return (
    <section className="py-16 md:py-24 bg-[#090914] border-b border-purple-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-purple-400 mb-1">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span className="text-[11px] font-mono font-black tracking-widest uppercase">
                AI_RECOMMEND // NEURAL_FIT
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              {user ? `${user.name}님을 위한 사이버 핏 추천` : '취향 분석 스마트 추천 큐레이션'}
            </h2>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              고객님의 스타일 선호도와 글로벌 K-스트릿 트렌드를 신경망으로 분석한 추천입니다.
            </p>
          </div>

          <Link
            to="/mypage/wishlist"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-pink-400 hover:text-pink-300 transition-colors bg-[#141428] px-3.5 py-2 rounded-lg border border-pink-500/30"
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500/50" />
            <span>찜한 스타일 리스트 ({wishlistIds.length})</span>
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

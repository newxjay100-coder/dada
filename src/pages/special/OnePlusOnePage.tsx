import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Product } from '@/types/database.types';
import { ProductCard } from '@/components/common/ProductCard';
import { Percent, Sparkles } from 'lucide-react';

export const OnePlusOnePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then((all) => {
      setProducts(all.filter((p) => p.is_one_plus_one));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Burgundy Hero Banner */}
      <div className="bg-[#721b29] text-white py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white text-[11px] font-bold tracking-widest uppercase">
            <Percent className="w-3.5 h-3.5" /> SPECIAL CURATION
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight">
            DASSOBA 1+1 SPECIAL SELECTION
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200 max-w-xl mx-auto font-light leading-relaxed">
            하나의 가격으로 완성하는 두 가지 무드. 엄선된 최상급 캐시미어 니트, 프리미엄 드레스 셔츠,
            수피마 티셔츠를 지금 특별 1+1 혜택으로 만나보세요.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-8">
          <span className="text-xs font-bold text-neutral-900 uppercase">
            1+1 대상 셀렉션 (총 {products.length}개)
          </span>
          <span className="text-xs text-neutral-400">결제 시 단품 옵션 2개 자동 지정</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-400">불러오는 중...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

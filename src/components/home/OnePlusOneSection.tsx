import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { Percent, ArrowRight } from 'lucide-react';

interface OnePlusOneSectionProps {
  products: Product[];
}

export const OnePlusOneSection: React.FC<OnePlusOneSectionProps> = ({ products }) => {
  const onePlusOneList = products.filter((p) => p.is_one_plus_one).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Banner Card Header */}
        <div className="relative overflow-hidden bg-[#721b29] text-white p-8 md:p-12 mb-12 shadow-md">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase bg-white/20 px-2.5 py-1 mb-3">
              <Percent className="w-3.5 h-3.5" /> SPECIAL CURATION
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight mb-3">
              DASSOBA 1+1 SPECIAL
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light mb-6">
              하나 가격으로 두 가지 색상과 실루엣을 완성하세요. 엄선된 캐시미어 니트, 드레스 셔츠, 코튼 티셔츠 1+1 기획 셀렉션입니다.
            </p>
            <Link
              to="/1plus1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#721b29] text-xs font-bold tracking-widest uppercase hover:bg-neutral-100 transition-colors shadow-sm"
            >
              1+1 기획전 바로가기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Subtle watermark */}
          <div className="absolute right-4 -bottom-10 text-[120px] font-serif font-black text-white/5 select-none pointer-events-none hidden md:block">
            1+1
          </div>
        </div>

        {/* 1+1 Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {onePlusOneList.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

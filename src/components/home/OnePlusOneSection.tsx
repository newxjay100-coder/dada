import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { Percent, ArrowRight, Zap } from 'lucide-react';

interface OnePlusOneSectionProps {
  products: Product[];
}

export const OnePlusOneSection: React.FC<OnePlusOneSectionProps> = ({ products }) => {
  const onePlusOneList = products.filter((p) => p.is_one_plus_one).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-[#07070e] border-b border-yellow-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Banner Card Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1f1903] via-[#2b1f08] to-[#140f28] border border-yellow-400/40 text-white p-8 md:p-12 mb-12 rounded-2xl shadow-[0_0_30px_rgba(250,204,21,0.2)]">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-black tracking-widest uppercase bg-yellow-950/80 border border-yellow-400/60 text-yellow-300 px-3 py-1 mb-3 rounded shadow-[0_0_10px_rgba(250,204,21,0.4)]">
              <Zap className="w-3.5 h-3.5" /> DUAL_MATRIX // 1+1 SPECIAL
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
              DASSOBA 1+1 SPECIAL
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal mb-6">
              하나 가격으로 두 가지 사이버 스트릿 스타일을 완성하세요. 엄선된 테크웨어 재킷, 카고 팬츠, 그래픽 티셔츠 1+1 기획전입니다.
            </p>
            <Link
              to="/1plus1"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-mono font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] hover:-translate-y-0.5"
              style={{
                clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
              }}
            >
              <span>1+1 기획전 바로가기 (ACCESS_1+1)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {/* Subtle Cyber Watermark */}
          <div className="absolute right-4 -bottom-10 text-[140px] font-mono font-black text-yellow-400/5 select-none pointer-events-none hidden md:block">
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

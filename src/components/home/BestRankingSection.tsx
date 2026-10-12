import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { Flame, ArrowRight } from 'lucide-react';

interface BestRankingSectionProps {
  products: Product[];
}

export const BestRankingSection: React.FC<BestRankingSectionProps> = ({ products }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Sort by popularity / sales
  const bestProducts = [...products]
    .filter((p) => p.is_best)
    .sort((a, b) => b.sale_count - a.sale_count)
    .slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-[#faf9f7] border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#721b29] mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-widest uppercase">
                MOST LOVED STYLES
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              BEST RANKING
            </h2>
          </div>

          {/* Ranking Time Period Filter */}
          <div className="flex items-center bg-white border border-neutral-200 p-1">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-colors ${
                period === 'daily'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              일간
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-colors ${
                period === 'weekly'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 text-xs font-semibold tracking-wider transition-colors ${
                period === 'monthly'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              월간
            </button>
          </div>
        </div>

        {/* Products Grid with Ranks */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {bestProducts.map((prod, idx) => (
            <ProductCard key={prod.id} product={prod} rank={idx + 1} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/best"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm"
          >
            실시간 랭킹 전체보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

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
    <section className="py-16 md:py-24 bg-[#090913] border-b border-pink-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-pink-400 mb-1">
              <Flame className="w-4 h-4 fill-pink-500" />
              <span className="text-[11px] font-mono font-black tracking-widest uppercase">
                MOST_WANTED // REALTIME_RANKING
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(255,0,127,0.3)]">
              BEST RANKING TOP
            </h2>
          </div>

          {/* Ranking Time Period Filter */}
          <div className="flex items-center bg-[#101020] border border-pink-500/30 p-1 rounded-lg">
            <button
              onClick={() => setPeriod('daily')}
              className={`px-3 py-1 text-xs font-mono font-bold tracking-wider transition-all rounded ${
                period === 'daily'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_0_10px_rgba(255,0,127,0.5)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              DAILY
            </button>
            <button
              onClick={() => setPeriod('weekly')}
              className={`px-3 py-1 text-xs font-mono font-bold tracking-wider transition-all rounded ${
                period === 'weekly'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_0_10px_rgba(255,0,127,0.5)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              WEEKLY
            </button>
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 text-xs font-mono font-bold tracking-wider transition-all rounded ${
                period === 'monthly'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-[0_0_10px_rgba(255,0,127,0.5)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              MONTHLY
            </button>
          </div>
        </div>

        {/* Products Grid with Ranks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {bestProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/best"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0e0e1a] hover:bg-gradient-to-r hover:from-pink-500 hover:to-cyan-400 hover:text-black border border-pink-500/40 hover:border-transparent text-pink-300 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(255,0,127,0.2)] hover:shadow-[0_0_25px_rgba(255,0,127,0.5)]"
            style={{
              clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
            }}
          >
            <span>베스트 랭킹 100 전체보기 (TOP_RANKING)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

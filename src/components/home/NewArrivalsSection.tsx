import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface NewArrivalsSectionProps {
  products: Product[];
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'WOMEN' | 'MEN' | 'KIDS' | 'ACC'>('ALL');

  const filtered = products
    .filter((p) => {
      if (!p.is_new) return false;
      if (activeTab === 'ALL') return true;
      if (activeTab === 'WOMEN') return p.category_id?.includes('women');
      if (activeTab === 'MEN') return p.category_id?.includes('men');
      if (activeTab === 'KIDS') return p.category_id?.includes('kids');
      if (activeTab === 'ACC') return p.category_id?.includes('acc');
      return true;
    })
    .slice(0, 8);

  const tabs: Array<'ALL' | 'WOMEN' | 'MEN' | 'KIDS' | 'ACC'> = [
    'ALL',
    'WOMEN',
    'MEN',
    'KIDS',
    'ACC',
  ];

  return (
    <section className="py-16 md:py-24 bg-[#07070e] border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-mono font-black tracking-widest uppercase text-cyan-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              CYBER_VAULT // S/S 2077
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              NEW ARRIVALS
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider transition-all uppercase rounded-t ${
                  activeTab === tab
                    ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/40 -mb-[5px] shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'ACC' ? 'GEAR/ACC' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0e0e1a] hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-500 hover:text-black border border-cyan-500/40 hover:border-transparent text-cyan-300 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(255,0,127,0.5)]"
            style={{
              clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
            }}
          >
            <span>전체 신상품 확인하기 (MORE_DROPS)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

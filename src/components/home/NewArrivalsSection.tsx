import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/database.types';
import { ProductCard } from '../common/ProductCard';
import { ArrowRight } from 'lucide-react';

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
    <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-1">
              CURRENT EDIT
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              NEW ARRIVALS
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 border-b border-neutral-200 pb-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wider transition-colors uppercase ${
                  activeTab === tab
                    ? 'text-neutral-900 border-b-2 border-neutral-900 -mb-[5px]'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {tab === 'ACC' ? 'ACCESSORIES' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/new"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-900 text-neutral-900 text-xs font-bold tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300"
          >
            신상품 전체보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

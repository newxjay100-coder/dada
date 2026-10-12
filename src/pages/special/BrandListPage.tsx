import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INITIAL_BRANDS } from '@/mock/seedProducts';
import { api } from '@/services/api';
import { Product, Brand } from '@/types/database.types';
import { ProductCard } from '@/components/common/ProductCard';

export const BrandListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentBrandSlug = searchParams.get('brand') || INITIAL_BRANDS[0].slug;

  const [products, setProducts] = useState<Product[]>([]);
  const currentBrand = INITIAL_BRANDS.find((b) => b.slug === currentBrandSlug) || INITIAL_BRANDS[0];

  useEffect(() => {
    api.getProducts().then((all) => {
      setProducts(all.filter((p) => p.brand?.slug === currentBrandSlug || p.brand_id === currentBrand.id));
    });
  }, [currentBrandSlug]);

  return (
    <div className="min-h-screen bg-white">
      {/* Brand Tabs Header */}
      <div className="bg-[#faf9f6] border-b border-neutral-200 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-500">
              BRANDS DIRECTORY // 2077
            </span>
            <h1 className="text-3xl font-orbitron font-black text-neutral-900 tracking-tight mt-1">
              사이버 스트리트 & 테크웨어 디자이너 레이블
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
            {INITIAL_BRANDS.map((b) => (
              <button
                key={b.id}
                onClick={() => setSearchParams({ brand: b.slug })}
                className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                  currentBrandSlug === b.slug
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
                }`}
              >
                {b.english_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Hero Story */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 border-b border-neutral-100">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-[#721b29] uppercase tracking-widest block mb-1">
            ABOUT {currentBrand.english_name}
          </span>
          <h2 className="text-2xl font-serif font-black text-neutral-900 mb-2">
            {currentBrand.name} ({currentBrand.english_name})
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            {currentBrand.description}
          </p>
        </div>
      </div>

      {/* Products under this brand */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200">
          <span className="text-xs font-bold text-neutral-900 uppercase">
            {currentBrand.english_name} 상품 ({products.length})
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center text-xs text-neutral-400">
            등록된 상품이 없습니다.
          </div>
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

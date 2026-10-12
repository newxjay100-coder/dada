import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/mock/seedProducts';
import { ArrowRight, Terminal } from 'lucide-react';

interface MegaMenuProps {
  activeCategorySlug: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeCategorySlug, onClose }) => {
  if (!activeCategorySlug) return null;

  const currentCategory = INITIAL_CATEGORIES.find((c) => c.slug === activeCategorySlug);
  if (!currentCategory) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#0a0a16]/98 border-b border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-40 animate-fade-in text-white backdrop-blur-2xl font-mono"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Category Title & All link */}
          <div className="col-span-3 border-r border-white/10 pr-6">
            <span className="text-[11px] tracking-widest uppercase text-cyan-400 font-bold flex items-center gap-1 mb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              CATEGORY_INDEX // 2077
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              {currentCategory.name} 컬렉션
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-sans">
              퓨처리즘 실루엣과 K-스트릿 테크웨어 감각의 스타일링을 제안합니다.
            </p>
            <Link
              to={`/category/${currentCategory.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-cyan-300 border-b border-cyan-400 pb-1 hover:text-pink-400 hover:border-pink-500 transition-colors"
            >
              <span>{currentCategory.name} 전체상품 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subcategories Grid */}
          <div className="col-span-6 grid grid-cols-3 gap-6 px-4">
            {currentCategory.subcategories?.map((sub) => (
              <div key={sub.id} className="space-y-2">
                <Link
                  to={`/category/${currentCategory.slug}?sub=${sub.slug}`}
                  onClick={onClose}
                  className="text-sm font-medium text-neutral-300 hover:text-cyan-300 block transition-colors"
                >
                  {sub.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Brands & Editorial Promotion Banner */}
          <div className="col-span-3 border-l border-white/10 pl-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-pink-400 tracking-wider uppercase block mb-3">
                FEATURED CYBER BRANDS
              </span>
              <div className="flex flex-wrap gap-2">
                {INITIAL_BRANDS.slice(0, 5).map((brand) => (
                  <Link
                    key={brand.id}
                    to={`/brands?brand=${brand.slug}`}
                    onClick={onClose}
                    className="px-2.5 py-1 bg-[#121224] border border-cyan-500/20 hover:border-cyan-400 text-[11px] text-neutral-300 hover:text-cyan-300 rounded transition-all"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-tr from-cyan-950/60 to-pink-950/40 rounded-xl border border-cyan-500/30">
              <span className="text-[10px] font-black text-yellow-300 uppercase tracking-widest block mb-1">
                MEMBERSHIP BENEFIT
              </span>
              <h5 className="text-xs font-bold text-white mb-1">
                신규 가입 시 10% 사이버 웰컴 쿠폰
              </h5>
              <p className="text-[11px] text-neutral-300 font-sans">
                가입 즉시 전 상품 사용 가능한 쿠폰팩을 지급합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

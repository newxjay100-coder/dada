import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/mock/seedProducts';
import { ArrowRight } from 'lucide-react';

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
      className="absolute top-full left-0 w-full bg-white border-b border-neutral-200 shadow-2xl z-40 animate-fade-in"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Category Title & All link */}
          <div className="col-span-3 border-r border-neutral-100 pr-6">
            <span className="text-xs tracking-widest uppercase text-neutral-400 font-semibold block mb-2">
              CATEGORY EXPLORER
            </span>
            <h3 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
              {currentCategory.name} 컬렉션
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              컨템포러리 감각의 정제된 실루엣과 감각적인 스타일링을 제안합니다.
            </p>
            <Link
              to={`/category/${currentCategory.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-900 border-b border-neutral-900 pb-1 hover:text-[#721b29] hover:border-[#721b29] transition-colors"
            >
              {currentCategory.name} 전체상품 보기 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subcategories Grid */}
          <div className="col-span-6 grid grid-cols-3 gap-6 px-4">
            {currentCategory.subcategories?.map((sub) => (
              <div key={sub.id} className="space-y-2">
                <Link
                  to={`/category/${currentCategory.slug}?sub=${sub.slug}`}
                  onClick={onClose}
                  className="text-sm font-medium text-neutral-800 hover:text-[#721b29] block transition-colors"
                >
                  {sub.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Brands & Editorial Promotion Banner */}
          <div className="col-span-3 border-l border-neutral-100 pl-6 space-y-6">
            <div>
              <span className="text-xs tracking-widest uppercase text-neutral-400 font-semibold block mb-3">
                HIGHLIGHT BRANDS
              </span>
              <div className="flex flex-wrap gap-2">
                {INITIAL_BRANDS.slice(0, 4).map((b) => (
                  <Link
                    key={b.id}
                    to={`/brands?brand=${b.slug}`}
                    onClick={onClose}
                    className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    {b.english_name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group overflow-hidden bg-neutral-950 text-white p-5">
              <span className="text-[10px] tracking-widest uppercase text-neutral-400 block mb-1">
                DASSOBA EDITORIAL
              </span>
              <h4 className="text-sm font-semibold mb-1">2026 S/S 봄 신상 기획전</h4>
              <p className="text-xs text-neutral-400 mb-3">최대 25% 할인 + 10% 쿠폰</p>
              <Link
                to="/special/editorial"
                onClick={onClose}
                className="text-[11px] font-medium text-white flex items-center gap-1 group-hover:underline"
              >
                에디토리얼 바로보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

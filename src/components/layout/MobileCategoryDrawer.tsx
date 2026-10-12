import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/mock/seedProducts';
import { X, ChevronRight, Sparkles, Tag, Flame, Percent } from 'lucide-react';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileCategoryDrawer: React.FC<MobileCategoryDrawerProps> = ({ isOpen, onClose }) => {
  const [selectedParentSlug, setSelectedParentSlug] = useState('women');

  if (!isOpen) return null;

  const currentCategory = INITIAL_CATEGORIES.find((c) => c.slug === selectedParentSlug);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl z-10 animate-fade-in">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <Link to="/" onClick={onClose} className="font-orbitron font-black text-xl tracking-widest text-neutral-950 hover:text-cyan-500 transition-colors">
            DASSOBA
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-neutral-50 border-b border-neutral-100 text-center">
          <Link
            to="/new"
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-2 text-neutral-800 hover:text-[#721b29]"
          >
            <Sparkles className="w-4 h-4 text-[#721b29]" />
            <span className="text-[11px] font-medium">신상품</span>
          </Link>
          <Link
            to="/best"
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-2 text-neutral-800 hover:text-[#721b29]"
          >
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-[11px] font-medium">베스트</span>
          </Link>
          <Link
            to="/1plus1"
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-2 text-neutral-800 hover:text-[#721b29]"
          >
            <Percent className="w-4 h-4 text-rose-600" />
            <span className="text-[11px] font-medium">1+1</span>
          </Link>
          <Link
            to="/events"
            onClick={onClose}
            className="flex flex-col items-center gap-1 py-2 text-neutral-800 hover:text-[#721b29]"
          >
            <Tag className="w-4 h-4 text-neutral-700" />
            <span className="text-[11px] font-medium">이벤트</span>
          </Link>
        </div>

        {/* Main Category Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Main Categories */}
          <div className="w-1/3 bg-neutral-100 overflow-y-auto">
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedParentSlug(cat.slug)}
                className={`w-full py-4 px-4 text-left text-sm font-medium transition-colors ${
                  selectedParentSlug === cat.slug
                    ? 'bg-white text-neutral-900 border-l-4 border-l-[#721b29] font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Subcategories */}
          <div className="w-2/3 bg-white p-4 overflow-y-auto">
            <div className="mb-4 pb-2 border-b border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 uppercase">
                {currentCategory?.name} 전체보기
              </span>
              <Link
                to={`/category/${currentCategory?.slug}`}
                onClick={onClose}
                className="text-xs text-[#721b29] flex items-center font-medium"
              >
                전체이동 <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-1">
              {currentCategory?.subcategories?.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/category/${currentCategory.slug}?sub=${sub.slug}`}
                  onClick={onClose}
                  className="block py-2.5 px-2 text-sm text-neutral-700 hover:text-[#721b29] hover:bg-neutral-50 rounded"
                >
                  {sub.name}
                </Link>
              ))}
            </div>

            {/* Popular Brands in Drawer */}
            <div className="mt-8 pt-4 border-t border-neutral-100">
              <span className="text-xs font-semibold text-neutral-400 block mb-2">
                인기 브랜드
              </span>
              <div className="space-y-1.5">
                {INITIAL_BRANDS.slice(0, 4).map((b) => (
                  <Link
                    key={b.id}
                    to={`/brands?brand=${b.slug}`}
                    onClick={onClose}
                    className="block text-xs text-neutral-600 hover:text-neutral-900 py-1"
                  >
                    {b.english_name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Quick Links */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-around text-xs text-neutral-600">
          <Link to="/customer" onClick={onClose} className="hover:text-neutral-900">
            고객센터
          </Link>
          <span className="text-neutral-300">|</span>
          <Link to="/boards/notice" onClick={onClose} className="hover:text-neutral-900">
            공지사항
          </Link>
          <span className="text-neutral-300">|</span>
          <Link to="/boards/faq" onClick={onClose} className="hover:text-neutral-900">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};

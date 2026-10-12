import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Sparkles } from 'lucide-react';
import { INITIAL_BRANDS } from '@/mock/seedProducts';
import { api } from '@/services/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_KEYWORDS = [
  '테크웨어',
  '네온 카고',
  '1+1 특가',
  '사이버 스트릿',
  '고딕 드레스',
  '오버핏 자켓',
  '컴뱃 부츠',
  '메탈릭 파카',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.getPopularKeywords().then((kws) => {
        if (kws && kws.length > 0) setKeywords(kws);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const query = searchTerm.trim();
    api.logSearchQuery(query, undefined, 'modal');
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleKeywordClick = (kw: string) => {
    api.logSearchQuery(kw, undefined, 'modal');
    navigate(`/search?q=${encodeURIComponent(kw)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Search Bar Input */}
        <form onSubmit={handleSubmit} className="flex items-center px-6 py-5 border-b border-neutral-200">
          <Search className="w-6 h-6 text-neutral-400 mr-4 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="찾으시는 브랜드, 상품명, 스타일 키워드를 입력해 주세요."
            className="w-full text-base md:text-lg focus:outline-none text-neutral-900 placeholder-neutral-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase font-bold tracking-wider px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
          >
            닫기
          </button>
        </form>

        {/* Keywords and Brands Panel */}
        <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Popular Keywords */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#721b29]" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                인기 검색어
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, idx) => (
                <button
                  key={kw}
                  onClick={() => handleKeywordClick(kw)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs bg-neutral-50 hover:bg-neutral-900 hover:text-white border border-neutral-200 transition-colors rounded-none"
                >
                  <span className="font-bold text-[#721b29] text-[10px]">{idx + 1}</span>
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Brands */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-neutral-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                추천 패션 레이블
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INITIAL_BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => {
                    navigate(`/brands?brand=${brand.slug}`);
                    onClose();
                  }}
                  className="p-3 text-left border border-neutral-100 hover:border-neutral-900 bg-neutral-50/50 hover:bg-neutral-50 transition-all group"
                >
                  <span className="block text-xs font-bold text-neutral-900 group-hover:text-[#721b29]">
                    {brand.english_name}
                  </span>
                  <span className="text-[11px] text-neutral-400 block truncate">
                    {brand.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

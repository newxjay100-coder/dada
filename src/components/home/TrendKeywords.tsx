import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles } from 'lucide-react';

const TRENDING_KEYWORDS = [
  '#캐시미어 니트',
  '#울 더블 블레이저',
  '#1+1 기획전',
  '#플리츠 맥시 드레스',
  '#셀비지 데님',
  '#수피마 코튼 티',
  '#카프스킨 미니멀백',
  '#개버딘 트렌치 코트',
  '#실버 볼드 주얼리',
];

export const TrendKeywords: React.FC = () => {
  return (
    <section className="py-6 bg-[#faf9f6] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#721b29] text-white">
              <TrendingUp className="w-3 h-3" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              TRENDING NOW
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
            {TRENDING_KEYWORDS.map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag.replace('#', ''))}`}
                className="whitespace-nowrap px-3 py-1 bg-white hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-700 text-xs transition-colors rounded-none shadow-2xs font-medium"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

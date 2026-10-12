import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Zap } from 'lucide-react';

const TRENDING_KEYWORDS = [
  '#사이버 테크웨어',
  '#네온 카고팬츠',
  '#1+1 듀얼특가',
  '#메탈릭 윈드브레이커',
  '#와이드 파라슈트',
  '#사이버 선글라스',
  '#오버핏 그래픽 후디',
  '#고프코어 재킷',
  '#볼드 실버 체인',
];

export const TrendKeywords: React.FC = () => {
  return (
    <section className="py-5 bg-[#0a0a14] border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-cyan-500 text-black shadow-[0_0_8px_rgba(0,240,255,0.6)]">
              <Zap className="w-3 h-3 fill-black" />
            </span>
            <span className="text-xs font-mono font-black uppercase tracking-wider text-cyan-300">
              HOT_TAGS // 2077
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
            {TRENDING_KEYWORDS.map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag.replace('#', ''))}`}
                className="whitespace-nowrap px-3 py-1 bg-[#121224] hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-500 hover:text-black border border-cyan-500/30 hover:border-transparent text-cyan-200 text-xs font-mono font-medium transition-all rounded shadow-[0_0_8px_rgba(0,240,255,0.15)] hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]"
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

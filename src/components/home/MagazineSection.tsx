import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

const STORIES = [
  {
    id: 'mag-01',
    category: 'STYLE GUIDE',
    title: 'THE ART OF MINIMAL TAILORING',
    subtitle: '과장되지 않은 정제된 실루엣과 고급 원사가 만들어내는 현대적 클래식의 미학',
    image: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?q=80&w=800&auto=format&fit=crop',
    link: '/magazine',
  },
  {
    id: 'mag-02',
    category: 'BRAND STORY',
    title: 'ATELIER 82: 장인 정신의 재해석',
    subtitle: '파리지앵 감성과 한국 현대 테일러링이 조우하는 특별한 스튜디오 여정',
    image: 'https://images.unsplash.com/photo-1591954426313-5e47d525428d?q=80&w=800&auto=format&fit=crop',
    link: '/brands?brand=atelier-82',
  },
  {
    id: 'mag-03',
    category: 'SEASON TREND',
    title: '2026 SPRING COLOR PALETTE: BURGUNDY & WARM BEIGE',
    subtitle: '부드러운 베이지와 깊은 버건디 포인트로 완성하는 데일리 럭셔리 스타일링',
    image: 'https://images.unsplash.com/photo-1612049621554-1df669d740df?q=80&w=800&auto=format&fit=crop',
    link: '/special/editorial',
  },
];

export const MagazineSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#f8f7f4] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
              <BookOpen className="w-4 h-4 text-[#721b29]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">
                EDITORIAL CURATION
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              DASSOBA MAGAZINE & STYLE
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              트렌드를 넘어 시대를 아우르는 감각적인 패션 스토리와 룩북을 제안합니다.
            </p>
          </div>

          <Link
            to="/magazine"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-[#721b29] border-b border-neutral-900 pb-0.5"
          >
            매거진 아카이브 전체보기 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORIES.map((story) => (
            <Link
              key={story.id}
              to={story.link}
              className="group flex flex-col bg-white overflow-hidden border border-neutral-200 hover:border-neutral-900 transition-all duration-300 shadow-2xs"
            >
              <div className="aspect-16/10 w-full overflow-hidden bg-neutral-100">
                <img
                  src={story.image}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[10px] font-bold tracking-widest text-[#721b29] uppercase mb-2">
                  {story.category}
                </span>
                <h3 className="text-base font-serif font-bold text-neutral-900 mb-2 leading-snug group-hover:text-[#721b29] transition-colors">
                  {story.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4 line-clamp-2">
                  {story.subtitle}
                </p>
                <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center gap-1 text-[11px] font-semibold text-neutral-900 group-hover:underline">
                  스토리 읽기 <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

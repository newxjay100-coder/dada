import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Terminal } from 'lucide-react';

const STORIES = [
  {
    id: 'mag-01',
    category: 'TECHWEAR EDIT',
    title: 'CYBER TECHWEAR 2077: SEOUL NIGHT CORE',
    subtitle: '네온 불빛이 교차하는 서울의 밤거리, 기능성 테크웨어와 사이버 스트릿의 감각적인 조화',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
    link: '/magazine',
    code: 'SYS_01',
  },
  {
    id: 'mag-02',
    category: 'METAVERSE LOOK',
    title: 'ATELIER CYBER: 디지털 아방가르드 룩북',
    subtitle: '과감한 실버 메탈릭 텍스처와 비대칭 절개 라인이 완성하는 하이엔드 퓨처리즘',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    link: '/brands?brand=atelier-82',
    code: 'SYS_02',
  },
  {
    id: 'mag-03',
    category: 'FUNKY STREET',
    title: 'NEON ACID STREET: 펑키 힙합 스타일링 가이드',
    subtitle: '일렉트릭 옐로우와 애시드 핑크 악센트로 자유분방한 젊음의 에너지를 표현하는 방법',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
    link: '/special/editorial',
    code: 'SYS_03',
  },
];

export const MagazineSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#090913] border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-mono font-black tracking-widest uppercase">
                EDITORIAL_LOOKBOOK // 2077
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              DASSOBA CYBER MAGAZINE
            </h2>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              트렌드를 선도하는 가장 감각적인 사이버 스트릿 패션 스토리와 비주얼 룩북을 제안합니다.
            </p>
          </div>

          <Link
            to="/magazine"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-colors bg-[#0e0e1a] px-4 py-2 border border-cyan-500/30 rounded"
          >
            <span>매거진 아카이브 전체보기 (ARCHIVE)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STORIES.map((story) => (
            <Link
              key={story.id}
              to={story.link}
              className="group flex flex-col bg-[#0e0e1a] border border-cyan-500/20 hover:border-cyan-400 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:-translate-y-1"
            >
              {/* Image Container with Cyber Frame */}
              <div className="aspect-16/10 w-full overflow-hidden relative bg-neutral-950">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-108 group-hover:brightness-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-cyan-400/50 text-cyan-300 font-mono font-black text-[9px] px-2 py-0.5 rounded">
                  {story.code}
                </span>
              </div>

              {/* Story Content */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-pink-400 mb-1">
                  {story.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                  {story.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {story.subtitle}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-400 font-semibold">
                  <span>READ_FULL_STORY</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

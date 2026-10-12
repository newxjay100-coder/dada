import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_EVENTS } from '@/mock/mockData';
import { Calendar, ArrowRight } from 'lucide-react';

export const EventListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="border-b border-neutral-200 pb-6 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            PROMOTIONS & EVENTS
          </span>
          <h1 className="text-3xl font-serif font-black text-neutral-900 tracking-tight mt-1">
            진행 중인 기획전 및 이벤트
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            다써바 회원님만을 위한 특별한 시즌 혜택과 프로모션을 만나보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_EVENTS.map((ev) => (
            <Link
              key={ev.id}
              to={ev.link_url || '/category/women'}
              className="group flex flex-col bg-white border border-neutral-200 overflow-hidden shadow-2xs hover:border-neutral-950 transition-all duration-300"
            >
              <div className="aspect-16/9 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={ev.banner_image_url}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-2 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#721b29]" />
                  <span>
                    {ev.start_date} ~ {ev.end_date}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-neutral-900 mb-1 group-hover:text-[#721b29] transition-colors">
                  {ev.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
                  {ev.subtitle}
                </p>
                <div className="mt-auto pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900">
                  <span>기획전 바로가기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MagazineListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="border-b border-neutral-200 pb-6 text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            FASHION EDITORIAL
          </span>
          <h1 className="text-3xl font-serif font-black text-neutral-900 tracking-tight mt-1">
            DASSOBA STYLE & MAGAZINE
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            현대적인 테일러링과 한국 컨템포러리 감성을 담은 룩북 아카이브
          </p>
        </div>

        {/* Lookbook Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: '2026 SPRING MINIMAL ARCHIVE',
              desc: '빛과 그림자, 절제된 선의 미학으로 풀어낸 버진 울 컬렉션 화보',
              img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
            },
            {
              title: 'THE MODERN SUITING GUIDE',
              desc: '출근과 저녁 모임을 자유롭게 넘나드는 현대인을 위한 셋업 스타일링',
              img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
            },
            {
              title: 'CASHMERE ESSENTIALS',
              desc: '천연 몽골리안 캐시미어 원사의 촉감과 섬세한 컬러 팔레트',
              img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
            },
          ].map((mag, i) => (
            <div key={i} className="bg-white border border-neutral-200 overflow-hidden shadow-2xs group">
              <div className="aspect-4/5 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={mag.img}
                  alt={mag.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
                  {mag.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
                  {mag.desc}
                </p>
                <Link
                  to="/category/women"
                  className="text-xs font-bold text-[#721b29] hover:underline"
                >
                  에디토리얼 상품 보러가기 &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

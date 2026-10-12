import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Percent, Calendar } from 'lucide-react';

interface QuickCategoryItem {
  name: string;
  path: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  badgeIcon?: React.ElementType;
  accent?: boolean;
}

const QUICK_ITEMS: QuickCategoryItem[] = [
  {
    name: '여성',
    path: '/category/women',
    image: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: '남성',
    path: '/category/men',
    image: 'https://images.unsplash.com/photo-1591954426313-5e47d525428d?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: '키즈',
    path: '/category/kids',
    image: 'https://images.unsplash.com/photo-1635061842938-9d0568bd20f8?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: '잡화',
    path: '/category/acc',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: '신상품',
    path: '/new',
    image: 'https://images.unsplash.com/photo-1593484330639-614d0634f68f?q=80&w=400&auto=format&fit=crop',
    badge: 'NEW',
    badgeColor: 'bg-neutral-900',
    badgeIcon: Sparkles,
  },
  {
    name: '베스트',
    path: '/best',
    image: 'https://images.unsplash.com/photo-1675408824613-27a7e7b8d475?q=80&w=400&auto=format&fit=crop',
    badge: 'BEST',
    badgeColor: 'bg-neutral-900',
    badgeIcon: Flame,
  },
  {
    name: '1+1',
    path: '/1plus1',
    image: 'https://images.unsplash.com/photo-1612049621554-1df669d740df?q=80&w=400&auto=format&fit=crop',
    badge: '1+1',
    badgeColor: 'bg-[#721b29]',
    badgeIcon: Percent,
    accent: true,
  },
  {
    name: '이벤트',
    path: '/events',
    image: 'https://images.unsplash.com/photo-1635353866477-f77a828b431a?q=80&w=400&auto=format&fit=crop',
    badge: 'EVENT',
    badgeColor: 'bg-neutral-900',
    badgeIcon: Calendar,
  },
];

export const QuickCategory: React.FC = () => {
  return (
    <section className="py-12 border-b border-neutral-100 bg-gradient-to-b from-[#faf9f6]/60 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-5 sm:gap-6">
          {QUICK_ITEMS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center group text-center focus:outline-none"
            >
              {/* 3D Sphere Container with multi-layered light and depth shadow */}
              <div className="relative mb-3 flex flex-col items-center">
                {/* 1. 입체 외곽 3D 베젤 프레임 (3D Outer Bezel Ring) */}
                <div
                  className="relative p-[3.5px] rounded-full transition-all duration-300 transform group-hover:-translate-y-2.5 group-hover:scale-105"
                  style={{
                    background: item.accent
                      ? 'linear-gradient(145deg, #ffffff 0%, #ecd0d5 40%, #721b29 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #e6e3dd 45%, #b5af9f 100%)',
                    boxShadow:
                      '0 12px_24px_-4px rgba(0,0,0,0.18), 0 4px 10px -2px rgba(0,0,0,0.10), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 5px rgba(0,0,0,0.22)',
                  }}
                >
                  {/* 2. 내부 3D 입체 돔 볼록 렌즈 (Inner 3D Dome) */}
                  <div
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      boxShadow:
                        'inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -6px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* 실사 인물 & 상품 이미지 */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-110 group-hover:brightness-105 transition-all duration-700 ease-out"
                    />

                    {/* 3. 입체 광택 하이라이트 (3D Curved Glass Specular Highlight) */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 35%, transparent 70%)',
                      }}
                    />

                    {/* 4. 하단부 3D 림 섀도우 (Bottom Spherical Rim Ambient Occlusion) */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)',
                      }}
                    />
                  </div>

                  {/* 5. 3D 플로팅 코너 뱃지 (Floating Dimensional Badge) */}
                  {item.badge && (
                    <div
                      className={`absolute -top-1 -right-1.5 ${item.badgeColor} text-white text-[9px] font-black tracking-tight px-1.5 py-0.5 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.35)] border border-white/40 flex items-center gap-0.5 transform group-hover:scale-110 transition-transform`}
                    >
                      {item.badgeIcon && <item.badgeIcon className="w-2.5 h-2.5" />}
                      <span>{item.badge}</span>
                    </div>
                  )}
                </div>

                {/* 6. 바닥 입체 투영 그림자 (Floating Ground Shadow) */}
                <div
                  className="w-12 sm:w-14 h-2 rounded-full mx-auto mt-1 transition-all duration-300 opacity-60 group-hover:opacity-90 group-hover:scale-125 group-hover:blur-[5px]"
                  style={{
                    background: item.accent
                      ? 'radial-gradient(ellipse at center, rgba(114,27,41,0.45) 0%, transparent 75%)'
                      : 'radial-gradient(ellipse at center, rgba(0,0,0,0.32) 0%, transparent 75%)',
                    filter: 'blur(3.5px)',
                  }}
                />
              </div>

              {/* 카테고리 명칭 라벨 */}
              <span
                className={`text-xs tracking-tight transition-all duration-200 mt-0.5 ${
                  item.accent
                    ? 'text-[#721b29] font-black group-hover:underline'
                    : 'text-neutral-800 font-semibold group-hover:text-[#721b29]'
                }`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

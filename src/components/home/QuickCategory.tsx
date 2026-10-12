import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Percent, Zap, Radio, Terminal } from 'lucide-react';

interface QuickCategoryItem {
  id: string;
  name: string;
  code: string;
  path: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  badgeBorder?: string;
  badgeIcon?: React.ElementType;
  accent?: 'cyan' | 'pink' | 'yellow';
}

const QUICK_ITEMS: QuickCategoryItem[] = [
  {
    id: '01',
    name: '여성',
    code: 'WOMEN',
    path: '/category/women',
    image: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?q=80&w=500&auto=format&fit=crop',
    accent: 'cyan',
  },
  {
    id: '02',
    name: '남성',
    code: 'MEN',
    path: '/category/men',
    image: 'https://images.unsplash.com/photo-1591954426313-5e47d525428d?q=80&w=500&auto=format&fit=crop',
    accent: 'pink',
  },
  {
    id: '03',
    name: '키즈',
    code: 'KIDS',
    path: '/category/kids',
    image: 'https://images.unsplash.com/photo-1635061842938-9d0568bd20f8?q=80&w=500&auto=format&fit=crop',
    accent: 'yellow',
  },
  {
    id: '04',
    name: '잡화',
    code: 'GEAR',
    path: '/category/acc',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop',
    accent: 'cyan',
  },
  {
    id: '05',
    name: '신상품',
    code: 'NEW_DROP',
    path: '/new',
    image: 'https://images.unsplash.com/photo-1593484330639-614d0634f68f?q=80&w=500&auto=format&fit=crop',
    badge: 'NEW',
    badgeColor: 'bg-cyan-950 text-cyan-300',
    badgeBorder: 'border-cyan-400',
    badgeIcon: Sparkles,
    accent: 'cyan',
  },
  {
    id: '06',
    name: '베스트',
    code: 'HOT_TOP',
    path: '/best',
    image: 'https://images.unsplash.com/photo-1675408824613-27a7e7b8d475?q=80&w=500&auto=format&fit=crop',
    badge: 'BEST',
    badgeColor: 'bg-pink-950 text-pink-300',
    badgeBorder: 'border-pink-500',
    badgeIcon: Flame,
    accent: 'pink',
  },
  {
    id: '07',
    name: '1+1 특가',
    code: 'DUAL_1+1',
    path: '/1plus1',
    image: 'https://images.unsplash.com/photo-1612049621554-1df669d740df?q=80&w=500&auto=format&fit=crop',
    badge: '1+1',
    badgeColor: 'bg-yellow-950 text-yellow-300',
    badgeBorder: 'border-yellow-400',
    badgeIcon: Percent,
    accent: 'yellow',
  },
  {
    id: '08',
    name: '이벤트',
    code: 'CYBER_EVT',
    path: '/events',
    image: 'https://images.unsplash.com/photo-1635353866477-f77a828b431a?q=80&w=500&auto=format&fit=crop',
    badge: 'EVENT',
    badgeColor: 'bg-purple-950 text-purple-300',
    badgeBorder: 'border-purple-400',
    badgeIcon: Zap,
    accent: 'cyan',
  },
];

export const QuickCategory: React.FC = () => {
  return (
    <section className="py-10 border-y border-cyan-500/20 bg-[#090913] relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Cyber Section Tag Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <span className="font-mono text-xs font-black tracking-widest text-cyan-400 uppercase">
            // QUICK_NAVIGATION_ORBS
          </span>
          <span className="text-white/20 text-xs">|</span>
          <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
            NEON 3D SPHERES • K-STREETWEAR
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-pink-400">
          <Terminal className="w-3 h-3" />
          <span>CYBER_MATRIX: ACTIVE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-6">
          {QUICK_ITEMS.map((item) => {
            const isCyan = item.accent === 'cyan';
            const isPink = item.accent === 'pink';
            const isYellow = item.accent === 'yellow';

            const borderGlow = isCyan
              ? 'group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]'
              : isPink
              ? 'group-hover:border-pink-500 group-hover:shadow-[0_0_20px_rgba(255,0,127,0.6)]'
              : 'group-hover:border-yellow-400 group-hover:shadow-[0_0_20px_rgba(254,238,10,0.6)]';

            const ringGradient = isCyan
              ? 'linear-gradient(135deg, #00f0ff 0%, #0d0d1a 50%, #7928ca 100%)'
              : isPink
              ? 'linear-gradient(135deg, #ff007f 0%, #0d0d1a 50%, #00f0ff 100%)'
              : 'linear-gradient(135deg, #fcee0a 0%, #0d0d1a 50%, #ff007f 100%)';

            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center group text-center focus:outline-none"
              >
                {/* 3D Cyber Holographic Orb Container */}
                <div className="relative mb-3 flex flex-col items-center">
                  {/* Outer Cyber Tech HUD Brackets */}
                  <div className="absolute -inset-1 rounded-full border border-white/5 group-hover:border-cyan-400/30 transition-all pointer-events-none scale-90 group-hover:scale-105" />

                  {/* 1. 3D Cyber Bezel Ring */}
                  <div
                    className={`relative p-[3px] rounded-full transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-105 ${borderGlow}`}
                    style={{
                      background: ringGradient,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                    }}
                  >
                    {/* 2. Inner 3D Glass Dome Sphere */}
                    <div
                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        boxShadow:
                          'inset 0 4px 10px rgba(0,240,255,0.4), inset 0 -6px 12px rgba(0,0,0,0.8)',
                      }}
                    >
                      {/* High-res Korean Streetwear Model Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-115 group-hover:brightness-110 transition-all duration-700 ease-out"
                      />

                      {/* 3. Cyber Scanline & Hologram Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-purple-900/40 pointer-events-none group-hover:opacity-60 transition-opacity" />

                      {/* 4. 3D Curved Specular Glass Highlight */}
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background:
                            'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.7) 0%, rgba(0,240,255,0.2) 30%, transparent 65%)',
                        }}
                      />

                      {/* 5. Spherical Rim Darkening */}
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)',
                        }}
                      />
                    </div>

                    {/* 6. Floating Cyber Badge */}
                    {item.badge && (
                      <div
                        className={`absolute -top-1 -right-1.5 ${item.badgeColor} border ${item.badgeBorder} text-[9px] font-mono font-black tracking-tight px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(0,0,0,0.8)] flex items-center gap-0.5 transform group-hover:scale-110 transition-transform`}
                      >
                        {item.badgeIcon && <item.badgeIcon className="w-2.5 h-2.5" />}
                        <span>{item.badge}</span>
                      </div>
                    )}
                  </div>

                  {/* 7. Bottom Projected Cyber Glow & Ground Shadow */}
                  <div
                    className="w-12 h-2.5 rounded-[100%] transition-all duration-300 transform group-hover:scale-125 -mt-1"
                    style={{
                      background: isCyan
                        ? 'radial-gradient(ellipse at center, rgba(0,240,255,0.5) 0%, transparent 70%)'
                        : isPink
                        ? 'radial-gradient(ellipse at center, rgba(255,0,127,0.5) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse at center, rgba(254,238,10,0.5) 0%, transparent 70%)',
                      filter: 'blur(3px)',
                    }}
                  />
                </div>

                {/* Category Text & Cyber Code */}
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                  {item.name}
                </span>
                <span className="text-[9px] font-mono text-neutral-400 group-hover:text-pink-400 transition-colors tracking-wider">
                  [{item.code}]
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Percent, Calendar } from 'lucide-react';

const QUICK_ITEMS = [
  {
    name: '여성',
    path: '/category/women',
    image: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: '남성',
    path: '/category/men',
    image: 'https://images.unsplash.com/photo-1591954426313-5e47d525428d?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: '키즈',
    path: '/category/kids',
    image: 'https://images.unsplash.com/photo-1635061842938-9d0568bd20f8?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: '잡화',
    path: '/category/acc',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop',
  },
  {
    name: '신상품',
    path: '/new',
    icon: Sparkles,
    highlight: true,
  },
  {
    name: '베스트',
    path: '/best',
    icon: Flame,
    highlight: true,
  },
  {
    name: '1+1',
    path: '/1plus1',
    icon: Percent,
    accent: true,
  },
  {
    name: '이벤트',
    path: '/events',
    icon: Calendar,
    highlight: true,
  },
];

export const QuickCategory: React.FC = () => {
  return (
    <section className="py-10 border-b border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-6">
          {QUICK_ITEMS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center group text-center"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-neutral-100 mb-2 border border-neutral-200/80 group-hover:border-[#721b29] transition-all duration-300 flex items-center justify-center group-hover:scale-105 shadow-xs">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:brightness-95"
                  />
                ) : item.accent ? (
                  <div className="w-full h-full bg-[#721b29] text-white flex flex-col items-center justify-center">
                    {item.icon && <item.icon className="w-6 h-6 mb-0.5" />}
                    <span className="text-[10px] font-black">SPECIAL</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-neutral-900 text-white flex items-center justify-center">
                    {item.icon && <item.icon className="w-6 h-6" />}
                  </div>
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  item.accent
                    ? 'text-[#721b29] font-bold'
                    : 'text-neutral-800 group-hover:text-[#721b29]'
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

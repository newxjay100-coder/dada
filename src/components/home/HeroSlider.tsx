import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Sparkles, Terminal } from 'lucide-react';
import { INITIAL_EVENTS } from '@/mock/mockData';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = INITIAL_EVENTS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#07070e] text-white border-b border-cyan-500/20">
      {/* Slide Image Container */}
      <div className="relative h-[480px] sm:h-[580px] md:h-[660px] w-full">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={s.banner_image_url}
              alt={s.title}
              className="h-full w-full object-cover object-center brightness-85 scale-100 transform transition-transform duration-10000 ease-out"
            />
            {/* Cyberpunk Neon Gradient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] via-[#07070e]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070e]/85 via-transparent to-[#07070e]/40" />
            {/* Subtle Cyber Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
          </div>
        ))}

        {/* Content Box */}
        <div className="absolute inset-0 z-20 flex items-end pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              {/* Cyber Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase text-cyan-300 bg-cyan-950/80 border border-cyan-400/50 px-3 py-1 backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  DASSOBA // CYBER_STREET_2077
                </span>
                <span className="text-[10px] font-mono text-pink-400 animate-pulse">
                  ● LIVE_CAMPAIGN
                </span>
              </div>

              {/* Title with Cyber Glow */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-normal leading-relaxed max-w-lg drop-shadow">
                {slide.subtitle}
              </p>

              {/* Cyber CTA Button */}
              <div className="pt-2">
                <Link
                  to={slide.link_url || '/category/women'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-pink-500 text-black font-mono font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(255,0,127,0.7)] hover:-translate-y-0.5"
                  style={{
                    clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                  }}
                >
                  <span>컬렉션 탐색하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cyberpunk HUD Slider Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
          {/* Numbers */}
          <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 text-xs font-mono tracking-widest text-neutral-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            <span className="text-cyan-300 font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="mx-1 text-neutral-600">/</span>
            <span className="text-neutral-400">{String(slides.length).padStart(2, '0')}</span>
          </div>

          <button
            onClick={prevSlide}
            aria-label="이전 슬라이드"
            className="w-9 h-9 bg-black/80 hover:bg-cyan-950 text-white hover:text-cyan-300 flex items-center justify-center border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="다음 슬라이드"
            className="w-9 h-9 bg-black/80 hover:bg-cyan-950 text-white hover:text-cyan-300 flex items-center justify-center border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

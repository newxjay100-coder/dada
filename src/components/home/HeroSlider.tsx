import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { INITIAL_EVENTS } from '@/mock/mockData';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = INITIAL_EVENTS;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
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
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Slide Image Container */}
      <div className="relative h-[480px] sm:h-[580px] md:h-[680px] w-full">
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
              className="h-full w-full object-cover object-center brightness-75 scale-100 transform transition-transform duration-10000 ease-out"
            />
            {/* Editorial Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
          </div>
        ))}

        {/* Content Box */}
        <div className="absolute inset-0 z-20 flex items-end pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200/90 bg-black/40 px-3 py-1 backdrop-blur-sm border border-white/20">
                DASSOBA EDITORIAL 2026
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-md">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light leading-relaxed max-w-lg drop-shadow">
                {slide.subtitle}
              </p>
              <div className="pt-2">
                <Link
                  to={slide.link_url || '/category/women'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-950 font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors shadow-lg"
                >
                  컬렉션 확인하기 <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
          {/* Numbers */}
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-mono tracking-widest text-neutral-300 border border-white/10">
            <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="mx-1 text-neutral-500">/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>

          <button
            onClick={prevSlide}
            aria-label="이전 슬라이드"
            className="w-9 h-9 rounded-none bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="다음 슬라이드"
            className="w-9 h-9 rounded-none bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

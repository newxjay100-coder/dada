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
    <section className="relative w-full overflow-hidden bg-[#07070e] text-white">
      {/* ========================================================================= */}
      {/* 1. OUTER 3D NEON LIGHT TUBE PERIMETER FRAME (외곽 진짜 3D 입체 네온관) */}
      {/* ========================================================================= */}

      {/* --- TOP 3D NEON TUBE --- */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center">
        {/* Ambient Glow Wash Downward */}
        <div className="absolute -top-4 w-full h-12 bg-gradient-to-b from-cyan-400/35 via-cyan-500/10 to-transparent blur-md pointer-events-none" />

        {/* 3D Cylindrical Glass Neon Tube */}
        <div className="relative w-full h-[6px] neon-tube-3d-h">
          {/* Top Glass Highlight Reflection */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/90 rounded-full" />
        </div>

        {/* Physical Chrome Mounting Brackets (메탈 고정 브래킷) */}
        <div className="absolute top-[-3px] left-[12%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[-3px] left-[35%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[-3px] right-[35%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[-3px] right-[12%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
      </div>

      {/* --- BOTTOM 3D NEON TUBE --- */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center">
        {/* Ambient Glow Wash Upward */}
        <div className="absolute -bottom-4 w-full h-12 bg-gradient-to-t from-cyan-400/35 via-cyan-500/10 to-transparent blur-md pointer-events-none" />

        {/* 3D Cylindrical Glass Neon Tube */}
        <div className="relative w-full h-[6px] neon-tube-3d-h">
          {/* Top Glass Highlight Reflection */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white/90 rounded-full" />
        </div>

        {/* Physical Chrome Mounting Brackets */}
        <div className="absolute bottom-[-3px] left-[12%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute bottom-[-3px] left-[35%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute bottom-[-3px] right-[35%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute bottom-[-3px] right-[12%] w-3 h-3.5 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
      </div>

      {/* --- LEFT VERTICAL 3D NEON TUBE (CYAN) --- */}
      <div className="absolute top-0 bottom-0 left-0 z-30 pointer-events-none hidden sm:block">
        <div className="absolute -left-3 top-0 bottom-0 w-10 bg-gradient-to-r from-cyan-400/30 to-transparent blur-md pointer-events-none" />
        <div className="relative h-full w-[5px] neon-tube-3d-v">
          <div className="absolute inset-y-0 left-0 w-[1.5px] bg-white/90 rounded-full" />
        </div>
        <div className="absolute top-[25%] left-[-3px] w-3.5 h-3 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[50%] left-[-3px] w-3.5 h-3 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[75%] left-[-3px] w-3.5 h-3 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
      </div>

      {/* --- RIGHT VERTICAL 3D NEON TUBE (PINK/MAGENTA ACCENT) --- */}
      <div className="absolute top-0 bottom-0 right-0 z-30 pointer-events-none hidden sm:block">
        <div className="absolute -right-3 top-0 bottom-0 w-10 bg-gradient-to-l from-pink-500/30 to-transparent blur-md pointer-events-none" />
        <div className="relative h-full w-[5px] neon-tube-3d-v-pink">
          <div className="absolute inset-y-0 right-0 w-[1.5px] bg-white/90 rounded-full" />
        </div>
        <div className="absolute top-[25%] right-[-3px] w-3.5 h-3 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[50%] right-[-3px] w-3.5 h-3 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
        <div className="absolute top-[75%] right-[-3px] w-3.5 h-3 neon-mount-bracket flex items-center justify-center">
          <div className="w-1 h-1 bg-black/80 rounded-full" />
        </div>
      </div>

      {/* --- 4 CORNER HIGH-VOLTAGE ELECTRODE TERMINAL CAPS --- */}
      <div className="absolute top-2 left-2 z-40 hidden sm:flex items-center gap-1 neon-electrode-cap px-2 py-0.5 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[9px] font-mono text-cyan-300 font-bold tracking-widest">NEON_15KV</span>
      </div>
      <div className="absolute top-2 right-2 z-40 hidden sm:flex items-center gap-1 neon-electrode-cap px-2 py-0.5 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
        <span className="text-[9px] font-mono text-pink-300 font-bold tracking-widest">ELECTRODE</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. SLIDE IMAGE CONTAINER */}
      {/* ========================================================================= */}
      <div className="relative h-[500px] sm:h-[600px] md:h-[680px] w-full">
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070e]/90 via-[#07070e]/30 to-[#07070e]/40" />
            {/* Subtle Cyber Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
          </div>
        ))}

        {/* ========================================================================= */}
        {/* 3. INNER CONTENT BOX WITH 3D NEON TUBE GLASS HUD FRAME */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-20 flex items-end pb-14 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            {/* --- FLOATING 3D NEON GLASS TUBE HUD CARD --- */}
            <div className="relative max-w-2xl backdrop-blur-xl bg-black/60 p-6 sm:p-8 rounded-2xl border-2 border-cyan-400/70 shadow-[0_0_30px_rgba(0,240,255,0.65),inset_0_0_20px_rgba(0,240,255,0.25)] space-y-4">
              {/* Outer 3D Neon Tube Rim Glow Effect */}
              <div className="absolute -inset-[3px] rounded-2xl border border-cyan-300/80 shadow-[0_0_15px_#00f0ff] pointer-events-none animate-pulse" />

              {/* 4 Metallic Chrome Mount Clips on the Card Corners */}
              <div className="absolute -top-2 -left-2 w-4 h-4 neon-mount-bracket flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_4px_#00f0ff]" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 neon-mount-bracket flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full shadow-[0_0_4px_#ff007f]" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 neon-mount-bracket flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_4px_#00f0ff]" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 neon-mount-bracket flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full shadow-[0_0_4px_#ff007f]" />
              </div>

              {/* Sub-Badge with 3D Neon Glass Tube Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border-2 border-cyan-300 shadow-[0_0_15px_#00f0ff,inset_0_0_8px_rgba(0,240,255,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                  <span className="text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase text-cyan-200">
                    DASSOBA // CYBER_STREET_2077
                  </span>
                </div>
                <span className="text-[10px] font-mono text-pink-400 font-bold animate-pulse flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ff007f]" />
                  ● LIVE_CAMPAIGN // 2077_EDITION
                </span>
              </div>

              {/* Main Title with Smooth Breathing Neon Lighting */}
              <div className="relative inline-block max-w-full">
                {/* Smooth Breathing Ambient Lighting Halo */}
                <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/30 via-pink-500/25 to-purple-500/30 blur-3xl rounded-full pointer-events-none opacity-85" />

                <h1 className="relative font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider leading-[1.12] text-white animate-neon-smooth uppercase select-none drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">
                  {slide.title}
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm md:text-base text-neutral-200 font-normal leading-relaxed max-w-lg drop-shadow">
                {slide.subtitle}
              </p>

              {/* Cyber CTA Button */}
              <div className="pt-2 flex items-center gap-4">
                <Link
                  to={slide.link_url || '/category/women'}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-pink-500 text-black font-mono font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:shadow-[0_0_35px_rgba(255,0,127,0.8)] hover:-translate-y-0.5"
                  style={{
                    clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)',
                  }}
                >
                  <span>컬렉션 탐색하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
                  <Zap className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>3D NEON TUBE ILLUMINATED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CYBERPUNK HUD SLIDER CONTROLS */}
        {/* ========================================================================= */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
          {/* Numbers */}
          <div className="bg-black/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono tracking-widest text-neutral-300 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.4)] rounded-md">
            <span className="text-cyan-300 font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="mx-1 text-neutral-600">/</span>
            <span className="text-neutral-400">{String(slides.length).padStart(2, '0')}</span>
          </div>

          <button
            onClick={prevSlide}
            aria-label="이전 슬라이드"
            className="w-9 h-9 bg-black/90 hover:bg-cyan-950 text-white hover:text-cyan-300 flex items-center justify-center border border-cyan-400 hover:border-cyan-300 rounded-md transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="다음 슬라이드"
            className="w-9 h-9 bg-black/90 hover:bg-cyan-950 text-white hover:text-cyan-300 flex items-center justify-center border border-cyan-400 hover:border-cyan-300 rounded-md transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

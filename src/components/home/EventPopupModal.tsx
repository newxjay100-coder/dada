import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Zap } from 'lucide-react';
import { INITIAL_POPUPS } from '@/mock/mockData';

export const EventPopupModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popup = INITIAL_POPUPS[0];

  useEffect(() => {
    const dismissedUntil = localStorage.getItem('dassoba_popup_dismissed_until');
    if (dismissedUntil) {
      const expiry = new Date(dismissedUntil).getTime();
      if (Date.now() < expiry) {
        return; // Don't show
      }
    }
    setIsOpen(true);
  }, []);

  const handleDismissToday = () => {
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    localStorage.setItem('dassoba_popup_dismissed_until', tomorrow.toISOString());
    setIsOpen(false);
  };

  if (!isOpen || !popup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-sm bg-[#0e0e1a] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.3)] border border-cyan-500/50">
        {/* Clickable Image Banner */}
        <Link to={popup.link_url || '/events'} onClick={() => setIsOpen(false)}>
          <div className="aspect-4/5 w-full bg-neutral-950 overflow-hidden relative">
            <img
              src={popup.desktop_image_url}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-transparent opacity-75" />
            <div className="absolute top-3 left-3 bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-300" />
              <span>POPUP // ALERT</span>
            </div>
          </div>
          <div className="p-4 bg-[#0e0e1a] text-center">
            <span className="text-[10px] font-black tracking-widest uppercase text-pink-400 block mb-1">
              SPECIAL CYBER EVENT // 2077
            </span>
            <h4 className="text-sm font-bold text-white leading-snug">
              {popup.title}
            </h4>
          </div>
        </Link>

        {/* Footer Actions: 오늘 하루 보지 않기 / 닫기 */}
        <div className="flex items-center justify-between bg-black/90 text-white text-xs px-4 py-3 border-t border-cyan-500/20">
          <button
            onClick={handleDismissToday}
            className="text-neutral-400 hover:text-cyan-300 transition-colors text-[11px]"
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-pink-400 hover:text-pink-300 font-bold transition-colors text-xs flex items-center gap-1"
          >
            <span>닫기</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

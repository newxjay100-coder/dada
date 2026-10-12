import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white overflow-hidden shadow-2xl border border-neutral-200">
        {/* Clickable Image Banner */}
        <Link to={popup.link_url || '/events'} onClick={() => setIsOpen(false)}>
          <div className="aspect-4/5 w-full bg-neutral-100 overflow-hidden">
            <img
              src={popup.desktop_image_url}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 bg-white text-center">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#721b29] block mb-1">
              SPECIAL EVENT
            </span>
            <h4 className="text-sm font-serif font-bold text-neutral-900 leading-snug">
              {popup.title}
            </h4>
          </div>
        </Link>

        {/* Footer Actions: 오늘 하루 보지 않기 / 닫기 */}
        <div className="flex items-center justify-between bg-neutral-950 text-white text-xs px-4 py-3 border-t border-neutral-800">
          <button
            onClick={handleDismissToday}
            className="text-neutral-400 hover:text-white transition-colors text-[11px]"
          >
            오늘 하루 보지 않기
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1 font-semibold text-white hover:text-amber-200 transition-colors text-[11px]"
          >
            닫기 <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

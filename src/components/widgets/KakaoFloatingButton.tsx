import React from 'react';
import { MessageSquare } from 'lucide-react';

export const KakaoFloatingButton: React.FC = () => {
  const kakaoUrl = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/_example';

  return (
    <a
      href={kakaoUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="카카오톡 상담하기"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 w-12 h-12 rounded-full bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <MessageSquare className="w-5 h-5 fill-current" />
      <span className="absolute right-14 bg-neutral-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
        카톡 1:1 상담
      </span>
    </a>
  );
};

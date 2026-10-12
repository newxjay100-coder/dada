import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Bell,
  Truck,
  RotateCcw,
  Coins,
  Tag,
  ArrowRight,
} from 'lucide-react';

export const CustomerCenterPage: React.FC = () => {
  const kakaoUrl = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/_example';

  const menuCards = [
    { title: '공지사항', desc: 'DASSOBA의 새로운 소식과 안내', icon: Bell, path: '/boards/notice' },
    { title: '자주 묻는 질문 (FAQ)', desc: '자주 찾는 질문과 명쾌한 해결법', icon: HelpCircle, path: '/boards/faq' },
    { title: '배송 및 출고 안내', desc: '출고 마감 시간 및 택배사 정보', icon: Truck, path: '/boards/faq?cat=shipping' },
    { title: '교환 / 반품 / 환불', desc: '간편 반품 접수 및 수거 가이드', icon: RotateCcw, path: '/mypage/claims' },
    { title: '포인트 / 적립금 정책', desc: '리뷰 적립 및 유효기간 안내', icon: Coins, path: '/boards/faq?cat=points' },
    { title: '쿠폰 사용 가이드', desc: '쿠폰 등록 및 동시 적용 안내', icon: Tag, path: '/boards/faq?cat=coupons' },
    { title: '1:1 맞춤 상담', desc: '전문 상담원과의 프라이빗 Q&A', icon: MessageCircle, path: '/mypage/inquiries' },
    { title: '쇼룸 피팅 예약', desc: '한남 플래그십 VIP 예약', icon: HelpCircle, path: '/boards/reservation' },
  ];

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">
            CUSTOMER SERVICE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 tracking-tight">
            고객센터
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            DASSOBA는 고객님의 품격 있는 쇼핑 경험을 위해 전담 컨시어지 서비스를 제공합니다.
          </p>
        </div>

        {/* CS Callout Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-[#faf9f6] border border-neutral-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-neutral-500 block mb-0.5">전화 상담</span>
              <div className="text-2xl font-bold text-neutral-900">1544-0000</div>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                평일 09:00 - 18:00 (점심시간 12:00 - 13:00)
                <br />
                주말 및 공휴일 휴무
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FEE500] text-black flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xs text-neutral-500 block mb-0.5">카카오톡 채널</span>
              <a
                href={kakaoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-lg font-bold text-neutral-900 hover:underline block"
              >
                @DASSOBA 채널 바로가기 &rarr;
              </a>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                채널 추가 시 신규 5% 시크릿 쿠폰 지급
                <br />
                실시간 챗봇 및 상담원 채팅 연결
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {menuCards.map((card) => (
            <Link
              key={card.title}
              to={card.path}
              className="p-6 border border-neutral-200 hover:border-neutral-900 bg-white transition-all duration-200 group flex flex-col justify-between h-40 shadow-2xs"
            >
              <div>
                <card.icon className="w-6 h-6 text-neutral-400 group-hover:text-[#721b29] transition-colors mb-3" />
                <h3 className="font-bold text-sm text-neutral-900 mb-1 group-hover:text-[#721b29]">
                  {card.title}
                </h3>
                <p className="text-[11px] text-neutral-500">{card.desc}</p>
              </div>
              <div className="text-[10px] font-bold text-neutral-400 group-hover:text-black flex items-center gap-1">
                자세히 보기 <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

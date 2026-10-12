import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, PhoneCall, Terminal, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const kakaoUrl = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/_example';

  return (
    <footer className="bg-[#05050a] text-neutral-400 border-t border-cyan-500/20 text-xs font-mono">
      {/* Top Banner / Customer Help Bar */}
      <div className="border-b border-white/5 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-[#0a0a14] p-4 rounded-xl border border-cyan-500/20">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 flex items-center justify-center shrink-0 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-bold">CYBER CUSTOMER DESK</span>
              <span className="text-lg font-bold text-white tracking-wide">1544-0000</span>
              <span className="text-[10px] text-neutral-400 block">
                평일 09:00 - 18:00 (점심 12:00 - 13:00) / 주말·공휴일 휴무
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0a0a14] p-4 rounded-xl border border-pink-500/20">
            <div className="w-10 h-10 rounded-lg bg-pink-950 flex items-center justify-center shrink-0 text-pink-300 border border-pink-400/40 shadow-[0_0_10px_rgba(255,0,127,0.3)]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-bold">1:1 LIVE CHAT SUPPORT</span>
              <a
                href={kakaoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-white hover:text-cyan-300 underline block"
              >
                카카오톡 실시간 상담 &rarr;
              </a>
              <span className="text-[10px] text-neutral-400 block">연중무휴 실시간 상담을 지원합니다.</span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#0a0a14] p-4 rounded-xl border border-yellow-500/20">
            <div className="w-10 h-10 rounded-lg bg-yellow-950 flex items-center justify-center shrink-0 text-yellow-300 border border-yellow-400/40 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block font-bold">SECURE PAYMENT PROTOCOL</span>
              <span className="text-sm font-bold text-white block">에스크로 100% 안전 결제 보장</span>
              <span className="text-[10px] text-neutral-400 block">
                소비자 피해보상보험 가입 사업장
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Details */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <span className="text-2xl font-black text-white tracking-tight block mb-2 drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              DASSOBA
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mb-4 font-sans">
              입어보고 싶은 모든 스타일을 한곳에서. 하이엔드 퓨처리즘과 사이버 스트릿웨어를 선도하는 트렌디 패션 플랫폼입니다.
            </p>
            <div className="flex items-center gap-2 text-cyan-400 text-[11px]">
              <Terminal className="w-3.5 h-3.5" />
              <span>© 2077 DASSOBA Inc. All rights reserved.</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">쇼핑 가이드</h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/new" className="hover:text-cyan-300">신상품 (NEW)</Link></li>
              <li><Link to="/best" className="hover:text-cyan-300">베스트 랭킹 (BEST)</Link></li>
              <li><Link to="/1plus1" className="hover:text-yellow-300">1+1 스페셜 기획</Link></li>
              <li><Link to="/special/editorial" className="hover:text-cyan-300">시즌 에디토리얼</Link></li>
              <li><Link to="/brands" className="hover:text-cyan-300">브랜드 디렉토리</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-3">고객지원</h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/boards/notice" className="hover:text-pink-300">공지사항</Link></li>
              <li><Link to="/boards/faq" className="hover:text-pink-300">자주 묻는 질문 (FAQ)</Link></li>
              <li><Link to="/boards/qna" className="hover:text-pink-300">질문과 답변 (Q&A)</Link></li>
              <li><Link to="/mypage/claims" className="hover:text-pink-300">반품/교환 안내</Link></li>
              <li><Link to="/customer" className="hover:text-pink-300">고객센터 홈</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-yellow-300 mb-3">마이페이지</h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/mypage/orders" className="hover:text-yellow-300">주문/배송 조회</Link></li>
              <li><Link to="/mypage/coupons" className="hover:text-yellow-300">쿠폰함</Link></li>
              <li><Link to="/mypage/points" className="hover:text-yellow-300">포인트 내역</Link></li>
              <li><Link to="/mypage/wishlist" className="hover:text-yellow-300">찜한 스타일</Link></li>
              <li><Link to="/mypage/reviews" className="hover:text-yellow-300">상품 리뷰 관리</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Business Meta */}
        <div className="pt-8 border-t border-white/10 text-[11px] text-neutral-400 leading-relaxed space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-neutral-300">
            <Link to="/terms" className="hover:text-cyan-300">이용약관</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-pink-400 text-white font-bold">개인정보처리방침</Link>
            <span>|</span>
            <Link to="/customer" className="hover:text-cyan-300">고객센터 안내</Link>
            <span>|</span>
            <Link to="/admin" className="hover:text-cyan-300 text-neutral-500">관리자 콘솔</Link>
          </div>
          <p>
            상호명: (주)다써바인터내셔널 | 대표자: 홍길동 | 사업자등록번호: 211-88-99999 | 통신판매업신고: 제 2026-서울강남-01234호
          </p>
          <p>
            사업장 소재지: 서울특별시 강남구 도산대로 123 다써바빌딩 5F | 개인정보보호책임자: 김다써 (privacy@dassoba.kr)
          </p>
          <p className="text-neutral-400">
            당사는 안전한 거래를 위하여 국민은행 에스크로 구매안전서비스에 가입하여 안전거래를 보장하고 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

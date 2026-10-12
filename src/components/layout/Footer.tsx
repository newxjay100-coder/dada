import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const kakaoUrl = import.meta.env.VITE_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/_example';

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 text-xs">
      {/* Top Banner / Customer Help Bar */}
      <div className="border-b border-neutral-800 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-[#f8f6f0]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">고객감동센터</span>
              <span className="text-lg font-bold text-white tracking-wide">1544-0000</span>
              <span className="text-[11px] text-neutral-400 block">
                평일 09:00 - 18:00 (점심 12:00 - 13:00) / 주말·공휴일 휴무
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-[#f8f6f0]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">1:1 실시간 상담</span>
              <a
                href={kakaoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-white hover:text-amber-300 underline block"
              >
                카카오톡 채널 상담하기 &rarr;
              </a>
              <span className="text-[11px] text-neutral-400 block">빠르고 친절하게 답변드립니다.</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-[#f8f6f0]">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] text-neutral-400 block">안전 결제 시스템</span>
              <span className="text-sm font-semibold text-white block">에스크로 100% 안심 구매</span>
              <span className="text-[11px] text-neutral-400 block">
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
            <span className="font-serif text-2xl font-black text-white tracking-tight block mb-2">
              DASSOBA
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mb-4">
              입어보고 싶은 모든 스타일을 한곳에서. 컨템포러리 감각의 정제된 실루엣과 신뢰할 수 있는 품질을 제안하는 프리미엄 패션 플랫폼입니다.
            </p>
            <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
              <span>© 2026 DASSOBA Inc. All rights reserved.</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">쇼핑 가이드</h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/new" className="hover:text-white">신상품</Link></li>
              <li><Link to="/best" className="hover:text-white">베스트 랭킹</Link></li>
              <li><Link to="/1plus1" className="hover:text-white">1+1 스페셜 기획</Link></li>
              <li><Link to="/special/editorial" className="hover:text-white">시즌 에디토리얼</Link></li>
              <li><Link to="/brands" className="hover:text-white">브랜드 디렉토리</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">고객지원</h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/boards/notice" className="hover:text-white">공지사항</Link></li>
              <li><Link to="/boards/faq" className="hover:text-white">자주 묻는 질문 (FAQ)</Link></li>
              <li><Link to="/boards/qna" className="hover:text-white">질문과 답변 (Q&A)</Link></li>
              <li><Link to="/mypage/claims" className="hover:text-white">반품/교환 안내</Link></li>
              <li><Link to="/customer" className="hover:text-white">고객센터 홈</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">마이페이지</h5>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/mypage/orders" className="hover:text-white">주문/배송 조회</Link></li>
              <li><Link to="/mypage/coupons" className="hover:text-white">쿠폰함</Link></li>
              <li><Link to="/mypage/points" className="hover:text-white">포인트 내역</Link></li>
              <li><Link to="/mypage/wishlist" className="hover:text-white">찜한 상품</Link></li>
              <li><Link to="/mypage/reviews" className="hover:text-white">상품 리뷰 관리</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal & Business Meta */}
        <div className="pt-8 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed space-y-2">
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-neutral-300">
            <Link to="/terms" className="hover:underline">이용약관</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:underline text-white font-bold">개인정보처리방침</Link>
            <span>|</span>
            <Link to="/customer" className="hover:underline">고객센터 안내</Link>
            <span>|</span>
            <Link to="/admin" className="hover:underline text-neutral-500">관리자</Link>
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

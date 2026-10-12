import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, FileText, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { pathname } = useLocation();
  const isPrivacy = pathname.includes('privacy');

  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#721b29] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>쇼핑몰 홈으로 돌아가기</span>
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 mb-8 bg-white p-1">
          <Link
            to="/terms"
            className={`flex-1 py-3 text-center text-xs font-bold transition-colors ${
              !isPrivacy
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            이용약관 (Terms of Service)
          </Link>
          <Link
            to="/privacy"
            className={`flex-1 py-3 text-center text-xs font-bold transition-colors ${
              isPrivacy
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            개인정보처리방침 (Privacy Policy)
          </Link>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white border border-neutral-200 p-8 md:p-12 shadow-2xs space-y-8 text-neutral-800 text-xs leading-relaxed">
          {isPrivacy ? (
            <>
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2 text-[#721b29] mb-1">
                  <Shield className="w-5 h-5" />
                  <span className="text-[11px] font-bold tracking-widest uppercase">PRIVACY POLICY</span>
                </div>
                <h1 className="text-2xl font-serif font-black text-neutral-900">
                  다써바 (DASSOBA) 개인정보처리방침
                </h1>
                <p className="text-neutral-500 text-[11px] mt-1">시행일자: 2026년 10월 06일</p>
              </div>

              <section className="space-y-3">
                <h2 className="font-bold text-sm text-neutral-900">제1조 (수집하는 개인정보 항목)</h2>
                <p>
                  (주)다써바인터내셔널(이하 '회사')은 원활한 고객 상담, 각종 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600">
                  <li><strong>필수항목:</strong> 아이디, 비밀번호, 성명, 휴대전화번호, 이메일 주소, 배송지 주소</li>
                  <li><strong>선택항목:</strong> 생년월일, 성별, 마케팅 정보 수신 동의 여부</li>
                  <li><strong>주문 및 결제 시:</strong> 신용카드 정보, 계좌번호, 결제승인내역, 수령인 정보</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-bold text-sm text-neutral-900">제2조 (개인정보의 수집 및 이용목적)</h2>
                <p>
                  회사는 수집한 개인정보를 계약의 이행, 대금 결제, 배송 업무, 신상품 및 1+1 프로모션 안내, 부정 이용 방지 등의 목적으로만 활용합니다.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-bold text-sm text-neutral-900">제3조 (개인정보의 보유 및 이용기간)</h2>
                <p>
                  회원 탈퇴 시 원칙적으로 고객님의 개인정보를 지체 없이 파기합니다. 단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령에 의하여 보존할 필요가 있는 경우 명시된 기간 동안 보관합니다.
                </p>
              </section>
            </>
          ) : (
            <>
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2 text-[#721b29] mb-1">
                  <FileText className="w-5 h-5" />
                  <span className="text-[11px] font-bold tracking-widest uppercase">TERMS OF SERVICE</span>
                </div>
                <h1 className="text-2xl font-serif font-black text-neutral-900">
                  다써바 (DASSOBA) 서비스 이용약관
                </h1>
                <p className="text-neutral-500 text-[11px] mt-1">시행일자: 2026년 10월 06일</p>
              </div>

              <section className="space-y-3">
                <h2 className="font-bold text-sm text-neutral-900">제1조 (목적)</h2>
                <p>
                  본 약관은 (주)다써바인터내셔널이 운영하는 DASSOBA 온라인 쇼핑몰(이하 '몰')에서 제공하는 인터넷 관련 전자상거래 서비스(이하 '서비스')를 이용함에 있어 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-bold text-sm text-neutral-900">제2조 (포인트 및 쿠폰 정책)</h2>
                <p>
                  회원은 상품 구매, 포토 리뷰 작성, 이벤트 참여 등을 통해 적립금(포인트)을 지급받을 수 있으며, 결제 시 쿠폰과 포인트를 중복 적용할 수 있습니다. 모든 포인트 거래 내역은 복식부기 원장에 영구 기록됩니다.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-bold text-sm text-neutral-900">제3조 (청약철회 및 교환/반품)</h2>
                <p>
                  몰에서 구매한 상품은 배송완료일로부터 7일 이내에 마이페이지를 통해 청약철회(반품/교환)를 요청할 수 있습니다. 단, 소비자의 귀책사유로 상품이 훼손되거나 착용 흔적이 있는 경우 청약철회가 제한될 수 있습니다.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

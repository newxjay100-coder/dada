import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, ShoppingBag } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#faf9f6] py-16 px-4">
      <div className="bg-white max-w-lg w-full p-8 md:p-12 border border-neutral-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-1">
            PAYMENT COMPLETE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900">
            주문이 완료되었습니다
          </h1>
          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
            고객님의 소중한 주문이 정상적으로 결제 접수되었습니다.
            <br />
            빠르고 안전하게 검수하여 출고해 드리겠습니다.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="bg-neutral-50 p-4 border border-neutral-200 text-xs">
          <span className="text-neutral-500 block mb-1">주문번호</span>
          <span className="text-base font-mono font-bold text-neutral-900 tracking-wider">
            {orderNumber || 'ORD-20261006-00000'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            to="/mypage/orders"
            className="flex-1 py-3.5 border border-neutral-900 text-neutral-900 text-xs font-bold tracking-wider uppercase hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>주문 내역 보기</span>
          </Link>
          <Link
            to="/"
            className="flex-1 py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-wider uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>쇼핑 계속하기</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

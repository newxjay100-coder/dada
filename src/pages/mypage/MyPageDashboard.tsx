import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Order } from '@/types/database.types';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Package, Truck, CheckCircle2, RotateCcw } from 'lucide-react';

export const MyPageDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.id) {
      api.getOrders(user.id).then((data) => setOrders(data.slice(0, 3)));
    }
  }, [user]);

  const recentOrder = orders[0];

  return (
    <div className="space-y-6">
      {/* Order Status Stepper */}
      <div className="bg-white p-6 border border-neutral-200 shadow-2xs">
        <h3 className="font-serif text-sm font-bold text-neutral-900 pb-3 border-b border-neutral-100 uppercase tracking-wider mb-6">
          진행 중인 주문 및 배송 현황
        </h3>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 bg-neutral-50 border border-neutral-100">
            <span className="text-[11px] text-neutral-400 block mb-1">결제완료</span>
            <span className="text-xl font-bold text-neutral-900">0</span>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-100">
            <span className="text-[11px] text-neutral-400 block mb-1">상품준비중</span>
            <span className="text-xl font-bold text-neutral-900">1</span>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-100">
            <span className="text-[11px] text-neutral-400 block mb-1">배송중</span>
            <span className="text-xl font-bold text-[#721b29]">1</span>
          </div>
          <div className="p-3 bg-neutral-50 border border-neutral-100">
            <span className="text-[11px] text-neutral-400 block mb-1">배송완료</span>
            <span className="text-xl font-bold text-neutral-900">1</span>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white p-6 border border-neutral-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <h3 className="font-serif text-sm font-bold text-neutral-900 uppercase tracking-wider">
            최근 주문 내역
          </h3>
          <Link
            to="/mypage/orders"
            className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 font-semibold"
          >
            전체보기 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs text-neutral-400 py-6 text-center">최근 주문 내역이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 border border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-neutral-900">{ord.order_number}</span>
                    <span className="text-neutral-400">• {ord.created_at.split('T')[0]}</span>
                  </div>
                  <h4 className="font-semibold text-neutral-800 text-sm mb-1">{ord.order_name}</h4>
                  <span className="text-neutral-600">
                    결제금액: <strong className="text-neutral-900">{formatPrice(ord.final_payment_amount)}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-bold">
                    {ord.order_status === 'shipping'
                      ? '배송중'
                      : ord.order_status === 'delivered'
                      ? '배송완료'
                      : '결제완료'}
                  </span>
                  <Link
                    to={`/mypage/orders?id=${ord.id}`}
                    className="px-3 py-1 bg-white border border-neutral-300 font-semibold hover:border-black"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim Shortcuts */}
      <div className="bg-white p-6 border border-neutral-200 shadow-2xs">
        <h3 className="font-serif text-sm font-bold text-neutral-900 pb-3 border-b border-neutral-100 uppercase tracking-wider mb-4">
          쇼핑 케어 서비스
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
          <Link
            to="/mypage/claims?type=cancel"
            className="p-4 border border-neutral-200 hover:border-neutral-900 bg-white transition-colors"
          >
            <span className="font-bold text-neutral-800 block mb-1">주문 취소</span>
            <span className="text-[11px] text-neutral-400">출고 전 즉시 취소</span>
          </Link>
          <Link
            to="/mypage/claims?type=return"
            className="p-4 border border-neutral-200 hover:border-neutral-900 bg-white transition-colors"
          >
            <span className="font-bold text-neutral-800 block mb-1">반품 접수</span>
            <span className="text-[11px] text-neutral-400">수령 7일 이내 반품</span>
          </Link>
          <Link
            to="/mypage/claims?type=exchange"
            className="p-4 border border-neutral-200 hover:border-neutral-900 bg-white transition-colors"
          >
            <span className="font-bold text-neutral-800 block mb-1">교환 신청</span>
            <span className="text-[11px] text-neutral-400">사이즈/색상 교환</span>
          </Link>
          <Link
            to="/mypage/claims?type=refund"
            className="p-4 border border-neutral-200 hover:border-neutral-900 bg-white transition-colors"
          >
            <span className="font-bold text-neutral-800 block mb-1">환불 내역</span>
            <span className="text-[11px] text-neutral-400">결제 취소 승인 조회</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

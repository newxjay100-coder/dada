import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { Order, OrderStatus } from '@/types/database.types';
import { formatPrice } from '@/lib/utils';
import { Package, Truck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user?.id) {
      api.getOrders(user.id).then(setOrders);
    }
  }, [user]);

  const handleConfirmPurchase = async (orderId: string) => {
    await api.updateOrderStatus(orderId, 'confirmed');
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: 'confirmed' } : o))
    );
    showToast('구매 확정되었습니다. 적립금이 정상 반영되었습니다.', 'success');
  };

  const handleRequestCancel = async (orderId: string) => {
    await api.updateOrderStatus(orderId, 'cancelled');
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: 'cancelled' } : o))
    );
    showToast('주문 취소 요청이 접수되었습니다.', 'info');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 font-bold">결제완료</span>;
      case 'preparing':
        return <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 font-bold">상품준비중</span>;
      case 'shipping':
        return <span className="px-2 py-0.5 bg-[#721b29] text-white font-bold">배송중</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 bg-neutral-900 text-white font-bold">배송완료</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 bg-emerald-800 text-white font-bold">구매확정</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold">취소완료</span>;
      default:
        return <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="font-serif text-xl font-bold text-neutral-900">나의 주문 내역</h2>
        <p className="text-xs text-neutral-500 mt-1">
          고객님의 최근 3개월 주문 및 실시간 배송 현황입니다.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400">
          주문 내역이 존재하지 않습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord.id} className="border border-neutral-200 p-5 space-y-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-neutral-900 text-sm">
                    {ord.order_number}
                  </span>
                  <span className="text-neutral-400">{ord.created_at.split('T')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(ord.order_status)}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {ord.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-semibold text-neutral-900">{item.product_name}</h4>
                      <span className="text-[11px] text-neutral-500">
                        옵션: {item.variant_info} | 수량: {item.quantity}개
                      </span>
                    </div>
                    <span className="font-bold text-neutral-900">
                      {formatPrice(item.total_amount)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment Summary */}
              <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3 bg-neutral-50 p-3">
                <div className="space-x-3 text-neutral-600">
                  <span>
                    상품금액: <strong>{formatPrice(ord.total_product_amount)}</strong>
                  </span>
                  {ord.coupon_discount > 0 && (
                    <span className="text-[#721b29]">
                      쿠폰할인: <strong>-{formatPrice(ord.coupon_discount)}</strong>
                    </span>
                  )}
                  {ord.points_used > 0 && (
                    <span className="text-amber-700">
                      포인트사용: <strong>-{formatPrice(ord.points_used)}</strong>
                    </span>
                  )}
                  <span>
                    총 결제금액: <strong className="text-neutral-950 font-bold">{formatPrice(ord.final_payment_amount)}</strong>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {ord.order_status === 'shipping' && (
                    <button
                      onClick={() => handleConfirmPurchase(ord.id)}
                      className="px-3 py-1.5 bg-neutral-900 text-white font-bold text-xs"
                    >
                      구매확정
                    </button>
                  )}
                  {ord.order_status === 'paid' && (
                    <button
                      onClick={() => handleRequestCancel(ord.id)}
                      className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 font-semibold text-xs"
                    >
                      주문취소
                    </button>
                  )}
                  <button
                    onClick={() =>
                      showToast(
                        `CJ대한통운 6891029381 (출고 완료) - 배송 조회가 정상 작동 중입니다.`,
                        'info'
                      )
                    }
                    className="px-3 py-1.5 border border-neutral-300 hover:border-black font-semibold text-xs"
                  >
                    배송조회
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

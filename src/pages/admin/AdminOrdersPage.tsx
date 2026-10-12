import React, { useState } from 'react';
import { Order, OrderStatus } from '@/types/database.types';
import { MockOrderStore } from '@/mock/mockStorage';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Search, Truck, Check, Package, RotateCcw } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => MockOrderStore.getAll());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { showToast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    MockOrderStore.updateStatus(orderId, newStatus);
    setOrders(MockOrderStore.getAll());
    showToast(`주문 상태가 '${newStatus}'(으)로 변경되었습니다.`, 'success');
  };

  const handleBulkStatusChange = (newStatus: OrderStatus) => {
    selectedIds.forEach((id) => MockOrderStore.updateStatus(id, newStatus));
    setOrders(MockOrderStore.getAll());
    setSelectedIds([]);
    showToast(`선택된 ${selectedIds.length}개 주문의 상태가 일괄 변경되었습니다.`, 'success');
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? orders.map((o) => o.id) : []);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.order_status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchBuyer = o.buyer_name.toLowerCase().includes(q);
      const matchName = o.order_name.toLowerCase().includes(q);
      if (!matchNum && !matchBuyer && !matchName) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">주문 관리 (ORDER FULFILLMENT)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            결제 확인, 배송 준비, 송장 번호 등록 및 주문 상태 일괄 변경
          </p>
        </div>
      </div>

      {/* Bulk Action Controls */}
      <div className="bg-neutral-950 p-4 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문번호, 주문자명, 상품명 검색"
            className="bg-neutral-900 border border-neutral-700 p-2 text-white placeholder-neutral-500 w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-white p-2"
          >
            <option value="all">전체 주문상태</option>
            <option value="paid">결제완료</option>
            <option value="preparing">상품준비</option>
            <option value="shipping">배송중</option>
            <option value="delivered">배송완료</option>
            <option value="cancelled">취소완료</option>
          </select>
        </div>

        {/* Bulk Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-bold">{selectedIds.length}개 선택됨:</span>
            <button
              onClick={() => handleBulkStatusChange('preparing')}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
            >
              상품준비중 처리
            </button>
            <button
              onClick={() => handleBulkStatusChange('shipping')}
              className="px-2.5 py-1.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-medium"
            >
              배송중 일괄 처리
            </button>
            <button
              onClick={() => handleBulkStatusChange('delivered')}
              className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-medium"
            >
              배송완료 처리
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === orders.length && orders.length > 0}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="py-3 px-4">주문번호 / 일시</th>
              <th className="py-3 px-4">주문자 / 수령인</th>
              <th className="py-3 px-4">주문 상품 정보</th>
              <th className="py-3 px-4 text-right">결제 금액</th>
              <th className="py-3 px-4 text-center">결제상태</th>
              <th className="py-3 px-4 text-center">주문 상태</th>
              <th className="py-3 px-4 text-center">상태 변경</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {filtered.map((ord) => (
              <tr key={ord.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ord.id)}
                    onChange={() => toggleSelect(ord.id)}
                  />
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-white block">{ord.order_number}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {ord.created_at.replace('T', ' ').substring(0, 16)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-neutral-200 block">{ord.buyer_name}</span>
                  <span className="text-[11px] text-neutral-400">{ord.buyer_phone}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-white block">{ord.order_name}</span>
                  <span className="text-[11px] text-neutral-400">
                    배송지: {ord.address_line1}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {formatPrice(ord.final_payment_amount)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold text-[10px]">
                    {ord.payment_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 font-bold text-[10px] ${
                      ord.order_status === 'shipping'
                        ? 'bg-[#721b29] text-white'
                        : ord.order_status === 'delivered'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {ord.order_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <select
                    value={ord.order_status}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                    className="bg-neutral-900 border border-neutral-700 text-[11px] text-white p-1"
                  >
                    <option value="paid">결제완료</option>
                    <option value="preparing">상품준비</option>
                    <option value="shipping">배송중</option>
                    <option value="delivered">배송완료</option>
                    <option value="confirmed">구매확정</option>
                    <option value="cancelled">취소완료</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PurchaseOrder } from '@/types/database.types';
import { INITIAL_SUPPLIERS } from '@/mock/mockData';
import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Plus, Check, Search, FileText, Cloud, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPurchaseOrdersPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [supplierId, setSupplierId] = useState(INITIAL_SUPPLIERS[0].id);
  const [quantity, setQuantity] = useState(100);
  const [unitCost, setUnitCost] = useState(70000);
  const [memo, setMemo] = useState('');
  const { showToast } = useToast();

  const loadPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPurchaseOrders();
      setPurchaseOrders(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    const sup = INITIAL_SUPPLIERS.find((s) => s.id === supplierId);
    const newPo: PurchaseOrder = {
      id: `po-${Date.now()}`,
      po_number: `PO-${Date.now().toString().slice(-8)}`,
      supplier_id: supplierId,
      supplier_name: sup?.name,
      status: 'ordered',
      total_cost: quantity * unitCost,
      requested_date: new Date().toISOString().split('T')[0],
      expected_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      items_count: quantity,
      memo,
      created_at: new Date().toISOString(),
    };
    await api.savePurchaseOrder(newPo);
    await loadPurchaseOrders();
    setShowModal(false);
    showToast('새 발주서가 Supabase purchase_orders 테이블에 실시간 등록되었습니다.', 'success');
  };

  const handleUpdateStatus = async (poId: string, status: any) => {
    await api.updatePOStatus(poId, status);
    await loadPurchaseOrders();
    showToast(`발주 상태가 '${status}'(으)로 업데이트되어 Supabase에 저장되었습니다.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-black text-white">발주 관리 (PURCHASE ORDER)</h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              <Cloud className="w-3 h-3" />
              {isSupabaseConfigured ? 'Supabase purchase_orders 동기화' : '로컬 모의 저장소'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            원단 및 완제품 공급업체 발주서 등록 및 입고 정산 시 Supabase <code className="text-cyan-400">purchase_orders</code> 테이블에 저장됩니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPurchaseOrders}
            disabled={isLoading}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs flex items-center gap-1.5 border border-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> 신규 발주서 작성
          </button>
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">발주번호</th>
              <th className="py-3 px-4">공급처 (Supplier)</th>
              <th className="py-3 px-4 text-center">발주 수량</th>
              <th className="py-3 px-4 text-right">총 발주금액</th>
              <th className="py-3 px-4 text-center">발주일 / 입고예정일</th>
              <th className="py-3 px-4 text-center">발주 상태</th>
              <th className="py-3 px-4 text-center">상태 관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 font-mono font-bold text-white">{po.po_number}</td>
                <td className="py-3 px-4 text-neutral-200">
                  <span className="font-semibold block">{po.supplier_name}</span>
                  <span className="text-[11px] text-neutral-500">{po.memo}</span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-neutral-300">
                  {po.items_count} EA
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-white">
                  {formatPrice(po.total_cost)}
                </td>
                <td className="py-3 px-4 text-center text-neutral-400 font-mono text-[11px]">
                  <div>발주: {po.requested_date}</div>
                  <div className="text-neutral-500">예정: {po.expected_date}</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      po.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : po.status === 'ordered'
                        ? 'bg-[#721b29] text-white'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {po.status === 'completed'
                      ? '입고완료'
                      : po.status === 'ordered'
                      ? '발주완료'
                      : po.status === 'partial_received'
                      ? '부분입고'
                      : '작성중'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <select
                    value={po.status}
                    onChange={(e) => handleUpdateStatus(po.id, e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 text-white p-1 text-[11px]"
                  >
                    <option value="draft">작성</option>
                    <option value="ordered">발주완료</option>
                    <option value="partial_received">부분입고</option>
                    <option value="completed">입고완료</option>
                    <option value="cancelled">취소</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white">신규 발주서(PO) 생성</h3>
            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">공급업체 선택</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                >
                  {INITIAL_SUPPLIERS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.contact_person})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">발주 수량 (EA)</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">단가 (Unit Cost)</label>
                  <input
                    type="number"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">발주 메모 / 생산 품목</label>
                <textarea
                  rows={3}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="품목명 및 납기 요청사항"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="p-3 bg-neutral-900 border border-neutral-800 flex justify-between">
                <span className="text-neutral-400">총 발주 예상 금액</span>
                <span className="font-bold text-white font-mono">
                  {formatPrice(quantity * unitCost)}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#721b29] text-white font-bold"
                >
                  발주 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

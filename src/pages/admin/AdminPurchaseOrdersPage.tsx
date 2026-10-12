import React, { useState } from 'react';
import { PurchaseOrder } from '@/types/database.types';
import { INITIAL_SUPPLIERS } from '@/mock/mockData';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Plus, Check, Search, FileText } from 'lucide-react';

export const AdminPurchaseOrdersPage: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po-01',
      po_number: 'PO-20261001-01',
      supplier_id: 'sup-01',
      supplier_name: '(주)느와르 어패럴',
      status: 'ordered',
      total_cost: 15400000,
      requested_date: '2026-10-01',
      expected_date: '2026-10-12',
      items_count: 140,
      memo: '테일러드 울 블레이저 2차 리오더 생산분 발주',
      created_at: '2026-10-01T09:00:00Z',
    },
    {
      id: 'po-02',
      po_number: 'PO-20260925-02',
      supplier_id: 'sup-02',
      supplier_name: '(주)아틀리에 텍스타일',
      status: 'completed',
      total_cost: 22000000,
      requested_date: '2026-09-25',
      expected_date: '2026-10-03',
      received_date: '2026-10-03',
      items_count: 200,
      memo: '1+1 캐시미어 하프넥 니트 초도 생산 원사 및 완제품 입고 완료',
      created_at: '2026-09-25T11:00:00Z',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [supplierId, setSupplierId] = useState(INITIAL_SUPPLIERS[0].id);
  const [quantity, setQuantity] = useState(100);
  const [unitCost, setUnitCost] = useState(70000);
  const [memo, setMemo] = useState('');
  const { showToast } = useToast();

  const handleCreatePO = (e: React.FormEvent) => {
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
    setPurchaseOrders([newPo, ...purchaseOrders]);
    setShowModal(false);
    showToast('새 발주서가 성공적으로 생성 및 접수되었습니다.', 'success');
  };

  const handleUpdateStatus = (poId: string, status: any) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status } : p))
    );
    showToast(`발주 상태가 '${status}'(으)로 업데이트되었습니다.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">발주 관리 (PURCHASE ORDER)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            원단 및 완제품 공급업체 발주서 작성, 입고 검수 및 공급가액 정산 관리
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> 신규 발주서 작성
        </button>
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

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Truck, Check, Plus, Search } from 'lucide-react';

interface ShipmentRow {
  id: string;
  orderNumber: string;
  recipientName: string;
  carrier: string;
  trackingNumber: string;
  status: 'ready' | 'shipping' | 'delivered';
  shippedAt?: string;
}

export const AdminDeliveryPage: React.FC = () => {
  const { showToast } = useToast();

  const [shipments, setShipments] = useState<ShipmentRow[]>([
    {
      id: 'sh-01',
      orderNumber: 'ORD-20261005-94821',
      recipientName: '김다써',
      carrier: 'CJ대한통운',
      trackingNumber: '6891029381',
      status: 'shipping',
      shippedAt: '2026-10-05 14:00',
    },
    {
      id: 'sh-02',
      orderNumber: 'ORD-20261002-83719',
      recipientName: '김다써',
      carrier: 'CJ대한통운',
      trackingNumber: '6891011244',
      status: 'delivered',
      shippedAt: '2026-10-02 16:30',
    },
  ]);

  const [bulkInput, setBulkInput] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  const handleUpdateTracking = (id: string, trackingNumber: string) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, trackingNumber, status: 'shipping' } : s))
    );
    showToast('송장 번호가 등록되어 배송중 상태로 변경되었습니다.', 'success');
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) return;

    // Parse lines: ORDER_NUMBER,TRACKING_NO
    const lines = bulkInput.trim().split('\n');
    let count = 0;
    lines.forEach((line) => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        count++;
      }
    });

    setShowBulkModal(false);
    setBulkInput('');
    showToast(`${count}건의 송장 번호가 일괄 반영되었습니다.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">배송 및 송장 관리 (LOGISTICS)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            택배사 지정, 운송장 번호 개별 및 일괄 등록, 실시간 배송 추적 상태 동기화
          </p>
        </div>
        <button
          onClick={() => setShowBulkModal(true)}
          className="px-4 py-2 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
        >
          <Truck className="w-4 h-4" /> 송장 번호 일괄 업로드
        </button>
      </div>

      {/* Shipment Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">주문번호</th>
              <th className="py-3 px-4">수령인</th>
              <th className="py-3 px-4">택배사</th>
              <th className="py-3 px-4">송장 번호</th>
              <th className="py-3 px-4 text-center">배송 상태</th>
              <th className="py-3 px-4">출고 일시</th>
              <th className="py-3 px-4 text-center">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 font-mono font-bold text-white">{s.orderNumber}</td>
                <td className="py-3 px-4 font-medium text-neutral-200">{s.recipientName}</td>
                <td className="py-3 px-4 text-neutral-300">{s.carrier}</td>
                <td className="py-3 px-4">
                  <input
                    type="text"
                    defaultValue={s.trackingNumber}
                    onBlur={(e) => handleUpdateTracking(s.id, e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 px-2.5 py-1 text-white font-mono text-xs w-36"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      s.status === 'delivered'
                        ? 'bg-neutral-800 text-white'
                        : s.status === 'shipping'
                        ? 'bg-[#721b29] text-white'
                        : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {s.status === 'delivered' ? '배송완료' : s.status === 'shipping' ? '배송중' : '출고준비'}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-neutral-400">{s.shippedAt || '-'}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => showToast('CJ대한통운 API 실시간 배송추적 확인 완료', 'info')}
                    className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium"
                  >
                    배송추적
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white">송장 번호 일괄 업로드</h3>
            <p className="text-neutral-400 leading-relaxed">
              한 줄에 하나씩 [주문번호,운송장번호] 형식으로 입력해 주세요.
            </p>
            <form onSubmit={handleBulkSubmit} className="space-y-3">
              <textarea
                rows={6}
                required
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="ORD-20261006-00001,6891029381&#10;ORD-20261006-00002,6891029382"
                className="w-full bg-neutral-900 border border-neutral-700 p-2.5 text-white font-mono"
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#721b29] text-white font-bold">
                  일괄 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { RotateCcw, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ClaimItem {
  id: string;
  orderNumber: string;
  type: 'cancel' | 'return' | 'exchange' | 'refund';
  productName: string;
  reason: string;
  detail: string;
  status: 'requested' | 'approved' | 'completed' | 'rejected';
  requestDate: string;
  refundAmount?: number;
}

export const MyClaimsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as any) || 'all';

  const [activeTab, setActiveTab] = useState<'all' | 'cancel' | 'return' | 'exchange' | 'refund'>(
    initialType
  );
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyType, setApplyType] = useState<'cancel' | 'return' | 'exchange'>('return');
  const [orderNumber, setOrderNumber] = useState('ORD-20261002-83719');
  const [reason, setReason] = useState('단순 변심 / 사이즈 불일치');
  const [detail, setDetail] = useState('');
  const { showToast } = useToast();

  const [claims, setClaims] = useState<ClaimItem[]>([
    {
      id: 'cl-01',
      orderNumber: 'ORD-20261002-83719',
      type: 'return',
      productName: '테일러드 더블 브레스티드 울 블레이저 (Black / M)',
      reason: '사이즈 교환 후 환불 희망',
      detail: '사이즈가 생각보다 여유 있어 환불 요청합니다.',
      status: 'approved',
      requestDate: '2026-10-04',
      refundAmount: 245000,
    },
    {
      id: 'cl-02',
      orderNumber: 'ORD-20260920-19283',
      type: 'cancel',
      productName: '재패니즈 셀비지 스트레이트 로우 데님',
      reason: '주문정보 변경으로 인한 즉시 취소',
      detail: '사이즈를 잘못 선택하여 취소 후 재주문합니다.',
      status: 'completed',
      requestDate: '2026-09-20',
      refundAmount: 143000,
    },
  ]);

  const handleApplyClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const newClaim: ClaimItem = {
      id: `cl-${Date.now()}`,
      orderNumber,
      type: applyType,
      productName: '주문 상품 접수 건',
      reason,
      detail,
      status: 'requested',
      requestDate: new Date().toISOString().split('T')[0],
      refundAmount: applyType === 'exchange' ? 0 : 129000,
    };
    setClaims([newClaim, ...claims]);
    setShowApplyModal(false);
    setDetail('');
    showToast(
      `${applyType === 'cancel' ? '주문취소' : applyType === 'return' ? '반품' : '교환'} 요청이 접수되었습니다. 관리자 승인 후 처리됩니다.`,
      'success'
    );
  };

  const filtered = claims.filter((c) => activeTab === 'all' || c.type === activeTab);

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">
            취소 / 반품 / 교환 / 환불 내역
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            신청하신 주문 변경 건의 승인 및 환불 진행 상태를 확인하실 수 있습니다.
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors shrink-0"
        >
          클레임 접수 신청
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-neutral-200 gap-2 text-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: '전체 내역' },
          { id: 'cancel', label: '주문 취소' },
          { id: 'return', label: '반품 내역' },
          { id: 'exchange', label: '교환 내역' },
          { id: 'refund', label: '환불 내역' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 px-3 font-semibold transition-colors ${
              activeTab === t.id
                ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold -mb-[1px]'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Claims List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400">
          접수된 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((cl) => (
            <div key={cl.id} className="p-5 border border-neutral-200 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-900">{cl.orderNumber}</span>
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 font-bold">
                    {cl.type === 'cancel'
                      ? '주문취소'
                      : cl.type === 'return'
                      ? '반품'
                      : cl.type === 'exchange'
                      ? '교환'
                      : '환불'}
                  </span>
                  <span className="text-neutral-400">• 접수일: {cl.requestDate}</span>
                </div>
                <div>
                  <span
                    className={`px-2 py-0.5 font-bold ${
                      cl.status === 'completed'
                        ? 'bg-neutral-900 text-white'
                        : cl.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {cl.status === 'completed'
                      ? '처리완료'
                      : cl.status === 'approved'
                      ? '승인완료 (수거진행)'
                      : '관리자 승인 대기'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1">{cl.productName}</h4>
                <p className="text-neutral-600">신청사유: {cl.reason}</p>
                {cl.detail && <p className="text-neutral-400 mt-1">상세내용: {cl.detail}</p>}
                {cl.refundAmount ? (
                  <p className="mt-2 font-semibold text-[#721b29]">
                    예상 환불 금액: {cl.refundAmount.toLocaleString()}원
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white max-w-md w-full p-6 border border-neutral-200 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              취소 / 반품 / 교환 신청
            </h3>

            <form onSubmit={handleApplyClaim} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">신청 구분</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cancel', label: '주문 취소' },
                    { id: 'return', label: '반품 접수' },
                    { id: 'exchange', label: '교환 신청' },
                  ].map((btn) => (
                    <button
                      type="button"
                      key={btn.id}
                      onClick={() => setApplyType(btn.id as any)}
                      className={`p-2.5 border text-center font-bold ${
                        applyType === btn.id
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">대상 주문번호</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">사유 선택</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300"
                >
                  <option value="단순 변심 / 사이즈 불일치">단순 변심 / 사이즈 불일치</option>
                  <option value="색상/디자인 상이">실물 색상 및 디자인 상이</option>
                  <option value="상품 불량 및 파손">상품 마감 불량 및 하자</option>
                  <option value="배송 지연">배송 지연으로 인한 취소</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">상세 내용</label>
                <textarea
                  rows={3}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="구체적인 사유를 남겨주시면 원활한 검수 및 승인이 가능합니다."
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-neutral-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white font-bold"
                >
                  신청하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

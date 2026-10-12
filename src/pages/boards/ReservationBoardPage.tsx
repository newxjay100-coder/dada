import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Reservation } from '@/types/database.types';
import { Calendar, Plus, Clock, CheckCircle } from 'lucide-react';

export const ReservationBoardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 'res-01',
      reservation_number: 'RSV-20261010-019',
      user_id: user?.id,
      customer_name: user?.name || '김다써',
      customer_phone: user?.phone || '010-9876-5432',
      reservation_date: '2026-10-10T15:00:00Z',
      status: 'confirmed',
      memo: '한남 플래그십 쇼룸 VIP 프라이빗 피팅 & 스타일링 컨설팅 (2인)',
      created_at: '2026-10-05T10:00:00Z',
    },
    {
      id: 'res-02',
      reservation_number: 'RSV-20260918-004',
      user_id: user?.id,
      customer_name: user?.name || '김다써',
      customer_phone: user?.phone || '010-9876-5432',
      reservation_date: '2026-09-18T14:00:00Z',
      status: 'completed',
      memo: '2026 F/W 프리뷰 쇼룸 방문 및 프리오더 상담',
      created_at: '2026-09-12T11:00:00Z',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '김다써');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '010-9876-5432');
  const [reservationDate, setReservationDate] = useState('2026-10-15T14:00');
  const [memo, setMemo] = useState('');

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      reservation_number: `RSV-${Date.now().toString().slice(-8)}`,
      user_id: user?.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      reservation_date: new Date(reservationDate).toISOString(),
      status: 'confirmed',
      memo,
      created_at: new Date().toISOString(),
    };
    setReservations([newRes, ...reservations]);
    setShowModal(false);
    setMemo('');
    showToast('쇼룸 피팅 예약이 성공적으로 접수되었습니다.', 'success');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">
        <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              예약 확인 게시판 (SHOWROOM RESERVATION)
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              DASSOBA 한남 플래그십 쇼룸 1:1 프라이빗 피팅 및 컨설팅 예약 현황입니다.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase hover:bg-neutral-800 transition-colors shrink-0"
          >
            피팅 예약 신청
          </button>
        </div>

        {/* Table */}
        <div className="border border-neutral-200 overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">예약번호</th>
                <th className="py-3 px-4">고객명</th>
                <th className="py-3 px-4">예약일시</th>
                <th className="py-3 px-4">예약 메모/내용</th>
                <th className="py-3 px-4 text-center">예약상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50">
                  <td className="py-4 px-4 font-mono font-bold text-neutral-900">
                    {r.reservation_number}
                  </td>
                  <td className="py-4 px-4 font-medium text-neutral-800">{r.customer_name}</td>
                  <td className="py-4 px-4 text-neutral-600">
                    {r.reservation_date.replace('T', ' ').substring(0, 16)}
                  </td>
                  <td className="py-4 px-4 text-neutral-700">{r.memo}</td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold ${
                        r.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'completed'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.status === 'confirmed'
                        ? '예약확정'
                        : r.status === 'completed'
                        ? '방문완료'
                        : '예약취소'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="bg-white max-w-md w-full p-6 border border-neutral-200 shadow-2xl space-y-4 text-xs">
              <h3 className="font-serif text-lg font-bold">오프라인 쇼룸 피팅 예약</h3>
              <form onSubmit={handleCreateReservation} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1">예약자명</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">연락처</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">방문 희망 일시</label>
                  <input
                    type="datetime-local"
                    required
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">피팅 희망 제품 / 요청 메모</label>
                  <textarea
                    rows={3}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="입어보고 싶으신 의류(아우터, 수트 등)나 방문 인원을 적어주세요."
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-neutral-300"
                  >
                    취소
                  </button>
                  <button type="submit" className="px-4 py-2 bg-neutral-900 text-white font-bold">
                    예약 신청
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

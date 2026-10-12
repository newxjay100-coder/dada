import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { PointTransaction } from '@/types/database.types';
import { Coins, Plus, Minus, Info } from 'lucide-react';

export const MyPointsPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);

  useEffect(() => {
    if (user?.id) {
      api.getPointTransactions(user.id).then(setTransactions);
    }
  }, [user]);

  const totalPoints = user?.points_balance || 14500;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'signup':
        return '가입축하 적립';
      case 'purchase':
        return '구매 확정 적립';
      case 'text_review':
        return '일반 리뷰 적립';
      case 'photo_review':
        return '포토 리뷰 적립';
      case 'usage':
        return '주문 결제 사용';
      case 'event':
        return '이벤트 프로모션';
      case 'admin_adjustment':
        return '관리자 수기 조정';
      default:
        return '기타';
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="font-serif text-xl font-bold text-neutral-900">포인트 내역 (원장 관리)</h2>
        <p className="text-xs text-neutral-500 mt-1">
          DASSOBA의 모든 포인트는 거래 원장(Ledger)에 투명하게 기록됩니다.
        </p>
      </div>

      {/* Point Balance Header Box */}
      <div className="p-6 bg-neutral-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-neutral-400 block mb-1">현재 사용 가능한 적립금</span>
          <div className="text-3xl sm:text-4xl font-mono font-black text-amber-300">
            {totalPoints.toLocaleString()} P
          </div>
        </div>
        <div className="text-xs text-neutral-400 max-w-xs leading-relaxed">
          * 적립금은 1P = 1원으로 현금과 동일하게 사용하실 수 있으며, 유효기간은 적립일로부터 2년입니다.
        </div>
      </div>

      {/* Transaction History Ledger Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
          적립 및 사용 거래 내역
        </h3>

        <div className="border border-neutral-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">일시</th>
                <th className="py-3 px-4">구분</th>
                <th className="py-3 px-4">내용</th>
                <th className="py-3 px-4 text-right">변동 포인트</th>
                <th className="py-3 px-4 text-right">잔액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-4 text-neutral-400 text-[11px]">
                    {tx.created_at.split('T')[0]}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-800">
                    {getTypeLabel(tx.transaction_type)}
                  </td>
                  <td className="py-3 px-4 text-neutral-700">{tx.description}</td>
                  <td
                    className={`py-3 px-4 text-right font-bold ${
                      tx.amount > 0 ? 'text-[#721b29]' : 'text-neutral-900'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} P
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-neutral-500">
                    {tx.balance_after?.toLocaleString()} P
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

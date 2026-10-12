import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from '@/mock/seedProducts';
import { useToast } from '@/context/ToastContext';
import { AlertTriangle, Plus, ArrowDown, ArrowUp, RefreshCw, Check } from 'lucide-react';

interface StockTransaction {
  id: string;
  sku: string;
  name: string;
  type: 'incoming' | 'sale_out' | 'return_in' | 'adjustment' | 'disposal' | 'po_in';
  quantity: number;
  balanceAfter: number;
  reason: string;
  date: string;
}

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<StockTransaction[]>([
    {
      id: 'tx-01',
      sku: 'NOIR-JK01-BLK-M',
      name: '테일러드 더블 브레스티드 울 블레이저',
      type: 'sale_out',
      quantity: -1,
      balanceAfter: 24,
      reason: '고객 주문 출고 (ORD-20261002-83719)',
      date: '2026-10-02 13:45',
    },
    {
      id: 'tx-02',
      sku: 'ATEL-KN02-OAT-F',
      name: '[1+1] 파인 캐시미어 블렌드 하프넥 니트',
      type: 'po_in',
      quantity: 50,
      balanceAfter: 50,
      reason: '발주 입고 완료 (PO-20260925-02)',
      date: '2026-10-03 10:20',
    },
    {
      id: 'tx-03',
      sku: 'LET-DR03-BGE-M',
      name: '실크 터치 드레이프 플리츠 맥시 원피스',
      type: 'return_in',
      quantity: 1,
      balanceAfter: 12,
      reason: '단순 변심 반품 양품 입고',
      date: '2026-10-04 16:10',
    },
  ]);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedSku, setSelectedSku] = useState('NOIR-JK01-BLK-M');
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustReason, setAdjustReason] = useState('정기 실사 재고 조정');

  // Low stock products alert (stock < 15)
  const lowStockItems: { product: string; sku: string; stock: number }[] = [];
  products.forEach((p) => {
    p.variants?.forEach((v) => {
      if (v.stock_quantity <= 15) {
        lowStockItems.push({
          product: p.name,
          sku: v.variant_sku,
          stock: v.stock_quantity,
        });
      }
    });
  });

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      sku: selectedSku,
      name: '수기 조정 대상 품목',
      type: 'adjustment',
      quantity: adjustQty,
      balanceAfter: 35,
      reason: adjustReason,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions([newTx, ...transactions]);
    setShowAdjustModal(false);
    showToast(`재고가 ${adjustQty > 0 ? '+' : ''}${adjustQty}개 수기 조정되었습니다.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">재고 및 입출고 수불부 (INVENTORY)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            실시간 재고 현황, 입고/출고/반품/조정 수불 트랜잭션 및 안전재고 경보
          </p>
        </div>
        <button
          onClick={() => setShowAdjustModal(true)}
          className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> 수기 재고 조정
        </button>
      </div>

      {/* Low Stock Alert Box */}
      {lowStockItems.length > 0 && (
        <div className="p-5 bg-amber-950/20 border border-amber-600/40 text-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>안전 재고 부족 경보 (발주 필요 품목 {lowStockItems.length}건)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.sku} className="p-3 bg-neutral-950 border border-amber-800/40">
                <span className="font-bold text-white block truncate">{item.product}</span>
                <span className="text-neutral-400 font-mono text-[11px] block">{item.sku}</span>
                <span className="text-amber-400 font-bold font-mono text-sm mt-1 block">
                  현재고: {item.stock} EA (임계치 15개 이하)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Transactions Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="font-bold text-white uppercase tracking-wider">
            입출고 수불 거래 원장 (INVENTORY TRANSACTIONS)
          </h3>
          <span className="text-neutral-500 font-mono text-[11px]">실시간 감사 로그</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">일시</th>
              <th className="py-3 px-4">품목 SKU</th>
              <th className="py-3 px-4">상품명</th>
              <th className="py-3 px-4 text-center">유형</th>
              <th className="py-3 px-4 text-right">변동 수량</th>
              <th className="py-3 px-4 text-right">조정 후 재고</th>
              <th className="py-3 px-4">사유 / 레퍼런스</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{tx.date}</td>
                <td className="py-3 px-4 font-mono font-bold text-neutral-300">{tx.sku}</td>
                <td className="py-3 px-4 font-medium text-white">{tx.name}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold ${
                      tx.type === 'po_in'
                        ? 'bg-emerald-950 text-emerald-300'
                        : tx.type === 'sale_out'
                        ? 'bg-neutral-800 text-neutral-300'
                        : tx.type === 'return_in'
                        ? 'bg-blue-950 text-blue-300'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {tx.type === 'po_in'
                      ? '발주입고'
                      : tx.type === 'sale_out'
                      ? '판매출고'
                      : tx.type === 'return_in'
                      ? '반품입고'
                      : '수기조정'}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-right font-mono font-bold ${
                    tx.quantity > 0 ? 'text-emerald-400' : 'text-neutral-300'
                  }`}
                >
                  {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} EA
                </td>
                <td className="py-3 px-4 text-right font-mono text-white font-bold">
                  {tx.balanceAfter} EA
                </td>
                <td className="py-3 px-4 text-neutral-400">{tx.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white">수기 재고 수불 조정</h3>
            <form onSubmit={handleAdjustStock} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">대상 SKU 선택</label>
                <select
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                >
                  <option value="NOIR-JK01-BLK-M">NOIR-JK01-BLK-M (테일러드 블레이저 Black/M)</option>
                  <option value="ATEL-KN02-OAT-F">ATEL-KN02-OAT-F (캐시미어 니트 Oatmeal/FREE)</option>
                  <option value="LET-DR03-BGE-M">LET-DR03-BGE-M (플리츠 맥시 드레스 Ivory/M)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">변동 수량 (양수/음수 가능)</label>
                <input
                  type="number"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">조정 사유</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="예: 정기 재고 실사 차이 조정"
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#721b29] text-white font-bold"
                >
                  조정 실행
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

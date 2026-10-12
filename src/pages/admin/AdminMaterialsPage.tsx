import React, { useState } from 'react';
import { Material } from '@/types/database.types';
import { INITIAL_MATERIALS, INITIAL_SUPPLIERS } from '@/mock/mockData';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit3, Trash2, Layers } from 'lucide-react';

export const AdminMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [showModal, setShowModal] = useState(false);
  const [materialCode, setMaterialCode] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [supplierId, setSupplierId] = useState(INITIAL_SUPPLIERS[0].id);
  const [stock, setStock] = useState(100);
  const [unit, setUnit] = useState('YD');
  const [cost, setCost] = useState(45000);
  const [location, setLocation] = useState('MAT-WH-A01');
  const [memo, setMemo] = useState('');
  const { showToast } = useToast();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = INITIAL_SUPPLIERS.find((s) => s.id === supplierId);
    const newMat: Material = {
      id: `mat-${Date.now()}`,
      material_code: materialCode || `MAT-${Date.now().toString().slice(-6)}`,
      material_name: materialName,
      supplier_id: supplierId,
      supplier_name: sup?.name,
      stock,
      unit,
      cost,
      location,
      memo,
    };
    setMaterials([newMat, ...materials]);
    setShowModal(false);
    showToast('원부자재가 성공적으로 등록되었습니다.', 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('해당 자재 정보를 삭제하시겠습니까?')) {
      setMaterials(materials.filter((m) => m.id !== id));
      showToast('자재가 삭제되었습니다.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">원부자재 관리 (RAW MATERIALS)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            의류 제작용 직물 원단, 수입 캐시미어 원사, 부자재(지퍼, 단추) 수량 및 보관 로케이션 관리
          </p>
        </div>
        <button
          onClick={() => {
            setMaterialCode(`MAT-FAB-${Date.now().toString().slice(-4)}`);
            setShowModal(true);
          }}
          className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> 신규 자재 등록
        </button>
      </div>

      {/* Materials Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">자재 코드</th>
              <th className="py-3 px-4">자재명</th>
              <th className="py-3 px-4">공급처</th>
              <th className="py-3 px-4 text-right">현재고 / 단위</th>
              <th className="py-3 px-4 text-right">원단 단가</th>
              <th className="py-3 px-4">창고 로케이션</th>
              <th className="py-3 px-4">메모</th>
              <th className="py-3 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {materials.map((m) => (
              <tr key={m.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 font-mono font-bold text-neutral-300">{m.material_code}</td>
                <td className="py-3 px-4 font-bold text-white">{m.material_name}</td>
                <td className="py-3 px-4 text-neutral-300">{m.supplier_name}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                  {m.stock} {m.unit}
                </td>
                <td className="py-3 px-4 text-right font-mono text-white">{formatPrice(m.cost)}</td>
                <td className="py-3 px-4 font-mono text-neutral-400">{m.location}</td>
                <td className="py-3 px-4 text-neutral-500">{m.memo || '-'}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1 text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            <h3 className="font-serif text-lg font-bold text-white">신규 원부자재 등록</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">자재 코드</label>
                <input
                  type="text"
                  required
                  value={materialCode}
                  onChange={(e) => setMaterialCode(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">자재명</label>
                <input
                  type="text"
                  required
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">수량</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">단위</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                  >
                    <option value="YD">YD (야드)</option>
                    <option value="KG">KG (킬로)</option>
                    <option value="EA">EA (개)</option>
                    <option value="ROLL">ROLL (롤)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">단가</label>
                  <input
                    type="number"
                    required
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">보관 로케이션</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">메모</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button type="submit" className="px-4 py-1.5 bg-[#721b29] text-white font-bold">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

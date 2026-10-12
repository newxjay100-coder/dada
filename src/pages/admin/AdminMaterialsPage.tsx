import React, { useState, useEffect } from 'react';
import { Material } from '@/types/database.types';
import { INITIAL_SUPPLIERS } from '@/mock/mockData';
import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit3, Trash2, Layers, Cloud, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMaterials();
      setMaterials(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
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
    await api.saveMaterial(newMat);
    await loadMaterials();
    setShowModal(false);
    showToast('원부자재가 Supabase materials 테이블에 실시간 저장되었습니다.', 'success');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('해당 자재 정보를 삭제하시겠습니까? Supabase 클라우드에서도 삭제됩니다.')) {
      await api.deleteMaterial(id);
      await loadMaterials();
      showToast('자재가 삭제되었습니다 (Supabase 동기화 완료).', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-serif font-black text-white">원부자재 관리 (RAW MATERIALS)</h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              <Cloud className="w-3 h-3" />
              {isSupabaseConfigured ? 'Supabase materials 동기화' : '로컬 모의 저장소'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            원단 및 부자재 재고/단가 변동 시 Supabase <code className="text-cyan-400">materials</code> 테이블에 즉시 저장됩니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadMaterials}
            disabled={isLoading}
            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs flex items-center gap-1.5 border border-neutral-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
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

import React, { useState } from 'react';
import { Product, ProductVariant } from '@/types/database.types';
import { MockProductStore } from '@/mock/mockStorage';
import { INITIAL_BRANDS, INITIAL_CATEGORIES } from '@/mock/seedProducts';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/lib/utils';
import { Plus, Edit3, Trash2, Search, Check, Percent } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => MockProductStore.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { showToast } = useToast();

  // Form states
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState(INITIAL_BRANDS[0].id);
  const [categoryId, setCategoryId] = useState('c-women-outer');
  const [costPrice, setCostPrice] = useState(60000);
  const [regularPrice, setRegularPrice] = useState(150000);
  const [salePrice, setSalePrice] = useState(129000);
  const [isOnePlusOne, setIsOnePlusOne] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isBest, setIsBest] = useState(false);
  const [primaryImage, setPrimaryImage] = useState(
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop'
  );
  const [description, setDescription] = useState('');

  const handleOpenNew = () => {
    setEditingProduct(null);
    setSku(`DASSOBA-${Date.now().toString().slice(-6)}`);
    setName('');
    setCostPrice(50000);
    setRegularPrice(129000);
    setSalePrice(109000);
    setIsOnePlusOne(false);
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setSku(p.sku);
    setName(p.name);
    setBrandId(p.brand_id || INITIAL_BRANDS[0].id);
    setCategoryId(p.category_id || 'c-women-outer');
    setCostPrice(p.cost_price);
    setRegularPrice(p.regular_price);
    setSalePrice(p.sale_price);
    setIsOnePlusOne(p.is_one_plus_one);
    setIsNew(p.is_new);
    setIsBest(p.is_best);
    setPrimaryImage(p.primary_image);
    setDescription(p.description);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      MockProductStore.delete(id);
      setProducts(MockProductStore.getAll());
      showToast('상품이 삭제되었습니다.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);

    const saved: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      sku,
      name,
      brand_id: brandId,
      brand: INITIAL_BRANDS.find((b) => b.id === brandId),
      category_id: categoryId,
      cost_price: costPrice,
      regular_price: regularPrice,
      sale_price: salePrice,
      discount_rate: Math.max(0, discount),
      tax_type: 'taxable',
      status: 'active',
      primary_image: primaryImage,
      description,
      is_one_plus_one: isOnePlusOne,
      is_new: isNew,
      is_best: isBest,
      view_count: editingProduct?.view_count || 10,
      sale_count: editingProduct?.sale_count || 5,
      rating_avg: editingProduct?.rating_avg || 5.0,
      review_count: editingProduct?.review_count || 1,
      created_at: editingProduct?.created_at || new Date().toISOString(),
      variants: editingProduct?.variants || [
        {
          id: `v-${Date.now()}-1`,
          product_id: editingProduct?.id || `prod-${Date.now()}`,
          variant_sku: `${sku}-BLK-M`,
          color: 'Black',
          color_code: '#111111',
          size: 'M',
          additional_price: 0,
          stock_quantity: 20,
          status: 'active',
        },
      ],
    };

    MockProductStore.save(saved);
    setProducts(MockProductStore.getAll());
    setShowModal(false);
    showToast(editingProduct ? '상품이 수정되었습니다.' : '신규 상품이 등록되었습니다.', 'success');
  };

  const filtered = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand?.english_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-4">
        <div>
          <h1 className="text-xl font-serif font-black text-white">상품 관리 (PRODUCT CATALOG)</h1>
          <p className="text-xs text-neutral-400 mt-1">
            SKU 등록, 판매가 및 원가 설정, 1+1 기획전 지정, 재고 옵션 관리
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> 신규 상품 등록
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-neutral-950 p-4 border border-neutral-800 flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="상품명, SKU, 브랜드명 검색"
            className="w-full bg-neutral-900 border border-neutral-700 p-2.5 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-neutral-950 border border-neutral-800 overflow-x-auto text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4 w-14">이미지</th>
              <th className="py-3 px-4">상품명 / 브랜드</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4 text-right">정상가</th>
              <th className="py-3 px-4 text-right">판매가</th>
              <th className="py-3 px-4 text-center">할인율</th>
              <th className="py-3 px-4 text-center">기획 뱃지</th>
              <th className="py-3 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-900/50">
                <td className="py-2.5 px-4">
                  <div className="w-10 h-12 bg-neutral-800 overflow-hidden border border-neutral-700">
                    <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <span className="font-bold text-white block line-clamp-1">{p.name}</span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {p.brand?.english_name || 'DASSOBA'}
                  </span>
                </td>
                <td className="py-2.5 px-4 font-mono text-neutral-300">{p.sku}</td>
                <td className="py-2.5 px-4 text-right font-mono text-neutral-400 line-through">
                  {formatPrice(p.regular_price)}
                </td>
                <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                  {formatPrice(p.sale_price)}
                </td>
                <td className="py-2.5 px-4 text-center font-bold text-[#f39c12]">
                  {p.discount_rate}%
                </td>
                <td className="py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {p.is_one_plus_one && (
                      <span className="px-1.5 py-0.5 bg-[#721b29] text-white text-[9px] font-bold">
                        1+1
                      </span>
                    )}
                    {p.is_new && (
                      <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-200 text-[9px] font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1 text-neutral-400 hover:text-white"
                      title="수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 text-neutral-400 hover:text-red-400"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 p-6 max-w-xl w-full my-8 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-white">
              {editingProduct ? '상품 정보 수정' : '신규 상품 등록'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">SKU 코드</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">브랜드 선택</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                  >
                    {INITIAL_BRANDS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.english_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">상품명</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">원가 (Cost)</label>
                  <input
                    type="number"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">정상가 (Regular)</label>
                  <input
                    type="number"
                    required
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">판매가 (Sale)</label>
                  <input
                    type="number"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">대표 이미지 URL</label>
                <input
                  type="text"
                  required
                  value={primaryImage}
                  onChange={(e) => setPrimaryImage(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">상품 에디토리얼 설명</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 p-2 text-white"
                />
              </div>

              {/* Special Flags */}
              <div className="flex items-center gap-6 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={isOnePlusOne}
                    onChange={(e) => setIsOnePlusOne(e.target.checked)}
                    className="accent-[#721b29]"
                  />
                  <span>1+1 스페셜 기획 적용</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-white"
                  />
                  <span>신상품 (NEW)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={isBest}
                    onChange={(e) => setIsBest(e.target.checked)}
                    className="accent-white"
                  />
                  <span>베스트 (BEST)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-700 text-neutral-400"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#721b29] hover:bg-[#8e2233] text-white font-bold"
                >
                  {editingProduct ? '수정 완료' : '등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

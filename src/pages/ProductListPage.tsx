import React, { useState, useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Product } from '@/types/database.types';
import { ProductCard } from '@/components/common/ProductCard';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/mock/seedProducts';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Check,
  Percent,
} from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subSlug = searchParams.get('sub');
  const brandParam = searchParams.get('brand');
  const searchParam = searchParams.get('q');

  // Filter States
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam || 'all');
  const [selectedSort, setSelectedSort] = useState<string>('recommended');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [onlyOnePlusOne, setOnlyOnePlusOne] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    api.getProducts().then((data) => {
      setAllProducts(data);
      setLoading(false);
    });
  }, []);

  // Current category info
  const currentCat = INITIAL_CATEGORIES.find((c) => c.slug === categorySlug);
  const currentSubCat = currentCat?.subcategories?.find((s) => s.slug === subSlug);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Category filter
      if (categorySlug && categorySlug !== 'all') {
        if (categorySlug === 'new') {
          if (!product.is_new) return false;
        } else if (categorySlug === 'best') {
          if (!product.is_best) return false;
        } else if (categorySlug === 'outlet') {
          if (product.discount_rate < 20) return false;
        } else if (categorySlug === 'editorial') {
          // editorial features curated products
        } else if (!product.category_id?.includes(categorySlug)) {
          return false;
        }
      }
      if (subSlug) {
        if (product.category_id !== subSlug) return false;
      }

      // 2. Brand filter
      if (selectedBrand !== 'all') {
        if (product.brand?.slug !== selectedBrand && product.brand_id !== selectedBrand) {
          return false;
        }
      }

      // 3. Search query
      if (searchParam) {
        const q = searchParam.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q);
        const matchesBrand = product.brand?.english_name.toLowerCase().includes(q) || product.brand?.name.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }

      // 4. Special flags
      if (onlyOnePlusOne && !product.is_one_plus_one) return false;
      if (onlySale && product.discount_rate <= 0) return false;

      // 5. Price range
      if (priceRange === 'under-50k' && product.sale_price >= 50000) return false;
      if (priceRange === '50k-100k' && (product.sale_price < 50000 || product.sale_price >= 100000)) return false;
      if (priceRange === '100k-200k' && (product.sale_price < 100000 || product.sale_price >= 200000)) return false;
      if (priceRange === 'over-200k' && product.sale_price < 200000) return false;

      // 6. Color filter
      if (selectedColor !== 'all') {
        const hasColor = product.variants?.some((v) =>
          v.color.toLowerCase().includes(selectedColor.toLowerCase())
        );
        if (!hasColor) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'new':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
        case 'sales':
          return b.sale_count - a.sale_count;
        case 'price-low':
          return a.sale_price - b.sale_price;
        case 'price-high':
          return b.sale_price - a.sale_price;
        case 'reviews':
          return b.review_count - a.review_count;
        case 'discount':
          return b.discount_rate - a.discount_rate;
        case 'recommended':
        default:
          return b.rating_avg - a.rating_avg;
      }
    });
  }, [
    allProducts,
    categorySlug,
    subSlug,
    selectedBrand,
    searchParam,
    onlyOnePlusOne,
    onlySale,
    priceRange,
    selectedColor,
    selectedSort,
  ]);

  const resetFilters = () => {
    setSelectedBrand('all');
    setPriceRange('all');
    setOnlyOnePlusOne(false);
    setOnlySale(false);
    setSelectedColor('all');
    setSelectedSort('recommended');
  };

  const colors = [
    { name: 'Black', code: '#111111' },
    { name: 'White', code: '#ffffff' },
    { name: 'Beige', code: '#d8cfc4' },
    { name: 'Charcoal', code: '#3a3a3c' },
    { name: 'Burgundy', code: '#721b29' },
    { name: 'Navy', code: '#101d33' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-[#fcfbfa] border-b border-neutral-200 py-10 md:py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-3">
            <Link to="/" className="hover:text-neutral-900">홈</Link>
            <span>/</span>
            {currentCat ? (
              <span className="text-neutral-800 font-medium">{currentCat.name}</span>
            ) : searchParam ? (
              <span className="text-neutral-800 font-medium">검색: "{searchParam}"</span>
            ) : (
              <span className="text-neutral-800 font-medium">전체 컬렉션</span>
            )}
            {currentSubCat && (
              <>
                <span>/</span>
                <span className="text-neutral-900 font-bold">{currentSubCat.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black text-neutral-950 tracking-tight">
                {categorySlug === 'new'
                  ? '신상품 (NEW ARRIVALS)'
                  : categorySlug === 'best'
                  ? '베스트 셀렉션 (BEST SELLER)'
                  : categorySlug === 'outlet'
                  ? '아울렛 특별전 (OUTLET ARCHIVE)'
                  : categorySlug === 'editorial'
                  ? '에디토리얼 기획전 (EDITORIAL CURATION)'
                  : currentSubCat
                  ? currentSubCat.name
                  : currentCat
                  ? `${currentCat.name} 컬렉션`
                  : searchParam
                  ? `'${searchParam}' 검색 결과`
                  : 'ALL PRODUCTS'}
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                총 {filteredProducts.length}개의 정제된 패션 스타일이 준비되어 있습니다.
              </p>
            </div>

            {/* Subcategories Horizontal Scroll */}
            {currentCat?.subcategories && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <Link
                  to={`/category/${currentCat.slug}`}
                  className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                    !subSlug
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'
                  }`}
                >
                  전체
                </Link>
                {currentCat.subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/category/${currentCat.slug}?sub=${sub.slug}`}
                    className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      subSlug === sub.slug
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-200 gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 border border-neutral-300 text-xs font-semibold text-neutral-800"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>필터</span>
          </button>

          {/* Active Quick Filters Pills (Desktop) */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setOnlyOnePlusOne(!onlyOnePlusOne)}
              className={`px-3 py-1 text-xs font-medium border transition-colors ${
                onlyOnePlusOne
                  ? 'bg-[#721b29] text-white border-[#721b29]'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
              }`}
            >
              1+1 기획
            </button>
            <button
              onClick={() => setOnlySale(!onlySale)}
              className={`px-3 py-1 text-xs font-medium border transition-colors ${
                onlySale
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
              }`}
            >
              할인 상품만
            </button>
            {(selectedBrand !== 'all' || priceRange !== 'all' || onlyOnePlusOne || onlySale || selectedColor !== 'all') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-900 ml-2"
              >
                <RotateCcw className="w-3 h-3" /> 초기화
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-neutral-400 hidden sm:inline">정렬:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="text-xs font-semibold text-neutral-900 border border-neutral-300 py-1.5 px-3 focus:outline-none focus:border-neutral-900 bg-white"
            >
              <option value="recommended">추천순</option>
              <option value="new">신상품순</option>
              <option value="popular">인기순</option>
              <option value="sales">판매순</option>
              <option value="price-low">낮은가격순</option>
              <option value="price-high">높은가격순</option>
              <option value="reviews">리뷰순</option>
              <option value="discount">할인율순</option>
            </select>
          </div>
        </div>

        {/* Desktop Split: Left Sidebar Filter + Right Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block col-span-1 space-y-8 pr-4 border-r border-neutral-100 text-xs">
            {/* Brand Filter */}
            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
                브랜드
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-600 hover:text-neutral-900">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === 'all'}
                    onChange={() => setSelectedBrand('all')}
                    className="accent-neutral-900"
                  />
                  <span>전체 브랜드</span>
                </label>
                {INITIAL_BRANDS.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer text-neutral-600 hover:text-neutral-900">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === b.slug}
                      onChange={() => setSelectedBrand(b.slug)}
                      className="accent-neutral-900"
                    />
                    <span>{b.english_name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
                가격대
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: '전체 가격' },
                  { id: 'under-50k', label: '5만원 이하' },
                  { id: '50k-100k', label: '5만원 ~ 10만원' },
                  { id: '100k-200k', label: '10만원 ~ 20만원' },
                  { id: 'over-200k', label: '20만원 이상' },
                ].map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer text-neutral-600 hover:text-neutral-900">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                      className="accent-neutral-900"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-3">
                색상
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-2 py-1 border text-[11px] ${
                    selectedColor === 'all'
                      ? 'border-neutral-900 font-bold bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-600'
                  }`}
                >
                  ALL
                </button>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      selectedColor === c.name
                        ? 'ring-2 ring-neutral-900 ring-offset-2'
                        : 'border-neutral-300'
                    }`}
                    style={{ backgroundColor: c.code }}
                  >
                    {selectedColor === c.name && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.name === 'White' || c.name === 'Beige' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Cards Grid: Desktop 4 / Tablet 3 / Mobile 2 */}
          <div className="col-span-1 md:col-span-3 lg:col-span-4">
            {loading ? (
              <div className="py-20 text-center text-neutral-400">
                상품 목록을 불러오는 중입니다...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-neutral-200">
                <span className="text-sm font-semibold text-neutral-800 block mb-1">
                  조건에 맞는 상품이 없습니다.
                </span>
                <p className="text-xs text-neutral-400 mb-4">
                  선택하신 필터 조건을 변경하거나 초기화해 보세요.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold"
                >
                  필터 전체 초기화
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-7">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="font-bold text-sm uppercase">상세 필터</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Mobile Filters */}
            <div className="space-y-6 text-xs flex-1">
              <div>
                <h4 className="font-bold mb-2">1+1 & 세일</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyOnePlusOne}
                      onChange={(e) => setOnlyOnePlusOne(e.target.checked)}
                    />
                    <span>1+1 기획 상품만</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlySale}
                      onChange={(e) => setOnlySale(e.target.checked)}
                    />
                    <span>세일 상품만</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2">브랜드</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2 border border-neutral-300"
                >
                  <option value="all">전체 브랜드</option>
                  {INITIAL_BRANDS.map((b) => (
                    <option key={b.id} value={b.slug}>
                      {b.english_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-bold mb-2">가격대</h4>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-2 border border-neutral-300"
                >
                  <option value="all">전체 가격</option>
                  <option value="under-50k">5만원 이하</option>
                  <option value="50k-100k">5만원 ~ 10만원</option>
                  <option value="100k-200k">10만원 ~ 20만원</option>
                  <option value="over-200k">20만원 이상</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 border border-neutral-300 text-xs font-semibold text-neutral-700"
              >
                초기화
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-neutral-900 text-white text-xs font-semibold"
              >
                적용 ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

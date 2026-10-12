import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Product, ProductVariant, Review } from '@/types/database.types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import {
  Heart,
  Share2,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  MessageCircle,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { user, isLoggedIn } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detail' | 'size' | 'shipping' | 'reviews' | 'qna'>('detail');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Review Form Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewFit, setReviewFit] = useState('정사이즈');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);

    api.getProductById(productId).then((prod) => {
      if (prod) {
        setProduct(prod);
        setSelectedImage(prod.primary_image);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
      }
      setLoading(false);
    });

    api.getReviews(productId).then((revs) => {
      setReviews(revs);
    });
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500 text-sm">상품 정보를 불러오는 중입니다...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-xl font-bold mb-2">존재하지 않거나 삭제된 상품입니다.</h2>
        <Link to="/" className="text-sm text-neutral-600 underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      showToast('옵션을 선택해 주세요.', 'error');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    showToast(`${product.name}이(가) 장바구니에 담겼습니다.`, 'success');
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      showToast('옵션을 선택해 주세요.', 'error');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      user_id: user?.id || 'guest',
      user_name: user?.name || '고객',
      user_grade: user?.member_grade || 'BRONZE',
      product_id: product.id,
      product_name: product.name,
      rating: reviewRating,
      content: reviewContent,
      fit_feedback: reviewFit,
      size_feedback: '만족',
      is_photo: false,
      is_verified: true,
      is_hidden: false,
      points_awarded: 500,
      created_at: new Date().toISOString(),
    };

    await api.createReview(newRev);
    setReviews((prev) => [newRev, ...prev]);
    setShowReviewModal(false);
    setReviewContent('');
    showToast('리뷰가 등록되어 500P가 적립되었습니다!', 'success');
  };

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 text-xs text-neutral-400">
        <Link to="/" className="hover:text-neutral-900">홈</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${product.category_id || 'women'}`} className="hover:text-neutral-900">
          {product.category?.name || '카테고리'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800 font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Stage */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14">
          {/* Left: Gallery (Cols 7) */}
          <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setSelectedImage(product.primary_image)}
                className={`w-16 h-20 border overflow-hidden ${
                  selectedImage === product.primary_image
                    ? 'border-neutral-900 ring-1 ring-neutral-900'
                    : 'border-neutral-200'
                }`}
              >
                <img
                  src={product.primary_image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>

            {/* Main Hero Image */}
            <div className="relative aspect-3/4 w-full bg-neutral-100 overflow-hidden">
              <img
                src={selectedImage || product.primary_image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {/* Feature Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.is_one_plus_one && <Badge variant="burgundy">1+1 SPECIAL</Badge>}
                {product.is_new && <Badge variant="primary">NEW</Badge>}
                {product.is_best && <Badge variant="secondary">BEST</Badge>}
              </div>
            </div>
          </div>

          {/* Right: Product Purchase Info (Cols 5) */}
          <div className="md:col-span-5 flex flex-col">
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <Link
                to={`/brands?brand=${product.brand?.slug}`}
                className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-[#721b29]"
              >
                {product.brand?.english_name || 'DASSOBA'}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="찜하기"
                  className="p-1.5 text-neutral-400 hover:text-[#721b29] transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      wishlisted ? 'fill-[#721b29] text-[#721b29]' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('상품 링크가 복사되었습니다.', 'info');
                  }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-serif font-black text-neutral-950 mt-3 mb-2 leading-snug">
              {product.name}
            </h1>

            {/* Review summary line */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating_avg)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-neutral-800">{product.rating_avg}</span>
              <span>•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="hover:underline text-neutral-600"
              >
                리뷰 {product.review_count}개
              </button>
            </div>

            {/* Pricing Section */}
            <div className="py-4 border-y border-neutral-100 space-y-1 mb-6">
              <div className="flex items-baseline gap-2">
                {product.discount_rate > 0 && (
                  <span className="text-2xl font-black text-[#721b29]">
                    {product.discount_rate}%
                  </span>
                )}
                <span className="text-2xl font-extrabold text-neutral-900">
                  {formatPrice(product.sale_price)}
                </span>
                {product.discount_rate > 0 && (
                  <span className="text-xs text-neutral-400 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
              </div>

              {/* Coupon / Point Reward Callout */}
              <div className="pt-2 flex flex-col gap-1 text-[11px] text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-neutral-100 font-semibold text-neutral-800">
                    쿠폰 혜택
                  </span>
                  <span>신규 회원 10% 쿠폰 적용 시 최대 {formatPrice(product.sale_price * 0.9)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-neutral-100 font-semibold text-neutral-800">
                    적립금
                  </span>
                  <span>구매 확정 시 최대 {formatPrice(Math.round(product.sale_price * 0.03))} 적립</span>
                </div>
              </div>
            </div>

            {/* Variants Options Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-neutral-900 block mb-2 uppercase">
                    COLOR / SIZE 선택
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 text-left border flex items-center justify-between text-xs transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950 font-bold'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                            style={{ backgroundColor: v.color_code }}
                          />
                          <span>
                            {v.color} / {v.size}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500">
                          재고 {v.stock_quantity}개
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold text-neutral-900 block mb-2">
                    수량
                  </label>
                  <div className="flex items-center border border-neutral-300 w-32 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-neutral-600 hover:text-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-neutral-600 hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Total Calculation Box */}
            <div className="bg-[#faf9f6] p-4 border border-neutral-200 mb-6 flex items-center justify-between">
              <span className="text-xs text-neutral-600 font-medium">총 상품 금액</span>
              <span className="text-lg font-black text-neutral-950">
                {formatPrice((product.sale_price + (selectedVariant?.additional_price || 0)) * quantity)}
              </span>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="py-4 border border-neutral-950 text-neutral-950 font-bold text-xs tracking-wider uppercase hover:bg-neutral-100 transition-colors"
              >
                장바구니 담기
              </button>
              <button
                onClick={handleBuyNow}
                className="py-4 bg-neutral-950 text-white font-bold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-sm"
              >
                바로 구매하기
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="border-t border-neutral-100 pt-4 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-400" />
                <span>5만원 이상 무료배송 (기본 배송비 3,000원)</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-neutral-400" />
                <span>수령 후 7일 이내 간편 반품/교환 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-400" />
                <span>100% 정품 보증 및 안전 에스크로 결제</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation: 상품정보 / 상세설명 / 사이즈 / 배송&교환 / 리뷰 / Q&A */}
        <div className="mt-16 md:mt-24">
          <div className="flex items-center border-b border-neutral-300 overflow-x-auto no-scrollbar">
            {[
              { id: 'detail', label: '상세설명' },
              { id: 'size', label: '사이즈 가이드' },
              { id: 'shipping', label: '배송/교환/반품' },
              { id: 'reviews', label: `리뷰 (${reviews.length})` },
              { id: 'qna', label: 'Q&A 상품문의' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-neutral-950 text-neutral-950 font-black -mb-[1px]'
                    : 'text-neutral-400 hover:text-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Detail */}
          {activeTab === 'detail' && (
            <div className="py-12 max-w-3xl mx-auto space-y-8 text-neutral-800">
              <div className="prose prose-neutral max-w-none text-sm leading-relaxed">
                <h3 className="font-serif text-xl font-bold mb-4">DESIGNER'S NOTE</h3>
                <p className="mb-6">{product.description}</p>
                <div
                  dangerouslySetInnerHTML={{ __html: product.details_html || '' }}
                  className="mb-8"
                />
              </div>

              {/* Editorial Large Visual Section */}
              <div className="space-y-6">
                <div className="aspect-16/9 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Size */}
          {activeTab === 'size' && (
            <div className="py-12 max-w-3xl mx-auto space-y-6 text-xs text-neutral-700">
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">실측 사이즈 (단면 cm)</h3>
              <p className="text-neutral-500 mb-4">측정 위치와 방법에 따라 1~2cm 오차가 발생할 수 있습니다.</p>
              <div className="border border-neutral-200 overflow-x-auto">
                <table className="w-full text-center">
                  <thead className="bg-neutral-50 border-b border-neutral-200 font-bold text-neutral-900">
                    <tr>
                      <th className="py-3 px-4">사이즈</th>
                      <th className="py-3 px-4">총장</th>
                      <th className="py-3 px-4">어깨너비</th>
                      <th className="py-3 px-4">가슴단면</th>
                      <th className="py-3 px-4">소매길이</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="py-3 px-4 font-bold">S</td>
                      <td className="py-3 px-4">72</td>
                      <td className="py-3 px-4">44</td>
                      <td className="py-3 px-4">52</td>
                      <td className="py-3 px-4">61</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">M</td>
                      <td className="py-3 px-4">74</td>
                      <td className="py-3 px-4">46</td>
                      <td className="py-3 px-4">54</td>
                      <td className="py-3 px-4">62</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">L</td>
                      <td className="py-3 px-4">76</td>
                      <td className="py-3 px-4">48</td>
                      <td className="py-3 px-4">56</td>
                      <td className="py-3 px-4">63</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'shipping' && (
            <div className="py-12 max-w-3xl mx-auto space-y-6 text-xs text-neutral-700 leading-relaxed">
              <div className="border-b border-neutral-200 pb-4">
                <h4 className="font-bold text-neutral-900 mb-1 text-sm">배송 안내</h4>
                <p>• 택배사: CJ대한통운 (1588-1255)</p>
                <p>• 배송비: 기본 3,000원 (50,000원 이상 구매 시 무료 배송)</p>
                <p>• 출고 일정: 평일 오후 2시 이전 결제 완료 건 당일 출고</p>
              </div>
              <div className="border-b border-neutral-200 pb-4">
                <h4 className="font-bold text-neutral-900 mb-1 text-sm">교환 및 반품 안내</h4>
                <p>• 신청 기한: 상품 수령 후 7일 이내 마이페이지에서 원클릭 접수</p>
                <p>• 단순 변심 반품 배송비: 6,000원 (환불금에서 자동 차감)</p>
                <p>• 상품 불량 및 오배송: 전액 무료 교환/반품 처리</p>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="py-12 max-w-3xl mx-auto space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    구매 고객 실사용 리뷰 ({reviews.length})
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-black text-neutral-900">{product.rating_avg}</span>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                >
                  리뷰 작성하기 (+500P)
                </button>
              </div>

              {/* Review Feed */}
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pb-6 border-b border-neutral-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{rev.user_name}</span>
                        <Badge variant="secondary" className="text-[9px]">
                          {rev.user_grade || 'BRONZE'}
                        </Badge>
                        <span className="text-neutral-400">• {rev.created_at.split('T')[0]}</span>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-neutral-200 text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-800 leading-relaxed font-normal">{rev.content}</p>
                    {rev.admin_reply && (
                      <div className="bg-neutral-50 p-3 mt-2 border-l-2 border-neutral-900 text-[11px] text-neutral-600">
                        <span className="font-bold text-neutral-900 block mb-1">
                          DASSOBA 담당자 답변:
                        </span>
                        {rev.admin_reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Q&A */}
          {activeTab === 'qna' && (
            <div className="py-12 max-w-3xl mx-auto space-y-6 text-xs text-neutral-700">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">상품 Q&A</h3>
                  <p className="text-neutral-500">배송 및 상품 관련 문의를 남겨주시면 빠르게 답변드립니다.</p>
                </div>
                <Link
                  to="/boards/qna"
                  className="px-4 py-2 border border-neutral-900 text-neutral-900 font-bold hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  문의 작성하기
                </Link>
              </div>
              <p className="text-neutral-400 py-6 text-center">
                등록된 질문이 없습니다. 궁금한 점이 있으시면 언제든 문의를 남겨주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white w-full max-w-md p-6 border border-neutral-200 shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-4">상품 리뷰 작성</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">평점 선택</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setReviewRating(r)}
                      className={`px-3 py-1 border ${
                        reviewRating === r ? 'bg-neutral-900 text-white font-bold' : 'border-neutral-300'
                      }`}
                    >
                      {r}점
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">핏 만족도</label>
                <select
                  value={reviewFit}
                  onChange={(e) => setReviewFit(e.target.value)}
                  className="w-full p-2 border border-neutral-300"
                >
                  <option value="정사이즈">정사이즈에요</option>
                  <option value="작은편">조금 작은 편이에요</option>
                  <option value="큰편">조금 여유있는 편이에요</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">리뷰 내용</label>
                <textarea
                  rows={4}
                  required
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="착용감, 핏, 소재감에 대한 상세한 후기를 남겨주시면 다른 고객분들께 큰 도움이 됩니다."
                  className="w-full p-3 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-neutral-300 font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white font-bold"
                >
                  리뷰 등록 (+500P)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-4 py-2 shadow-lg flex items-center justify-between gap-3">
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label="찜하기"
          className="p-3 border border-neutral-300 hover:text-[#721b29] text-neutral-600 shrink-0"
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-[#721b29] text-[#721b29]' : ''}`} />
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 border border-neutral-950 text-neutral-950 font-bold text-xs uppercase"
        >
          장바구니
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 bg-neutral-950 text-white font-bold text-xs uppercase"
        >
          바로구매
        </button>
      </div>
    </div>
  );
};

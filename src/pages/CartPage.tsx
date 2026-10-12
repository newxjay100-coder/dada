import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    toggleSelect,
    selectAll,
    clearSelected,
    selectedItemsCount,
    totalItemsCount,
    totalRegularAmount,
    totalProductAmount,
    totalDiscountAmount,
    deliveryFee,
    finalAmount,
  } = useCart();

  const navigate = useNavigate();
  const allSelected = items.length > 0 && items.every((i) => i.isSelected);

  const handleCheckout = () => {
    if (selectedItemsCount === 0) {
      alert('주문하실 상품을 선택해 주세요.');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 bg-white">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-neutral-900 mb-2">
          장바구니가 비어 있습니다.
        </h2>
        <p className="text-xs text-neutral-500 mb-8 max-w-sm text-center leading-relaxed">
          마음에 드는 스타일과 1+1 스페셜 기획 상품을 찾아 장바구니에 담아보세요.
        </p>
        <Link
          to="/"
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Page Title */}
        <div className="mb-8 border-b border-neutral-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 tracking-tight">
            SHOPPING CART
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            장바구니에 담긴 상품을 확인하고 주문을 진행해 주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart Items List (Cols 8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Control Bar */}
            <div className="bg-white p-4 border border-neutral-200 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => selectAll(e.target.checked)}
                  className="w-4 h-4 accent-neutral-900"
                />
                <span>
                  전체선택 ({selectedItemsCount}/{totalItemsCount})
                </span>
              </label>

              <button
                onClick={clearSelected}
                className="text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> 선택 삭제
              </button>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => {
                const itemTotalPrice =
                  (item.product.sale_price + (item.variant.additional_price || 0)) * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="bg-white p-4 sm:p-6 border border-neutral-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="mt-1 w-4 h-4 accent-neutral-900 shrink-0"
                      />

                      {/* Image */}
                      <Link
                        to={`/product/${item.product.id}`}
                        className="w-20 h-24 sm:w-24 sm:h-28 bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100"
                      >
                        <img
                          src={item.product.primary_image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Info */}
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          {item.product.brand?.english_name || 'DASSOBA'}
                        </span>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-[#721b29] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-[11px] text-neutral-500">
                          선택옵션: {item.variant.color} / {item.variant.size}
                        </div>
                        <div className="text-xs font-bold text-neutral-900 pt-1">
                          {formatPrice(item.product.sale_price)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-neutral-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-neutral-500 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right">
                        <span className="text-sm font-black text-neutral-900 block">
                          {formatPrice(itemTotalPrice)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Order Summary Sticky Card (Cols 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-neutral-200 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-serif text-lg font-bold text-neutral-950 pb-3 border-b border-neutral-200">
                주문 요약
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>총 상품금액</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(totalRegularAmount)}
                  </span>
                </div>

                {totalDiscountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#721b29]">
                    <span>상품 할인</span>
                    <span className="font-semibold">
                      -{formatPrice(totalDiscountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-neutral-600">
                  <span>배송비</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-neutral-900">무료</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="text-[10px] text-neutral-400 pt-1">
                  * 50,000원 이상 결제 시 무료배송 혜택 제공
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-neutral-950">최종 결제 예상금액</span>
                  <span className="text-xl font-black text-[#721b29]">
                    {formatPrice(finalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCheckout}
                disabled={selectedItemsCount === 0}
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>주문하기 ({selectedItemsCount}개)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-[10px] text-neutral-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>에스크로 100% 안전결제 보증</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

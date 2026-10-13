import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import {
  getPaymentAdapter,
  PaymentMethod,
  getTossClientKey,
  setTossClientKey,
  DEFAULT_TOSS_CLIENT_KEY,
  ensureTossPaymentsSdk,
} from '@/lib/paymentAdapter';
import { generateOrderNumber, formatPrice } from '@/lib/utils';
import { Order, OrderItem, UserCoupon } from '@/types/database.types';
import {
  ShieldCheck,
  Check,
  Tag,
  Coins,
  CreditCard,
  ChevronRight,
  Smartphone,
  Building2,
  Wallet,
  Settings2,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, totalProductAmount, deliveryFee, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Buyer Form
  const [buyerName, setBuyerName] = useState(user?.name || '김다써');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '010-9876-5432');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'vip@dassoba.kr');

  // Shipping Form
  const [recipientName, setRecipientName] = useState(user?.name || '김다써');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '010-9876-5432');
  const [postalCode, setPostalCode] = useState('04399');
  const [addressLine1, setAddressLine1] = useState('서울시 용산구 한남대로 91');
  const [addressLine2, setAddressLine2] = useState('102동 1502호');
  const [deliveryMemo, setDeliveryMemo] = useState('부재 시 문 앞에 놓아주세요.');

  // Coupon & Points State
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [selectedUserCoupon, setSelectedUserCoupon] = useState<UserCoupon | null>(null);
  const [userPointsBalance] = useState<number>(user?.points_balance || 14500);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [pointsInput, setPointsInput] = useState<string>('');

  // Toss Payments State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tosspay');
  const [easyPayProvider, setEasyPayProvider] = useState<
    'tosspay' | 'kakaopay' | 'naverpay' | 'payco'
  >('tosspay');
  const [useLiveTossWindow, setUseLiveTossWindow] = useState<boolean>(true);
  const [tossSdkLoaded, setTossSdkLoaded] = useState<boolean>(false);
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
  const [customClientKey, setCustomClientKey] = useState<string>(getTossClientKey());
  const [isProcessing, setIsProcessing] = useState(false);

  // Preload Toss SDK & check fail query params
  useEffect(() => {
    ensureTossPaymentsSdk().then((loaded) => setTossSdkLoaded(loaded));

    if (searchParams.get('toss_fail') === 'true') {
      const failMsg = searchParams.get('message') || '토스페이먼츠 결제가 취소되었거나 실패했습니다.';
      showToast(failMsg, 'error');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user?.id) {
      api.getUserCoupons(user.id).then((coupons) => {
        setUserCoupons(coupons.filter((c) => !c.is_used));
      });
    }
  }, [user]);

  // Selected Cart Items only
  const selectedItems = items.filter((i) => i.isSelected);

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-lg font-bold mb-2">주문할 상품이 없습니다.</h2>
        <Link to="/cart" className="text-xs text-neutral-600 underline">
          장바구니로 돌아가기
        </Link>
      </div>
    );
  }

  // Calculate discounts
  let couponDiscount = 0;
  if (selectedUserCoupon?.coupon) {
    const c = selectedUserCoupon.coupon;
    if (c.discount_type === 'percentage') {
      couponDiscount = Math.round((totalProductAmount * c.discount_value) / 100);
      if (c.max_discount_amount && couponDiscount > c.max_discount_amount) {
        couponDiscount = c.max_discount_amount;
      }
    } else if (c.discount_type === 'fixed') {
      couponDiscount = c.discount_value;
    } else if (c.discount_type === 'free_shipping') {
      couponDiscount = deliveryFee;
    }
  }

  // Max points that can be used
  const payableBeforePoints = Math.max(0, totalProductAmount + deliveryFee - couponDiscount);
  const maxUsablePoints = Math.min(userPointsBalance, payableBeforePoints);

  const handleApplyPoints = (amount: number) => {
    const valid = Math.min(Math.max(0, amount), maxUsablePoints);
    setUsedPoints(valid);
    setPointsInput(String(valid));
  };

  const handleUseAllPoints = () => {
    handleApplyPoints(maxUsablePoints);
  };

  const finalPaymentAmount = Math.max(0, payableBeforePoints - usedPoints);

  const handleSaveClientKey = () => {
    setTossClientKey(customClientKey);
    showToast('토스페이먼츠 클라이언트 키가 저장되었습니다.', 'success');
    setShowKeyConfig(false);
  };

  const handleResetClientKey = () => {
    setTossClientKey(DEFAULT_TOSS_CLIENT_KEY);
    setCustomClientKey(DEFAULT_TOSS_CLIENT_KEY);
    showToast('공식 토스 테스트 키로 초기화되었습니다.', 'info');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderNumber = generateOrderNumber();
    const orderId = `ord-${Date.now()}`;

    try {
      const firstItem = selectedItems[0];
      const orderName =
        selectedItems.length > 1
          ? `${firstItem.product.name} 외 ${selectedItems.length - 1}건`
          : firstItem.product.name;

      // 1. Prepare Order Items & Order Payload before opening Toss window
      // (Because Toss Payments SDK redirects the browser to /order-success upon completion)
      const orderItems: OrderItem[] = selectedItems.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        order_id: orderId,
        product_id: item.product.id,
        variant_id: item.variant.id,
        product_name: item.product.name,
        variant_info: `${item.variant.color} / ${item.variant.size}`,
        unit_price: item.product.sale_price + (item.variant.additional_price || 0),
        quantity: item.quantity,
        total_amount:
          (item.product.sale_price + (item.variant.additional_price || 0)) * item.quantity,
        is_one_plus_one: item.product.is_one_plus_one,
        status: 'ordered',
      }));

      const newOrder: Order = {
        id: orderId,
        order_number: orderNumber,
        user_id: user?.id,
        order_name: orderName,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_email: buyerEmail,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        postal_code: postalCode,
        address_line1: addressLine1,
        address_line2: addressLine2,
        delivery_memo: deliveryMemo,
        total_product_amount: totalProductAmount,
        delivery_fee: deliveryFee,
        discount_amount: 0,
        coupon_discount: couponDiscount,
        points_used: usedPoints,
        final_payment_amount: finalPaymentAmount,
        payment_method: paymentMethod,
        payment_provider: 'Toss Payments',
        order_status: 'paid',
        payment_status: 'completed',
        items: orderItems,
        created_at: new Date().toISOString(),
      };

      // Save pending order in sessionStorage & Supabase so redirect to /order-success has full data
      sessionStorage.setItem(
        'dassoba_pending_toss_order',
        JSON.stringify({
          order: newOrder,
          usedPoints,
          rewardPoints: Math.round(finalPaymentAmount * 0.02),
          userId: user?.id,
        })
      );
      await api.createOrder(newOrder);

      // 2. Process payment via Toss Payments Adapter
      const paymentAdapter = getPaymentAdapter();
      const paymentRes = await paymentAdapter.processPayment({
        orderId,
        orderNumber,
        orderName,
        amount: finalPaymentAmount,
        buyerName,
        buyerEmail,
        buyerPhone,
        paymentMethod,
        easyPayProvider,
        useLiveTossWindow,
      });

      if (!paymentRes.success) {
        // Rollback pre-created order if user closed/cancelled Toss window
        await api.deleteOrder(orderId);
        sessionStorage.removeItem('dassoba_pending_toss_order');

        if (paymentRes.cancelled) {
          showToast('토스 결제가 취소되었습니다. 결제 수단을 다시 확인해 주세요.', 'info');
          return;
        }
        throw new Error(paymentRes.errorMessage || '토스페이먼츠 결제 처리에 실패했습니다.');
      }

      // 3. If resolved directly (e.g. instant mode or 0-won point payment), finalize order & navigate
      newOrder.payment_key = paymentRes.paymentKey;
      await api.createOrder(newOrder);

      await api.saveDelivery({
        id: `sh-${newOrder.id}`,
        order_id: newOrder.id,
        carrier: 'CJ대한통운',
        tracking_number: '',
        shipment_status: 'ready',
        memo: `토스페이먼츠 결제 완료 · 상품 준비 (${orderNumber})`,
      });

      if (usedPoints > 0 && user?.id) {
        await api.addPointTransaction({
          user_id: user.id,
          transaction_type: 'usage',
          amount: -usedPoints,
          description: `주문 결제 포인트 사용 (${orderNumber})`,
          reference_id: orderNumber,
        });
      }

      if (user?.id) {
        const rewardPoints = Math.round(finalPaymentAmount * 0.02);
        await api.addPointTransaction({
          user_id: user.id,
          transaction_type: 'purchase',
          amount: rewardPoints,
          description: `구매 적립금 지급 예정 (${orderNumber})`,
          reference_id: orderNumber,
        });
      }

      sessionStorage.removeItem('dassoba_pending_toss_order');
      clearCart();
      showToast('토스페이먼츠 결제가 성공적으로 완료되었습니다!', 'success');
      navigate(
        `/order-success/${orderNumber}?paymentKey=${encodeURIComponent(
          paymentRes.paymentKey
        )}&orderId=${encodeURIComponent(orderNumber)}&amount=${finalPaymentAmount}&method=${paymentMethod}`
      );
    } catch (err: any) {
      await api.deleteOrder(orderId);
      sessionStorage.removeItem('dassoba_pending_toss_order');
      showToast(err.message || '주문 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="mb-8 border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              CHECKOUT
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              주문 정보 및 배송지를 입력하시고 토스페이먼츠 안전 결제를 완료해 주세요.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0064FF]/10 border border-[#0064FF]/25 rounded-full text-[11px] font-bold text-[#0064FF]">
            <ShieldCheck className="w-4 h-4" />
            <span>Toss Payments 공식 전자결제 연동</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Buyer, Shipping, Coupons, Points, Payment (Cols 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Buyer Information */}
            <div className="bg-white p-6 border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100 uppercase tracking-wider">
                01. 주문 고객 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">주문자명</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">연락처</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">이메일</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Destination */}
            <div className="bg-white p-6 border border-neutral-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100 uppercase tracking-wider">
                02. 배송지 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">수령인</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">수령인 연락처</label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1 font-medium">우편번호</label>
                  <div className="flex gap-2 max-w-xs">
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                    />
                    <button
                      type="button"
                      onClick={() => showToast('기본 테스트 주소가 자동 적용되었습니다.', 'info')}
                      className="px-4 py-2 bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold shrink-0"
                    >
                      우편번호 검색
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1 font-medium">기본 주소</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900 mb-2"
                  />
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="상세 주소를 입력해 주세요 (동/호수)"
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1 font-medium">배송 요청사항</label>
                  <input
                    type="text"
                    value={deliveryMemo}
                    onChange={(e) => setDeliveryMemo(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* 3. Coupon & Points (Concurrent Application Supported) */}
            <div className="bg-white p-6 border border-neutral-200 shadow-2xs space-y-5">
              <h3 className="font-serif text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100 uppercase tracking-wider">
                03. 쿠폰 및 적립금 혜택 (동시 적용 가능)
              </h3>

              {/* Coupon Select */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                  <Tag className="w-3.5 h-3.5 text-[#721b29]" />
                  <span>할인 쿠폰 적용</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedUserCoupon?.id || ''}
                    onChange={(e) => {
                      const found = userCoupons.find((c) => c.id === e.target.value) || null;
                      setSelectedUserCoupon(found);
                    }}
                    className="flex-1 p-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="">적용 가능한 쿠폰 선택 (보유 {userCoupons.length}장)</option>
                    {userCoupons.map((uc) => (
                      <option key={uc.id} value={uc.id}>
                        {uc.coupon?.name} (
                        {uc.coupon?.discount_type === 'percentage'
                          ? `${uc.coupon?.discount_value}%`
                          : `${uc.coupon?.discount_value?.toLocaleString()}원`}
                        )
                      </option>
                    ))}
                  </select>
                  {selectedUserCoupon && (
                    <button
                      type="button"
                      onClick={() => setSelectedUserCoupon(null)}
                      className="px-3 py-2 border border-neutral-300 text-neutral-600 hover:text-black font-semibold"
                    >
                      취소
                    </button>
                  )}
                </div>
                {couponDiscount > 0 && (
                  <p className="text-[11px] text-[#721b29] font-semibold">
                    * 쿠폰 할인이 적용되어 {formatPrice(couponDiscount)}이(가) 할인되었습니다.
                  </p>
                )}
              </div>

              {/* Point Ledger Application */}
              <div className="space-y-2 text-xs pt-3 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>적립금 사용</span>
                  </div>
                  <span className="text-neutral-500">
                    보유 잔액:{' '}
                    <strong className="text-neutral-900">
                      {userPointsBalance.toLocaleString()}P
                    </strong>
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={maxUsablePoints}
                    value={pointsInput}
                    onChange={(e) => {
                      setPointsInput(e.target.value);
                      handleApplyPoints(Number(e.target.value) || 0);
                    }}
                    placeholder="0"
                    className="flex-1 p-2.5 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleUseAllPoints}
                    className="px-4 py-2 bg-neutral-900 text-white font-semibold text-xs whitespace-nowrap"
                  >
                    전액 사용
                  </button>
                </div>
                {usedPoints > 0 && (
                  <p className="text-[11px] text-amber-700 font-semibold">
                    * 적립금 {usedPoints.toLocaleString()}P가 결제 금액에서 차감되었습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 4. Toss Payments Section */}
            <div className="bg-white p-6 border-2 border-[#0064FF]/30 shadow-sm space-y-5 rounded-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#0064FF] text-white flex items-center justify-center font-black text-sm shadow-xs">
                    T
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-black text-neutral-900 flex items-center gap-2">
                      <span>04. 토스페이먼츠 결제수단 선택</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#0064FF] text-white rounded-full">
                        TOSS PAYMENTS
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-500">
                      토스페이, 신용/체크카드, 카카오·네이버페이, 계좌이체, 가상계좌를 지원합니다.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowKeyConfig(!showKeyConfig)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xs transition-colors"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>PG 키 설정</span>
                </button>
              </div>

              {/* Optional Toss Client Key Configuration Panel */}
              {showKeyConfig && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#0064FF]" />
                      토스페이먼츠 클라이언트 키 (Client Key)
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {tossSdkLoaded ? '● Toss SDK 로드 완료' : '○ SDK 로딩 중'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    기본값으로 토스페이먼츠 공식 테스트 키(<code>{DEFAULT_TOSS_CLIENT_KEY}</code>)가
                    적용되어 있어 즉시 실제 토스 결제창을 띄울 수 있습니다. 본인 상점 키가 있다면 아래에 입력해 주세요.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customClientKey}
                      onChange={(e) => setCustomClientKey(e.target.value)}
                      placeholder="test_ck_... 또는 live_ck_..."
                      className="flex-1 p-2 border border-slate-300 bg-white text-neutral-900 font-mono text-xs focus:outline-none focus:border-[#0064FF]"
                    />
                    <button
                      type="button"
                      onClick={handleSaveClientKey}
                      className="px-3.5 py-2 bg-[#0064FF] text-white font-bold text-xs hover:bg-[#0050CC]"
                    >
                      적용하기
                    </button>
                    <button
                      type="button"
                      onClick={handleResetClientKey}
                      className="px-3 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 inline-flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      공식 테스트키 복원
                    </button>
                  </div>
                </div>
              )}

              {/* Toss Payment Method Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    id: 'tosspay',
                    label: '토스페이',
                    sub: '토스 앱 1초 간편결제',
                    badge: '추천',
                    icon: Wallet,
                  },
                  {
                    id: 'credit_card',
                    label: '신용·체크카드',
                    sub: '전 카드사 / 앱카드',
                    badge: '무이자',
                    icon: CreditCard,
                  },
                  {
                    id: 'easy_pay',
                    label: '간편결제 허브',
                    sub: '카카오·네이버·페이코',
                    badge: '인기',
                    icon: Sparkles,
                  },
                  {
                    id: 'transfer',
                    label: '실시간 계좌이체',
                    sub: '은행 계좌 즉시 출금',
                    icon: Building2,
                  },
                  {
                    id: 'vbank',
                    label: '가상계좌 (무통장)',
                    sub: '전용 입금계좌 발급',
                    icon: Building2,
                  },
                  {
                    id: 'mobile',
                    label: '휴대폰 결제',
                    sub: '통신사 소액결제',
                    icon: Smartphone,
                  },
                ].map((m) => {
                  const Icon = m.icon;
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`relative p-3.5 text-left border transition-all flex flex-col justify-between gap-2 rounded-xs ${
                        active
                          ? 'border-[#0064FF] bg-[#0064FF]/5 text-neutral-950 ring-1 ring-[#0064FF]'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon
                          className={`w-4 h-4 ${
                            active ? 'text-[#0064FF]' : 'text-neutral-400'
                          }`}
                        />
                        {m.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${
                              active
                                ? 'bg-[#0064FF] text-white'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-neutral-900">{m.label}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">{m.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Easy pay sub-options when easy_pay is selected */}
              {paymentMethod === 'easy_pay' && (
                <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2.5 rounded-xs">
                  <span className="text-xs font-bold text-neutral-800 block">
                    간편결제 지갑 선택 (토스페이먼츠 통합창 연동)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'tosspay', label: '토스페이', color: 'border-[#0064FF] text-[#0064FF]' },
                      { id: 'kakaopay', label: '카카오페이', color: 'border-amber-500 text-amber-900' },
                      { id: 'naverpay', label: '네이버페이', color: 'border-emerald-600 text-emerald-700' },
                      { id: 'payco', label: '페이코 (PAYCO)', color: 'border-rose-600 text-rose-700' },
                    ].map((ep) => (
                      <button
                        type="button"
                        key={ep.id}
                        onClick={() => setEasyPayProvider(ep.id as any)}
                        className={`px-3 py-2 text-xs font-bold border transition-all rounded-xs ${
                          easyPayProvider === ep.id
                            ? 'bg-[#0064FF] text-white border-[#0064FF] shadow-2xs'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                        }`}
                      >
                        {ep.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toss Execution Mode Selector (Real Toss SDK Popup vs 1-Click Instant Test) */}
              <div className="p-4 bg-[#0064FF]/5 border border-[#0064FF]/20 rounded-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    토스페이먼츠 결제 실행 방식
                  </span>
                  <span className="text-[10px] font-bold text-[#0064FF]">
                    Supabase 주문 테이블 자동 연동
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setUseLiveTossWindow(true)}
                    className={`p-3 border text-left rounded-xs transition-all flex items-start gap-2.5 ${
                      useLiveTossWindow
                        ? 'border-[#0064FF] bg-white shadow-2xs ring-1 ring-[#0064FF]'
                        : 'border-neutral-200 bg-white/60 text-neutral-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        useLiveTossWindow ? 'border-[#0064FF] bg-[#0064FF] text-white' : 'border-neutral-400'
                      }`}
                    >
                      {useLiveTossWindow && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">
                        실제 토스페이먼츠 결제창 띄우기 (기본)
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        공식 Toss Payments SDK 결제창을 호출하여 카드/토스페이 인증을 진행합니다.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseLiveTossWindow(false)}
                    className={`p-3 border text-left rounded-xs transition-all flex items-start gap-2.5 ${
                      !useLiveTossWindow
                        ? 'border-[#0064FF] bg-white shadow-2xs ring-1 ring-[#0064FF]'
                        : 'border-neutral-200 bg-white/60 text-neutral-600'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        !useLiveTossWindow ? 'border-[#0064FF] bg-[#0064FF] text-white' : 'border-neutral-400'
                      }`}
                    >
                      {!useLiveTossWindow && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900">
                        토스 원클릭 즉시 승인 (빠른 테스트)
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        앱 인증 절차를 생략하고 즉시 승인키를 발급하여 주문/DB 저장을 완료합니다.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column (Cols 4) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-neutral-200 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-serif text-lg font-bold text-neutral-950 pb-3 border-b border-neutral-200">
                최종 결제 금액
              </h3>

              {/* Items Mini List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs py-1 border-b border-neutral-100"
                  >
                    <span className="text-neutral-700 truncate max-w-[180px]">
                      {item.product.name} ({item.quantity}개)
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(
                        (item.product.sale_price + (item.variant.additional_price || 0)) *
                          item.quantity
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 text-xs pt-2">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>총 상품금액</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(totalProductAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600">
                  <span>배송비</span>
                  <span>{deliveryFee === 0 ? '무료' : formatPrice(deliveryFee)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-[#721b29]">
                    <span>쿠폰 할인</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                {usedPoints > 0 && (
                  <div className="flex items-center justify-between text-amber-700">
                    <span>적립금 사용</span>
                    <span className="font-semibold">-{formatPrice(usedPoints)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-200 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-neutral-950">최종 결제금액</span>
                  <span className="text-2xl font-black text-[#0064FF]">
                    {formatPrice(finalPaymentAmount)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#0064FF] hover:bg-[#0050CC] disabled:bg-neutral-400 text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-md rounded-xs cursor-pointer"
              >
                {isProcessing ? (
                  <span>토스페이먼츠 결제창 연결 중...</span>
                ) : (
                  <>
                    <span className="w-5 h-5 rounded-full bg-white text-[#0064FF] font-black text-xs flex items-center justify-center">
                      T
                    </span>
                    <span>{formatPrice(finalPaymentAmount)} 토스 결제하기</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-neutral-400 leading-normal space-y-1">
                <p>구매조건을 확인하였으며, 토스페이먼츠 전자결제 진행에 동의합니다.</p>
                <p className="text-[#0064FF] font-semibold">
                  🔒 토스페이먼츠 안전결제 (SSL 암호화 전송 적용)
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

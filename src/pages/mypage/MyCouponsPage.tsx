import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { UserCoupon, Coupon } from '@/types/database.types';
import { INITIAL_COUPONS } from '@/mock/mockData';
import { Tag, Sparkles, Check, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const MyCouponsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [couponCodeInput, setCouponCodeInput] = useState('');

  useEffect(() => {
    if (user?.id) {
      api.getUserCoupons(user.id).then(setCoupons);
    }
  }, [user]);

  const handleRegisterCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    const found = INITIAL_COUPONS.find(
      (c) => c.code.toLowerCase() === couponCodeInput.trim().toLowerCase()
    );

    if (found) {
      const newUc: UserCoupon = {
        id: `uc-${Date.now()}`,
        user_id: user?.id || 'guest',
        coupon_id: found.id,
        coupon: found,
        is_used: false,
        issued_at: new Date().toISOString(),
        expires_at: found.valid_until,
      };
      setCoupons((prev) => [newUc, ...prev]);
      setCouponCodeInput('');
      showToast(`'${found.name}' 쿠폰이 정상 등록되었습니다!`, 'success');
    } else {
      showToast('유효하지 않거나 만료된 쿠폰 번호입니다.', 'error');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="font-serif text-xl font-bold text-neutral-900">쿠폰함</h2>
        <p className="text-xs text-neutral-500 mt-1">
          보유하신 할인 쿠폰과 신규 발급 가능한 혜택 목록입니다.
        </p>
      </div>

      {/* Coupon Code Register Form */}
      <form onSubmit={handleRegisterCode} className="p-4 bg-neutral-50 border border-neutral-200 flex gap-2">
        <input
          type="text"
          value={couponCodeInput}
          onChange={(e) => setCouponCodeInput(e.target.value)}
          placeholder="쿠폰 시리얼 번호 입력 (예: WELCOME10, DASSOBA5000)"
          className="flex-1 p-2.5 bg-white border border-neutral-300 text-xs focus:outline-none focus:border-neutral-900 font-mono uppercase"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-neutral-900 text-white font-bold text-xs uppercase"
        >
          쿠폰 등록
        </button>
      </form>

      {/* Available Coupons Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
          사용 가능한 쿠폰 ({coupons.filter((c) => !c.is_used).length}장)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((uc) => (
            <div
              key={uc.id}
              className={`p-5 border relative overflow-hidden transition-all ${
                uc.is_used
                  ? 'border-neutral-200 bg-neutral-100/50 opacity-60'
                  : 'border-neutral-300 bg-white shadow-2xs hover:border-neutral-900'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#721b29]">
                  {uc.coupon?.discount_type === 'percentage'
                    ? 'DISCOUNT %'
                    : uc.coupon?.discount_type === 'free_shipping'
                    ? 'FREE DELIVERY'
                    : 'CASH COUPON'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 ${
                    uc.is_used ? 'bg-neutral-200 text-neutral-600' : 'bg-neutral-900 text-white'
                  }`}
                >
                  {uc.is_used ? '사용완료' : '사용가능'}
                </span>
              </div>

              <div className="text-2xl font-black text-neutral-950 mb-1">
                {uc.coupon?.discount_type === 'percentage'
                  ? `${uc.coupon?.discount_value}%`
                  : uc.coupon?.discount_type === 'free_shipping'
                  ? '배송비 무료'
                  : formatPrice(uc.coupon?.discount_value || 0)}
              </div>

              <h4 className="text-xs font-bold text-neutral-800 mb-1">{uc.coupon?.name}</h4>
              <p className="text-[11px] text-neutral-500 mb-3">{uc.coupon?.description}</p>

              <div className="pt-3 border-t border-dashed border-neutral-200 text-[10px] text-neutral-400">
                유효기간: {uc.expires_at.split('T')[0]} 까지
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useNavigate } from 'react-router-dom';

export const MyProfileEditPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '김다써');
  const [phone, setPhone] = useState(user?.phone || '010-9876-5432');
  const [birthday, setBirthday] = useState(user?.birthday || '1992-05-18');
  const [marketingConsent, setMarketingConsent] = useState(user?.marketing_consent ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      name,
      phone,
      birthday,
      marketing_consent: marketingConsent,
    });
    setIsSaving(false);
    showToast('회원 정보가 성공적으로 수정되었습니다.', 'success');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        '정말로 회원 탈퇴하시겠습니까? 탈퇴 시 보유하신 적립금과 쿠폰은 즉시 소멸되며 복구되지 않습니다.'
      )
    ) {
      logout();
      showToast('회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.', 'info');
      navigate('/');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="font-serif text-xl font-bold text-neutral-900">회원정보 수정</h2>
        <p className="text-xs text-neutral-500 mt-1">
          기본 회원 정보 및 혜택 알림 수신 여부를 변경하실 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs max-w-lg">
        <div>
          <label className="block text-neutral-500 mb-1 font-semibold">아이디</label>
          <input
            type="text"
            disabled
            value={user?.login_id || 'vipuser'}
            className="w-full p-2.5 bg-neutral-100 border border-neutral-200 text-neutral-500 font-mono cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-neutral-500 mb-1 font-semibold">이메일</label>
          <input
            type="email"
            disabled
            value={user?.email || 'vip@dassoba.kr'}
            className="w-full p-2.5 bg-neutral-100 border border-neutral-200 text-neutral-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-neutral-700 mb-1 font-semibold">이름</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label className="block text-neutral-700 mb-1 font-semibold">휴대폰 번호</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label className="block text-neutral-700 mb-1 font-semibold">생년월일</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-2.5 border border-neutral-300 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="pt-2 border-t border-neutral-100">
          <label className="flex items-center gap-2 cursor-pointer text-neutral-800">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="accent-neutral-900"
            />
            <span>신상품 할인 및 VIP 이벤트 혜택 알림 수신 동의</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 bg-neutral-900 text-white font-bold text-xs uppercase hover:bg-neutral-800 transition-colors"
        >
          {isSaving ? '저장 중...' : '회원정보 수정 완료'}
        </button>
      </form>

      {/* Account Deletion Area */}
      <div className="pt-8 border-t border-neutral-200">
        <h4 className="font-bold text-xs text-neutral-800 mb-1">회원 탈퇴</h4>
        <p className="text-[11px] text-neutral-400 mb-3">
          회원 탈퇴 시 모든 구매 데이터, 보유 쿠폰 및 적립금은 영구히 삭제됩니다.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
        >
          회원 탈퇴 신청
        </button>
      </div>
    </div>
  );
};

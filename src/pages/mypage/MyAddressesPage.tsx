import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UserAddress } from '@/types/database.types';
import { MapPin, Plus, Check } from 'lucide-react';

export const MyAddressesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<UserAddress[]>([
    {
      id: 'addr-01',
      user_id: user?.id || 'u-vip',
      address_name: '자택 (기본배송지)',
      recipient_name: user?.name || '김다써',
      recipient_phone: user?.phone || '010-9876-5432',
      postal_code: '04399',
      address_line1: '서울시 용산구 한남대로 91',
      address_line2: '102동 1502호',
      is_default: true,
      delivery_memo: '부재 시 문 앞에 놓아주세요.',
    },
    {
      id: 'addr-02',
      user_id: user?.id || 'u-vip',
      address_name: '회사',
      recipient_name: user?.name || '김다써',
      recipient_phone: user?.phone || '010-9876-5432',
      postal_code: '06134',
      address_line1: '서울시 강남구 테헤란로 152',
      address_line2: '12층 디자인랩',
      is_default: false,
      delivery_memo: '경비실에 맡겨주세요.',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addressName, setAddressName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      user_id: user?.id || 'u-vip',
      address_name: addressName || '배송지',
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      postal_code: postalCode,
      address_line1: addressLine1,
      address_line2: addressLine2,
      is_default: false,
    };
    setAddresses([...addresses, newAddr]);
    setShowAddModal(false);
    showToast('새 배송지가 등록되었습니다.', 'success');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
    showToast('기본 배송지가 변경되었습니다.', 'info');
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">배송지 관리</h2>
          <p className="text-xs text-neutral-500 mt-1">
            자주 사용하는 배송지를 등록하고 기본 배송지를 설정하세요.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs uppercase flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> 새 배송지 추가
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 border relative space-y-2 ${
              addr.is_default
                ? 'border-neutral-900 bg-neutral-50/50 ring-1 ring-neutral-900'
                : 'border-neutral-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 text-sm">
                {addr.address_name}
              </span>
              {addr.is_default ? (
                <span className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] font-bold">
                  기본 배송지
                </span>
              ) : (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-[11px] text-neutral-500 hover:text-black font-semibold underline"
                >
                  기본 배송지로 설정
                </button>
              )}
            </div>

            <div className="text-neutral-700">
              <strong className="text-neutral-900">{addr.recipient_name}</strong> |{' '}
              {addr.recipient_phone}
            </div>

            <div className="text-neutral-600 leading-relaxed">
              ({addr.postal_code}) {addr.address_line1} {addr.address_line2}
            </div>

            {addr.delivery_memo && (
              <p className="text-[11px] text-neutral-400">요청사항: {addr.delivery_memo}</p>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white max-w-md w-full p-6 border border-neutral-200 shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-4">새 배송지 등록</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">배송지명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 자택, 회사, 부모님댁"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">수령인</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">연락처</label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">우편번호</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">기본 주소</label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300 mb-2"
                />
                <input
                  type="text"
                  placeholder="상세 주소"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full p-2.5 border border-neutral-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-300"
                >
                  취소
                </button>
                <button type="submit" className="px-4 py-2 bg-neutral-900 text-white font-bold">
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

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Inquiry } from '@/types/database.types';

export const MyInquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: 'inq-01',
      user_id: user?.id || 'u-vip',
      category: 'shipping',
      title: '배송지 변경 요청 드립니다.',
      content: '주문한 코트 출고 전인데 배송지 호수를 1502호에서 1503호로 변경 가능한가요?',
      status: 'answered',
      admin_reply: '안녕하세요 고객님! 출고 전 확인되어 1503호로 안전하게 변경 접수되었습니다. 감사합니다.',
      created_at: '2026-10-04T11:00:00Z',
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<'product' | 'shipping' | 'exchange_return' | 'refund' | 'general'>('shipping');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInq: Inquiry = {
      id: `inq-${Date.now()}`,
      user_id: user?.id || 'u-vip',
      category,
      title,
      content,
      status: 'submitted',
      created_at: new Date().toISOString(),
    };
    setInquiries([newInq, ...inquiries]);
    setShowModal(false);
    setTitle('');
    setContent('');
    showToast('1:1 문의가 접수되었습니다. 신속하게 답변해 드리겠습니다.', 'success');
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900">1:1 맞춤 상담 내역</h2>
          <p className="text-xs text-neutral-500 mt-1">
            문의하신 내용에 대해 전문 상담원이 성심성의껏 답변드립니다.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs uppercase"
        >
          1:1 문의하기
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {inquiries.map((inq) => (
          <div key={inq.id} className="p-5 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-bold text-neutral-800">
                [{inq.category === 'shipping' ? '배송문의' : '일반문의'}] {inq.title}
              </span>
              <span
                className={`px-2 py-0.5 font-bold ${
                  inq.status === 'answered'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {inq.status === 'answered' ? '답변완료' : '접수대기'}
              </span>
            </div>
            <p className="text-neutral-700 leading-relaxed">{inq.content}</p>
            {inq.admin_reply && (
              <div className="mt-3 p-3.5 bg-neutral-50 border-l-2 border-neutral-900 text-[11px] text-neutral-600">
                <span className="font-bold text-neutral-900 block mb-1">고객센터 답변:</span>
                {inq.admin_reply}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white max-w-md w-full p-6 border border-neutral-200 shadow-2xl">
            <h3 className="font-serif text-lg font-bold mb-4">1:1 문의 등록</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">문의 유형</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-neutral-300"
                >
                  <option value="shipping">배송문의</option>
                  <option value="product">상품문의</option>
                  <option value="exchange_return">교환/반품문의</option>
                  <option value="refund">환불문의</option>
                  <option value="general">기타문의</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">제목</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요"
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">문의 내용</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="상세한 문의 내용을 남겨주세요."
                  className="w-full p-2.5 border border-neutral-300 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-300 font-semibold"
                >
                  취소
                </button>
                <button type="submit" className="px-4 py-2 bg-neutral-900 text-white font-bold">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

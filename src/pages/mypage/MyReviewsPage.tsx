import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { Review } from '@/types/database.types';
import { Star, CheckCircle, Trash2, Edit3 } from 'lucide-react';

export const MyReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'written' | 'available'>('written');

  useEffect(() => {
    if (user?.id) {
      api.getReviews().then((all) => {
        setReviews(all.filter((r) => r.user_id === user.id));
      });
    }
  }, [user]);

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('리뷰가 삭제되었습니다.', 'info');
  };

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="font-serif text-xl font-bold text-neutral-900">상품 리뷰 관리</h2>
        <p className="text-xs text-neutral-500 mt-1">
          일반 리뷰 작성 시 500P, 포토 리뷰 작성 시 1,000P가 즉시 적립됩니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('written')}
          className={`pb-3 ${
            activeTab === 'written'
              ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold -mb-[1px]'
              : 'text-neutral-400 hover:text-black'
          }`}
        >
          내가 작성한 리뷰 ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 ${
            activeTab === 'available'
              ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold -mb-[1px]'
              : 'text-neutral-400 hover:text-black'
          }`}
        >
          작성 가능한 리뷰 (1)
        </button>
      </div>

      {/* Written reviews */}
      {activeTab === 'written' ? (
        reviews.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            작성하신 상품평이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 border border-neutral-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-neutral-200 text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-neutral-400">• {rev.created_at.split('T')[0]}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 인증구매
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-neutral-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-neutral-900">{rev.product_name}</h4>
                <p className="text-neutral-700 leading-relaxed">{rev.content}</p>

                {rev.admin_reply && (
                  <div className="p-3 bg-neutral-50 border-l-2 border-neutral-900 text-[11px] text-neutral-600">
                    <span className="font-bold text-neutral-900 block mb-0.5">
                      DASSOBA 관리자 답변:
                    </span>
                    {rev.admin_reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="p-5 border border-neutral-200 text-xs flex items-center justify-between">
          <div>
            <span className="text-neutral-400 text-[11px] block">주문번호 ORD-20261005-94821</span>
            <h4 className="font-bold text-neutral-900 mt-0.5">
              오버사이즈 울 캐시미어 싱글 코트 (Black / L)
            </h4>
            <span className="text-[11px] text-[#721b29] font-semibold">
              포토 리뷰 작성 시 최대 1,000P 지급
            </span>
          </div>
          <button
            onClick={() => showToast('리뷰 작성 모달을 엽니다.', 'info')}
            className="px-4 py-2 bg-neutral-900 text-white font-bold"
          >
            리뷰 쓰기
          </button>
        </div>
      )}
    </div>
  );
};

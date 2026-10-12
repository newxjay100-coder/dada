import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Review } from '@/types/database.types';
import { Star, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [onlyPhoto, setOnlyPhoto] = useState(false);
  const [starFilter, setStarFilter] = useState<number>(0);

  useEffect(() => {
    api.getReviews().then(setReviews);
  }, []);

  const filtered = reviews.filter((r) => {
    if (onlyPhoto && !r.is_photo) return false;
    if (starFilter > 0 && r.rating !== starFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            REAL CUSTOMER SATISFACTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 tracking-tight">
            구매 고객 리얼 리뷰 ({reviews.length})
          </h1>
          <p className="text-xs text-neutral-500">
            실제 구매 고객님들이 솔직하게 남겨주신 실착 핏과 만족도 후기입니다.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#faf9f6] border border-neutral-200 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyPhoto(!onlyPhoto)}
              className={`px-3 py-1.5 border flex items-center gap-1.5 transition-colors font-medium ${
                onlyPhoto
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>포토 리뷰만 모아보기</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-neutral-500 mr-2">별점 필터:</span>
            {[0, 5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setStarFilter(star)}
                className={`px-2.5 py-1 border transition-colors ${
                  starFilter === star
                    ? 'bg-neutral-900 text-white border-neutral-900 font-bold'
                    : 'bg-white text-neutral-700 border-neutral-300'
                }`}
              >
                {star === 0 ? '전체' : `★ ${star}점`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="p-6 border border-neutral-200 bg-white hover:border-neutral-900 transition-all flex flex-col justify-between shadow-2xs space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 text-xs">{rev.user_name}</span>
                    <Badge variant="secondary" className="text-[9px]">
                      {rev.user_grade || 'BRONZE'}
                    </Badge>
                    <span className="text-neutral-400 text-[11px]">
                      {rev.created_at.split('T')[0]}
                    </span>
                  </div>
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
                </div>

                <div className="text-xs font-bold text-neutral-600">
                  {rev.product_name}
                </div>

                {rev.images && rev.images[0] && (
                  <div className="aspect-16/9 w-full bg-neutral-100 overflow-hidden border border-neutral-100">
                    <img
                      src={rev.images[0]}
                      alt="리뷰 사진"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <p className="text-xs text-neutral-800 leading-relaxed font-normal">
                  {rev.content}
                </p>

                {rev.fit_feedback && (
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-700">사이즈 피드백:</span>
                    <span>{rev.fit_feedback}</span>
                  </div>
                )}

                {rev.admin_reply && (
                  <div className="p-3 bg-neutral-50 border-l-2 border-[#721b29] text-[11px] text-neutral-600">
                    <span className="font-bold text-neutral-900 block mb-0.5">
                      DASSOBA 공식 답변:
                    </span>
                    {rev.admin_reply}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" /> 검증된 구매평
                </span>
                <span>+{rev.points_awarded}P 적립 완료</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

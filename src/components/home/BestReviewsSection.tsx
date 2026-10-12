import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '@/mock/mockData';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';

export const BestReviewsSection: React.FC = () => {
  const reviews = INITIAL_REVIEWS.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-1">
              VERIFIED SATISFACTION
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              BEST REAL REVIEWS
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              실제 구매 고객님들이 직접 남겨주신 솔직한 스타일 후기입니다.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-[#721b29] border-b border-neutral-900 pb-0.5"
          >
            포토 리뷰 전체보기 <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col border border-neutral-200 bg-white p-5 hover:border-neutral-900 transition-all duration-300 shadow-2xs group"
            >
              {/* Photo if available */}
              {rev.images && rev.images[0] && (
                <div className="aspect-4/3 w-full overflow-hidden bg-neutral-100 mb-4">
                  <img
                    src={rev.images[0]}
                    alt={rev.product_name || '리뷰 이미지'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Stars & Rating */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-0.5">
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
                <span className="text-[10px] text-neutral-400">
                  {rev.created_at.split('T')[0]}
                </span>
              </div>

              {/* Product Name */}
              <span className="text-[11px] font-semibold text-neutral-500 line-clamp-1 mb-2">
                {rev.product_name}
              </span>

              {/* Review Content */}
              <p className="text-xs text-neutral-800 leading-relaxed line-clamp-3 mb-4 font-normal flex-1">
                {rev.content}
              </p>

              {/* Author & Verified */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 mt-auto">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-neutral-800">{rev.user_name}</span>
                  {rev.user_grade && (
                    <Badge variant="secondary" className="text-[9px] py-0 px-1">
                      {rev.user_grade}
                    </Badge>
                  )}
                </div>
                {rev.is_verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                    <CheckCircle className="w-3 h-3" /> 구매인증
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

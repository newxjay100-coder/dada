import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_REVIEWS } from '@/mock/mockData';
import { Star, CheckCircle, ArrowRight, MessageSquareQuote } from 'lucide-react';

export const BestReviewsSection: React.FC = () => {
  const reviews = INITIAL_REVIEWS.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-[#07070e] border-b border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[11px] font-mono font-black tracking-widest uppercase text-cyan-400 flex items-center gap-1.5 mb-1">
              <MessageSquareQuote className="w-3.5 h-3.5 text-cyan-400" />
              VERIFIED_FEEDBACK // 100% REAL
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.3)]">
              BEST REAL REVIEWS
            </h2>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              실제 구매 고객님들이 직접 촬영하여 남겨주신 솔직한 스트릿 핏 후기입니다.
            </p>
          </div>

          <Link
            to="/reviews"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-white transition-colors bg-[#0e0e1a] px-4 py-2 border border-cyan-500/30 rounded"
          >
            <span>포토 리뷰 전체보기 (PHOTO_STREAM)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col border border-cyan-500/20 bg-[#0e0e1a] hover:border-cyan-400 p-5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] group"
            >
              {/* Photo if available */}
              {rev.images && rev.images[0] && (
                <div className="aspect-4/3 w-full overflow-hidden bg-neutral-950 rounded-lg mb-4 relative">
                  <img
                    src={rev.images[0]}
                    alt={rev.product_name || '리뷰 이미지'}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Rating & Author */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-neutral-700 text-neutral-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300">
                  <CheckCircle className="w-3 h-3 text-cyan-400" />
                  <span>인증구매</span>
                </div>
              </div>

              {/* Product Name */}
              {rev.product_name && (
                <span className="text-[11px] font-mono text-neutral-400 truncate mb-1">
                  {rev.product_name}
                </span>
              )}

              {/* Review Text */}
              <p className="text-xs text-neutral-200 line-clamp-3 leading-relaxed mb-4 flex-1">
                "{rev.content}"
              </p>

              {/* Reviewer Details */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span className="text-neutral-300 font-bold">{rev.user_name || 'VIP 회원'}</span>
                <span>{rev.created_at?.slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

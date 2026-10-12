import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Sparkles, Zap, Flame, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/database.types';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  rank?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, rank }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col bg-[#0e0e1a] border border-cyan-500/20 hover:border-cyan-400/80 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] hover:-translate-y-1">
      {/* Tech Corner HUD Marks */}
      <span className="absolute top-1.5 left-1.5 z-20 text-[9px] font-mono text-cyan-400/40 pointer-events-none group-hover:text-cyan-400 transition-colors">
        +
      </span>
      <span className="absolute bottom-1.5 right-1.5 z-20 text-[9px] font-mono text-pink-400/40 pointer-events-none group-hover:text-pink-400 transition-colors">
        +
      </span>

      {/* Product Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-3/4 w-full overflow-hidden bg-neutral-950"
      >
        <img
          src={product.primary_image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
        />

        {/* Cyber Neon Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1a] via-transparent to-cyan-500/10 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Ranking Badge if provided */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 z-10 bg-black/85 backdrop-blur-md border border-cyan-400 text-cyan-300 font-mono font-black text-xs px-2.5 py-1 rounded shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            #{String(rank).padStart(2, '0')}
          </div>
        )}

        {/* Cyber Feature Badges */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end pointer-events-none">
          {product.is_one_plus_one && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-mono font-black bg-yellow-950/90 text-yellow-300 border border-yellow-400 rounded shadow-[0_0_8px_rgba(250,204,21,0.5)]">
              <Zap className="w-2.5 h-2.5" /> 1+1 DUAL
            </span>
          )}
          {product.is_new && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-mono font-black bg-cyan-950/90 text-cyan-300 border border-cyan-400 rounded shadow-[0_0_8px_rgba(0,240,255,0.5)]">
              <Sparkles className="w-2.5 h-2.5" /> NEW DROP
            </span>
          )}
          {product.is_best && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-mono font-black bg-pink-950/90 text-pink-300 border border-pink-500 rounded shadow-[0_0_8px_rgba(255,0,127,0.5)]">
              <Flame className="w-2.5 h-2.5" /> BEST TOP
            </span>
          )}
        </div>

        {/* Wishlist Button (Cyber Glow Heart) */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? '찜 해제' : '찜하기'}
          className={`absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-115 ${
            wishlisted
              ? 'bg-pink-950/90 border border-pink-500 shadow-[0_0_12px_rgba(255,0,127,0.7)]'
              : 'bg-black/70 border border-white/20 text-neutral-300 hover:border-pink-400 hover:text-pink-400'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-[#ff007f] text-[#ff007f]' : 'text-neutral-300'
            }`}
          />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-1 bg-gradient-to-b from-[#0e0e1a] to-[#090913]">
        {/* Brand Name */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
          <span>{product.brand?.english_name || 'DASSOBA // 2077'}</span>
          <span className="text-[9px] text-neutral-500">K-STREET</span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="text-xs sm:text-sm font-semibold text-neutral-100 line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors mb-2 min-h-8"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-2">
            {product.discount_rate > 0 && (
              <span className="text-sm sm:text-base font-mono font-black text-[#ff007f] drop-shadow-[0_0_8px_rgba(255,0,127,0.5)]">
                {product.discount_rate}%
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-white font-mono">
              {formatPrice(product.sale_price)}
            </span>
            {product.discount_rate > 0 && (
              <span className="text-[11px] font-mono text-neutral-500 line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>

          {/* Cyber Card Footer: Rating & Badges */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px] text-neutral-400 font-mono">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-white">{product.rating_avg}</span>
              <span className="text-neutral-500">({product.review_count})</span>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-cyan-400/80">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              <span>정품보증</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

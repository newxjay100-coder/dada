import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Product } from '@/types/database.types';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';
import { Badge } from './Badge';

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
    <div className="group relative flex flex-col bg-white overflow-hidden transition-all duration-300">
      {/* Product Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-3/4 w-full overflow-hidden bg-neutral-100"
      >
        <img
          src={product.primary_image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ranking Badge if provided */}
        {rank !== undefined && (
          <div className="absolute top-0 left-0 bg-neutral-900 text-white font-serif font-black text-sm px-3 py-1.5 shadow-md">
            {rank}
          </div>
        )}

        {/* Feature Badges Container */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end pointer-events-none">
          {product.is_one_plus_one && (
            <Badge variant="burgundy">1+1</Badge>
          )}
          {product.is_new && (
            <Badge variant="primary">NEW</Badge>
          )}
          {product.is_best && (
            <Badge variant="secondary">BEST</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? '찜 해제' : '찜하기'}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-[#721b29] text-[#721b29]' : 'text-neutral-700 hover:text-black'
            }`}
          />
        </button>
      </Link>

      {/* Product Info */}
      <div className="pt-3 pb-2 flex flex-col flex-1">
        {/* Brand Name */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
          {product.brand?.english_name || 'DASSOBA'}
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="text-xs sm:text-sm font-medium text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#721b29] transition-colors mb-2 min-h-8"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5">
            {product.discount_rate > 0 && (
              <span className="text-sm sm:text-base font-extrabold text-[#721b29]">
                {product.discount_rate}%
              </span>
            )}
            <span className="text-sm sm:text-base font-bold text-neutral-900">
              {formatPrice(product.sale_price)}
            </span>
            {product.discount_rate > 0 && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>

          {/* Rating & Badges */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-500">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-neutral-700">{product.rating_avg}</span>
              <span>({product.review_count})</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-neutral-400">쿠폰</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-400">적립</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

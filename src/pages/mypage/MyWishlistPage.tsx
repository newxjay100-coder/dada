import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { api } from '@/services/api';
import { Product } from '@/types/database.types';
import { ProductCard } from '@/components/common/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const MyWishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then((all) => {
      setProducts(all.filter((p) => wishlistIds.includes(p.id)));
      setLoading(false);
    });
  }, [wishlistIds]);

  return (
    <div className="bg-white p-6 sm:p-8 border border-neutral-200 shadow-2xs space-y-6">
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="font-serif text-xl font-bold text-neutral-900">찜한 상품</h2>
        <p className="text-xs text-neutral-500 mt-1">
          마음에 들어 저장해두신 위시리스트 상품 ({products.length}개)
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-neutral-400">불러오는 중...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Heart className="w-6 h-6" />
          </div>
          <p className="text-xs text-neutral-500">찜한 상품이 없습니다.</p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

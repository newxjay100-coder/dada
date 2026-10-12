import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  totalWishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'dassoba_wishlist_ids';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['prod-01', 'prod-05', 'prod-09'];
    } catch {
      return ['prod-01', 'prod-05', 'prod-09'];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Sync with Supabase wishlists table
  useEffect(() => {
    if (isSupabaseConfigured) {
      api.getWishlist('u-vip').then((ids) => {
        if (ids && ids.length > 0) {
          setWishlistIds(ids);
        } else {
          // Initialize default 3 items in Supabase
          ['prod-01', 'prod-05', 'prod-09'].forEach((id) => api.addToWishlist('u-vip', id));
        }
      });
    }
  }, []);

  const toggleWishlist = (productId: string) => {
    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    if (isCurrentlyWishlisted) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      if (isSupabaseConfigured) {
        api.removeFromWishlist('u-vip', productId);
      }
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      if (isSupabaseConfigured) {
        api.addToWishlist('u-vip', productId);
      }
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        totalWishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}

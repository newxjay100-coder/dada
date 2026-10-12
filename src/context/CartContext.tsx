import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types/database.types';

import { api } from '@/services/api';
import { isSupabaseConfigured } from '@/lib/supabase';

export interface CartItem {
  id: string; // unique item id (e.g. `${product.id}-${variant.id}`)
  product: Product;
  variant: ProductVariant;
  quantity: number;
  isSelected: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelect: (itemId: string) => void;
  selectAll: (selected: boolean) => void;
  clearSelected: () => void;
  clearCart: () => void;
  totalItemsCount: number;
  selectedItemsCount: number;
  totalProductAmount: number;
  deliveryFee: number;
  totalRegularAmount: number;
  totalDiscountAmount: number;
  finalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'dassoba_cart_items';

const getInitialCartItems = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}

  // Initial 3 items to match header badge (3)
  return [
    {
      id: 'prod-01-v1',
      product: {
        id: 'prod-01',
        sku: 'P2026-FW-001',
        name: '오버사이즈 울 블렌드 더블 코트',
        cost_price: 180000,
        regular_price: 490000,
        sale_price: 441000,
        discount_rate: 10,
        tax_type: 'taxable',
        status: 'active',
        primary_image: '/images/products/prod_01_wool_coat.jpg',
        is_one_plus_one: false,
        is_new: true,
        is_best: true,
        view_count: 1420,
        sale_count: 312,
        rating_avg: 4.9,
        review_count: 84,
        description: '최상급 울 블렌드 소재의 오버핏 더블 코트',
        created_at: new Date().toISOString(),
      },
      variant: {
        id: 'v1',
        product_id: 'prod-01',
        variant_sku: 'P2026-FW-001-BLK-L',
        color: '블랙',
        color_code: '#000000',
        size: 'L',
        additional_price: 0,
        stock_quantity: 45,
        status: 'active',
      },
      quantity: 1,
      isSelected: true,
    },
    {
      id: 'prod-02-v1',
      product: {
        id: 'prod-02',
        sku: 'P2026-FW-002',
        name: '사이버 펑크 데미지 그런지 니트',
        cost_price: 65000,
        regular_price: 220000,
        sale_price: 198000,
        discount_rate: 10,
        tax_type: 'taxable',
        status: 'active',
        primary_image: '/images/products/prod_02_damage_knit.jpg',
        is_one_plus_one: false,
        is_new: true,
        is_best: true,
        view_count: 980,
        sale_count: 145,
        rating_avg: 4.8,
        review_count: 38,
        description: '디스트로이드 디테일의 하이엔드 그런지 니트웨어',
        created_at: new Date().toISOString(),
      },
      variant: {
        id: 'v1',
        product_id: 'prod-02',
        variant_sku: 'P2026-FW-002-CHAR-FREE',
        color: '차콜',
        color_code: '#333333',
        size: 'FREE',
        additional_price: 0,
        stock_quantity: 20,
        status: 'active',
      },
      quantity: 1,
      isSelected: true,
    },
    {
      id: 'prod-04-v1',
      product: {
        id: 'prod-04',
        sku: 'P2026-FW-004',
        name: '네온 스트랩 카고 팬츠',
        cost_price: 52000,
        regular_price: 198000,
        sale_price: 178000,
        discount_rate: 10,
        tax_type: 'taxable',
        status: 'active',
        primary_image: '/images/products/prod_04_women_cargo.jpg',
        is_one_plus_one: false,
        is_new: true,
        is_best: true,
        view_count: 1250,
        sale_count: 289,
        rating_avg: 4.9,
        review_count: 67,
        description: '사이버펑크 무드의 테크니컬 스트랩 카고 팬츠',
        created_at: new Date().toISOString(),
      },
      variant: {
        id: 'v1',
        product_id: 'prod-04',
        variant_sku: 'P2026-FW-004-BLK-M',
        color: '블랙',
        color_code: '#000000',
        size: 'M',
        additional_price: 0,
        stock_quantity: 35,
        status: 'active',
      },
      quantity: 1,
      isSelected: true,
    },
  ];
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(getInitialCartItems);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync initial cart items to Supabase cart_items table if connected
  useEffect(() => {
    if (isSupabaseConfigured && items.length > 0) {
      items.forEach((it) => {
        api.saveCartItem({
          id: it.id,
          user_id: 'u-vip',
          product_id: it.product.id,
          variant_id: it.variant.id,
          quantity: it.quantity,
          is_selected: it.isSelected,
        });
      });
    }
  }, []);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const itemId = `${product.id}-${variant.id}`;
    let newQty = quantity;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        newQty = existing.quantity + quantity;
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQty } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          variant,
          quantity,
          isSelected: true,
        },
      ];
    });

    if (isSupabaseConfigured) {
      api.saveCartItem({
        id: itemId,
        user_id: 'u-vip',
        product_id: product.id,
        variant_id: variant.id,
        quantity: newQty,
        is_selected: true,
      });
    }
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    if (isSupabaseConfigured) {
      api.removeCartItem(itemId);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
    const targetItem = items.find((i) => i.id === itemId);
    if (isSupabaseConfigured && targetItem) {
      api.saveCartItem({
        id: itemId,
        user_id: 'u-vip',
        product_id: targetItem.product.id,
        variant_id: targetItem.variant.id,
        quantity,
        is_selected: targetItem.isSelected,
      });
    }
  };

  const toggleSelect = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isSelected: !i.isSelected } : i))
    );
  };

  const selectAll = (selected: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, isSelected: selected })));
  };

  const clearSelected = () => {
    const selected = items.filter((i) => i.isSelected);
    setItems((prev) => prev.filter((i) => !i.isSelected));
    if (isSupabaseConfigured) {
      selected.forEach((s) => api.removeCartItem(s.id));
    }
  };

  const clearCart = () => {
    setItems([]);
    if (isSupabaseConfigured) {
      api.clearCartItems('u-vip');
    }
  };

  const selectedItems = items.filter((i) => i.isSelected);

  const totalItemsCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const selectedItemsCount = selectedItems.reduce((acc, i) => acc + i.quantity, 0);

  const totalRegularAmount = selectedItems.reduce(
    (acc, i) => acc + (i.product.regular_price + (i.variant.additional_price || 0)) * i.quantity,
    0
  );

  const totalProductAmount = selectedItems.reduce(
    (acc, i) => acc + (i.product.sale_price + (i.variant.additional_price || 0)) * i.quantity,
    0
  );

  const totalDiscountAmount = totalRegularAmount - totalProductAmount;

  // Free shipping on 50,000 KRW or more, otherwise 3,000 KRW
  const deliveryFee = selectedItems.length > 0 && totalProductAmount < 50000 ? 3000 : 0;

  const finalAmount = totalProductAmount + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        selectAll,
        clearSelected,
        clearCart,
        totalItemsCount,
        selectedItemsCount,
        totalProductAmount,
        deliveryFee,
        totalRegularAmount,
        totalDiscountAmount,
        finalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

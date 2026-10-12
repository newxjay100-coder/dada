import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/types/database.types';

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    const itemId = `${product.id}-${variant.id}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
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
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
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
    setItems((prev) => prev.filter((i) => !i.isSelected));
  };

  const clearCart = () => {
    setItems([]);
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

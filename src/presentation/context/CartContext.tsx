'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { CartItem } from '@/domain/models/CartItem';

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Cart context provider.
 * Skeleton: provides static empty state in this phase.
 * Full implementation with localStorage persistence in cart feature phase.
 */
export function CartProvider({ children }: CartProviderProps) {
  const value: CartContextValue = {
    items: [],
    totalCount: 0,
    addItem: () => {},
    removeItem: () => {},
    clearCart: () => {},
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context.
 * Throws if used outside of CartProvider.
 */
export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
